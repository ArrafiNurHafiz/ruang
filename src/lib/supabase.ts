import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "[Supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Running in demo mode.",
  );
}

// Supabase realtime is optional; Neon PostgreSQL is the primary database.
// Only initialize if explicitly enabled with an active URL.
const isExplicitlyEnabled =
  import.meta.env.VITE_ENABLE_SUPABASE === "true" &&
  Boolean(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes("kwvkpsvlmgpdjuubrnop"));

export const supabase = isExplicitlyEnabled
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const isSupabaseEnabled = !!supabase;

