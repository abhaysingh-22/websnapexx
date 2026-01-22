import { useEffect, useState } from "react";
import type { Profile } from "@/types/user.type";
import { authService, type LocalSession, type LocalUser } from "@/services/auth.service";

export const useAuth = () => {
  const [user, setUser] = useState<LocalUser | null>(null);
  const [session, setSession] = useState<LocalSession | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const sync = async () => {
      const s = await authService.getSession();
      setSession(s);
      setUser(s?.user ?? null);

      // Lightweight local "profile" derived from user metadata.
      setProfile(
        s?.user
          ? {
              id: s.user.id,
              user_id: s.user.id,
              full_name: s.user.user_metadata?.full_name ?? null,
              avatar_url: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }
          : null
      );
    };

    // Initial load
    sync().finally(() => setIsLoading(false));

    // Listen for local auth changes
    const handler = () => sync();
    window.addEventListener(authService.authEventName, handler);
    return () => window.removeEventListener(authService.authEventName, handler);
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await authService.signUp(email, password, fullName);
    return { data, error: (error as unknown as Error) ?? null };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await authService.signIn(email, password);
    return { data, error: (error as unknown as Error) ?? null };
  };

  const signInWithGoogle = async () => {
    const { data, error } = await authService.signInWithGoogle();
    return { data, error: (error as unknown as Error) ?? null };
  };

  const signOut = async () => {
    const { error } = await authService.signOut();
    return { error };
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
