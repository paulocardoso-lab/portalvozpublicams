import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';
import { isDonationsEnabled } from '@/lib/donation-config';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://vozpublicams.com.br';

  const [articles, sections, donationsEnabled] = await Promise.all([
    prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true, updatedAt: true },
    }),
    prisma.section.findMany({
      select: { slug: true },
    }),
    isDonationsEnabled(),
  ]);

  const articleEntries = articles.map((article) => ({
    url: `${baseUrl}/${article.slug}`,
    lastModified: article.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const sectionEntries = sections.map((section) => ({
    url: `${baseUrl}/editoria/${section.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'always' as const,
      priority: 1,
    },
    ...(donationsEnabled ? [{
      url: `${baseUrl}/apoiar`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }] : []),
    ...sectionEntries,
    ...articleEntries,
  ];
}
