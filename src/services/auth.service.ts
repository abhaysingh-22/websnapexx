import type { AuthResponse, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export const authService = {
  async signUp(email: string, password: string, fullName: string): Promise<AuthResponse> {
    const emailRedirectTo = `${window.location.origin}/home`;
    return supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo,
        data: { full_name: fullName },
      },
    });
  },

  async signIn(email: string, password: string): Promise<AuthResponse> {
    return supabase.auth.signInWithPassword({ email, password });
  },

  async signInWithGoogle() {
    const redirectTo = `${window.location.origin}/home`;
    return supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
  },

  async signOut(): Promise<{ error: Error | null }> {
    const { error } = await supabase.auth.signOut();
    return { error: (error as unknown as Error) ?? null };
  },

  async getSession(): Promise<Session | null> {
    const { data } = await supabase.auth.getSession();
    return data.session;
  },
};
