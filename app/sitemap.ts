import { MetadataRoute } from 'next';
import { TEMPLATES } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://dimensionui.com';

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/builder`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/blog/how-to-launch-saas-landing-page`, lastModified: new Date('2026-09-18'), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/blog/3d-websites-convert-better`, lastModified: new Date('2026-09-12'), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/blog/best-saas-templates-2026`, lastModified: new Date('2026-09-05'), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/blog/tailwind-framer-motion-animations`, lastModified: new Date('2026-08-28'), changeFrequency: 'monthly', priority: 0.7 },
  ];

  const templatePages: MetadataRoute.Sitemap = TEMPLATES.map((t) => ({
    url: `${base}/template/${t.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: t.tier === 'free' ? 0.7 : 0.9,
  }));

  return [...staticPages, ...templatePages];
}
