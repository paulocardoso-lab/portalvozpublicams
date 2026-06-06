'use client';

import React from 'react';
import useSWR from 'swr';
import type { HeaderIndicator } from '@/lib/market-indicators';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface HeaderTickerProps {
  initialData: {
    market: { usd: string; boi: string; soja: string; milho: string };
    indicators: HeaderIndicator[];
    weather: { temp: number };
  };
}

export function HeaderTicker({ initialData }: HeaderTickerProps) {
  const { data } = useSWR('/api/external', fetcher, {
    fallbackData: initialData,
    refreshInterval: 600000, // Atualiza a cada 10 minutos
  });

  const indicators: HeaderIndicator[] = data?.indicators || initialData.indicators;

  return (
    <div className="flex gap-[12px] items-center">
      <span className="font-mono text-vp-text-3 tracking-tighter uppercase">
        {indicators.map((item, index) => (
          <React.Fragment key={item.key}>
            {index > 0 && <span className="mx-2 text-vp-text-4">|</span>}
            <span className="text-vp-text-4">{item.label}</span> {item.value}
          </React.Fragment>
        ))}
      </span>
    </div>
  );
}
