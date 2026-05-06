import React from 'react';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import Link from 'next/link';

export default function DonateAmountPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-vp-bg w-full">
      <div className="hidden md:block"><SiteHeader /></div>

      <div className="flex-1 flex flex-col max-w-[600px] mx-auto w-full md:py-10 bg-vp-bg md:border-x border-vp-border">
        {/* Mobile Header (Only visible on small screens since Desktop has SiteHeader) */}
        <div className="flex items-center px-4 py-3 border-b border-vp-border gap-3 md:hidden">
          <Link href="/" className="bg-transparent border-none text-vp-text text-[18px] p-0 cursor-pointer text-decoration-none">‹</Link>
          <span className="font-sans text-[11px] text-vp-text-3 uppercase tracking-[0.1em] flex-1 text-center">Apoiar · 1 de 3</span>
          <span className="w-[18px]" />
        </div>

        {/* Step indicator */}
        <div className="grid grid-cols-3 gap-1 px-4 py-2.5">
          {[1,2,3].map(n => (
            <div key={n} className={`h-[3px] ${n===1 ? 'bg-vp-accent' : 'bg-vp-border'}`} />
          ))}
        </div>

        <div className="flex-1 overflow-y-auto vp-scroll px-4.5 py-3 pb-6">
          <span className="eyebrow text-[10px]">Sem donos. Sem paywall.</span>
          <h1 className="font-display text-[30px] leading-[1.05] my-2 tracking-[-0.015em]">
            Quanto você pode contribuir por mês?
          </h1>
          <p className="font-serif text-[14px] text-vp-text-2 leading-[1.5] mb-5.5">
            4.812 leitores sustentam o Voz Pública. Sua contribuição é o que nos permite recusar dinheiro de campanha eleitoral e do agro.
          </p>

          {/* Goal bar */}
          <div className="mb-5.5">
            <div className="flex justify-between font-sans text-[11px] text-vp-text-3 mb-1.5 uppercase tracking-[0.06em]">
              <span>Meta de abril</span>
              <span><span className="text-vp-accent font-bold">R$ 38.420</span> / R$ 50.000</span>
            </div>
            <div className="h-[6px] bg-vp-border">
              <div className="w-[76.8%] h-full bg-vp-accent" />
            </div>
          </div>

          {/* Plans */}
          {[
            { n: 'Leitor',    v: 'R$ 19', d: 'Newsletter exclusiva, sem banners.' },
            { n: 'Apoiador',  v: 'R$ 39', d: 'Acesso aos bastidores e podcast extra.', selected: true, popular: true },
            { n: 'Guardião',  v: 'R$ 79', d: 'Encontros mensais com a redação.' },
            { n: 'Mecenas',   v: 'R$ 199', d: 'Crédito como financiador em reportagens especiais.' },
          ].map((p, i) => (
            <div key={i} className={`p-4 mb-2.5 relative cursor-pointer border ${p.selected ? 'border-2 border-vp-accent bg-vp-accent/5' : 'border-vp-border bg-transparent'}`}>
              {p.popular && (
                <span className="absolute top-0 right-3 -translate-y-1/2 bg-vp-accent text-[#1a1a19] text-[9px] uppercase tracking-[0.06em] font-bold px-2 py-0.5 rounded-sm">
                  Mais escolhido
                </span>
              )}
              <div className="flex justify-between items-baseline mb-1.5">
                <span className="font-display text-[20px] font-bold">{p.n}</span>
                <span className="font-display text-[22px] text-vp-accent font-bold">
                  {p.v}<span className="text-[12px] text-vp-text-3 font-normal">/mês</span>
                </span>
              </div>
              <p className="font-serif text-[13px] text-vp-text-2 leading-[1.4]">{p.d}</p>
            </div>
          ))}

          {/* Custom */}
          <div className="mt-4.5">
            <div className="eyebrow mb-2 text-[10px]">ou contribuição única</div>
            <div className="flex gap-1.5 mb-2">
              {['R$ 50','R$ 100','R$ 250','R$ 500'].map(v => (
                <button key={v} className="vp-btn flex-1 text-[11px] py-2.5 bg-vp-surface border-vp-border hover:border-vp-accent transition-colors">{v}</button>
              ))}
            </div>
            <input className="vp-input w-full font-serif text-[14px]" placeholder="Outro valor — R$" />
          </div>
        </div>

        <div className="p-4 border-t border-vp-border bg-vp-bg">
          <Link href="/apoiar/dados" className="vp-btn vp-btn-primary w-full py-3.5 text-[13px] text-center no-underline inline-block">
            Continuar com R$ 39/mês →
          </Link>
        </div>
      </div>

      <div className="hidden md:block"><SiteFooter /></div>
    </div>
  );
}
