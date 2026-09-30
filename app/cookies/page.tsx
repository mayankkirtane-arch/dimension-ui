import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Cookie, Info, CheckCircle2, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Cookie Policy & Storage Disclosure — DimensionUI",
  description: "Understand the essential cookies, local storage items, and session storage utilized on DimensionUI.",
  alternates: {
    canonical: "https://dimensionui.com/cookies",
  },
  openGraph: {
    title: "DimensionUI Cookie Policy",
    description: "Transparent breakdown of essential cookies and client-side browser storage at DimensionUI.",
    url: "https://dimensionui.com/cookies",
    type: "website",
  },
};

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-[#07070d] text-slate-200">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 size-[650px] rounded-full bg-emerald-600/5 blur-[160px]" />
      </div>

      {/* Navigation */}
      <nav className="border-b border-white/10 bg-black/40 backdrop-blur-xl sticky top-0 z-20">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back to DimensionUI
          </Link>
          <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">
            Legal & Compliance
          </span>
        </div>
      </nav>

      <main className="mx-auto max-w-4xl px-6 py-14">
        {/* Header */}
        <div className="mb-12 border-b border-white/10 pb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 mb-4">
            <Cookie className="size-3.5" />
            Cookie Disclosure
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Cookie & Storage Policy
          </h1>
          <p className="mt-3 text-sm text-slate-400 leading-relaxed">
            Last Updated: September 30, 2026. This disclosure explains how DimensionUI uses browser cookies and local storage to provide essential website functionality.
          </p>
        </div>

        {/* Content */}
        <div className="space-y-10 text-sm leading-relaxed text-slate-300">
          {/* Overview */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
            <div className="flex items-center gap-2.5 text-base font-bold text-white mb-3">
              <ShieldCheck className="size-4 text-emerald-400" />
              <h2>No Third-Party Advertising or Tracking Cookies</h2>
            </div>
            <p className="text-slate-400">
              DimensionUI <strong className="text-white">does not use</strong> third-party tracking pixels, marketing trackers, or cross-site advertising cookies (such as Facebook Pixel, Google AdSense, or data broker beacons). All storage items used on our site are strictly functional and essential to maintaining your active login session, cart contents, and interface preferences.
            </p>
          </section>

          {/* Essential Cookies */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
            <h2 className="text-base font-bold text-white mb-4">1. Essential HTTP Cookies</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400">
                    <th className="py-2.5 pr-4 font-semibold text-white">Name / Prefix</th>
                    <th className="py-2.5 pr-4 font-semibold text-white">Source</th>
                    <th className="py-2.5 pr-4 font-semibold text-white">Purpose</th>
                    <th className="py-2.5 font-semibold text-white">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  <tr>
                    <td className="py-3 pr-4 font-mono text-purple-300">sb-*-auth-token</td>
                    <td className="py-3 pr-4">Supabase Auth</td>
                    <td className="py-3 pr-4">Stores encrypted JWT session token to keep you logged in across page visits.</td>
                    <td className="py-3">Session / Max 1 year</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-mono text-purple-300">sb-test-*</td>
                    <td className="py-3 pr-4">DimensionUI</td>
                    <td className="py-3 pr-4">Used during development or sandbox testing to simulate customer sessions.</td>
                    <td className="py-3">Session</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Local Storage Keys */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
            <h2 className="text-base font-bold text-white mb-4">2. Browser LocalStorage Items</h2>
            <p className="mb-4 text-slate-400">
              We utilize browser localStorage to persist your interface state locally on your machine without transmitting unnecessary data to our servers:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400">
                    <th className="py-2.5 pr-4 font-semibold text-white">Key</th>
                    <th className="py-2.5 pr-4 font-semibold text-white">Purpose</th>
                    <th className="py-2.5 font-semibold text-white">Sensitivity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  <tr>
                    <td className="py-3 pr-4 font-mono text-cyan-300">cart-storage</td>
                    <td className="py-3 pr-4">Persists selected template items in your cart drawer.</td>
                    <td className="py-3 text-emerald-400">Low (Public items)</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-mono text-cyan-300">recently_viewed_templates</td>
                    <td className="py-3 pr-4">Stores IDs of templates you recently previewed for quick browsing.</td>
                    <td className="py-3 text-emerald-400">Low</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-mono text-cyan-300">dimensionui_waitlist_email</td>
                    <td className="py-3 pr-4">Remembers that you subscribed to template updates so the form does not repeatedly prompt you.</td>
                    <td className="py-3 text-slate-300">Email string</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-mono text-cyan-300">reviews_*</td>
                    <td className="py-3 pr-4">Caches customer reviews you write locally for instant previewing.</td>
                    <td className="py-3 text-emerald-400">Low</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Third-Party Storage */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
            <div className="flex items-center gap-2.5 text-base font-bold text-white mb-3">
              <Info className="size-4 text-purple-400" />
              <h2>3. Payment Provider Storage (PayPal)</h2>
            </div>
            <p className="text-slate-400">
              When you initiate an order, PayPal may set temporary session identifiers and security cookies necessary for fraud prevention and payment verification in accordance with their respective security and privacy policies.
            </p>
          </section>

          {/* Managing Storage */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
            <h2 className="text-base font-bold text-white mb-3">4. Managing Your Preferences</h2>
            <p className="text-slate-400">
              You can clear cookies and local storage items at any time through your browser settings. Please note that clearing authentication cookies will log you out of your account vault, and clearing local storage will empty your shopping cart.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
