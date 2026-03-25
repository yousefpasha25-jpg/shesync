import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file."
  );
}

/**
 * Singleton browser-side Supabase client using @supabase/ssr.
 * This ensures cookies are synced with the server-side client,
 * preventing auth state mismatches between client and server components.
 */
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
