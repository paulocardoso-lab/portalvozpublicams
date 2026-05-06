import React from 'react';
import Link from 'next/link';
import { Monogram } from '@/components/shared/Monogram';
import { HeaderTicker } from './HeaderTicker';
import { getMarketData, getWeatherData } from '@/lib/external-data';
import { prisma } from '@/lib/prisma';
import { getSiteSettings } from '@/app/actions/settings';

export async function SiteHeader() {
  const now = new Date();
  const formattedDate = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Campo_Grande'
  }).format(now);

  const market = await getMarketData();
  const weather = await getWeatherData();

  const initialTickerData = { market, weather };

  const settings = await getSiteSettings();

  const dbSections = await prisma.section.findMany({
    where: { showInMenu: true },
    orderBy: { menuOrder: 'asc' }
  });
  
  return (
    <header className="hidden md:block border-b border-vp-border bg-vp-bg sticky top-0 z-50">
      {/* Top utility bar */}
      <div className="flex items-center justify-between px-7 py-2 border-b border-vp-border font-sans text-[11px] text-vp-text-3">
        <div className="flex gap-4.5 items-center">
          <span className="tracking-[0.08em] uppercase">{formattedDate}</span>
          <span className="text-vp-text-4">·</span>
          <HeaderTicker initialData={initialTickerData} />
        </div>
        <div className="flex gap-4 items-center">
          <Link href="/newsletter" className="cursor-pointer hover:text-vp-accent no-underline">Newsletter</Link>
          <Link href="/podcasts" className="cursor-pointer hover:text-vp-accent no-underline">Podcast</Link>
          <Link href="/denuncia" className="cursor-pointer hover:text-vp-accent no-underline">Envie sua denúncia</Link>
          <span className="text-vp-text-4">·</span>
          <Link href="/login" className="cursor-pointer hover:text-vp-accent no-underline">Entrar</Link>
          <Link href="/apoiar" className="no-underline">
            <button className="vp-btn vp-btn-primary px-3 py-1.5 text-[11px]">Assine</button>
          </Link>
        </div>
      </div>

      {/* Logo row */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center px-7 py-4.5 gap-5">
        <div className="flex items-center gap-3.5">
          <Link href="/menu" className="bg-transparent border-none text-vp-text cursor-pointer font-sans text-[12px] flex items-center gap-2 hover:text-vp-accent no-underline">
            <span className="inline-block w-4 h-[11px] relative">
              <span className="absolute left-0 right-0 top-0 h-[1.5px] bg-current" />
              <span className="absolute left-0 right-0 top-[5px] h-[1.5px] bg-current" />
              <span className="absolute left-0 right-0 bottom-0 h-[1.5px] bg-current" />
            </span>
            MENU
          </Link>
          <Link href="/busca" className="bg-transparent border-none text-vp-text cursor-pointer font-sans text-[12px] flex items-center gap-1.5 hover:text-vp-accent no-underline">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
            BUSCAR
          </Link>
        </div>

        <Link href="/" className="flex flex-col items-center gap-1 no-underline">
          <Monogram size="lg" />
          <div className="font-serif italic text-[13px] text-vp-text-2 tracking-[0.02em]">
            {settings['SITE_TAGLINE'] || 'Jornalismo independente de Mato Grosso do Sul'}
          </div>
        </Link>

        <div className="flex gap-3 justify-end items-center font-sans text-[11px] text-vp-text-3">
          <span className="uppercase tracking-[0.08em]">Siga</span>
          {[
            { k: 'FB', url: settings['SOCIAL_FB'] },
            { k: 'IG', url: settings['SOCIAL_IG'] },
            { k: 'X',  url: settings['SOCIAL_X'] },
            { k: 'YT', url: settings['SOCIAL_YT'] },
            { k: 'WA', url: settings['SOCIAL_WA'] }
          ].filter(s => s.url).map(s => (
            <a key={s.k} href={s.url} target="_blank" rel="noopener noreferrer" className="w-6 h-6 border border-vp-border-2 rounded-[2px] inline-flex items-center justify-center text-[9px] font-bold text-vp-text-2 cursor-pointer hover:border-vp-accent hover:text-vp-accent">
              {s.k}
            </a>
          ))}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex gap-0 px-5 border-t border-vp-border overflow-x-auto font-sans">
        {dbSections.map((s, i) => (
          <Link key={s.id} href={`/editoria/${s.slug}`} className={`px-3.5 py-2.5 text-[12px] font-bold tracking-[0.04em] uppercase whitespace-nowrap cursor-pointer border-b-2 hover:text-vp-accent hover:border-vp-accent no-underline ${i === 2 ? 'text-vp-accent border-vp-accent' : 'text-vp-text-2 border-transparent'}`}>
            {s.name}
          </Link>
        ))}
      </nav>
    </header>
  );
}
