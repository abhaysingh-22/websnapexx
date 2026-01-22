// Stub auth service - no backend
import type { Profile } from "@/types/user.type";

// Mock user for demo purposes
const MOCK_USER_KEY = 'mock_user';
const MOCK_PROFILE_KEY = 'mock_profile';

interface MockUser {
  id: string;
  email: string;
  user_metadata: { full_name?: string };
}

interface MockSession {
  user: MockUser;
  access_token: string;
}

const generateId = () => Math.random().toString(36).substring(2) + Date.now().toString(36);

export const authService = {
  async signUp(email: string, password: string, fullName: string) {
    // Simulate signup - store in localStorage
    const user: MockUser = {
      id: generateId(),
      email,
      user_metadata: { full_name: fullName },
    };
    
    const session: MockSession = {
      user,
      access_token: generateId(),
    };

    const profile: Profile = {
      id: generateId(),
      user_id: user.id,
      full_name: fullName,
      avatar_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    localStorage.setItem(MOCK_USER_KEY, JSON.stringify(session));
    localStorage.setItem(MOCK_PROFILE_KEY, JSON.stringify(profile));

    return { user, session };
  },

  async signInWithGoogle() {
    // Simulate Google sign-in
    const user: MockUser = {
      id: generateId(),
      email: 'demo@google.com',
      user_metadata: { full_name: 'Google User' },
    };
    
    const session: MockSession = {
      user,
      access_token: generateId(),
    };

    const profile: Profile = {
      id: generateId(),
      user_id: user.id,
      full_name: 'Google User',
      avatar_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    localStorage.setItem(MOCK_USER_KEY, JSON.stringify(session));
    localStorage.setItem(MOCK_PROFILE_KEY, JSON.stringify(profile));

    // Return URL for redirect simulation
    return { url: `${window.location.origin}/home` };
  },

  async signIn(email: string, password: string) {
    // Check if user exists in localStorage or create demo session
    const stored = localStorage.getItem(MOCK_USER_KEY);
    
    if (stored) {
      const session = JSON.parse(stored) as MockSession;
      if (session.user.email === email) {
        return { user: session.user, session };
      }
    }

    // For demo: accept any credentials
    const user: MockUser = {
      id: generateId(),
      email,
      user_metadata: { full_name: email.split('@')[0] },
    };
    
    const session: MockSession = {
      user,
      access_token: generateId(),
    };

    const profile: Profile = {
      id: generateId(),
      user_id: user.id,
      full_name: email.split('@')[0],
      avatar_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    localStorage.setItem(MOCK_USER_KEY, JSON.stringify(session));
    localStorage.setItem(MOCK_PROFILE_KEY, JSON.stringify(profile));

    return { user, session };
  },

  async signOut() {
    localStorage.removeItem(MOCK_USER_KEY);
    localStorage.removeItem(MOCK_PROFILE_KEY);
  },

  async getSession(): Promise<MockSession | null> {
    const stored = localStorage.getItem(MOCK_USER_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as MockSession;
  },

  async getProfile(userId: string): Promise<Profile | null> {
    const stored = localStorage.getItem(MOCK_PROFILE_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as Profile;
  },

  async updateProfile(userId: string, updates: Partial<Pick<Profile, 'full_name' | 'avatar_url'>>) {
    const stored = localStorage.getItem(MOCK_PROFILE_KEY);
    if (!stored) return null;
    
    const profile = JSON.parse(stored) as Profile;
    const updated = { ...profile, ...updates, updated_at: new Date().toISOString() };
    localStorage.setItem(MOCK_PROFILE_KEY, JSON.stringify(updated));
    
    return updated;
  },

  async deleteAccount() {
    localStorage.removeItem(MOCK_USER_KEY);
    localStorage.removeItem(MOCK_PROFILE_KEY);
  },

  onAuthStateChange(callback: (event: string, session: unknown) => void) {
    // Check initial state
    const session = localStorage.getItem(MOCK_USER_KEY);
    if (session) {
      callback('SIGNED_IN', JSON.parse(session));
    }
    
    // Return mock subscription
    return { data: { subscription: { unsubscribe: () => {} } } };
  },
};
