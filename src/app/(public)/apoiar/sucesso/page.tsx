"use client";

import React from 'react';
import Link from 'next/link';
import { BrandLogo } from '@/components/shared/BrandLogo';

export default function DonateSuccessPage() {
  return (
    <div className="flex flex-col min-h-screen bg-vp-bg w-full items-center justify-center p-6 text-center">
      <div className="w-[100px] h-[100px] rounded-full bg-vp-accent flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(217,119,87,0.3)]">
        <span className="text-vp-bg text-[56px] font-black leading-none">✓</span>
      </div>

      <span className="eyebrow text-[11px] mb-4 text-vp-accent tracking-[0.2em] font-black uppercase">
        Bem-vinda à Redação
      </span>
      
      <h1 className="font-display text-[42px] lg:text-[56px] leading-[1.05] mb-6 tracking-tight font-black max-w-[600px]">
        Obrigado por sustentar o Voz Pública.
      </h1>
      
      <p className="font-serif text-[18px] lg:text-[21px] text-vp-text-2 leading-relaxed mb-10 max-w-[540px]">
        Você agora faz parte do grupo de pessoas que garante um jornalismo sem donos e sem rabo preso em Mato Grosso do Sul.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-[480px]">
        <Link href="/" className="vp-btn vp-btn-primary py-4 font-bold uppercase tracking-widest text-[13px] no-underline inline-block">
          Ir para a Home →
        </Link>
        <button className="vp-btn py-4 font-bold uppercase tracking-widest text-[13px] hover:bg-vp-surface transition-colors">
          Compartilhar apoio
        </button>
      </div>

      <div className="mt-12 pt-8 border-t border-vp-border w-full max-w-[400px]">
        <p className="font-mono text-[11px] text-vp-text-4 uppercase tracking-widest">
          Recibo enviado para marina@email.com · Transação #VP-9821
        </p>
      </div>
    </div>
  );
}
