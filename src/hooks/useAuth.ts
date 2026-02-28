import { useEffect, useState, useRef, useCallback } from "react";
import type { Session, User } from "@supabase/supabase-js";
import type { Profile } from "@/types/user.type";
import {
  externalSupabase,
  setSessionExpiry,
  isSessionExpired,
  clearSessionExpiry,
  getSessionTimeRemaining,
} from "@/integrations/externalSupabase/client";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const expiryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** Sign out and clear all session metadata */
  const forceSignOut = useCallback(async () => {
    clearSessionExpiry();
    if (expiryTimerRef.current) clearTimeout(expiryTimerRef.current);
    await externalSupabase.auth.signOut({ scope: "local" });
  }, []);

  /** Schedule an auto-logout when the session expires */
  const scheduleAutoLogout = useCallback(() => {
    if (expiryTimerRef.current) clearTimeout(expiryTimerRef.current);
    const remaining = getSessionTimeRemaining();
    if (remaining <= 0) {
      forceSignOut();
      return;
    }
    expiryTimerRef.current = setTimeout(() => {
      forceSignOut();
    }, remaining);
  }, [forceSignOut]);

  useEffect(() => {
    // 1) Subscribe first (prevents missing events)
    const {
      data: { subscription },
    } = externalSupabase.auth.onAuthStateChange((event, nextSession) => {
      if (event === "SIGNED_OUT") {
        setSession(null);
        setUser(null);
        setProfile(null);
        clearSessionExpiry();
        if (expiryTimerRef.current) clearTimeout(expiryTimerRef.current);
        return;
      }

      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setProfile(null);

      // If there's an active session, enforce expiry
      if (nextSession) {
        if (isSessionExpired()) {
          forceSignOut();
          return;
        }
        // If no expiry is set (e.g. Google OAuth just completed and page reloaded),
        // set the default 2-hour expiry now.
        const hasExpiry = localStorage.getItem('snapexx_session_expiry');
        if (!hasExpiry) {
          setSessionExpiry(false);
        }
        scheduleAutoLogout();
      }
    });

    // 2) Then load current session
    externalSupabase.auth
      .getSession()
      .then(({ data }) => {
        if (data.session && isSessionExpired()) {
          forceSignOut();
          return;
        }
        setSession(data.session);
        setUser(data.session?.user ?? null);
        setProfile(null);
        if (data.session) scheduleAutoLogout();
      })
      .finally(() => setIsLoading(false));

    return () => {
      subscription.unsubscribe();
      if (expiryTimerRef.current) clearTimeout(expiryTimerRef.current);
    };
  }, [forceSignOut, scheduleAutoLogout]);

  const signUp = async (email: string, password: string, fullName: string) => {
    const emailRedirectTo = `${window.location.origin}/onboarding/1`;
    const { data, error } = await externalSupabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo,
      },
    });
    return { data, error };
  };

  const signIn = async (email: string, password: string, rememberMe = false) => {
    const { data, error } = await externalSupabase.auth.signInWithPassword({
      email,
      password,
    });
    if (!error && data.session) {
      setSessionExpiry(rememberMe);
      scheduleAutoLogout();
    }
    return { data, error };
  };

  const signInWithGoogle = async () => {
    // Use the current app's origin so the redirect always comes back to this app,
    // never to Lovable or any other deployment.
    const redirectTo = `${window.location.origin}/home`;
    const { data, error } = await externalSupabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
    // Note: setSessionExpiry is handled inside onAuthStateChange (SIGNED_IN event)
    // because OAuth does a full page reload before the session is established.
    return { data, error };
  };

  const signOut = async () => {
    clearSessionExpiry();
    if (expiryTimerRef.current) clearTimeout(expiryTimerRef.current);

    // Some projects return 403 session_not_found for global sign-out.
    // For UX we still want logout to succeed locally.
    const global = await externalSupabase.auth.signOut({ scope: "global" });
    const local = await externalSupabase.auth.signOut({ scope: "local" });

    // If local sign-out worked, consider it a success even if global failed.
    if (!local.error) return { error: null };
    // If local failed but global worked, still consider it success.
    if (!global.error) return { error: null };
    // Both failed: surface the local error (more relevant to the app state).
    return { error: local.error ?? global.error };
  };

  /** Send a 6-digit OTP to the user's email for password recovery */
  const sendOtp = async (email: string) => {
    const { data, error } = await externalSupabase.auth.resetPasswordForEmail(email);
    return { data, error };
  };

  /** Verify the OTP entered by the user */
  const verifyOtp = async (email: string, token: string) => {
    const { data, error } = await externalSupabase.auth.verifyOtp({
      email,
      token,
      type: "recovery",
    });
    return { data, error };
  };

  /** Update the user's password (requires an active session from verifyOtp) */
  const updatePassword = async (newPassword: string) => {
    const { data, error } = await externalSupabase.auth.updateUser({
      password: newPassword,
    });
    return { data, error };
  };

  return {
    user,
    session,
    profile,
    isLoading,
    isAuthenticated: !!session,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    sendOtp,
    verifyOtp,
    updatePassword,
    updateProfile: async () => ({ data: null, error: new Error("Profiles not enabled") }),
    refreshProfile: () => undefined,
  };
};

