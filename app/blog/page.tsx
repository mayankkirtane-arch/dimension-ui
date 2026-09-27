/**
 * Blog Landing Page
 * Showcases tutorials and template showcases for SEO traffic.
 */
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Calendar, Clock, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: 'Blog — Next.js Templates, SaaS Design & Web Dev Tips',
  description: 'Tutorials, case studies, and design tips for developers building SaaS products, landing pages, and web apps with Next.js, Tailwind CSS, and Framer Motion.',
  alternates: {
    canonical: 'https://dimensionui.com/blog',
  },
  openGraph: {
    title: 'DimensionUI Blog — Next.js & SaaS Design Tips',
    description: 'Tutorials and insights for developers building web products with Next.js, Tailwind CSS, and Framer Motion.',
    url: 'https://dimensionui.com/blog',
    type: 'website',
  },
};

const POSTS = [
  {
    slug: "how-to-launch-saas-landing-page",
    title: "How to Launch a SaaS Landing Page in Under 10 Minutes",
    excerpt: "A step-by-step walkthrough of setting up DimensionUI's Aether AI SaaS template in your Next.js project — from clone to deployed.",
    date: "2026-09-18",
    readTime: "5 min read",
    tag: "Tutorial",
    tagColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
  },
  {
    slug: "3d-websites-convert-better",
    title: "Why 3D Websites Convert 2× Better Than Flat Designs",
    excerpt: "We analyzed 50 landing pages and found that interactive 3D elements increase time-on-site by 78% and conversion rates by 2×. Here's the data.",
    date: "2026-09-12",
    readTime: "7 min read",
    tag: "Research",
    tagColor: "text-purple-400 bg-purple-500/10 border-purple-500/30",
  },
  {
    slug: "best-saas-templates-2026",
    title: "10 Best SaaS Website Templates of 2026",
    excerpt: "We curated the top 10 SaaS templates that are converting the best this year — from AI tools to B2B platforms.",
    date: "2026-09-05",
    readTime: "9 min read",
    tag: "Roundup",
    tagColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  },
  {
    slug: "tailwind-framer-motion-animations",
    title: "Tailwind + Framer Motion: The Perfect Animation Stack",
    excerpt: "Learn how we combine Tailwind CSS utility classes with Framer Motion variants to create the silky 60fps animations you see in DimensionUI.",
    date: "2026-08-28",
    readTime: "6 min read",
    tag: "Deep Dive",
    tagColor: "text-orange-400 bg-orange-500/10 border-orange-500/30",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#06060b] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 size-[700px] rounded-full bg-purple-600/5 blur-[160px]" />
      </div>

      <nav className="border-b border-white/10 bg-black/40 backdrop-blur-xl sticky top-0 z-10">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors">
            <ArrowLeft className="size-4" />
            Back to DimensionUI
          </Link>
          <span className="text-sm font-bold text-white">Blog</span>
        </div>
      </nav>

      <main className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-12">
          <h1 className="text-5xl font-black text-white mb-3">Blog</h1>
          <p className="text-white/50 text-xl">Tutorials, design tips, and inspiration from the DimensionUI team.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {POSTS.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:border-white/20 hover:bg-white/[0.04] transition-all"
            >
              <span className={`mb-3 self-start rounded-full border px-3 py-0.5 text-xs font-semibold ${post.tagColor}`}>
                {post.tag}
              </span>
              <h2 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors leading-snug">
                {post.title}
              </h2>
              <p className="text-sm text-white/50 leading-relaxed mb-4 flex-1">{post.excerpt}</p>
              <div className="flex items-center justify-between text-xs text-white/30">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1"><Calendar className="size-3" />{post.date}</span>
                  <span className="flex items-center gap-1"><Clock className="size-3" />{post.readTime}</span>
                </div>
                <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
