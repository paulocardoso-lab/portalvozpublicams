import React from 'react';
import Link from 'next/link';

export default function DonateSuccessPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-vp-bg w-full items-center justify-center p-6 text-center">
      <div className="max-w-[400px] w-full flex flex-col items-center">
        
        <div className="w-[84px] h-[84px] rounded-full bg-vp-accent flex items-center justify-center mb-6 font-display text-[44px] font-bold text-[#1a1a19]">
          ✓
        </div>

        <span className="eyebrow text-[10px] mb-2.5">Bem-vinda à redação</span>
        
        <h1 className="font-display text-[32px] leading-[1.1] tracking-[-0.015em] mb-3.5">
          Obrigado, Marina.
        </h1>
        
        <p className="font-serif text-[15px] leading-[1.55] text-vp-text-2 mb-7 max-w-[320px]">
          Você é uma das <strong className="text-vp-accent">4.813 pessoas</strong> que sustentam um jornalismo sem donos em Mato Grosso do Sul.
        </p>

        <div className="w-full max-w-[320px] grid gap-2">
          <Link href="/" className="vp-btn vp-btn-primary py-3.5 text-[13px] no-underline text-center w-full block">
            Ler matérias exclusivas →
          </Link>
          <button className="vp-btn py-3.5 text-[12px] bg-transparent border border-vp-border hover:border-vp-accent w-full transition-colors justify-center cursor-pointer">
            Compartilhar nas redes
          </button>
        </div>

        <div className="mt-8 text-[11px] text-vp-text-3 font-mono">
          Recibo enviado para marina@email.com
        </div>

      </div>
    </div>
  );
}
