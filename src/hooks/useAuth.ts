import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { authService } from "@/services/auth.service";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Listener FIRST
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
    });

    // THEN initial session fetch
    supabase.auth
      .getSession()
      .then(({ data }) => {
        setSession(data.session);
        setUser(data.session?.user ?? null);
      })
      .finally(() => setIsLoading(false));

    return () => subscription.unsubscribe();
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
    profile: null,
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
