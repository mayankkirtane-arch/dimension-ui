/**
 * Blog Landing Page
 * Showcases tutorials and template showcases for SEO traffic.
 */
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Calendar, Clock, ArrowRight } from "lucide-react";
import { BLOG_POSTS } from "@/lib/site";

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

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#06060b] text-white">
      {/* Breadcrumb Schema */}
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
            ],
          }),
        }}
      />
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
        {/* Semantic Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-white/40">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <span className="text-white/80 font-medium" aria-current="page">Blog</span>
        </nav>

        <div className="mb-12">
          <h1 className="text-5xl font-black text-white mb-3">Blog & Tutorials</h1>
          <p className="text-white/50 text-xl">Technical tutorials, design tips, and guides for Next.js 15, Tailwind CSS & Framer Motion.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {BLOG_POSTS.map((post) => (
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
