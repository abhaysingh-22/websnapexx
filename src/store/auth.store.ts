import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Profile } from '@/types/user.type';

interface AuthStore {
  // State
  user: User | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  setLoading: (isLoading: boolean) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      profile: null,
      isAuthenticated: false,
      isLoading: true,

      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user 
      }),

      setProfile: (profile) => set({ profile }),

      setLoading: (isLoading) => set({ isLoading }),

      clearAuth: () => set({ 
        user: null, 
        profile: null, 
        isAuthenticated: false,
        isLoading: false,
      }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        // Only persist minimal auth state
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
