/**
 * Dashboard Page (Protected)
 * Customer library for purchased templates with secure download access,
 * version information, documentation links, license info, and purchase records.
 */

// Skip static prerendering — this page requires auth and runtime Supabase credentials
export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  TEMPLATES,
  type TemplateItem,
  getTemplateVersion,
  getTemplateLastUpdated,
} from "@/lib/site";
import {
  LogOut,
  Download,
  Zap,
  Lock,
  BookOpen,
  ExternalLink,
  ShieldCheck,
  Calendar,
  GitBranch,
  Github,
  Clock,
  FileText,
  KeyRound,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

export type PurchaseRecord = {
  template_id: string;
  id?: string;
  order_id?: string;
  created_at?: string;
  amount?: string | number;
  status?: string;
  license_key?: string;
  license_type?: string;
  version?: string;
  changelog_url?: string;
  github_repo?: string;
  updated_at?: string;
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Query purchases specifically for this authenticated customer
  let purchases: PurchaseRecord[] = [];
  try {
    const { data } = await supabase
      .from("purchases")
      .select("*")
      .eq("user_id", user.id);
    purchases = (data as PurchaseRecord[]) ?? [];
  } catch {
    purchases = [];
  }

  const purchaseMap = new Map<string, PurchaseRecord>();
  for (const p of purchases) {
    if (p.template_id) {
      purchaseMap.set(p.template_id, p);
    }
  }

  const purchasedTemplates = TEMPLATES.filter((t) => purchaseMap.has(t.id));
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
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <h1 className="text-3xl font-black text-white">My Library</h1>
              {hasPurchases && (
                <span className="rounded-full bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 text-xs font-bold text-purple-400">
                  {purchasedTemplates.length} {purchasedTemplates.length === 1 ? "Template" : "Templates"}
                </span>
              )}
            </div>
            <p className="text-white/50 text-sm">
              {hasPurchases
                ? `Access your purchased templates, source file downloads, and documentation.`
                : "You haven't purchased any templates yet."}
            </p>
          </div>

          {hasPurchases && (
            <Link
              href="/#gallery"
              className="text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors"
            >
              + Explore more templates
            </Link>
          )}
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
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {purchasedTemplates.map((template) => {
              const purchase = purchaseMap.get(template.id);
              const versionStr = purchase?.version ?? getTemplateVersion(template);
              const licenseStr = purchase?.license_type ?? "Commercial (Unlimited Projects)";
              const purchaseDate = purchase?.created_at
                ? new Date(purchase.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "Active Purchase";
              const amountPaid = purchase?.amount ? `$${purchase.amount}` : template.price;
              const orderId = purchase?.order_id ?? purchase?.id;
              const githubUrl = purchase?.github_repo ?? null;
              const changelogUrl = purchase?.changelog_url ?? null;
              const lastUpdated = purchase?.updated_at
                ? new Date(purchase.updated_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : getTemplateLastUpdated(template);

              return (
                <div
                  key={template.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 flex flex-col justify-between gap-6 hover:border-white/20 transition-all"
                >
                  {/* Card Header */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">
                        {template.category}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[11px] font-medium text-emerald-400">
                        <CheckCircle2 className="size-3" />
                        Purchased
                      </span>
                    </div>

                    <h2 className="text-xl font-bold text-white">{template.name}</h2>
                    <p className="text-xs text-white/50 mt-1 leading-relaxed">{template.blurb}</p>
                  </div>

                  {/* Metadata & Technical Specs Section */}
                  <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 flex flex-col gap-3 text-xs">
                    {/* Version & Latest Update */}
                    <div className="grid grid-cols-2 gap-3 pb-3 border-b border-white/5">
                      <div className="flex items-center gap-2">
                        <GitBranch className="size-3.5 text-purple-400 shrink-0" />
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-white/40">Version</p>
                          <p className="font-semibold text-white/90">{versionStr}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="size-3.5 text-cyan-400 shrink-0" />
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-white/40">Latest Update</p>
                          <p className="font-semibold text-white/90">{lastUpdated}</p>
                        </div>
                      </div>
                    </div>

                    {/* License Information */}
                    <div className="flex items-start gap-2 pb-3 border-b border-white/5">
                      <ShieldCheck className="size-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-white/40">License</p>
                        <p className="font-medium text-white/80">{licenseStr}</p>
                        {purchase?.license_key && (
                          <div className="flex items-center gap-1 mt-1 text-[11px] font-mono text-purple-300">
                            <KeyRound className="size-3 text-purple-400" />
                            <span>{purchase.license_key}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Purchase Information */}
                    <div className="grid grid-cols-2 gap-3 pb-3 border-b border-white/5">
                      <div className="flex items-center gap-2">
                        <Calendar className="size-3.5 text-amber-400 shrink-0" />
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-white/40">Purchased</p>
                          <p className="font-medium text-white/80">{purchaseDate}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-white/40">Amount Paid</p>
                        <p className="font-medium text-white/80">{amountPaid}</p>
                        {orderId && (
                          <p className="text-[10px] font-mono text-white/40 truncate">
                            Order #{orderId}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* GitHub Access & Changelog Link */}
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-white/40 mb-1">GitHub Access</p>
                        {githubUrl ? (
                          <a
                            href={githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-purple-400 hover:text-purple-300 transition-colors"
                          >
                            <Github className="size-3.5" />
                            Repository
                            <ExternalLink className="size-3" />
                          </a>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-white/40">
                            <Github className="size-3 text-white/30" />
                            Private repository
                          </span>
                        )}
                      </div>

                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-white/40 mb-1">Changelog</p>
                        <Link
                          href={changelogUrl || `/template/${template.id}#changelog`}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
                        >
                          <FileText className="size-3.5" />
                          View Changelog
                          <ExternalLink className="size-3" />
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Actions / Buttons */}
                  <div className="flex flex-col sm:flex-row items-stretch gap-2.5 pt-2">
                    <a
                      href={`/api/download/${template.id}`}
                      className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 py-2.5 px-4 text-xs font-bold text-white hover:brightness-110 transition-all shadow-lg shadow-purple-900/20"
                    >
                      <Download className="size-3.5" />
                      Download Source (.zip)
                    </a>

                    <Link
                      href={`/template/${template.id}`}
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] py-2.5 px-3 text-xs font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <BookOpen className="size-3.5" />
                      Documentation
                    </Link>

                    <Link
                      href={`/preview/${template.id}`}
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] py-2.5 px-3 text-xs font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <ExternalLink className="size-3.5" />
                      Preview
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
