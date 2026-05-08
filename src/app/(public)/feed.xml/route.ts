import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const baseUrl = 'https://vozpublicams.com.br';
  const articles = await prisma.article.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { publishedAt: 'desc' },
    take: 20,
    include: { authors: true, section: true },
  });

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>Voz Pública MS</title>
  <link>${baseUrl}</link>
  <description>Jornalismo independente para Mato Grosso do Sul</description>
  <language>pt-br</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
  ${articles.map((article) => `
  <item>
    <title><![CDATA[${article.title}]]></title>
    <link>${baseUrl}/materia/${article.slug}</link>
    <guid>${baseUrl}/materia/${article.slug}</guid>
    <pubDate>${new Date(article.publishedAt || article.createdAt).toUTCString()}</pubDate>
    <description><![CDATA[${article.lead || ''}]]></description>
    <category>${article.section.name}</category>
    <author>${article.authors.map(a => a.email).join(', ')}</author>
  </item>`).join('')}
</channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}
