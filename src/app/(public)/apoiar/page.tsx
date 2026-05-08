import React from 'react';
import Link from 'next/link';
import { FunnelLayout } from '@/components/subscription/FunnelLayout';

export default function DonateAmountPage() {
  return (
    <FunnelLayout step={1} title="Apoiar">
      <div className="px-5 py-6 lg:px-8">
        <span className="eyebrow text-[10px] text-vp-text-3">Sem donos. Sem paywall.</span>
        <h1 className="font-display text-[30px] lg:text-[42px] leading-[1.05] my-2 tracking-tight font-black">
          Quanto você pode contribuir por mês?
        </h1>
        <p className="font-serif text-[15px] lg:text-[17px] text-vp-text-2 leading-relaxed mb-8">
          4.812 leitores sustentam o Voz Pública. Sua contribuição é o que nos permite recusar dinheiro de campanha eleitoral e do agronegócio direto.
        </p>

        {/* Goal bar */}
        <div className="mb-8 p-5 bg-vp-surface border border-vp-border">
          <div className="flex justify-between font-sans text-[11px] text-vp-text-3 mb-2 uppercase tracking-widest font-bold">
            <span>Meta de Abril</span>
            <span><span className="text-vp-accent">R$ 38.420</span> / R$ 50.000</span>
          </div>
          <div className="h-[8px] bg-vp-bg rounded-full overflow-hidden">
            <div className="w-[76.8%] h-full bg-vp-accent shadow-[0_0_10px_rgba(217,119,87,0.5)]" />
          </div>
        </div>

        {/* Plans */}
        <div className="grid gap-3">
          {[
            { n: 'Leitor',    v: 'R$ 19', d: 'Newsletter exclusiva, site sem banners.' },
            { n: 'Apoiador',  v: 'R$ 39', d: 'Acesso aos bastidores e podcast extra.', selected: true, popular: true },
            { n: 'Guardião',  v: 'R$ 79', d: 'Encontros mensais com a redação via Zoom.' },
            { n: 'Mecenas',   v: 'R$ 199', d: 'Crédito nominal em grandes reportagens especiais.' },
          ].map((p, i) => (
            <div key={i} className={`p-5 relative cursor-pointer border transition-all ${p.selected ? 'border-2 border-vp-accent bg-vp-accent/5' : 'border-vp-border bg-vp-surface hover:border-vp-text-4'}`}>
              {p.popular && (
                <span className="absolute -top-3 right-5 bg-vp-accent text-vp-bg text-[10px] uppercase tracking-widest font-black px-2 py-0.5 shadow-lg">
                  Mais escolhido
                </span>
              )}
              <div className="flex justify-between items-baseline mb-2">
                <span className="font-display text-[21px] font-black">{p.n}</span>
                <span className="font-display text-[24px] text-vp-accent font-black">
                  {p.v}<span className="text-[12px] text-vp-text-3 font-normal ml-1">/mês</span>
                </span>
              </div>
              <p className="font-serif text-[14px] text-vp-text-2 leading-snug">{p.d}</p>
            </div>
          ))}
        </div>

        {/* Custom */}
        <div className="mt-8 border-t border-vp-border pt-8">
          <div className="eyebrow mb-3 text-[10px] text-vp-text-3">ou contribuição única</div>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {['R$ 50','R$ 100','R$ 250','R$ 500'].map(v => (
              <button key={v} className="vp-btn text-[11px] font-bold py-3 hover:border-vp-accent transition-all">{v}</button>
            ))}
          </div>
          <input className="vp-input w-full font-serif text-[15px]" placeholder="Outro valor — R$" />
        </div>
      </div>

      <div className="p-5 border-t border-vp-border bg-vp-bg sticky bottom-0">
        <Link href="/apoiar/dados" className="vp-btn vp-btn-primary w-full py-4 text-[13px] text-center font-bold uppercase tracking-widest no-underline inline-block">
          Continuar com R$ 39/mês →
        </Link>
      </div>
    </FunnelLayout>
  );
}

