import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";

import { AmbientBackdrop } from "@/components/ambient-backdrop";
import { CartDrawer } from "@/components/cart-drawer";
import { FlashSaleBanner } from "@/components/flash-sale-banner";
import { AffiliateTracker } from "@/components/affiliate-tracker";
import { TemplateCompareDrawer } from "@/components/template-compare-drawer";
import { AiRecommender } from "@/components/ai-recommender";
import { KeyboardShortcuts } from "@/components/keyboard-shortcuts";
import "./globals.css";


const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://dimensionui.com"),
  title: {
    default: "DimensionUI — Premium Next.js Templates for SaaS, B2B & Local Business",
    template: "%s · DimensionUI",
  },
  description:
    "Buy production-ready Next.js 15 templates with Tailwind CSS & Framer Motion. 42+ templates for SaaS, AI tools, local businesses, e-commerce & B2B agencies. Copy-paste ready, one-time payment.",
  keywords: [
    "Next.js templates",
    "React templates",
    "SaaS landing page template",
    "Tailwind CSS template",
    "Framer Motion template",
    "buy Next.js template",
    "Next.js 15 template",
    "UI template marketplace",
    "B2B website template",
    "local business website template",
    "e-commerce landing page",
    "AI SaaS template",
    "TypeScript template",
    "DimensionUI",
  ],
  authors: [{ name: "DimensionUI", url: "https://dimensionui.com" }],
  creator: "DimensionUI",
  publisher: "DimensionUI",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "DimensionUI — Premium Next.js Templates for SaaS, B2B & Local Business",
    description:
      "42+ production-ready Next.js 15 templates with Tailwind CSS & Framer Motion. Copy-paste ready, one-time payment.",
    type: "website",
    siteName: "DimensionUI",
    url: "https://dimensionui.com",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "DimensionUI — Premium Next.js Templates for SaaS, B2B & Local Business",
    description:
      "42+ production-ready Next.js 15 templates. Tailwind CSS + Framer Motion. Copy-paste ready.",
    site: "@dimensionui",
    creator: "@dimensionui",
  },
  alternates: {
    canonical: "https://dimensionui.com",
  },
};

export const viewport: Viewport = {
  themeColor: "#07070d",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="relative min-h-dvh overflow-x-hidden bg-obsidian font-sans text-ink antialiased">
        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "DimensionUI",
              url: "https://dimensionui.com",
              description: "Premium Next.js templates marketplace for SaaS, B2B, local business and e-commerce.",
              sameAs: ["https://twitter.com/dimensionui"],
            }),
          }}
        />
        
        {/* Flash Sale Banner at top */}
        <FlashSaleBanner />

        {/* Fixed atmosphere layer — sits behind all content */}
        <AmbientBackdrop />

        {/* Global referral tracking */}
        <Suspense fallback={null}>
          <AffiliateTracker />
        </Suspense>

        {/* Keyboard shortcuts: / for search, Esc for close */}
        <KeyboardShortcuts />

        {/* Global cart drawer */}
        <CartDrawer />

        {/* Global template comparison tool */}
        <TemplateCompareDrawer />

        {/* AI Template Recommender floating chatbot */}
        <AiRecommender />

        {/* Content stack */}
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
