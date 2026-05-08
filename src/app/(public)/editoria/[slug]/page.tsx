import React from 'react';
import Link from 'next/link';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { MobileTabBar } from '@/components/layout/MobileTabBar';
import { MobileMasthead } from '@/components/layout/MobileMasthead';
import { ImgPH } from '@/components/shared/ImgPH';
import Image from 'next/image';

import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function SectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Buscar a editoria no banco
  const section = await prisma.section.findUnique({
    where: { slug },
    include: {
      articles: {
        where: { status: 'PUBLISHED' },
        include: { authors: true },
        orderBy: { publishedAt: 'desc' },
        take: 10,
      }
    }
  });

  if (!section) {
    notFound();
  }

  const articles = section.articles;
  const featured = articles[0];
  const list = articles.slice(1);
  
  return (
    <div className="flex flex-col min-h-[100dvh] bg-vp-bg w-full">
      <div className="hidden md:block"><SiteHeader /></div>
      <div className="md:hidden"><MobileMasthead /></div>

      {/* Section hero */}
      <div className="border-b-2 border-vp-text md:px-7 px-4 md:py-10 py-6">
        <div className="max-w-[1300px] mx-auto">
          <div className="eyebrow mb-2.5 text-[10px]">Editoria</div>
          <h1 className="font-display md:text-[72px] text-[48px] tracking-[-0.02em] mb-3.5 leading-[1.05]">{section.name}</h1>
          <p className="font-serif md:text-[18px] text-[15px] text-vp-text-2 max-w-[640px] leading-[1.5]">
            {section.description || `Cobertura contínua de ${section.name} em Mato Grosso do Sul.`}
          </p>
          <div className="mt-4.5 flex gap-4.5 font-sans md:text-[12px] text-[10px] text-vp-text-3">
            <span>{articles.length} reportagens recentes</span><span>·</span><span>Voz Pública MS</span>
          </div>
        </div>
      </div>

      {/* Subnav */}
      <div className="border-b border-vp-border px-4 md:px-7 flex gap-5 font-sans md:text-[12px] text-[11px] text-vp-text-2 uppercase tracking-[0.08em] overflow-x-auto vp-scroll">
        {['Todos','Investigações','Dados','Séries','Vídeo','Opinião'].map((t,i) => (
          <a key={t} className={`whitespace-nowrap py-3.5 border-b-2 font-semibold cursor-pointer hover:text-vp-accent transition-colors ${i===0 ? 'border-vp-accent text-vp-accent' : 'border-transparent'}`}>
            {t}
          </a>
        ))}
      </div>

      <div className="grid md:grid-cols-[1fr_300px] grid-cols-1 gap-8 md:px-7 px-4 py-7 max-w-[1400px] mx-auto w-full">
        <div>
          {/* Featured */}
          {featured ? (
            <article className="grid md:grid-cols-2 grid-cols-1 gap-7 pb-7 border-b border-vp-border">
              <Link href={`/${featured.slug}`} className="block">
                {featured.heroImage ? (
                  <div className="relative w-full h-[340px] overflow-hidden rounded-sm group">
                    <Image 
                      src={featured.heroImage} 
                      alt={featured.title} 
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      priority
                    />
                  </div>
                ) : (
                  <ImgPH label={featured.eyebrow || section.name} height={340} />
                )}
              </Link>
              <div>
                <span className="eyebrow text-[10px]">{featured.eyebrow || 'Reportagem'}</span>
                <Link href={`/${featured.slug}`} className="no-underline">
                  <h2 className="font-display md:text-[38px] text-[28px] my-2.5 leading-[1.05] hover:text-vp-accent cursor-pointer transition-colors">
                    {featured.title}
                  </h2>
                </Link>
                <p className="font-serif md:text-[16px] text-[14px] text-vp-text-2 leading-[1.5] mb-3.5 text-pretty">
                  {featured.lead}
                </p>
                <div className="byline text-[11px]">
                  {featured.authors.map(a => a.name).join(' e ')} · {featured.publishedAt ? new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short' }).format(new Date(featured.publishedAt)) : 'Recente'}
                </div>
              </div>
            </article>
          ) : (
            <div className="py-20 text-center text-vp-text-3 font-serif italic border-b border-vp-border">
              Nenhuma reportagem disponível nesta editoria.
            </div>
          )}

          {/* List */}
          {list.map((x) => (
            <article key={x.id} className="grid md:grid-cols-[200px_1fr_auto] grid-cols-[1fr] gap-5 py-5 border-b border-vp-border md:items-start">
              <Link href={`/${x.slug}`}>
                {x.heroImage ? (
                  <div className="relative w-full h-[130px] overflow-hidden rounded-sm">
                    <Image 
                      src={x.heroImage} 
                      alt={x.title} 
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <ImgPH label={x.eyebrow || section.name} height={130} />
                )}
              </Link>
              <div>
                <span className="eyebrow text-[10px]">{x.eyebrow || 'Reportagem'}</span>
                <Link href={`/${x.slug}`} className="no-underline">
                  <h3 className="font-display text-[22px] my-1.5 leading-[1.15] hover:text-vp-accent cursor-pointer transition-colors">{x.title}</h3>
                </Link>
                <p className="font-serif text-[14px] text-vp-text-2 leading-[1.5] line-clamp-2">{x.lead}</p>
                <div className="byline text-[11px] mt-2.5">
                  por {x.authors.map(a => a.name).join(', ')} · {x.publishedAt ? new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short' }).format(new Date(x.publishedAt)) : 'Recente'}
                </div>
              </div>
              <div className="hidden md:flex flex-col items-end gap-1.5">
                <span className="meta">{x.readTimeMin || 5} min</span>
                <span className="meta">{x.views} visualiz.</span>
              </div>
            </article>
          ))}

          {/* Pagination */}
          <div className="flex justify-center gap-1 py-7 font-sans text-[13px]">
            {['1','2','3','4','…','29'].map((n,i) => (
              <button key={i} className={`vp-btn min-w-[36px] px-2.5 py-1.5 ${i===0 ? 'bg-vp-surface border-vp-border-2' : 'bg-transparent border-transparent text-vp-text-2 hover:bg-vp-surface'}`}>
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="grid gap-5 md:self-start">
          <div className="vp-ad h-[250px] w-full">300 × 250</div>
          <div className="bg-vp-surface p-4 border border-vp-border">
            <h4 className="font-display text-[18px] mb-2.5">Repórteres desta editoria</h4>
            {['Marina Ribeiro','Carlos Benites','Lucas Fragoso','Ana Figueira'].map((n,i) => (
              <div key={n} className={`flex items-center gap-2.5 py-2 ${i>0 ? 'border-t border-vp-border' : ''}`}>
                <ImgPH label="" width={32} height={32} style={{ borderRadius: '50%' }} />
                <div className="font-sans text-[13px] font-semibold">{n}</div>
              </div>
            ))}
          </div>
          <div className="vp-ad h-[600px] hidden md:block">300 × 600</div>
        </aside>
      </div>

      <div className="hidden md:block"><SiteFooter /></div>
      <div className="md:hidden"><MobileTabBar active="search" /></div>
    </div>
  );
}
