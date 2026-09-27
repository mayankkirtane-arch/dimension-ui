/**
 * Supabase Server Client
 * Guards against missing env vars during build/prerender.
 */
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  const cookieStore = await cookies();

  // Return a safe no-op proxy during build when env vars aren't set yet
  if (!url.startsWith("http")) {
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        signOut: async () => {},
      },
      from: () => ({
        select: () => ({ eq: () => Promise.resolve({ data: [], error: null }) }),
      }),
    } as any;
  }

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Safe to ignore in Server Components — middleware handles session refresh.
        }
      },
    },
  });
}
