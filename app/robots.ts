import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/', '/login/', '/preview/'],
      },
    ],
    sitemap: 'https://dimensionui.com/sitemap.xml',
  };
}
