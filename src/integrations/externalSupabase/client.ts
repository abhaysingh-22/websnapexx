import { createClient } from "@supabase/supabase-js";

// External Supabase project (user-provided).
// NOTE: This uses a publishable/anon key, safe for frontend usage.
export const EXTERNAL_SUPABASE_URL = "https://lhqovttrqyfjwbojnopl.supabase.co";
export const EXTERNAL_SUPABASE_ANON_KEY = "sb_publishable_oAHwrdZEBuzjyRnjX0ISUw_V6ikF-0S";

// Session expires after 24 hours (86400 seconds)
export const externalSupabase = createClient(
  EXTERNAL_SUPABASE_URL,
  EXTERNAL_SUPABASE_ANON_KEY,
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    },
    global: {
      headers: {
        // Request 24-hour session expiry
        'x-supabase-auth-exp': '86400',
      },
    },
  }
);
