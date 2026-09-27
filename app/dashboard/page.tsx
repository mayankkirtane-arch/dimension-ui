/**
 * Dashboard Page (Protected)
 * Shows user's purchased templates and allows them to download/copy source code.
 */

// Skip static prerendering — this page requires auth and runtime Supabase credentials
export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { TEMPLATES } from "@/lib/site";
import { LogOut, Download, Zap, Lock } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // In production: query a `purchases` table to get what this user has bought.
  // For now we show a demo state with placeholder purchased items.
  let purchases: { template_id: string }[] = [];
  try {
    const { data } = await supabase
      .from("purchases")
      .select("template_id")
      .eq("user_id", user.id);
    purchases = data ?? [];
  } catch {
    purchases = [];
  }

  const purchasedIds = new Set((purchases ?? []).map((p: { template_id: string }) => p.template_id));
  const purchasedTemplates = TEMPLATES.filter((t) => purchasedIds.has(t.id));
  const hasPurchases = purchasedTemplates.length > 0;

  const handleSignOut = async () => {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/");
  };

  return (
    <div className="min-h-screen bg-[#06060b] text-white">
      {/* Navbar */}
      <nav className="border-b border-white/10 bg-black/40 backdrop-blur-xl sticky top-0 z-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500">
              <Zap className="size-4 text-white" />
            </div>
            <span className="font-bold text-white">DimensionUI</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-white/50">{user.email}</span>
            <form action={handleSignOut}>
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-white/60 hover:text-white transition-colors"
              >
                <LogOut className="size-3.5" />
                Sign out
              </button>
            </form>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-black text-white mb-2">My Templates</h1>
          <p className="text-white/50">
            {hasPurchases
              ? `You own ${purchasedTemplates.length} template${purchasedTemplates.length > 1 ? "s" : ""}.`
              : "You haven't purchased any templates yet."}
          </p>
        </div>

        {!hasPurchases ? (
          <div className="flex flex-col items-center gap-6 rounded-2xl border border-white/10 bg-white/[0.02] py-20 text-center">
            <div className="flex size-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
              <Lock className="size-8 text-white/30" />
            </div>
            <div>
              <p className="text-xl font-bold text-white mb-1">No templates yet</p>
              <p className="text-white/40 text-sm">Browse our gallery and purchase your first template!</p>
            </div>
            <Link
              href="/#gallery"
              className="rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 px-6 py-3 text-sm font-bold text-white hover:brightness-110 transition-all"
            >
              Browse Templates
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {purchasedTemplates.map((template) => (
              <div
                key={template.id}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 flex flex-col gap-4"
              >
                <div>
                  <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">
                    {template.category}
                  </span>
                  <h3 className="text-base font-bold text-white mt-1">{template.name}</h3>
                  <p className="text-xs text-white/40 mt-1 leading-relaxed">{template.blurb}</p>
                </div>

                <div className="flex items-center gap-2 mt-auto">
                  <a
                    href={`/api/download/${template.id}`}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-white/[0.06] border border-white/10 py-2 text-xs font-semibold text-white hover:bg-white/10 transition-colors"
                  >
                    <Download className="size-3.5" />
                    Download Code
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
