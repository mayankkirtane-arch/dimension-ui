/**
 * Individual Blog Post Page
 * Dynamic route with full post content, contextual internal linking,
 * Breadcrumb schema, and featured template showcases.
 */
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, ArrowRight, ExternalLink } from "lucide-react";
import { TEMPLATES } from "@/lib/site";

const POST_FEATURED_TEMPLATES: Record<string, string[]> = {
  "how-to-launch-saas-landing-page": ["aether-ai-saas", "cloudscale-analytics"],
  "3d-websites-convert-better": ["cloudscale-analytics", "fintech-neobank", "enterprise-b2b-agency"],
  "best-saas-templates-2026": ["aether-ai-saas", "cloudscale-analytics", "fintech-neobank"],
  "tailwind-framer-motion-animations": ["aether-ai-saas", "cloudscale-analytics", "app-launch-lp"],
};

const POSTS: Record<string, { title: string; date: string; readTime: string; tag: string; content: string }> = {
  "how-to-launch-saas-landing-page": {
    title: "How to Launch a SaaS Landing Page in Under 10 Minutes",
    date: "2026-09-18",
    readTime: "5 min read",
    tag: "Tutorial",
    content: `
## Getting Started

DimensionUI templates like [Aether AI SaaS](/template/aether-ai-saas) and [CloudScale SaaS Analytics](/template/cloudscale-analytics) are designed to be plug-and-play. Here's how to go from zero to live in 10 minutes.

### Step 1: Purchase & Download

After purchasing, you'll receive a ZIP file containing the complete Next.js project. You can start with our free lead magnet [Aether AI SaaS](/template/aether-ai-saas) or select an enterprise template like [Enterprise B2B Growth Agency](/template/enterprise-b2b-agency).

### Step 2: Install Dependencies

\`\`\`bash
npm install
\`\`\`

### Step 3: Configure Your Content

Open \`lib/site.ts\` and update:
- Your product name and tagline
- Navigation links
- Pricing tiers
- Feature bullets

### Step 4: Deploy to Vercel

\`\`\`bash
vercel deploy
\`\`\`

That's it. Your SaaS landing page is live in under 10 minutes. For enterprise telemetry dials, you can also explore [CloudScale SaaS Analytics](/template/cloudscale-analytics).

## Customization Tips

- All colors are defined as CSS variables in \`globals.css\`
- Framer Motion animations can be tweaked in \`lib/animations.ts\`
- The hero section accepts any background gradient via Tailwind classes
    `,
  },
  "3d-websites-convert-better": {
    title: "Why 3D Websites Convert 2× Better Than Flat Designs",
    date: "2026-09-12",
    readTime: "7 min read",
    tag: "Research",
    content: `
## The Data

After analyzing 50 landing pages across SaaS, e-commerce, and agency niches, we found a clear pattern: pages with interactive 3D elements consistently outperform flat designs.

Interactive templates such as [CloudScale SaaS Analytics](/template/cloudscale-analytics) and [Fintech NeoBank & Wallet](/template/fintech-neobank) demonstrate how Framer Motion micro-interactions elevate engagement.

### Key Metrics

| Metric | Flat Design | 3D/Interactive |
|---|---|---|
| Avg. time on site | 1m 12s | 2m 9s |
| Bounce rate | 68% | 41% |
| Conversion rate | 2.1% | 4.3% |
| Social shares | 0.3% | 1.8% |

### Why It Works

**1. Pattern Interruption**
3D elements break the visual monotony users have developed a subconscious filter against. When something moves in response to the cursor — like in [DevFlow API Documentation](/template/devflow-hub) — the brain registers it as interactive and responsive.

**2. Perceived Value**
Visitors subconsciously associate visual polish with product quality. A stunning 3D landing page signals that your team cares about craft. Explore [Enterprise B2B Growth Agency](/template/enterprise-b2b-agency) to see high-production interactions in action.

**3. Shareability**
People screenshot and share impressive websites. Your landing page becomes a marketing asset in itself.
    `,
  },
  "best-saas-templates-2026": {
    title: "10 Best SaaS Website Templates of 2026",
    date: "2026-09-05",
    readTime: "9 min read",
    tag: "Roundup",
    content: `
## The Top SaaS Templates This Year

We reviewed hundreds of templates to find the ones actually driving signups and revenue for founders.

### 1. [Aether AI SaaS](/template/aether-ai-saas) — DimensionUI
Clean, conversion-focused, with an interactive waitlist capture flow. Perfect for AI tools and fast-moving SaaS founders.

### 2. [CloudScale SaaS Analytics](/template/cloudscale-analytics) — DimensionUI
Enterprise feel with animated telemetry and usage quota rings. Great for B2B software companies.

### 3. [DevFlow API Documentation](/template/devflow-hub) — DimensionUI
Developer-first portal with searchable endpoints, multi-language code blocks, and webhook inspectors.

### 4. [Fintech NeoBank & Wallet](/template/fintech-neobank) — DimensionUI
High-trust financial technology interface with virtual card previews and security compliance badges.

### 5. [Nova Developer Portfolio](/template/nova-minimal-portfolio) — DimensionUI
For founders and developers who want to establish personal brand authority alongside their product.

### Why DimensionUI Templates Top the List

- **60fps Framer Motion animations** — not CSS transitions that stutter on mobile
- **Copy-paste ready** — no proprietary component library to learn
- **TypeScript + Next.js 15** — production-ready architecture out of the box
- **Verified Lighthouse performance** — genuine sub-second load times tested on mobile viewports
    `,
  },
  "tailwind-framer-motion-animations": {
    title: "Tailwind + Framer Motion: The Perfect Animation Stack",
    date: "2026-08-28",
    readTime: "6 min read",
    tag: "Deep Dive",
    content: `
## Why These Two Libraries Belong Together

Tailwind CSS handles static styling. Framer Motion handles everything that moves. Together they cover 95% of everything you'll need to build modern web UIs.

### The Basic Pattern

\`\`\`tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  className="rounded-2xl border border-white/10 bg-white/5 p-6"
>
  Your content here
</motion.div>
\`\`\`

Tailwind handles the visual style. Framer handles the entrance animation. Clean separation of concerns.

### Staggered Children

\`\`\`tsx
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

<motion.ul variants={container} initial="hidden" animate="show">
  {items.map(item => (
    <motion.li variants={{ hidden: { y: 20 }, show: { y: 0 } }}>
      {item}
    </motion.li>
  ))}
</motion.ul>
\`\`\`

This pattern is used extensively throughout DimensionUI templates like [Aether AI SaaS](/template/aether-ai-saas), [AppLaunch Mobile LP](/template/app-launch-lp), and [DevFlow API Documentation](/template/devflow-hub) to create silky 60fps cascading card animations.
    `,
  },
};

export async function generateStaticParams() {
  return Object.keys(POSTS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = POSTS[slug];
  if (!post) return {};
  return { 
    title: `${post.title} — DimensionUI Blog`, 
    description: post.content.slice(0, 160).replace(/[#\n`*|\[\]\(\)]/g, " ").trim(),
    alternates: { canonical: `https://dimensionui.com/blog/${slug}` },
    openGraph: {
      title: `${post.title} — DimensionUI Blog`,
      description: post.content.slice(0, 160).replace(/[#\n`*|\[\]\(\)]/g, " ").trim(),
      url: `https://dimensionui.com/blog/${slug}`,
      type: "article",
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = POSTS[slug];
  if (!post) notFound();

  const featuredTemplateIds = POST_FEATURED_TEMPLATES[slug] || [];
  const featuredTemplates = featuredTemplateIds
    .map((id) => TEMPLATES.find((t) => t.id === id))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  // Markdown-like rendering with markdown link support
  const renderParagraphWithLinks = (text: string) => {
    const parts = [];
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      const href = match[2];
      const isInternal = href.startsWith("/");
      parts.push(
        isInternal ? (
          <Link key={match.index} href={href} className="text-purple-400 hover:text-purple-300 underline font-medium">
            {match[1]}
          </Link>
        ) : (
          <a key={match.index} href={href} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 underline font-medium">
            {match[1]}
          </a>
        )
      );
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  const renderContent = (content: string) =>
    content.split("\n").map((line, i) => {
      if (line.startsWith("## ")) return <h2 key={i} className="text-2xl font-black text-white mt-10 mb-4">{line.slice(3)}</h2>;
      if (line.startsWith("### ")) return <h3 key={i} className="text-xl font-bold text-white mt-7 mb-3">{renderParagraphWithLinks(line.slice(4))}</h3>;
      if (line.startsWith("- ")) return <li key={i} className="text-white/70 ml-4 mb-1 list-disc">{renderParagraphWithLinks(line.slice(2))}</li>;
      if (line.startsWith("```")) return <div key={i} className="font-mono text-xs text-cyan-300 bg-white/5 rounded-lg p-4 my-3 border border-white/10 overflow-x-auto whitespace-pre">{""}</div>;
      if (line.startsWith("|")) return <div key={i} className="font-mono text-xs text-white/70 border-b border-white/10 py-1">{line}</div>;
      if (line.trim() === "") return <div key={i} className="h-2" />;
      return <p key={i} className="text-white/70 leading-relaxed mb-3">{renderParagraphWithLinks(line)}</p>;
    });

  return (
    <div className="min-h-screen bg-[#06060b] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 size-[700px] rounded-full bg-purple-600/5 blur-[160px]" />
      </div>

      <nav className="border-b border-white/10 bg-black/40 backdrop-blur-xl sticky top-0 z-10">
        <div className="mx-auto flex max-w-3xl items-center px-6 py-4">
          <Link href="/blog" className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors">
            <ArrowLeft className="size-4" />
            All Posts
          </Link>
        </div>
      </nav>

      <article className="mx-auto max-w-3xl px-6 py-16">
        {/* Article & Breadcrumb Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: post.title,
              author: { "@type": "Organization", name: "DimensionUI", url: "https://dimensionui.com" },
              datePublished: post.date,
              publisher: {
                "@type": "Organization",
                name: "DimensionUI",
                url: "https://dimensionui.com",
              },
              url: `https://dimensionui.com/blog/${slug}`,
              description: post.content.slice(0, 200).replace(/[#\n`*|\[\]\(\)]/g, ' ').trim(),
            }),
          }}
        />
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
                  name: "Blog",
                  item: "https://dimensionui.com/blog",
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: post.title,
                  item: `https://dimensionui.com/blog/${slug}`,
                },
              ],
            }),
          }}
        />

        {/* Semantic Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-xs text-white/40">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-white/80 font-medium" aria-current="page">{post.title}</span>
        </nav>

        <div className="mb-6 flex items-center gap-4 text-xs text-white/40">
          <span className="flex items-center gap-1"><Calendar className="size-3" />{post.date}</span>
          <span className="flex items-center gap-1"><Clock className="size-3" />{post.readTime}</span>
          <span className="rounded-full border border-purple-500/30 bg-purple-500/10 px-2.5 py-0.5 text-purple-300">{post.tag}</span>
        </div>
        <h1 className="text-4xl font-black text-white mb-10 leading-tight">{post.title}</h1>
        <div className="prose-content">{renderContent(post.content)}</div>

        {/* Featured Templates Mentioned in this Post */}
        {featuredTemplates.length > 0 && (
          <div className="mt-16 rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
            <h3 className="text-lg font-bold text-white mb-2">Featured Templates in this Guide</h3>
            <p className="text-xs text-white/50 mb-6">
              Production-ready Next.js 15 templates demonstrated in this article.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {featuredTemplates.map((t) => (
                <Link
                  key={t.id}
                  href={`/template/${t.id}`}
                  className="group rounded-xl border border-white/10 bg-white/[0.02] p-4 hover:border-purple-500/40 hover:bg-white/[0.04] transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[0.65rem] font-bold text-cyan-400 uppercase tracking-wider">{t.category}</span>
                    <span className="font-mono text-xs font-bold text-white">{t.price === "$0" ? "FREE" : t.price}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors flex items-center justify-between">
                    {t.name}
                    <ArrowRight className="size-3 text-white/30 group-hover:text-purple-300 group-hover:translate-x-0.5 transition-all" />
                  </h4>
                  <p className="text-xs text-white/50 mt-1 line-clamp-2 leading-relaxed">{t.blurb}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Closing CTA */}
        <div className="mt-12 rounded-2xl border border-purple-500/20 bg-purple-500/5 p-8 text-center">
          <h3 className="text-xl font-bold text-white mb-2">Ready to Build Something Stunning?</h3>
          <p className="text-sm text-white/50 mb-6 max-w-md mx-auto">
            Browse 42+ production-ready Next.js templates built with React 19, Tailwind CSS v4 & Framer Motion.
          </p>
          <Link href="/#gallery" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 px-6 py-3 text-sm font-bold text-white hover:brightness-110 shadow-lg shadow-purple-500/20 transition-all">
            Browse All Templates →
          </Link>
        </div>
      </article>
    </div>
  );
}
