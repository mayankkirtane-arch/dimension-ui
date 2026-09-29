/**
 * Dynamic SEO page for each template.
 * Generates a unique, indexable page at /template/[id] for every template in the TEMPLATES array.
 * Next.js will statically generate all 42 pages at build time.
 */
import {
  TEMPLATES,
  getTemplateVersion,
  getTemplateLastUpdated,
  getTemplateChangelog,
  getTemplateCompatibility,
  getTemplateQualityReport,
  getTemplateIntegrations,
  getTemplateFigma,
} from "@/lib/site";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Check, ShoppingCart, Zap, ExternalLink, Sliders, GitCommit, ShieldCheck, Blocks, Figma } from "lucide-react";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { ReviewsSection } from "@/components/reviews";
import { TemplateChangelog } from "@/components/template-changelog";
import { TemplateCompatibility } from "@/components/template-compatibility";
import { TemplateQualityBadges } from "@/components/template-quality-badges";
import { TemplateIntegrations } from "@/components/template-integrations";
import { TemplateFigmaSection } from "@/components/template-figma";
import {
  getTemplateSeo,
  getTemplateSeoTitle,
  getTemplateSeoDescription,
  getTemplateSeoKeywords,
} from "@/lib/seo-intent";
import { getBlogPostBySlug } from "@/lib/site";

// Generate all static paths at build time
export async function generateStaticParams() {
  return TEMPLATES.map((t) => ({ id: t.id }));
}

// Generate unique meta tags per template targeting distinct international search intent
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const template = TEMPLATES.find((t) => t.id === id);
  if (!template) return {};

  const title = getTemplateSeoTitle(template);
  const description = getTemplateSeoDescription(template);
  const keywords = getTemplateSeoKeywords(template);

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: `https://dimensionui.com/template/${template.id}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
    },
    alternates: {
      canonical: `https://dimensionui.com/template/${template.id}`,
    },
  };
}

export default async function TemplatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const template = TEMPLATES.find((t) => t.id === id);
  if (!template) notFound();

  const isFree = template.tier === "free";

  const tierLabel = isFree ? "Free" : `$${template.tier} Tier`;
  const tierColor = isFree
    ? "text-emerald-400 border-emerald-400/30 bg-emerald-400/10"
    : template.tier === "20"
    ? "text-purple-300 border-purple-400/30 bg-purple-400/10"
    : "text-cyan-400 border-cyan-400/30 bg-cyan-400/10";

  const currentVersion = getTemplateVersion(template);
  const lastUpdated = getTemplateLastUpdated(template);
  const changelogEntries = getTemplateChangelog(template);
  const compatibility = getTemplateCompatibility(template);
  const qualityReport = getTemplateQualityReport(template.id);
  const integrations = getTemplateIntegrations(template);
  const figma = getTemplateFigma(template);
  const hasFigmaIncluded = figma.state === "Figma Included";
  const hasFigmaAvailable = figma.state === "Figma Available";

  const seoData = getTemplateSeo(template);
  const relatedGuides = seoData.relatedBlogSlugs
    .map((slug) => getBlogPostBySlug(slug))
    .filter((b): b is NonNullable<typeof b> => Boolean(b));

  return (
    <div className="min-h-screen bg-[#06060b] text-white">
      {/* JSON-LD Product Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: template.name,
            description: template.blurb,
            image: `https://dimensionui.com/template/${template.id}/opengraph-image`,
            brand: { "@type": "Brand", name: "DimensionUI" },
            offers: {
              "@type": "Offer",
              price: template.tier === "free" ? "0" : template.tier,
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
              seller: { "@type": "Organization", name: "DimensionUI", url: "https://dimensionui.com" },
            },
            url: `https://dimensionui.com/template/${template.id}`,
            category: template.category,
          }),
        }}
      />
      {/* JSON-LD Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://dimensionui.com",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Templates",
                item: "https://dimensionui.com/#gallery",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: template.category,
                item: `https://dimensionui.com/?category=${encodeURIComponent(template.category)}#gallery`,
              },
              {
                "@type": "ListItem",
                position: 4,
                name: template.name,
                item: `https://dimensionui.com/template/${template.id}`,
              },
            ],
          }),
        }}
      />
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 size-[800px] rounded-full bg-purple-600/5 blur-[160px]" />
      </div>

      {/* Navbar */}
      <nav className="border-b border-white/10 bg-black/40 backdrop-blur-xl sticky top-0 z-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500">
              <Zap className="size-4 text-white" />
            </div>
            <span className="font-bold text-white">DimensionUI</span>
          </Link>
          <Link href="/#gallery" className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors">
            <ArrowLeft className="size-4" />
            All Templates
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* LEFT: Live Preview */}
          <div className="sticky top-24">
            <div className="rounded-2xl border border-white/10 overflow-hidden bg-black shadow-2xl">
              {/* Browser chrome */}
              <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-[#ff5f56]" />
                  <span className="size-2 rounded-full bg-[#ffbd2e]" />
                  <span className="size-2 rounded-full bg-[#27c93f]" />
                  <span className="ml-3 text-xs font-mono text-white/30 truncate max-w-[180px] sm:max-w-none">
                    dimensionui.com/preview/{template.id}
                  </span>
                </div>
                <Link
                  href={`/preview/${template.id}`}
                  className="flex items-center gap-1 text-[0.6875rem] font-medium text-purple-400 hover:text-purple-300 transition-colors"
                  title="Open interactive multi-device preview"
                >
                  <span>Interactive Preview</span>
                  <ExternalLink className="size-3" />
                </Link>
              </div>
              {/* iframe live preview */}
              <iframe
                src={`/preview/${template.id}?embed=true`}
                className="w-full h-[500px] border-0"
                title={`Live preview of ${template.name}`}
              />
            </div>
          </div>

          {/* RIGHT: Info & CTA */}
          <div className="flex flex-col gap-6">
            {/* Breadcrumb Navigation */}
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-white/40">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <Link href="/#gallery" className="hover:text-white transition-colors">Templates</Link>
              <span>/</span>
              <Link href={`/?category=${encodeURIComponent(template.category)}#gallery`} className="hover:text-white transition-colors">
                {template.category}
              </Link>
              <span>/</span>
              <span className="text-white/80 font-medium" aria-current="page">{template.name}</span>
            </nav>

            {/* Title + tier badge */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className={`rounded-full border px-3 py-0.5 text-xs font-semibold ${tierColor}`}>
                  {tierLabel}
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-0.5 text-xs text-white/50">
                  {template.category}
                </span>
                <span className="rounded-full border border-purple-500/30 bg-purple-500/10 px-2.5 py-0.5 text-xs font-mono font-semibold text-purple-300">
                  {currentVersion}
                </span>
                <a
                  href="#compatibility"
                  className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.02] px-2.5 py-0.5 text-xs text-white/50 hover:text-white hover:border-white/20 transition-colors"
                >
                  <Sliders className="size-3 text-purple-400" />
                  Compatibility
                </a>
                <a
                  href="#integrations"
                  className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.02] px-2.5 py-0.5 text-xs text-white/50 hover:text-white hover:border-white/20 transition-colors"
                >
                  <Blocks className="size-3 text-cyan-400" />
                  Integrations
                  {integrations.length > 0 && (
                    <span className="ml-0.5 text-[0.65rem] text-cyan-300 font-mono">({integrations.length})</span>
                  )}
                </a>
                <a
                  href="#quality"
                  className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.02] px-2.5 py-0.5 text-xs text-white/50 hover:text-white hover:border-white/20 transition-colors"
                >
                  <ShieldCheck className="size-3 text-emerald-400" />
                  Quality Verified
                </a>
                <a
                  href="#changelog"
                  className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.02] px-2.5 py-0.5 text-xs text-white/50 hover:text-white hover:border-white/20 transition-colors"
                >
                  <GitCommit className="size-3 text-cyan-400" />
                  Changelog
                </a>
                {/* Figma Badge: ONLY "Figma Included" when resource actually exists */}
                {hasFigmaIncluded && (
                  <a
                    href="#figma"
                    className="inline-flex items-center gap-1 rounded-full border border-violet-500/40 bg-violet-500/15 px-2.5 py-0.5 text-xs font-semibold text-violet-300 hover:bg-violet-500/25 transition-colors shadow-[0_0_10px_rgba(139,92,246,0.2)]"
                    title="Official Figma source file included"
                  >
                    <Figma className="size-3 text-violet-400" />
                    Figma Included
                  </a>
                )}
                {hasFigmaAvailable && (
                  <a
                    href="#figma"
                    className="inline-flex items-center gap-1 rounded-full border border-cyan-500/40 bg-cyan-500/15 px-2.5 py-0.5 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/25 transition-colors"
                    title="Figma community resource available"
                  >
                    <Figma className="size-3 text-cyan-400" />
                    Figma Available
                  </a>
                )}
                {!hasFigmaIncluded && !hasFigmaAvailable && (
                  <a
                    href="#figma"
                    className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.02] px-2.5 py-0.5 text-xs text-white/50 hover:text-white hover:border-white/20 transition-colors"
                    title="Design specifications & code-first architecture"
                  >
                    <Figma className="size-3 text-white/40" />
                    Figma (None)
                  </a>
                )}
              </div>
              <h1 className="text-4xl font-black text-white leading-tight">{template.name}</h1>
              <p className="mt-3 text-lg text-white/60 leading-relaxed">{template.blurb}</p>
            </div>

            {/* Features */}
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
              <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">What&apos;s included</p>
              <ul className="flex flex-col gap-2.5">
                {template.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-white/80">
                    <Check className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
                <li className="flex items-start gap-2.5 text-sm text-white/80">
                  <Check className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                  Full TypeScript source code
                </li>
                <li className="flex items-start gap-2.5 text-sm text-white/80">
                  <Check className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                  Commercial licence, unlimited projects
                </li>
              </ul>
            </div>

            {/* Pricing + CTA */}
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 flex flex-col gap-4">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-white">
                  {isFree ? "Free" : template.price}
                </span>
                {!isFree && (
                  <span className="text-sm text-white/40">one-time payment</span>
                )}
              </div>

              <AddToCartButton template={template} />

              {!isFree && (
                <p className="text-xs text-white/30 text-center">
                  💡 Add 3+ templates to get a 20% bundle discount automatically.
                </p>
              )}
            </div>

            {/* Tech stack */}
            <div className="flex flex-wrap gap-2">
              {["Next.js 15", "React", "TypeScript", "Tailwind CSS", "Framer Motion"].map((tech) => (
                <span key={tech} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/50">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Technical Specifications */}
        <section className="mt-16 rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <Sliders className="size-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Technical Specifications</h2>
                <p className="text-xs text-white/50">Verified architecture, framework stack, and licensing</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${tierColor}`}>
                {tierLabel}
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/60">
                {template.category}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 flex flex-col justify-between">
              <span className="text-xs font-medium text-white/40 uppercase tracking-wider">Price</span>
              <span className="text-base font-bold text-white mt-1.5">{isFree ? "Free ($0)" : template.price}</span>
            </div>

            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 flex flex-col justify-between">
              <span className="text-xs font-medium text-white/40 uppercase tracking-wider">License</span>
              <span className="text-base font-semibold text-white mt-1.5">Commercial (Unlimited Projects)</span>
            </div>

            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 flex flex-col justify-between">
              <span className="text-xs font-medium text-white/40 uppercase tracking-wider">Framework</span>
              <span className="text-base font-semibold text-white mt-1.5">Next.js (App Router)</span>
            </div>

            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 flex flex-col justify-between">
              <span className="text-xs font-medium text-white/40 uppercase tracking-wider">Next.js version</span>
              <span className="text-base font-semibold text-white mt-1.5">15.1.6</span>
            </div>

            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 flex flex-col justify-between">
              <span className="text-xs font-medium text-white/40 uppercase tracking-wider">React version</span>
              <span className="text-base font-semibold text-white mt-1.5">19.0.0</span>
            </div>

            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 flex flex-col justify-between">
              <span className="text-xs font-medium text-white/40 uppercase tracking-wider">Tailwind version</span>
              <span className="text-base font-semibold text-white mt-1.5">4.0.0</span>
            </div>

            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 flex flex-col justify-between">
              <span className="text-xs font-medium text-white/40 uppercase tracking-wider">TypeScript</span>
              <span className="text-base font-semibold text-white mt-1.5">Strict (v5.7.3)</span>
            </div>

            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 flex flex-col justify-between">
              <span className="text-xs font-medium text-white/40 uppercase tracking-wider">Dark mode</span>
              <span className="text-base font-semibold text-white mt-1.5">
                {template.features.some((f) => f.toLowerCase().includes("dark"))
                  ? "Yes (Default)"
                  : "Yes (Dark Obsidian Theme)"}
              </span>
            </div>

            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 flex flex-col justify-between">
              <span className="text-xs font-medium text-white/40 uppercase tracking-wider">Template version</span>
              <span className="text-base font-semibold font-mono text-purple-300 mt-1.5">{currentVersion}</span>
            </div>

            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 flex flex-col justify-between">
              <span className="text-xs font-medium text-white/40 uppercase tracking-wider">Last updated</span>
              <span className="text-base font-semibold text-white mt-1.5">{lastUpdated}</span>
            </div>

            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 flex flex-col justify-between">
              <span className="text-xs font-medium text-white/40 uppercase tracking-wider">Responsive</span>
              <span className="text-base font-semibold text-white mt-1.5">Yes (Mobile, Tablet & Desktop)</span>
            </div>

            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 flex flex-col justify-between">
              <span className="text-xs font-medium text-white/40 uppercase tracking-wider">Figma Resource</span>
              <span className={`text-base font-semibold mt-1.5 ${
                hasFigmaIncluded
                  ? "text-violet-300 font-bold"
                  : hasFigmaAvailable
                  ? "text-cyan-300 font-bold"
                  : "text-white/60"
              }`}>
                {figma.state === "No Figma File" ? "None (Code-First)" : figma.state}
              </span>
            </div>
          </div>
        </section>

        {/* Template Architecture, Use Case & Scope Breakdown */}
        <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
          <div className="border-b border-white/10 pb-4 mb-6">
            <h2 className="text-xl font-bold text-white">Architecture & Included Scope</h2>
            <p className="text-xs text-white/50 mt-1">
              Detailed technical specification covering framework stack, intended use case, included pages and UI sections, pricing, and licensing terms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Target Use Case */}
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
              <h3 className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-2">Target Use Case</h3>
              <p className="text-sm text-white/80 leading-relaxed">{seoData.useCase}</p>
            </div>

            {/* Pages & UI Sections Included */}
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
              <h3 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">Pages & Sections Included</h3>
              <ul className="flex flex-wrap gap-2 mt-2">
                {seoData.includedSections.map((sec) => (
                  <li key={sec} className="rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-white/70">
                    {sec}
                  </li>
                ))}
              </ul>
            </div>

            {/* Framework Architecture */}
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
              <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">Framework & Technology</h3>
              <p className="text-sm text-white/80 leading-relaxed">
                Built with Next.js 15 (App Router with Server Actions & Static Site Generation), React 19, Tailwind CSS v4, TypeScript 5.7 strict mode, and GPU-accelerated Framer Motion physics.
              </p>
            </div>

            {/* Pricing & Commercial Licensing */}
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
              <h3 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">Pricing & Commercial License</h3>
              <p className="text-sm text-white/80 leading-relaxed">
                {isFree ? "100% Free lead magnet" : `${template.price} one-time payment with zero monthly subscriptions`}. Includes a commercial license for unlimited personal and client projects with lifetime source code access.
              </p>
            </div>
          </div>
        </section>

        {/* Compatibility Matrix */}
        <TemplateCompatibility entries={compatibility} />

        {/* Supported Integrations */}
        <TemplateIntegrations
          templateName={template.name}
          integrations={integrations}
        />

        {/* Figma Design Resources */}
        <TemplateFigmaSection
          figma={figma}
          templateName={template.name}
          category={template.category}
        />

        {/* Verified Quality Indicators */}
        <TemplateQualityBadges report={qualityReport} />

        {/* Changelog & Release Notes */}
        <TemplateChangelog
          templateName={template.name}
          currentVersion={currentVersion}
          entries={changelogEntries}
        />

        {/* Reviews Section */}
        <ReviewsSection templateId={template.id} />

        {/* Related Templates */}
        {(() => {
          const related = TEMPLATES.filter(
            (t) => t.id !== template.id && (t.category === template.category || t.tier === template.tier)
          ).slice(0, 3);
          if (related.length === 0) return null;
          return (
            <div className="mt-16">
              <h3 className="text-xl font-bold text-white mb-6">You Might Also Like</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {related.map((t) => (
                  <Link
                    key={t.id}
                    href={`/template/${t.id}`}
                    className="group rounded-xl border border-white/10 bg-white/[0.02] p-4 hover:border-white/20 hover:bg-white/[0.04] transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[0.65rem] font-bold text-cyan-400 uppercase">{t.category}</span>
                      <span className="font-mono text-sm font-bold text-white">{t.price === "$0" ? "FREE" : t.price}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">{t.name}</h4>
                    <p className="text-xs text-white/50 mt-1 line-clamp-2">{t.blurb}</p>
                  </Link>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Related Technical Guides & Articles for Internal SEO Linking */}
        {relatedGuides.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white">Related Technical Guides & Articles</h3>
                <p className="text-xs text-white/50">Tutorials and design deep dives relevant to this template</p>
              </div>
              <Link href="/blog" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">
                View all articles →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedGuides.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group rounded-xl border border-white/10 bg-white/[0.02] p-5 hover:border-purple-500/30 hover:bg-white/[0.04] transition-all"
                >
                  <span className={`inline-block mb-2 rounded-full border px-2.5 py-0.5 text-[0.6875rem] font-semibold ${post.tagColor}`}>
                    {post.tag}
                  </span>
                  <h4 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                    {post.title}
                  </h4>
                  <p className="text-xs text-white/50 mt-2 line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="mt-4 flex items-center gap-3 text-[0.6875rem] text-white/40">
                    <span>{post.date}</span>
                    <span>·</span>
                    <span>{post.readTime}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
