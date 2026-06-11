import React from 'react';
import Link from 'next/link';
import { isDonationsEnabled } from '@/lib/donation-config';

export default async function DonateSuccessPage() {
  const donationsEnabled = await isDonationsEnabled();
  return (
    <div className="flex flex-col min-h-screen bg-vp-bg w-full items-center justify-center p-4 sm:p-6 text-center">
      <div className="w-[100px] h-[100px] rounded-full bg-vp-accent flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(217,119,87,0.3)]">
        <span className="text-vp-bg text-[56px] font-black leading-none">✓</span>
      </div>

      <span className="eyebrow text-[11px] mb-4 text-vp-accent tracking-[0.2em] font-black uppercase">
        Apoio registrado
      </span>
      
      <h1 className="font-display text-[28px] sm:text-[42px] lg:text-[56px] leading-[1.05] mb-6 tracking-tight font-black max-w-150">
        Obrigado por sustentar o Voz Pública.
      </h1>
      
      <p className="font-serif text-[18px] lg:text-[21px] text-vp-text-2 leading-relaxed mb-10 max-w-[540px]">
        Se você pagou por PIX ou transferência, a equipe fará a conferência do comprovante e a identificação do apoio.
      </p>

      <div className={`grid gap-4 w-full max-w-[480px] ${donationsEnabled ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"}`}>
        <Link href="/" className="vp-btn vp-btn-primary py-4 font-bold uppercase tracking-widest text-[13px] no-underline inline-block">
          Ir para a Home →
        </Link>
        {donationsEnabled && (
          <Link href="/apoiar" className="vp-btn py-4 font-bold uppercase tracking-widest text-[13px] hover:bg-vp-surface transition-colors no-underline inline-block">
            Fazer outro apoio
          </Link>
        )}
      </div>

      <div className="mt-12 pt-8 border-t border-vp-border w-full max-w-[420px]">
        <p className="font-mono text-[11px] text-vp-text-4 uppercase tracking-widest">
          Em breve esta etapa emitirá recibos automáticos quando a integração financeira estiver conectada.
        </p>
      </div>
    </div>
  );
}
