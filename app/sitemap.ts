import { MetadataRoute } from 'next';
import { getFeaturedArticles, getAllCategories, getPolicies } from '@/lib/data';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://knowlix.org';

  const [articles, categories, policies] = await Promise.all([
    getFeaturedArticles(),
    getAllCategories(),
    getPolicies(),
  ]);

  const articleUrls: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${baseUrl}/article/${a.slug}`,
    lastModified: new Date(a.updatedAt),
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  const categoryUrls: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${baseUrl}/category/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const policyUrls: MetadataRoute.Sitemap = policies.map((p) => ({
    url: `${baseUrl}/policies/${p.slug}`,
    lastModified: new Date(p.updatedAt),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/policies`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  return [...staticUrls, ...articleUrls, ...categoryUrls, ...policyUrls];
}
