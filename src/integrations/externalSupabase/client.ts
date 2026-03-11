import { createClient } from "@supabase/supabase-js";

// External Supabase project (user-provided).
// NOTE: This uses a publishable/anon key, safe for frontend usage.
export const EXTERNAL_SUPABASE_URL = "https://lhqovttrqyfjwbojnopl.supabase.co";
export const EXTERNAL_SUPABASE_ANON_KEY = "sb_publishable_oAHwrdZEBuzjyRnjX0ISUw_V6ikF-0S";

// Session durations
export const DEFAULT_SESSION_DURATION = 2 * 60 * 60 * 1000; // 2 hours in ms
export const REMEMBER_ME_SESSION_DURATION = 4 * 60 * 60 * 1000; // 4 hours in ms

const SESSION_EXPIRY_KEY = 'snapexx_session_expiry';
const REMEMBER_ME_KEY = 'snapexx_remember_me';

/** Persist the session expiry timestamp in localStorage */
export const setSessionExpiry = (rememberMe: boolean) => {
  const duration = rememberMe ? REMEMBER_ME_SESSION_DURATION : DEFAULT_SESSION_DURATION;
  const expiresAt = Date.now() + duration;
  localStorage.setItem(SESSION_EXPIRY_KEY, String(expiresAt));
  localStorage.setItem(REMEMBER_ME_KEY, String(rememberMe));
};

/** Check whether the client-side session has expired */
export const isSessionExpired = (): boolean => {
  const expiresAt = localStorage.getItem(SESSION_EXPIRY_KEY);
  if (!expiresAt) return false; // no expiry set yet — allow (first load)
  return Date.now() > Number(expiresAt);
};

/** Clear session expiry metadata */
export const clearSessionExpiry = () => {
  localStorage.removeItem(SESSION_EXPIRY_KEY);
  localStorage.removeItem(REMEMBER_ME_KEY);
};

/** Get remaining session time in ms (0 if expired) */
export const getSessionTimeRemaining = (): number => {
  const expiresAt = localStorage.getItem(SESSION_EXPIRY_KEY);
  if (!expiresAt) return 0;
  return Math.max(0, Number(expiresAt) - Date.now());
};

// Debug: capture URL before Supabase client strips tokens
console.log('[SUPABASE-CLIENT] Module load URL:', window.location.href);
console.log('[SUPABASE-CLIENT] Hash:', window.location.hash ? 'has hash tokens' : 'no hash');
console.log('[SUPABASE-CLIENT] Search:', window.location.search ? window.location.search : 'no query params');

export const INITIAL_URL_HASH = window.location.hash;

// Default session: 2 hours (7200 seconds)
export const externalSupabase = createClient(
  EXTERNAL_SUPABASE_URL,
  EXTERNAL_SUPABASE_ANON_KEY,
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
      flowType: 'implicit',
      detectSessionInUrl: false, // Disabled so we can manually parse the hash in useAuth.ts
    },
    global: {
      headers: {
        // Request 2-hour session expiry
        'x-supabase-auth-exp': '7200',
      },
    },
  }
);
