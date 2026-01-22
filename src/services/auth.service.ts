import { supabase } from "@/integrations/supabase/client";
import type { Profile } from "@/types/user.type";

export const authService = {
  async signUp(email: string, password: string, fullName: string) {
    const redirectUrl = `${window.location.origin}/home`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) throw error;
    return data;
  },

  async signInWithGoogle() {
    // Redirect back into the app after OAuth completes
    const redirectTo = `${window.location.origin}/home`;

    // Debug-only: helps confirm which backend project the browser is calling.
    // Do not log secrets.
    try {
      const host = new URL(String(import.meta.env.VITE_SUPABASE_URL)).host;
      console.log('[auth] starting Google OAuth', { host, redirectTo });
    } catch {
      console.log('[auth] starting Google OAuth', { redirectTo });
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
      },
    });

    if (error) {
      console.error('[auth] Google OAuth error', {
        message: error.message,
        status: (error as unknown as { status?: number }).status,
        name: (error as unknown as { name?: string }).name,
      });
      throw error;
    }
    return data;
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  },

  async updateProfile(userId: string, updates: Partial<Pick<Profile, 'full_name' | 'avatar_url'>>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteAccount() {
    // Sign out the user - actual deletion would require admin/edge function
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  onAuthStateChange(callback: (event: string, session: unknown) => void) {
    return supabase.auth.onAuthStateChange(callback);
  },
};
