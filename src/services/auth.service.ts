// Frontend-only auth service (localStorage)
// NOTE: This is intentionally NOT secure and is meant only for demos / offline prototypes.

export type LocalUser = {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
  };
};

export type LocalSession = {
  user: LocalUser;
  access_token: string;
  expires_at: number; // epoch seconds
};

export type LocalAuthResponse = {
  data: {
    session: LocalSession | null;
    user: LocalUser | null;
  };
  error: Error | null;
};

type StoredUser = {
  id: string;
  email: string;
  password: string;
  full_name?: string;
  created_at: string;
};

const USERS_KEY = "local_auth_users";
const SESSION_KEY = "local_auth_session";
const AUTH_EVENT = "local-auth-changed";

const emitAuthChange = () => window.dispatchEvent(new Event(AUTH_EVENT));

const generateId = () => crypto.randomUUID?.() ?? Math.random().toString(36).slice(2);

const readUsers = (): StoredUser[] => {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as StoredUser[]) : [];
  } catch {
    return [];
  }
};

const writeUsers = (users: StoredUser[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const readSession = (): LocalSession | null => {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as LocalSession) : null;
  } catch {
    return null;
  }
};

const writeSession = (session: LocalSession | null) => {
  if (!session) {
    localStorage.removeItem(SESSION_KEY);
  } else {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }
};

const toLocalUser = (u: StoredUser): LocalUser => ({
  id: u.id,
  email: u.email,
  user_metadata: {
    full_name: u.full_name,
  },
});

export const authService = {
  authEventName: AUTH_EVENT,

  async signUp(email: string, password: string, fullName: string): Promise<LocalAuthResponse> {
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const users = readUsers();

      const exists = users.some((u) => u.email.toLowerCase() === normalizedEmail);
      if (exists) {
        return { data: { session: null, user: null }, error: new Error("User already registered") };
      }

      const newUser: StoredUser = {
        id: generateId(),
        email: normalizedEmail,
        password,
        full_name: fullName?.trim() || undefined,
        created_at: new Date().toISOString(),
      };
      writeUsers([newUser, ...users]);

      // Auto-sign-in for demo convenience
      const session: LocalSession = {
        user: toLocalUser(newUser),
        access_token: generateId(),
        expires_at: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
      };
      writeSession(session);
      emitAuthChange();

      return { data: { session, user: session.user }, error: null };
    } catch (e) {
      return { data: { session: null, user: null }, error: e instanceof Error ? e : new Error("Sign up failed") };
    }
  },

  async signIn(email: string, password: string): Promise<LocalAuthResponse> {
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const users = readUsers();
      const user = users.find((u) => u.email.toLowerCase() === normalizedEmail);

      if (!user || user.password !== password) {
        return { data: { session: null, user: null }, error: new Error("Invalid login credentials") };
      }

      const session: LocalSession = {
        user: toLocalUser(user),
        access_token: generateId(),
        expires_at: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
      };
      writeSession(session);
      emitAuthChange();

      return { data: { session, user: session.user }, error: null };
    } catch (e) {
      return { data: { session: null, user: null }, error: e instanceof Error ? e : new Error("Sign in failed") };
    }
  },

  async signInWithGoogle(): Promise<LocalAuthResponse> {
    return {
      data: { session: null, user: null },
      error: new Error("Google sign-in is disabled in frontend-only mode"),
    };
  },

  async signOut(): Promise<{ error: Error | null }> {
    writeSession(null);
    emitAuthChange();
    return { error: null };
  },

  async getSession(): Promise<LocalSession | null> {
    const session = readSession();
    if (!session) return null;
    if (session.expires_at <= Math.floor(Date.now() / 1000)) {
      writeSession(null);
      emitAuthChange();
      return null;
    }
    return session;
  },
};
