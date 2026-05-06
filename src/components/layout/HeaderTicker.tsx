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
    <>
      <span>Campo Grande {weather.temp}°C</span>
      <span className="text-vp-text-4">·</span>
      <span className="font-mono text-vp-text-3">
        USD {market.usd} &nbsp; BOI {market.boi} &nbsp; SOJA {market.soja}
      </span>
    </>
  );
}
