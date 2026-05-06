import React from 'react';
import prisma from '@/lib/prisma';
import Link from 'next/link';

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
      authors: true,
    },
    orderBy: { publishedAt: 'desc' },
    take: 20,
  }) : [];

  return (
    <main className="max-w-[800px] mx-auto px-6 py-12 min-h-[60vh]">
      <div className="mb-12 border-b border-vp-border pb-8">
        <h1 className="font-display text-[42px] mb-6 tracking-tight">Buscar no Voz Pública</h1>
        <form action="/busca" method="GET" className="flex gap-2">
          <input 
            name="q" 
            defaultValue={q}
            placeholder="Digite palavras-chave..." 
            className="vp-input text-[18px] py-3 px-4 flex-1"
            autoFocus
          />
          <button type="submit" className="vp-btn vp-btn-primary px-8 text-[14px]">
            BUSCAR
          </button>
        </form>
      </div>

      <div className="space-y-10">
        {q && results.length === 0 && (
          <p className="text-vp-text-3 italic">Nenhum resultado encontrado para &quot;{q}&quot;.</p>
        )}

        {results.map(article => (
          <article key={article.id} className="group border-b border-vp-border pb-8 last:border-0">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-[11px] font-bold text-vp-accent uppercase tracking-wider">
                {article.section?.name}
              </div>
              <Link href={`/${article.slug}`} className="no-underline">
                <h2 className="font-display text-[24px] leading-tight text-vp-text group-hover:text-vp-accent transition-colors">
                  {article.title}
                </h2>
              </Link>
              <p className="text-vp-text-2 text-[15px] leading-relaxed line-clamp-2">
                {article.lead}
              </p>
              <div className="text-[11px] text-vp-text-3 font-sans">
                {article.authors.map(a => a.name).join(', ')} • {article.publishedAt?.toLocaleDateString('pt-BR')}
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
