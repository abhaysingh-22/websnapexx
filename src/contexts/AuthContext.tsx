import React, { createContext, useContext, ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import type { Profile } from "@/types/user.type";
import type { Session, User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ data: unknown; error: Error | null }>;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<{ data: unknown; error: Error | null }>;
  signInWithGoogle: () => Promise<{ data: unknown; error: Error | null }>;
  signOut: () => Promise<{ error: Error | null }>;
  sendOtp: (email: string) => Promise<{ data: unknown; error: Error | null }>;
  verifyOtp: (email: string, token: string) => Promise<{ data: unknown; error: Error | null }>;
  updatePassword: (newPassword: string) => Promise<{ data: unknown; error: Error | null }>;
  updateProfile: (updates: unknown) => Promise<{ data: null; error: Error | null }>;
  refreshProfile: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
