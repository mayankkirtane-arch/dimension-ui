import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, FileCheck, ShieldAlert, Key, DownloadCloud, AlertTriangle, Scale } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms and Conditions — DimensionUI",
  description: "Read the terms governing the use of DimensionUI, template licensing, purchases, and intellectual property rights.",
  alternates: {
    canonical: "https://dimensionui.com/terms",
  },
  openGraph: {
    title: "DimensionUI Terms & Conditions",
    description: "Commercial licensing terms, permitted usage, and agreements for DimensionUI templates.",
    url: "https://dimensionui.com/terms",
    type: "website",
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#07070d] text-slate-200">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 size-[650px] rounded-full bg-cyan-600/5 blur-[160px]" />
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
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400 mb-4">
            <Scale className="size-3.5" />
            Legal Agreement
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Terms & Conditions
          </h1>
          <p className="mt-3 text-sm text-slate-400 leading-relaxed">
            Last Updated: September 30, 2026. Please read these terms carefully before purchasing or using templates, code packages, or digital products from DimensionUI.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-10 text-sm leading-relaxed text-slate-300">
          {/* Section 1: Agreement to Terms */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
            <div className="flex items-center gap-2.5 text-base font-bold text-white mb-3">
              <FileCheck className="size-4 text-purple-400" />
              <h2>1. Agreement to Terms</h2>
            </div>
            <p className="text-slate-400">
              By accessing, browsing, or purchasing digital items from DimensionUI (&quot;DimensionUI&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;), you agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree to these terms, you must not use or download materials from this website.
            </p>
          </section>

          {/* Section 2: Commercial License & Permitted Use */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
            <div className="flex items-center gap-2.5 text-base font-bold text-white mb-3">
              <Key className="size-4 text-cyan-400" />
              <h2>2. Template Licenses & Permitted Use</h2>
            </div>
            <p className="mb-4 text-slate-400">
              When you purchase a template from DimensionUI, you are granted a non-exclusive, perpetual, worldwide commercial license to use the template code and assets subject to the following permissions:
            </p>
            <div className="space-y-3">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                <h3 className="font-semibold text-emerald-400 mb-1">What You CAN Do:</h3>
                <ul className="list-disc pl-5 space-y-1 text-slate-300 text-xs">
                  <li>Use the template for unlimited personal, commercial, and client client websites.</li>
                  <li>Modify, customize, and combine the source code with other libraries or backend services.</li>
                  <li>Deploy the final customized website or application to production servers or hosting platforms.</li>
                  <li>Charge clients for services, consulting, or development work built using our templates.</li>
                </ul>
              </div>

              <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                <h3 className="font-semibold text-red-400 mb-1">What You CANNOT Do (Prohibited Use):</h3>
                <ul className="list-disc pl-5 space-y-1 text-slate-300 text-xs">
                  <li>Resell, redistribute, license, or sub-license the raw template source code as a standalone template or UI kit.</li>
                  <li>Publish the source code in public open-source repositories without substantial proprietary modifications.</li>
                  <li>Include our templates in competing digital template vaults, site generators, or theme marketplaces.</li>
                  <li>Claim original authorship or copyright ownership of the un-customized core template designs.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3: Accounts & Security */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
            <div className="flex items-center gap-2.5 text-base font-bold text-white mb-3">
              <ShieldAlert className="size-4 text-amber-400" />
              <h2>3. Accounts, Vault Access & Security</h2>
            </div>
            <p className="mb-3 text-slate-400">
              To access your purchased source code files, download updates, and view your license keys, you must authenticate using your authorized email or Google account.
            </p>
            <p className="text-slate-400">
              You are responsible for maintaining the confidentiality of your authentication credentials and all activity under your account. DimensionUI reserves the right to suspend or revoke access to the download vault if fraudulent payment or license sharing is detected.
            </p>
          </section>

          {/* Section 4: Downloads & Delivery */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
            <div className="flex items-center gap-2.5 text-base font-bold text-white mb-3">
              <DownloadCloud className="size-4 text-emerald-400" />
              <h2>4. Digital Delivery & Availability</h2>
            </div>
            <p className="mb-3 text-slate-400">
              All products sold on DimensionUI are intangible digital downloads (.zip packages containing Next.js source code, components, and configuration). Delivery occurs immediately upon verified payment completion through your dashboard vault.
            </p>
            <p className="text-slate-400">
              While we strive to provide continuous availability of our download servers and template updates, we cannot guarantee uninterrupted access. We recommend creating local backups of downloaded source files.
            </p>
          </section>

          {/* Section 5: Intellectual Property */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
            <h2 className="text-base font-bold text-white mb-3">5. Intellectual Property Rights</h2>
            <p className="text-slate-400">
              All branding, logos, trademarks, documentation, website structure, and original template source code remain the intellectual property of DimensionUI and its contributors, protected by applicable copyright and intellectual property laws.
            </p>
          </section>

          {/* Section 6: Disclaimers & Limitation of Liability */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
            <div className="flex items-center gap-2.5 text-base font-bold text-white mb-3">
              <AlertTriangle className="size-4 text-yellow-400" />
              <h2>6. Disclaimer of Warranties & Limitation of Liability</h2>
            </div>
            <p className="mb-3 text-slate-400">
              Templates and code packages are provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranties of any kind, whether express or implied, including fitness for a particular purpose or non-infringement.
            </p>
            <p className="text-slate-400">
              To the fullest extent permitted by law, DimensionUI shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use our templates, software dependencies, third-party APIs, or hosting platforms.
            </p>
          </section>

          {/* Section 7: Termination & Contact */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
            <h2 className="text-base font-bold text-white mb-3">7. Contact & Notices</h2>
            <p className="text-slate-400 leading-relaxed">
              If you have any questions or inquiries regarding these Terms and Conditions or commercial licensing, please reach out to us at:
              <br />
              Email:{" "}
              <a href="mailto:support@dimensionui.com" className="text-cyan-400 hover:text-cyan-300">
                support@dimensionui.com
              </a>
              <br />
              Operator: [Insert Legal Business Entity / DimensionUI Operator]
              <br />
              Jurisdiction: [Insert Governing Law & Jurisdiction, e.g. State of California, USA / India]
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
