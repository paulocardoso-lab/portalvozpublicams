'use client';

import React from 'react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function NewsletterCounter({ initialCount }: { initialCount: number }) {
  const { data } = useSWR('/api/stats/newsletter', fetcher, {
    fallbackData: { count: initialCount },
    refreshInterval: 300000, // 5 minutos
  });

  const count = data?.count ?? initialCount;

  return (
    <span>{count.toLocaleString()} apoiadores até hoje.</span>
  );
}
