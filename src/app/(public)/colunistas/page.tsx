import React from 'react';
import { prisma } from '@/lib/prisma';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { MobileMasthead } from '@/components/layout/MobileMasthead';
import { MobileTabBar } from '@/components/layout/MobileTabBar';
import { SafeImage } from '@/components/shared/SafeImage';
import { ImgPH } from '@/components/shared/ImgPH';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Colunistas',
  description: 'Conheça os colunistas e articulistas do Voz Pública MS.',
};

export default async function ColunistasPage() {
  const columnists = await prisma.user.findMany({
    where: { role: { in: ['COLUMNIST', 'REPORTER'] }, status: 'ACTIVE' },
    select: {
      id: true,
      name: true,
      slug: true,
      image: true,
      avatar: true,
      bio: true,
      columnTitle: true,
      displayOrder: true,
      articles: {
        where: { status: 'PUBLISHED' },
        select: { title: true, slug: true, publishedAt: true },
        orderBy: { publishedAt: 'desc' },
        take: 1,
      },
      _count: { select: { articles: { where: { status: 'PUBLISHED' } } } },
    },
    orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }],
  });

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:flex flex-col min-h-screen bg-vp-bg w-full">
        <SiteHeader />

        <div className="border-b border-vp-border bg-vp-surface px-[28px] py-[40px]">
          <div className="max-w-[1100px] mx-auto">
            <div className="eyebrow text-[10px] mb-3">Voz Pública MS</div>
            <h1 className="font-display text-[56px] font-black leading-[1.05] tracking-tight text-vp-text mb-3">
              Opinião &amp; Colunistas
            </h1>
            <p className="font-serif italic text-[18px] text-vp-text-2 max-w-[640px] leading-relaxed">
              Análises, perspectivas e opiniões de quem acompanha de perto o poder em Mato Grosso do Sul.
            </p>
          </div>
        </div>

        <div className="px-[28px] py-[48px] max-w-[1100px] mx-auto w-full">
          <div className="grid grid-cols-2 gap-px bg-vp-border">
            {columnists.map((col) => {
              const photo = col.avatar || col.image;
              const latest = col.articles[0];
              return (
                <article key={col.id} className="bg-vp-bg p-8 flex gap-6 group">
                  <Link href={col.slug ? `/colunista/${col.slug}` : '#'} className="shrink-0">
                    <div className="w-[100px] h-[100px] rounded-full overflow-hidden bg-vp-surface border border-vp-border">
                      {photo ? (
                        <SafeImage src={photo} alt={col.name} width={100} height={100} className="object-cover w-full h-full" />
                      ) : (
                        <ImgPH label="" width={100} height={100} className="rounded-full" />
                      )}
                    </div>
                  </Link>
                  <div className="flex flex-col justify-center gap-2 min-w-0">
                    <div className="font-sans text-[10px] text-vp-accent uppercase tracking-widest font-bold">
                      {col.columnTitle || 'Opinião'}
                    </div>
                    <Link href={col.slug ? `/colunista/${col.slug}` : '#'}>
                      <h2 className="font-display text-[24px] font-black leading-tight group-hover:text-vp-accent transition-colors">
                        {col.name}
                      </h2>
                    </Link>
                    {col.bio && (
                      <p className="font-serif text-[14px] text-vp-text-2 leading-relaxed line-clamp-2">
                        {col.bio}
                      </p>
                    )}
                    {latest && (
                      <Link href={`/materia/${latest.slug}`} className="font-display text-[14px] italic text-vp-text-3 hover:text-vp-accent transition-colors line-clamp-1">
                        &ldquo;{latest.title}&rdquo; →
                      </Link>
                    )}
                    <div className="font-mono text-[10px] text-vp-text-4">
                      {col._count.articles} {col._count.articles === 1 ? 'coluna' : 'colunas'}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {columnists.length === 0 && (
            <div className="py-24 text-center text-vp-text-3 font-serif italic">
              Nenhum colunista cadastrado ainda.
            </div>
          )}
        </div>

        <div className="mt-auto">
          <SiteFooter />
        </div>
      </div>

      {/* Mobile */}
      <div className="lg:hidden flex flex-col min-h-screen bg-vp-bg w-full">
        <MobileMasthead />

        <div className="px-4 py-8 bg-vp-surface border-b border-vp-border">
          <div className="eyebrow text-[10px] mb-2">Voz Pública MS</div>
          <h1 className="font-display text-[32px] font-black leading-tight">Opinião &amp; Colunistas</h1>
          <p className="font-serif italic text-[14px] text-vp-text-2 mt-2 leading-relaxed">
            Análises e opiniões sobre o poder em MS.
          </p>
        </div>

        <div className="flex flex-col divide-y divide-vp-border pb-20">
          {columnists.map((col) => {
            const photo = col.avatar || col.image;
            const latest = col.articles[0];
            return (
              <article key={col.id} className="px-4 py-5 flex gap-4">
                <Link href={col.slug ? `/colunista/${col.slug}` : '#'} className="shrink-0">
                  <div className="w-[64px] h-[64px] rounded-full overflow-hidden bg-vp-surface border border-vp-border">
                    {photo ? (
                      <SafeImage src={photo} alt={col.name} width={64} height={64} className="object-cover w-full h-full" />
                    ) : (
                      <ImgPH label="" width={64} height={64} className="rounded-full" />
                    )}
                  </div>
                </Link>
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="font-sans text-[9px] text-vp-accent uppercase tracking-widest font-bold">
                    {col.columnTitle || 'Opinião'}
                  </div>
                  <Link href={col.slug ? `/colunista/${col.slug}` : '#'}>
                    <h2 className="font-display text-[18px] font-black leading-tight">{col.name}</h2>
                  </Link>
                  {latest && (
                    <Link href={`/materia/${latest.slug}`} className="font-display text-[13px] italic text-vp-text-3 line-clamp-1">
                      &ldquo;{latest.title}&rdquo;
                    </Link>
                  )}
                  <div className="font-mono text-[10px] text-vp-text-4">
                    {col._count.articles} {col._count.articles === 1 ? 'coluna' : 'colunas'}
                  </div>
                </div>
              </article>
            );
          })}

          {columnists.length === 0 && (
            <div className="py-16 text-center text-vp-text-3 font-serif italic px-4">
              Nenhum colunista cadastrado ainda.
            </div>
          )}
        </div>

        <MobileTabBar />
      </div>
    </>
  );
}
