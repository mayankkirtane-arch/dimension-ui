/**
 * Supabase Browser Client
 * Creates a Supabase client for use in Client Components (browser-side).
 * Guards against missing env vars during build/prerender.
 */
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

  // Return a safe no-op proxy during build when env vars aren't set yet
  if (!url.startsWith("http")) {
    return {
      auth: {
        signInWithOtp: async () => ({ error: new Error("Supabase not configured") }),
        signInWithOAuth: async () => ({ error: new Error("Supabase not configured") }),
        getUser: async () => ({ data: { user: null }, error: null }),
        signOut: async () => {},
      },
    } as any;
  }

  return createBrowserClient(url, key);
}
