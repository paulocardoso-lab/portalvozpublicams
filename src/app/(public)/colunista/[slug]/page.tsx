import React from 'react';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { DesktopColumnist } from '@/components/columnist/DesktopColumnist';
import { MobileMasthead } from '@/components/layout/MobileMasthead';
import { MobileTabBar } from '@/components/layout/MobileTabBar';
import Link from 'next/link';
import { ImgPH } from '@/components/shared/ImgPH';

export default async function ColumnistPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const columnist = await prisma.user.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      image: true,
      avatar: true,
      email: true,
      bio: true,
      articles: {
        where: { status: 'PUBLISHED' },
        orderBy: { publishedAt: 'desc' },
        take: 12,
      }
    }
  });

  if (!columnist) notFound();

  const articles = columnist.articles || [];
  const latest = articles[0];
  const archive = articles.slice(1);

  return (
    <>
      {/* Desktop Version */}
      <div className="hidden lg:block">
        <DesktopColumnist columnist={columnist} />
      </div>

      {/* Mobile Version */}
      <div className="lg:hidden flex flex-col min-h-screen bg-vp-bg w-full">
        <MobileMasthead />
        
        <div className="px-4 py-6 sm:py-8 bg-vp-surface border-b border-vp-border">
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-vp-bg border border-vp-border mb-4">
              <ImgPH label="" width={96} height={96} />
            </div>
            <div className="eyebrow text-[10px] mb-1">Colunista</div>
            <h1 className="font-display text-[32px] leading-tight mb-2">{columnist.name}</h1>
            <p className="font-serif italic text-[14px] text-vp-text-2 px-4">
              {columnist.bio || 'Colunista do Voz Pública.'}
            </p>
          </div>
        </div>

        <div className="px-4 py-6 flex flex-col gap-6 pb-20 sm:pb-6">
          {latest && (
            <article className="pb-6 border-b border-vp-border">
              <div className="eyebrow text-[10px] mb-1.5">Última coluna</div>
              <Link href={`/materia/${latest.slug}`}>
                <h2 className="font-display text-[26px] italic leading-tight mb-3">“{latest.title}”</h2>
              </Link>
              <p className="font-serif text-[15px] text-vp-text-2 line-clamp-4">{latest.lead}</p>
            </article>
          )}

          <div className="flex flex-col gap-4">
            <h3 className="font-sans text-[11px] uppercase tracking-widest font-bold text-vp-text-3">Arquivo</h3>
            {archive.map((art) => (
              <article key={art.id} className="grid grid-cols-[50px_1fr] gap-3 pb-4 border-b border-vp-border">
                <div className="font-mono text-[10px] text-vp-text-3 pt-1">
                  {art.publishedAt ? new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short' }).format(new Date(art.publishedAt)) : ''}
                </div>
                <Link href={`/materia/${art.slug}`}>
                  <h4 className="font-display text-[18px] italic leading-tight">{art.title}</h4>
                </Link>
              </article>
            ))}
          </div>
        </div>

        <MobileTabBar />
      </div>
    </>
  );
}
