import React from 'react';
import { Metadata, ResolvingMetadata } from 'next';
import { MobileArticle } from '@/components/article/MobileArticle';
import { DesktopArticle } from '@/components/article/DesktopArticle';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const article = await prisma.article.findUnique({
    where: { slug },
    include: { authors: true, section: true }
  });

  if (!article) return { title: 'Notícia não encontrada | Voz Pública MS' };

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${article.title} | Voz Pública MS`,
    description: article.lead,
    openGraph: {
      title: article.title,
      description: article.lead || '',
      url: `https://vozpublica.com.br/${article.slug}`,
      siteName: 'Voz Pública MS',
      images: article.heroImage ? [article.heroImage, ...previousImages] : previousImages,
      locale: 'pt_BR',
      type: 'article',
      publishedTime: article.publishedAt?.toISOString(),
      authors: article.authors.map(a => a.name),
      section: article.section?.name,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.lead || '',
      images: article.heroImage ? [article.heroImage] : [],
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Buscar a matéria no banco
  const article = await prisma.article.findUnique({
    where: { slug },
    include: {
      authors: true,
      section: true,
    }
  });

  if (!article || article.status !== 'PUBLISHED') {
    notFound();
  }

  // Incrementar visualizações (background-ish)
  // Nota: Em produção usaríamos um padrão mais robusto, 
  // mas para o MVP vamos atualizar direto.
  await prisma.article.update({
    where: { id: article.id },
    data: { views: { increment: 1 } }
  });

  return (
    <>
      <div className="md:hidden">
        <MobileArticle article={article} />
      </div>
      <div className="hidden md:block">
        <DesktopArticle article={article} />
      </div>
    </>
  );
}
