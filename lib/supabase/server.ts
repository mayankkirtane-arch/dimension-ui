/**
 * Supabase Server Client
 * Guards against missing env vars during build/prerender and provides
 * a high-fidelity local proxy for tests and offline development.
 */
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Global in-memory storage for test/mock purchases
const mockPurchasesMemory = new Map<string, any[]>();

export async function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  const cookieStore = await cookies();

  // Return a safe proxy during build, testing, or when env vars aren't configured yet
  if (!url.startsWith("http")) {
    const testUserCookie = cookieStore.get("sb-test-user")?.value;
    const testPurchasesCookie = cookieStore.get("sb-test-purchases")?.value;

    let mockUser: { id: string; email?: string } | null = null;
    if (testUserCookie) {
      try {
        mockUser = JSON.parse(testUserCookie);
      } catch {
        mockUser = { id: testUserCookie, email: testUserCookie };
      }
    }

    return {
      auth: {
        getUser: async () => ({ data: { user: mockUser }, error: null }),
        signOut: async () => {},
      },
      from: (table: string) => {
        const userId = mockUser?.id || "anonymous";
        let memoryList = mockPurchasesMemory.get(userId) || [];

        // Also merge cookie data if provided
        if (table === "purchases" && testPurchasesCookie) {
          try {
            const parsed = JSON.parse(testPurchasesCookie);
            const array = Array.isArray(parsed) ? parsed : [parsed];
            for (const item of array) {
              if (!memoryList.some((m) => m.template_id === item.template_id)) {
                memoryList.push(item);
              }
            }
          } catch {}
        }

        return {
          select: (columns: string = "*") => ({
            eq: (field: string, val: any) => ({
              eq: (field2: string, val2: any) => {
                const filtered = memoryList.filter(
                  (i) => i[field] === val && i[field2] === val2
                );
                return Promise.resolve({ data: filtered, error: null });
              },
              single: () => {
                const found = memoryList.find((i) => i[field] === val);
                return Promise.resolve({ data: found || null, error: null });
              },
              then: (resolve: any) => {
                const filtered = memoryList.filter((i) => i[field] === val);
                resolve({ data: filtered, error: null });
              },
            }),
            single: () => {
              const item = memoryList[0] || null;
              return Promise.resolve({ data: item, error: null });
            },
            then: (resolve: any) => {
              resolve({ data: memoryList, error: null });
            },
          }),
          insert: async (data: any) => {
            const items = Array.isArray(data) ? data : [data];
            for (const item of items) {
              memoryList.push({
                ...item,
                id: item.id || `purch-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
                created_at: item.created_at || new Date().toISOString(),
              });
            }
            mockPurchasesMemory.set(userId, memoryList);
            return { data: items, error: null };
          },
          update: (patch: any) => ({
            eq: async (field: string, val: any) => {
              for (const item of memoryList) {
                if (item[field] === val) {
                  Object.assign(item, patch);
                }
              }
              mockPurchasesMemory.set(userId, memoryList);
              return { data: memoryList, error: null };
            },
          }),
        };
      },
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

export async function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) ?? "";

  if (!url.startsWith("http")) {
    return createClient();
  }

  return createServerClient(url, serviceKey, {
    cookies: {
      getAll() {
        return [];
      },
      setAll() {},
    },
  });
}
