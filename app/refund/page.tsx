import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, RefreshCw, HelpCircle, Mail, AlertCircle, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Refund Policy — DimensionUI",
  description: "Review DimensionUI's general refund policy for digital template purchases and source code downloads.",
  alternates: {
    canonical: "https://dimensionui.com/refund",
  },
  openGraph: {
    title: "DimensionUI Refund Policy",
    description: "Guidelines and instructions for requesting refunds on digital purchases at DimensionUI.",
    url: "https://dimensionui.com/refund",
    type: "website",
  },
};

export default function RefundPage() {
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
            Customer Support & Policies
          </span>
        </div>
      </nav>

      <main className="mx-auto max-w-4xl px-6 py-14">
        {/* Header */}
        <div className="mb-12 border-b border-white/10 pb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-400 mb-4">
            <RefreshCw className="size-3.5" />
            General Policy
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Refund Policy
          </h1>
          <p className="mt-3 text-sm text-slate-400 leading-relaxed">
            Last Updated: September 30, 2026. This policy outlines how refund requests for digital templates and source code purchases are evaluated and handled.
          </p>
        </div>

        {/* Content */}
        <div className="space-y-10 text-sm leading-relaxed text-slate-300">
          {/* Nature of Digital Goods */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
            <div className="flex items-center gap-2.5 text-base font-bold text-white mb-3">
              <AlertCircle className="size-4 text-purple-400" />
              <h2>1. Nature of Digital Goods</h2>
            </div>
            <p className="text-slate-400">
              Because DimensionUI offers intangible, irrevocable digital goods (.zip packages containing complete Next.js source code, components, and assets), delivery happens immediately upon purchase. Once downloaded, digital source files cannot be physically returned. As such, refund requests are reviewed on a case-by-case basis in accordance with this policy and applicable payment provider rules.
            </p>
          </section>

          {/* Refund Review Process */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
            <div className="flex items-center gap-2.5 text-base font-bold text-white mb-3">
              <HelpCircle className="size-4 text-cyan-400" />
              <h2>2. How Refund Requests are Handled</h2>
            </div>
            <p className="mb-3 text-slate-400">
              Refund requests are not automatically approved or denied. Each request is evaluated manually by our support team based on the specific circumstances. Typical situations eligible for refund review include:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-300">
              <li>Duplicate accidental purchases of the exact same template on the same account.</li>
              <li>Verified technical corruption or unrecoverable defect in the source zip file that our support team cannot resolve.</li>
              <li>Verified fraudulent transactions reported through authorized payment channels.</li>
            </ul>
            <p className="mt-4 text-slate-400">
              Refund requests are handled in accordance with the published policy and applicable payment provider rules. DimensionUI does not override or supersede the rules and dispute processes of PayPal or other relevant payment processors.
            </p>
          </section>

          {/* Payment Provider & Processing */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
            <div className="flex items-center gap-2.5 text-base font-bold text-white mb-3">
              <CheckCircle2 className="size-4 text-emerald-400" />
              <h2>3. Processing of Approved Refunds</h2>
            </div>
            <p className="mb-3 text-slate-400">
              When a refund is approved by DimensionUI:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-300">
              <li>Refunds are processed back through the original payment provider (e.g. PayPal) used for the initial transaction.</li>
              <li>Depending on the payment provider and your financial institution, funds typically take several business days to reflect in your account balance or statement.</li>
              <li>Upon refund issuance, the associated commercial license key and download access for the refunded template in your dashboard vault will be revoked.</li>
            </ul>
          </section>

          {/* How to Submit a Request */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
            <div className="flex items-center gap-2.5 text-base font-bold text-white mb-3">
              <Mail className="size-4 text-amber-400" />
              <h2>4. How to Submit a Refund Request</h2>
            </div>
            <p className="mb-4 text-slate-400">
              To request a refund review, please contact our support team with your transaction details:
            </p>
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-xs space-y-1.5 font-mono text-slate-300 mb-4">
              <p>Email: support@dimensionui.com</p>
              <p>Subject: Refund Request - [Your Order ID or Account Email]</p>
              <p>Details: Include template name, date of purchase, and reason for request.</p>
            </div>
            <p className="text-slate-400">
              Our support team will respond to review your request and assist you with technical resolution or refund processing.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
