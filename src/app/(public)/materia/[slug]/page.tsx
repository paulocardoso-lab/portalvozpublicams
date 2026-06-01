import React from 'react';
import { Metadata, ResolvingMetadata } from 'next';
import { MobileArticle } from '@/components/article/MobileArticle';
import { DesktopArticle } from '@/components/article/DesktopArticle';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { ViewLogger } from '@/components/shared/ViewLogger';
import { CommentSection } from '@/components/article/CommentSection';
import { auth } from '@/auth';

const publicAuthorSelect = {
  id: true,
  name: true,
  slug: true,
  avatar: true,
} as const;

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const article = await prisma.article.findUnique({
    where: { slug },
    include: { authors: { select: publicAuthorSelect }, section: true }
  });

  if (!article) return { title: 'Notícia não encontrada | Voz Pública MS' };

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${article.title} | Voz Pública MS`,
    description: article.lead,
    openGraph: {
      title: article.title,
      description: article.lead || '',
      url: `https://vozpublica.com.br/materia/${article.slug}`,
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
      authors: { select: publicAuthorSelect },
      section: true,
      comments: {
        where: { status: 'APPROVED' },
        select: {
          id: true,
          body: true,
          guestName: true,
          createdAt: true,
          user: { select: { name: true } }
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!article) notFound();

  const session = await auth();

  if (!article || article.status !== 'PUBLISHED') {
    notFound();
  }

  // Incremento de views agora é feito via client-side para não bloquear o LCP

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    'headline': article.title,
    'description': article.lead,
    'image': article.heroImage ? [article.heroImage] : [],
    'datePublished': article.publishedAt?.toISOString(),
    'dateModified': article.updatedAt?.toISOString(),
    'author': article.authors.map(a => ({
      '@type': 'Person',
      'name': a.name,
      'url': `https://vozpublica.com.br/autor/${a.slug || a.id}`
    })),
    'publisher': {
      '@type': 'Organization',
      'name': 'Voz Pública MS',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://sitevozpublicamsoficial-paulocardoso-labs-projects.vercel.app/logo.png'
      }
    },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `https://vozpublica.com.br/materia/${article.slug}`
    }
  };

  // Serialização para componentes Client
  const serializedArticle = JSON.parse(JSON.stringify(article));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ViewLogger articleId={article.id} />
      <div className="md:hidden" suppressHydrationWarning>
        <MobileArticle article={serializedArticle} />
      </div>
      <div className="hidden md:block" suppressHydrationWarning>
        <DesktopArticle article={serializedArticle} />
      </div>
      <div className="max-w-[1200px] mx-auto px-4 pb-20">
        <CommentSection 
          articleId={article.id} 
          comments={serializedArticle.comments} 
          isLoggedIn={!!session} 
        />
      </div>
    </>
  );
}
