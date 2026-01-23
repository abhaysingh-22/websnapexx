import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import type { Profile } from "@/types/user.type";
import { externalSupabase } from "@/integrations/externalSupabase/client";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1) Subscribe first (prevents missing events)
    const {
      data: { subscription },
    } = externalSupabase.auth.onAuthStateChange((_, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      // Profile loading (DB) is not enabled in this slice.
      setProfile(null);
    });

    // 2) Then load current session
    externalSupabase.auth
      .getSession()
      .then(({ data }) => {
        setSession(data.session);
        setUser(data.session?.user ?? null);
        setProfile(null);
      })
      .finally(() => setIsLoading(false));

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    const emailRedirectTo = `${window.location.origin}/signin`;
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

  const signIn = async (email: string, password: string) => {
    const { data, error } = await externalSupabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signInWithGoogle = async () => {
    const redirectTo = `${window.location.origin}/home`;
    const { data, error } = await externalSupabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
    return { data, error };
  };

  const signOut = async () => {
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
    updateProfile: async () => ({ data: null, error: new Error("Profiles not enabled") }),
    refreshProfile: () => undefined,
  };
};

