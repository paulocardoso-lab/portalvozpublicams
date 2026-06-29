'use client';

import React from 'react';
import useSWR from 'swr';
import type { HeaderIndicator } from '@/lib/market-indicators';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface HeaderTickerProps {
  initialData: {
    market: { usd: string; boi: string; soja: string; milho: string };
    indicators: HeaderIndicator[];
    weather: { temp: number | null };
  };
}

function TickerItem({ item }: { item: HeaderIndicator }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-5">
      <span className="text-vp-text-4">{item.label}</span>
      <span className="text-vp-text-3">{item.value}</span>
      <span className="text-vp-text-4 opacity-40">|</span>
    </span>
  );
}

export function HeaderTicker({ initialData }: HeaderTickerProps) {
  const { data } = useSWR('/api/external', fetcher, {
    fallbackData: initialData,
    refreshInterval: 600000,
  });

  const indicators: HeaderIndicator[] = data?.indicators?.length
    ? data.indicators
    : initialData.indicators;

  if (!indicators.length) return null;

  // Duplicar para loop contínuo sem salto visual
  const items = [...indicators, ...indicators];

  return (
    <div className="vp-ticker-wrap max-w-[340px] xl:max-w-[480px]">
      <div className="vp-ticker-track font-mono text-[11px] tracking-tighter uppercase">
        {items.map((item, i) => (
          <TickerItem key={`${item.key}-${i}`} item={item} />
        ))}
      </div>
    </div>
  );
}
