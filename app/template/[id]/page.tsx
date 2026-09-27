/**
 * Dynamic SEO page for each template.
 * Generates a unique, indexable page at /template/[id] for every template in the TEMPLATES array.
 * Next.js will statically generate all 42 pages at build time.
 */
import { TEMPLATES, CHECKOUT_URL } from "@/lib/site";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Check, ShoppingCart, Zap, ExternalLink } from "lucide-react";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { ReviewsSection } from "@/components/reviews";

// Generate all static paths at build time
export async function generateStaticParams() {
  return TEMPLATES.map((t) => ({ id: t.id }));
}

// Generate unique meta tags per template for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const template = TEMPLATES.find((t) => t.id === id);
  if (!template) return {};
  const isFree = template.tier === 'free';
  const priceStr = isFree ? 'Free download' : `${template.price} one-time payment`;
  const title = `${template.name} — Next.js Template`;
  const description = `${template.blurb} Built with Next.js 15, Tailwind CSS & Framer Motion. ${priceStr}. Commercial license included.`;

  return {
    title,
    description,
    keywords: [
      template.name,
      `${template.category} template`,
      `${template.category} Next.js template`,
      "Next.js template",
      "Tailwind CSS template",
      "Framer Motion template",
      "React template",
      "buy website template",
      "DimensionUI",
    ],
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
  const is3D = template.tier === "30";

  const tierLabel = isFree ? "Free" : `$${template.tier} Tier`;
  const tierColor = isFree
    ? "text-emerald-400 border-emerald-400/30 bg-emerald-400/10"
    : is3D
    ? "text-purple-300 border-purple-400/30 bg-purple-400/10"
    : "text-cyan-400 border-cyan-400/30 bg-cyan-400/10";

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
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-white/40">
              <Link href="/#gallery" className="hover:text-white transition-colors">Templates</Link>
              <span>/</span>
              <span>{template.category}</span>
            </div>

            {/* Title + tier badge */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className={`rounded-full border px-3 py-0.5 text-xs font-semibold ${tierColor}`}>
                  {tierLabel}
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-0.5 text-xs text-white/50">
                  {template.category}
                </span>
              </div>
              <h1 className="text-4xl font-black text-white leading-tight">{template.name}</h1>
              <p className="mt-3 text-lg text-white/60 leading-relaxed">{template.blurb}</p>
            </div>

            {/* Features */}
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
              <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">What's included</p>
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
      </main>
    </div>
  );
}
