import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://vozpublicams.com.br';

  // Fetch all published articles
  const articles = await prisma.article.findMany({
    where: { status: 'PUBLISHED' },
    select: { slug: true, updatedAt: true },
  });

  const articleEntries = articles.map((article) => ({
    url: `${baseUrl}/materia/${article.slug}`,
    lastModified: article.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Fetch all sections
  const sections = await prisma.section.findMany({
    select: { slug: true },
  });

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
    {
      url: `${baseUrl}/apoiar`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    ...sectionEntries,
    ...articleEntries,
  ];
}
