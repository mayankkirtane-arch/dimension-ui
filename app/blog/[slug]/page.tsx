/**
 * Individual Blog Post Page
 * Dynamic route with full post content.
 */
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock } from "lucide-react";

const POSTS: Record<string, { title: string; date: string; readTime: string; tag: string; content: string }> = {
  "how-to-launch-saas-landing-page": {
    title: "How to Launch a SaaS Landing Page in Under 10 Minutes",
    date: "2026-09-18",
    readTime: "5 min read",
    tag: "Tutorial",
    content: `
## Getting Started

DimensionUI templates are designed to be plug-and-play. Here's how to go from zero to live in 10 minutes.

### Step 1: Purchase & Download

After purchasing, you'll receive a ZIP file containing the complete Next.js project. Unzip it into your workspace.

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

That's it. Your SaaS landing page is live in under 10 minutes.

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

### Key Metrics

| Metric | Flat Design | 3D/Interactive |
|---|---|---|
| Avg. time on site | 1m 12s | 2m 9s |
| Bounce rate | 68% | 41% |
| Conversion rate | 2.1% | 4.3% |
| Social shares | 0.3% | 1.8% |

### Why It Works

**1. Pattern Interruption**
3D elements break the visual monotony users have developed a subconscious filter against. When something moves in response to the cursor, the brain registers it as *real*.

**2. Perceived Value**
Visitors subconsciously associate visual polish with product quality. A stunning 3D landing page signals that your team cares about craft.

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
## The Top 10 SaaS Templates This Year

We reviewed hundreds of templates to find the ones actually driving signups and revenue for founders.

### 1. Aether AI SaaS — DimensionUI
Clean, conversion-focused, with a beautiful waitlist capture flow. Perfect for AI tools and SaaS products.

### 2. Orbital SaaS Hub — DimensionUI
Enterprise feel with animated dashboards. Great for B2B software companies.

### 3. Nova Minimal Portfolio
For founders who want to establish personal brand alongside their product.

### Why DimensionUI Templates Top the List

- **60fps Framer Motion animations** — not CSS transitions that stutter on mobile
- **Copy-paste ready** — no component library to learn
- **TypeScript + Next.js 15** — production-ready architecture out of the box
- **AI prompts included** — every template comes with GPT prompts to generate matching copy instantly
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

This pattern is used extensively throughout DimensionUI templates to create the cascading card animations.
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
    title: post.title, 
    description: post.content.slice(0, 150).replace(/[#\n`]/g, ""),
    alternates: { canonical: `https://dimensionui.com/blog/${slug}` }
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = POSTS[slug];
  if (!post) notFound();

  // Simple markdown-like rendering
  const renderContent = (content: string) =>
    content.split("\n").map((line, i) => {
      if (line.startsWith("## ")) return <h2 key={i} className="text-2xl font-black text-white mt-10 mb-4">{line.slice(3)}</h2>;
      if (line.startsWith("### ")) return <h3 key={i} className="text-xl font-bold text-white mt-7 mb-3">{line.slice(4)}</h3>;
      if (line.startsWith("- ")) return <li key={i} className="text-white/70 ml-4 mb-1 list-disc">{line.slice(2)}</li>;
      if (line.startsWith("```")) return <div key={i} className="font-mono text-xs text-cyan-300 bg-white/5 rounded-lg p-4 my-3 border border-white/10 overflow-x-auto whitespace-pre">{""}</div>;
      if (line.startsWith("|")) return <div key={i} className="font-mono text-xs text-white/70 border-b border-white/10 py-1">{line}</div>;
      if (line.trim() === "") return <div key={i} className="h-2" />;
      return <p key={i} className="text-white/70 leading-relaxed mb-3">{line}</p>;
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
        {/* Article Schema */}
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
              description: post.content.slice(0, 200).replace(/[#\n`*|]/g, ' ').trim(),
            }),
          }}
        />
        <div className="mb-6 flex items-center gap-4 text-xs text-white/40">
          <span className="flex items-center gap-1"><Calendar className="size-3" />{post.date}</span>
          <span className="flex items-center gap-1"><Clock className="size-3" />{post.readTime}</span>
          <span className="rounded-full border border-purple-500/30 bg-purple-500/10 px-2.5 py-0.5 text-purple-300">{post.tag}</span>
        </div>
        <h1 className="text-4xl font-black text-white mb-10 leading-tight">{post.title}</h1>
        <div className="prose-content">{renderContent(post.content)}</div>

        <div className="mt-16 rounded-2xl border border-purple-500/20 bg-purple-500/5 p-8 text-center">
          <h3 className="text-xl font-bold text-white mb-2">Ready to Build Something Stunning?</h3>
          <p className="text-sm text-white/50 mb-4">Browse 42+ production-ready Next.js templates built with the techniques from this post.</p>
          <Link href="/#gallery" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 px-6 py-3 text-sm font-bold text-white hover:brightness-110">
            Browse Templates →
          </Link>
        </div>
      </article>
    </div>
  );
}
