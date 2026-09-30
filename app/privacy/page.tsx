import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Shield, Lock, Eye, Database, FileText, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy — DimensionUI",
  description: "Learn how DimensionUI collects, uses, and protects your account, payment, and license information.",
  alternates: {
    canonical: "https://dimensionui.com/privacy",
  },
  openGraph: {
    title: "DimensionUI Privacy Policy",
    description: "Transparent overview of user data collection, security, and third-party processing at DimensionUI.",
    url: "https://dimensionui.com/privacy",
    type: "website",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#07070d] text-slate-200">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 size-[650px] rounded-full bg-purple-600/5 blur-[160px]" />
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
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-400 mb-4">
            <Shield className="size-3.5" />
            Transparent Privacy
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-slate-400 leading-relaxed">
            Last Updated: September 30, 2026. This policy explains how DimensionUI (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) collects, uses, and safeguards information when you use our website, templates, and services.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-10 text-sm leading-relaxed text-slate-300">
          {/* Section 1 */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
            <div className="flex items-center gap-2.5 text-base font-bold text-white mb-3">
              <Eye className="size-4 text-purple-400" />
              <h2>1. Information We Actually Collect</h2>
            </div>
            <p className="mb-4 text-slate-400">
              We practice data minimization and collect only the information strictly required to authenticate your account, deliver template source files, generate valid commercial licenses, and provide customer support:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-300">
              <li>
                <strong className="text-white">Account & Authentication Data:</strong> When you sign in via Email Magic Link or Google OAuth, our authentication provider (Supabase Auth) records your email address, authentication identifier, and basic profile information provided by Google (name and avatar, if provided).
              </li>
              <li>
                <strong className="text-white">Purchase & License Records:</strong> When you purchase a template, we store the template identifier, amount paid, transaction/order identifier, generated commercial license key, and timestamp in our secure database.
              </li>
              <li>
                <strong className="text-white">Template Requests & Waitlists:</strong> If you submit a custom template suggestion or join our newsletter, we store the email address and suggestion you submit.
              </li>
              <li>
                <strong className="text-white">User-Submitted Reviews:</strong> If you voluntarily write a review for a template, we store the name provided, rating, and feedback comment.
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
            <div className="flex items-center gap-2.5 text-base font-bold text-white mb-3">
              <Lock className="size-4 text-cyan-400" />
              <h2>2. Financial & Payment Information</h2>
            </div>
            <p className="mb-3 text-slate-400">
              DimensionUI <strong className="text-white">never</strong> sees, collects, or stores your credit card numbers, debit card numbers, bank account details, or payment credentials.
            </p>
            <p className="text-slate-400">
              All payment transactions are handled directly through <strong className="text-white">PayPal</strong> (PayPal Sandbox during evaluation/testing and PayPal Live in production). PayPal transmits only an order authorization and capture confirmation token to our server to verify that the transaction was completed.
            </p>
          </section>

          {/* Section 3 */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
            <div className="flex items-center gap-2.5 text-base font-bold text-white mb-3">
              <Database className="size-4 text-emerald-400" />
              <h2>3. Third-Party Service Providers</h2>
            </div>
            <p className="mb-4 text-slate-400">
              We partner with trusted infrastructure providers to run DimensionUI. Each provider processes data according to their own privacy standards and security agreements:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <h3 className="font-semibold text-white">Supabase</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Provides hosted database storage, Row-Level Security (RLS), and authentication services.
                </p>
              </div>
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <h3 className="font-semibold text-white">PayPal</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Processes secure payments, order verification, and refund management.
                </p>
              </div>
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <h3 className="font-semibold text-white">Google OAuth</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Provides optional federated single-sign-on identity verification for your account.
                </p>
              </div>
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <h3 className="font-semibold text-white">Vercel</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Hosts our Next.js application runtime and provides edge delivery and serverless execution.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
            <div className="flex items-center gap-2.5 text-base font-bold text-white mb-3">
              <FileText className="size-4 text-purple-400" />
              <h2>4. AI Features & Client-Side Processing</h2>
            </div>
            <p className="text-slate-400">
              Our interactive template recommender tool operates using client-side keyword matching directly within your web browser. Your project search queries are not forwarded to third-party commercial AI model providers for advertising or tracking purposes.
            </p>
          </section>

          {/* Section 5 */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
            <div className="flex items-center gap-2.5 text-base font-bold text-white mb-3">
              <Mail className="size-4 text-amber-400" />
              <h2>5. Your Rights & Data Deletion Requests</h2>
            </div>
            <p className="mb-3 text-slate-400">
              You maintain rights over your personal data under applicable data protection laws (such as GDPR and CCPA), including the right to access, rectify, or request deletion of your information.
            </p>
            <p className="mb-3 text-slate-400">
              Because template licenses and verified downloads must remain verifiable, requests to delete account records are handled manually to ensure that active commercial licenses are properly preserved or terminated according to your wishes.
            </p>
            <p className="text-slate-400">
              To request an export or deletion of your personal data, or to contact our privacy team, please contact us at:{" "}
              <a
                href="mailto:support@dimensionui.com"
                className="text-purple-400 hover:text-purple-300 underline underline-offset-4"
              >
                support@dimensionui.com
              </a>{" "}
              or via our support contact channels.
            </p>
          </section>

          {/* Section 6 */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
            <h2 className="text-base font-bold text-white mb-3">6. Entity & Contact Information</h2>
            <p className="text-slate-400 leading-relaxed">
              <strong>DimensionUI Operations</strong>
              <br />
              Business / Operator: [Insert Legal Entity Name / DimensionUI Operator]
              <br />
              Email:{" "}
              <a href="mailto:support@dimensionui.com" className="text-purple-400 hover:text-purple-300">
                support@dimensionui.com
              </a>
              <br />
              Address: [Insert Business Jurisdiction / Address, e.g. Bangalore, India]
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
