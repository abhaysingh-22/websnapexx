import { useState, useEffect, useCallback } from 'react';
import { authService } from '@/services/auth.service';
import type { Profile } from '@/types/user.type';

interface User {
  id: string;
  email: string;
  user_metadata: { full_name?: string };
}

interface Session {
  user: User;
  access_token: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const profileData = await authService.getProfile(userId);
      setProfile(profileData);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }, []);

  useEffect(() => {
    // Check for existing session on mount
    const initAuth = async () => {
      try {
        const existingSession = await authService.getSession();
        if (existingSession) {
          setSession(existingSession);
          setUser(existingSession.user);
          await fetchProfile(existingSession.user.id);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [fetchProfile]);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const data = await authService.signUp(email, password, fullName);
      setSession(data.session as Session);
      setUser(data.user as User);
      await fetchProfile(data.user.id);
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const data = await authService.signIn(email, password);
      setSession(data.session as Session);
      setUser(data.user as User);
      await fetchProfile(data.user.id);
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const data = await authService.signInWithGoogle();
      // After mock Google sign-in, fetch the session
      const newSession = await authService.getSession();
      if (newSession) {
        setSession(newSession);
        setUser(newSession.user);
        await fetchProfile(newSession.user.id);
      }
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      await authService.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const updateProfile = async (updates: Partial<Pick<Profile, 'full_name' | 'avatar_url'>>) => {
    if (!user) return { data: null, error: new Error('Not authenticated') };
    
    try {
      const data = await authService.updateProfile(user.id, updates);
      setProfile(data);
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
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
    updateProfile,
    refreshProfile: () => user && fetchProfile(user.id),
  };
};
