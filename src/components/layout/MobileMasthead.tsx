'use client';

import React from 'react';
import Link from 'next/link';
import { Monogram } from '@/components/shared/Monogram';
import useSWR from 'swr';
import type { HeaderIndicator } from '@/lib/market-indicators';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

/**
 * MobileMasthead — Cabeçalho mobile do portal.
 * Design compacto otimizado para iPhone 14 (390px).
 */
export function MobileMasthead({ title }: { title?: string }) {
  const now = new Date();
  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  const formatted = `${days[now.getDay()]} · ${now.getDate()} ${months[now.getMonth()]}`;

  const { data } = useSWR('/api/external', fetcher, {
    refreshInterval: 600000, // 10 min
  });

  const mobileIndicators: HeaderIndicator[] = data?.indicators?.filter((item: HeaderIndicator) => item.showInMobile).slice(0, 3) || [
    { key: 'usd', label: 'USD', value: '5,12', unit: 'R$', showInMobile: true, displayOrder: 10 },
    { key: 'boi', label: 'BOI', value: '353,80', unit: 'R$/@', showInMobile: true, displayOrder: 20 },
  ];

  return (
    <div className="sticky top-0 z-50 bg-vp-bg border-b border-vp-border">
      <div className="flex items-center px-3 py-1 gap-1">
        <Link href="/menu" aria-label="Menu" className="text-vp-text min-w-11 min-h-11 flex items-center justify-center cursor-pointer transition-colors hover:text-vp-accent">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </Link>
        <div className="flex-1 text-center">
          <Link href="/" aria-label="Home" className="inline-block">
            {title ? (
              <div className="font-sans text-[12px] font-bold uppercase tracking-[0.12em] text-vp-accent">{title}</div>
            ) : (
              <Monogram size="sm" cssHeight="var(--vp-compact-logo-size)" />
            )}
          </Link>
        </div>
        <Link href="/busca" aria-label="Buscar" className="text-vp-text min-w-11 min-h-11 flex items-center justify-center cursor-pointer transition-colors hover:text-vp-accent">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
        </Link>
      </div>
      {/* Edition strip */}
      <div className="px-4 py-1.5 border-t border-vp-border font-sans text-[10px] text-vp-text-3 flex items-center gap-3 tracking-[0.06em] uppercase">
        <span className="font-semibold shrink-0" suppressHydrationWarning>{formatted}</span>
        <span className="text-vp-text-4 shrink-0">·</span>
        <div className="vp-ticker-wrap flex-1 min-w-0">
          <div className="vp-ticker-track font-mono text-vp-text-4">
            {[...mobileIndicators, ...mobileIndicators].map((item, i) => (
              <span key={`${item.key}-${i}`} className="inline-flex items-center gap-1 px-3">
                <span className="text-vp-text-4">{item.label}</span>
                <span className="text-vp-text-3">{item.value}</span>
                <span className="opacity-30 ml-1">|</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
