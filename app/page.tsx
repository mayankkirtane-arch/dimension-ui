import { Hero } from "@/components/hero";
import { Navbar } from "@/components/navbar";
import { FaqSection } from "@/components/sections/faq";
import { SiteFooter } from "@/components/sections/footer";
import { GallerySection } from "@/components/sections/gallery";
import { PlaybookSections } from "@/components/sections/playbooks";
import { BundlesSection } from "@/components/sections/bundles";
import { NewsletterCapture } from "@/components/newsletter-capture";

/**
 * DimensionUI landing page.
 *
 * Section order is deliberate: prove the product (gallery), then prove it fits
 * the visitor's market (playbooks), then remove objections (FAQ), then capture
 * leads (newsletter) before the closing CTA in the footer.
 */
export default function Home() {
  return (
    <>
      <Navbar />

      <main id="main">
        <Hero />
        <GallerySection />
        <BundlesSection />
        <PlaybookSections />
        <FaqSection />

        <section className="mx-auto max-w-4xl px-6 py-16">
          <NewsletterCapture />
        </section>
      </main>

      <SiteFooter />
      {/* FAQ Schema for Google rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "What frameworks do DimensionUI templates use?",
                acceptedAnswer: { "@type": "Answer", text: "All DimensionUI templates are built with Next.js 15, React, TypeScript, Tailwind CSS, and Framer Motion. They are production-ready and fully copy-paste compatible." },
              },
              {
                "@type": "Question",
                name: "Is this a one-time payment or a subscription?",
                acceptedAnswer: { "@type": "Answer", text: "DimensionUI templates are sold with a one-time payment. No recurring subscriptions. You get lifetime access to the full source code." },
              },
              {
                "@type": "Question",
                name: "Can I use DimensionUI templates for client projects?",
                acceptedAnswer: { "@type": "Answer", text: "Yes. All paid templates include a commercial license for unlimited use in client projects." },
              },
              {
                "@type": "Question",
                name: "Do you offer free Next.js templates?",
                acceptedAnswer: { "@type": "Answer", text: "Yes. DimensionUI offers several completely free Next.js templates. Premium templates start at $15 and go up to $30 for advanced 3D templates." },
              },
            ],
          }),
        }}
      />
    </>
  );
}
