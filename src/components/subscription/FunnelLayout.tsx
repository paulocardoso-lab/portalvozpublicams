import React from 'react';
import Link from 'next/link';
import { BrandLogo } from '@/components/shared/BrandLogo';

interface FunnelLayoutProps {
  children: React.ReactNode;
  step: number;
  title: string;
}

export function FunnelLayout({ children, step, title }: FunnelLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-vp-bg w-full">
      {/* Desktop Header (Simplified) */}
      <div className="hidden lg:block border-b border-vp-border bg-vp-surface/30">
        <div className="max-w-[1200px] mx-auto px-7 py-5 flex items-center justify-between">
          <Link href="/">
            <BrandLogo size="md" />
          </Link>
          <div className="flex items-center gap-12 font-sans text-[11px] uppercase tracking-[0.2em] font-black text-vp-text-4">
            <div className="flex items-center gap-3">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center border ${step >= 1 ? 'bg-vp-accent border-vp-accent text-vp-bg' : 'border-vp-border'}`}>1</span>
              <span className={step >= 1 ? 'text-vp-text' : ''}>Plano</span>
            </div>
            <div className="flex items-center gap-3">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center border ${step >= 2 ? 'bg-vp-accent border-vp-accent text-vp-bg' : 'border-vp-border'}`}>2</span>
              <span className={step >= 2 ? 'text-vp-text' : ''}>Dados</span>
            </div>
            <div className="flex items-center gap-3">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center border ${step >= 3 ? 'bg-vp-accent border-vp-accent text-vp-bg' : 'border-vp-border'}`}>3</span>
              <span className={step >= 3 ? 'text-vp-text' : ''}>Pagamento</span>
            </div>
          </div>
          <Link href="/" className="text-[24px] text-vp-text-4 hover:text-vp-text transition-colors">×</Link>
        </div>
      </div>

      <div className="flex-1 flex flex-col max-w-[640px] mx-auto w-full lg:my-10 bg-vp-bg lg:border border-vp-border lg:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        {/* Mobile Header */}
        <div className="flex items-center px-2 py-1 border-b border-vp-border gap-1 lg:hidden">
          <Link href="/apoiar" className="text-vp-text text-[24px] no-underline leading-none min-w-11 min-h-11 flex items-center justify-center">‹</Link>
          <span className="font-sans text-[10px] text-vp-text-3 uppercase tracking-[0.2em] flex-1 text-center font-black">
            {title} · {step} de 3
          </span>
          <span className="w-[24px]" />
        </div>

        {/* Step indicator bar (Mobile) */}
        <div className="grid grid-cols-3 gap-1.5 px-4 py-2 lg:hidden">
          {[1, 2, 3].map(n => (
            <div key={n} className={`h-[3px] ${n <= step ? 'bg-vp-accent' : 'bg-vp-border'}`} />
          ))}
        </div>

        <main className="flex-1 overflow-y-auto vp-scroll">
          {children}
        </main>
      </div>

      <footer className="px-4 py-4 sm:p-8 text-center text-[10px] text-vp-text-4 font-mono uppercase tracking-[0.2em]">
        Voz Pública MS · Ambiente Seguro via Pagar.me & Stripe
      </footer>
    </div>
  );
}

