"use client";

import React from 'react';
import Link from 'next/link';
import { MobileMasthead } from '@/components/layout/MobileMasthead';
import { MobileTabBar } from '@/components/layout/MobileTabBar';

export default function MenuPage() {
  const sections = [
    { n: 'Política', s: 'politica' },
    { n: 'Cidades', s: 'cidades' },
    { n: 'Pantanal', s: 'pantanal' },
    { n: 'Agronegócio', s: 'agronegocio' },
    { n: 'Economia', s: 'economia' },
    { n: 'Segurança', s: 'seguranca' },
    { n: 'Saúde', s: 'saude' },
    { n: 'Educação', s: 'educacao' },
    { n: 'Indígenas', s: 'indigenas' },
    { n: 'Fronteira', s: 'fronteira' },
    { n: 'Cultura', s: 'cultura' },
    { n: 'Esportes', s: 'esportes' },
    { n: 'Opinião', s: 'opiniao' },
    { n: 'Especiais', s: 'especiais' },
  ];

  return (
    <div className="flex flex-col min-h-[100dvh] bg-[#111110] text-vp-text w-full max-w-[480px] mx-auto border-x border-vp-border">
      <div className="p-4 flex justify-between items-center border-b border-vp-border">
        <Link href="/" className="text-[12px] font-bold tracking-[0.1em] uppercase text-vp-text-3 no-underline">Fechar ×</Link>
        <span className="font-sans text-[11px] uppercase tracking-[0.15em] font-bold text-vp-accent">Navegação</span>
        <div className="w-10" />
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid gap-6">
          {sections.map(s => (
            <Link key={s.s} href={`/editoria/${s.s}`} className="block no-underline">
              <div className="font-display text-[32px] leading-none hover:text-vp-accent transition-colors">{s.n}</div>
            </Link>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-vp-border grid gap-4">
          <Link href="/newsletter" className="text-[14px] font-sans uppercase tracking-[0.1em] no-underline text-vp-text-2">Newsletter</Link>
          <Link href="/login" className="text-[14px] font-sans uppercase tracking-[0.1em] no-underline text-vp-text-2">Entrar</Link>
          <Link href="/apoiar" className="text-[14px] font-sans uppercase tracking-[0.1em] no-underline text-vp-accent font-bold">Apoie o Voz Pública</Link>
        </div>
      </div>

      <MobileTabBar active="sections" />
    </div>
  );
}
