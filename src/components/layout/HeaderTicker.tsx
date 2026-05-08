'use client';

import React from 'react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface HeaderTickerProps {
  initialData: {
    market: { usd: string; boi: string; soja: string };
    weather: { temp: number };
  };
}

export function HeaderTicker({ initialData }: HeaderTickerProps) {
  const { data } = useSWR('/api/external', fetcher, {
    fallbackData: initialData,
    refreshInterval: 600000, // Atualiza a cada 10 minutos
  });

  const { market, weather } = data || initialData;

  return (
    <div className="flex gap-[12px] items-center">
      <span className="font-mono text-vp-text-3 tracking-tighter uppercase">
        <span className="text-vp-text-4">USD</span> {market.usd}
        <span className="mx-2 text-vp-text-4">|</span>
        <span className="text-vp-text-4">BOI</span> {market.boi}
        <span className="mx-2 text-vp-text-4">|</span>
        <span className="text-vp-text-4">SOJA</span> {market.soja}
      </span>
    </div>
  );
}
