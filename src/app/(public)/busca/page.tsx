import React from 'react';
import prisma from '@/lib/prisma';
import { DesktopSearch } from '@/components/search/DesktopSearch';
import { MobileMasthead } from '@/components/layout/MobileMasthead';
import { MobileTabBar } from '@/components/layout/MobileTabBar';
import Link from 'next/link';

const publicAuthorSelect = {
  id: true,
  name: true,
  slug: true,
  avatar: true,
} as const;

export default async function SearchPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ q?: string }> 
}) {
  const { q } = await searchParams;

  const results = q ? await prisma.article.findMany({
    where: {
      OR: [
        { title: { contains: q, mode: 'insensitive' } },
        { lead: { contains: q, mode: 'insensitive' } },
      ],
      status: 'PUBLISHED',
    },
    include: {
      section: true,
      authors: { select: publicAuthorSelect },
    },
    orderBy: { publishedAt: 'desc' },
    take: 30,
  }) : [];

  return (
    <>
      {/* Desktop Version */}
      <div className="hidden lg:block">
        <DesktopSearch query={q || ''} results={results} />
      </div>

      {/* Mobile Version */}
      <div className="lg:hidden flex flex-col min-h-screen bg-vp-bg w-full">
        <MobileMasthead />
        
        <div className="px-4 py-6 sm:py-8 border-b border-vp-border">
          <h1 className="font-display text-[26px] sm:text-[32px] mb-4">Busca</h1>
          <form action="/busca" method="GET" className="flex gap-2">
            <input
              name="q"
              defaultValue={q}
              placeholder="Pesquisar..."
              className="vp-input text-[16px] py-2.5 px-4 flex-1 min-h-11"
            />
            <button type="submit" className="vp-btn vp-btn-primary px-5 text-[12px] font-bold min-h-11">
              IR
            </button>
          </form>
        </div>

        <div className="px-4 py-6 flex flex-col gap-6 pb-20 sm:pb-6">
          {q && results.length === 0 && (
            <p className="text-vp-text-3 italic text-center py-10">
              Nenhum resultado para &quot;{q}&quot;
            </p>
          )}

          {results.map(article => (
            <article key={article.id} className="pb-6 border-b border-vp-border">
              <div className="flex items-center gap-2 text-[10px] font-bold text-vp-accent uppercase tracking-wider mb-1">
                {article.section?.name}
              </div>
              <Link href={`/materia/${article.slug}`}>
                <h2 className="font-display text-[22px] leading-tight mb-2">
                  {article.title}
                </h2>
              </Link>
              <p className="font-serif text-[14px] text-vp-text-2 line-clamp-2">
                {article.lead}
              </p>
            </article>
          ))}
        </div>

        <MobileTabBar active="search" />
      </div>
    </>
  );
}
