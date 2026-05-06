import React from 'react';
import Link from 'next/link';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { ImgPH } from '@/components/shared/ImgPH';
import { MobileMasthead } from '@/components/layout/MobileMasthead';
import { MobileTabBar } from '@/components/layout/MobileTabBar';

import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function ColumnistPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Buscar o colunista no banco
  const columnist = await prisma.user.findUnique({
    where: { slug },
    include: {
      articles: {
        where: { status: 'PUBLISHED' },
        orderBy: { publishedAt: 'desc' },
        take: 10,
      }
    }
  });

  if (!columnist || columnist.role !== 'COLUMNIST') {
    // Se não for colunista ou não existir, 404
    // Mas por enquanto, se o role for diferente de COLUMNIST vamos deixar passar se tiver artigos
    if (!columnist) notFound();
  }

  const articles = columnist.articles;
  const latest = articles[0];
  const archive = articles.slice(1);

  return (
    <div className="flex flex-col min-h-[100dvh] bg-vp-bg w-full">
      <div className="hidden md:block"><SiteHeader /></div>
      <div className="md:hidden"><MobileMasthead /></div>

      {/* Hero columnist */}
      <div className="border-b border-vp-border md:px-7 px-4 md:py-10 py-7 bg-vp-surface">
        <div className="max-w-[1100px] mx-auto grid md:grid-cols-[160px_1fr_auto] grid-cols-1 gap-7 items-center">
          <ImgPH label="" width={160} height={160} style={{ borderRadius: '50%' }} />
          <div>
            <div className="eyebrow mb-2 text-[10px]">Colunista · Voz Pública</div>
            <h1 className="font-display md:text-[56px] text-[40px] tracking-[-0.02em] mb-2.5 leading-[1.05]">{columnist.name}</h1>
            <p className="font-serif italic md:text-[17px] text-[15px] text-vp-text-2 max-w-[640px] leading-[1.5] text-pretty">
              {columnist.bio || 'Colunista do Voz Pública MS.'}
            </p>
            <div className="mt-3.5 flex flex-wrap gap-2.5 font-sans text-[12px]">
              <a className="text-vp-text-3 cursor-pointer hover:underline hover:text-vp-text">{columnist.email}</a>
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            <button className="vp-btn vp-btn-primary w-full md:w-auto">Seguir colunista</button>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-[1fr_300px] grid-cols-1 gap-8 md:px-7 px-4 py-7 max-w-[1300px] mx-auto w-full">
        <div>
          {/* Latest column */}
          {latest ? (
            <article className="pb-7 border-b border-vp-border">
              <span className="eyebrow text-[10px]">Coluna de hoje · {latest.publishedAt ? new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short' }).format(new Date(latest.publishedAt)) : 'Recente'}</span>
              <Link href={`/${latest.slug}`} className="no-underline">
                <h2 className="font-display md:text-[40px] text-[28px] my-2.5 leading-[1.1] italic hover:text-vp-accent cursor-pointer transition-colors">
                  “{latest.title}”
                </h2>
              </Link>
              <p className="font-serif md:text-[19px] text-[15px] text-vp-text-2 leading-[1.6] mb-3.5 text-pretty">
                {latest.lead}
              </p>
              <Link href={`/${latest.slug}`} className="vp-btn inline-block text-[13px]">Ler coluna completa →</Link>
            </article>
          ) : (
            <div className="py-20 text-center text-vp-text-3 font-serif italic border-b border-vp-border">
              O colunista ainda não publicou textos.
            </div>
          )}

          {/* Archive */}
          <h3 className="font-sans text-[11px] uppercase tracking-[0.14em] font-bold my-7">Colunas recentes</h3>
          {archive.map((c) => (
            <article key={c.id} className="py-4.5 border-b border-vp-border grid grid-cols-[50px_1fr] md:grid-cols-[60px_1fr] gap-4.5">
              <div className="font-mono text-[11px] text-vp-text-3 tracking-[0.08em] uppercase pt-1.5">
                {c.publishedAt ? new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short' }).format(new Date(c.publishedAt)) : 'Abr'}
              </div>
              <div>
                <Link href={`/${c.slug}`} className="no-underline">
                  <h4 className="font-display md:text-[22px] text-[18px] italic mb-1.5 leading-[1.15] hover:text-vp-accent cursor-pointer transition-colors">“{c.title}”</h4>
                </Link>
                <p className="font-serif text-[14px] text-vp-text-2 leading-[1.5] line-clamp-2">{c.lead}</p>
              </div>
            </article>
          ))}
        </div>

        <aside className="grid gap-5 md:self-start">
          <div className="bg-vp-surface border border-vp-border p-4.5">
            <div className="eyebrow mb-2 text-[10px]">Sobre a coluna</div>
            <p className="font-serif text-[14px] text-vp-text-2 leading-[1.55]">
              Publicada às terças, quintas e domingos. 218 textos no arquivo. 18.420 assinantes recebem por e-mail.
            </p>
          </div>
          <div className="vp-ad h-[250px] w-full">300 × 250</div>
          <div>
            <h4 className="font-sans text-[11px] uppercase tracking-[0.14em] font-bold mb-3">Tags mais usadas</h4>
            <div className="flex flex-wrap gap-1.5">
              {['ALMS','Governo','Orçamento','Agro','Pantanal','Oposição','PT','PP','PSDB','Eleições 2026','Justiça'].map(t => (
                <span key={t} className="vp-tag vp-tag-outline cursor-pointer hover:border-vp-accent hover:text-vp-accent transition-colors">{t}</span>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <div className="hidden md:block"><SiteFooter /></div>
      <div className="md:hidden"><MobileTabBar /></div>
    </div>
  );
}
