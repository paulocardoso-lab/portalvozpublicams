import React from 'react';
import Link from 'next/link';
import { Monogram } from '@/components/shared/Monogram';
import { HeaderTicker } from './HeaderTicker';
import { getHeaderIndicators, getMarketData, getWeatherData } from '@/lib/external-data';
import { fallbackHeaderIndicators } from '@/lib/market-indicators';
import { prisma } from '@/lib/prisma';
import { getSiteSettings } from '@/app/actions/settings';
import { normalizeWhatsAppLink } from '@/lib/social-links';
import type { Section } from '@prisma/client';

/**
 * SiteHeader (Masthead) — Cabeçalho principal do portal.
 * Rigorosamente fiel ao design clássico editorial.
 */
export async function SiteHeader() {
  const now = new Date();
  const formattedDate = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(now);

  let initialTickerData = { 
    market: { usd: '5,12', boi: '353,80', soja: '122,51', milho: '65,98', trigo: '1.250,00' }, 
    indicators: fallbackHeaderIndicators(),
    weather: { temp: 28 } 
  };
  let settings: Record<string, string> = {};
  let dbSections: Section[] = [];

  try {
    const [market, weather, indicators, siteSettings, sections] = await Promise.all([
      getMarketData().catch(() => initialTickerData.market),
      getWeatherData().catch(() => initialTickerData.weather),
      getHeaderIndicators().catch(() => initialTickerData.indicators),
      getSiteSettings().catch(() => ({})),
      prisma.section.findMany({
        where: { showInMenu: true },
        orderBy: { menuOrder: 'asc' }
      }).catch(() => [])
    ]);

    initialTickerData = { market, indicators, weather };
    settings = siteSettings;
    dbSections = sections;
  } catch (error) {
    console.error('Header data fetch error:', error);
  }

  const isSocialVisible = (urlKey: string, enabledKey: string) => {
    const url = settings[urlKey];
    const enabled = settings[enabledKey];
    return Boolean(url) && enabled !== '0' && enabled !== 'false';
  };
  const whatsappUrl = normalizeWhatsAppLink(settings['SOCIAL_WA'], settings['SOCIAL_WHATSAPP_MESSAGE']);
  
  return (
    <header className="hidden md:block border-b border-(--vp-header-border-color) bg-(--vp-header-bg) backdrop-blur sticky top-0 z-50">
      {/* 1. Top utility bar */}
      <div className="flex items-center justify-between px-7 py-2 border-b border-(--vp-header-border-color) bg-(--vp-header-topbar-bg) font-mono text-[length:var(--vp-header-topbar-font-size)] text-vp-text-3 tracking-tighter uppercase">
        <div className="flex gap-4.5 items-center">
          <span>{formattedDate}</span>
          <span className="text-vp-text-4">·</span>
          <span>Campo Grande 28°C</span>
          <span className="text-vp-text-4">·</span>
          <HeaderTicker initialData={initialTickerData} />
        </div>
        <div className="flex gap-4 items-center font-bold whitespace-nowrap">
          <Link href="/newsletter" className="hover:text-vp-accent transition-colors font-sans normal-case tracking-normal font-semibold">Newsletter</Link>
          <Link href="/podcasts" className="hover:text-vp-accent transition-colors font-sans normal-case tracking-normal font-semibold">Podcast</Link>
          <Link href="/denuncia" className="hover:text-vp-accent transition-colors font-sans normal-case tracking-normal font-semibold">Envie sua denúncia</Link>
          <span className="text-vp-text-4">·</span>
          <Link href="/login" className="hover:text-vp-accent transition-colors">Entrar</Link>
          <Link href="/apoiar">
            <button className="vp-btn vp-btn-primary px-3 py-1.5 text-[11px] font-bold">Assine</button>
          </Link>
        </div>
      </div>

      {/* 2. Logo row — altura governada por --vp-header-height */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center px-7 gap-5 h-(--vp-header-height,72px)">
        <div className="flex items-center gap-3.5">
          <Link href="/menu" className="text-vp-text font-sans text-[length:var(--vp-header-nav-size)] font-[number:var(--vp-header-nav-weight)] flex items-center gap-2 hover:text-vp-accent transition-colors">
            <span className="inline-block w-4 h-[11px] relative">
              <span className="absolute left-0 right-0 top-0 h-[1.5px] bg-current" />
              <span className="absolute left-0 right-0 top-[5px] h-[1.5px] bg-current" />
              <span className="absolute left-0 right-0 bottom-0 h-[1.5px] bg-current" />
            </span>
            MENU
          </Link>
          <Link href="/busca" className="text-vp-text font-sans text-[length:var(--vp-header-nav-size)] font-[number:var(--vp-header-nav-weight)] flex items-center gap-1.5 hover:text-vp-accent transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
            BUSCAR
          </Link>
        </div>

        <Link href="/" className="flex items-center justify-center h-full no-underline group py-2">
          <Monogram
            size={48}
            cssHeight="var(--vp-header-logo-size)"
            className="transition-transform group-hover:scale-[1.02] max-h-full"
            src={settings['BRAND_LOGO_URL'] || '/logo.webp'}
          />
        </Link>

        <div className="flex gap-3 justify-end items-center font-sans text-[11px] text-vp-text-3">
          <span className="uppercase tracking-[0.08em] font-semibold">Siga</span>
          {[
            { k: 'FB', url: settings['SOCIAL_FB'], visible: isSocialVisible('SOCIAL_FB', 'SOCIAL_FB_ENABLED') },
            { k: 'IG', url: settings['SOCIAL_IG'], visible: isSocialVisible('SOCIAL_IG', 'SOCIAL_IG_ENABLED') },
            { k: 'X',  url: settings['SOCIAL_X'], visible: isSocialVisible('SOCIAL_X', 'SOCIAL_X_ENABLED') },
            { k: 'YT', url: settings['SOCIAL_YT'], visible: isSocialVisible('SOCIAL_YT', 'SOCIAL_YT_ENABLED') },
            { k: 'WA', url: whatsappUrl, visible: isSocialVisible('SOCIAL_WA', 'SOCIAL_WA_ENABLED') && Boolean(whatsappUrl) }
          ].filter(s => s.visible).map(s => (
            <a key={s.k} href={s.url} target="_blank" rel="noopener noreferrer" className="w-6 h-6 border border-vp-border-2 rounded-[2px] inline-flex items-center justify-center text-[9px] font-bold text-vp-text-2 hover:border-vp-accent hover:text-vp-accent transition-all">
              {s.k}
            </a>
          ))}
        </div>
      </div>

      {/* 3. Nav Row */}
      <nav className="flex border-t border-(--vp-header-border-color) overflow-x-auto px-(--vp-header-nav-spacing) scrollbar-hide">
        {dbSections.map((s, i) => (
          <Link
            key={s.id}
            href={`/editoria/${s.slug}`}
            className={`text-[length:var(--vp-header-nav-size)] font-[number:var(--vp-header-nav-weight)] tracking-[0.04em] uppercase whitespace-nowrap py-2.5 px-(--vp-header-nav-spacing) border-b-2 transition-all font-sans ${i === 0 ? 'text-vp-accent border-vp-accent' : 'text-vp-text-2 border-transparent hover:text-vp-text hover:border-vp-border-2'}`}
          >
            {s.name}
          </Link>
        ))}
      </nav>
    </header>
  );
}
