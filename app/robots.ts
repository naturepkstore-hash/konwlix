import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://knowlix.org';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/watchlist', '/notifications', '/settings'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
