import React from 'react';
import Link from 'next/link';
import { FunnelLayout } from '@/components/subscription/FunnelLayout';
import { formatCurrency, getDonationConfig, resolveDonationSelection, supportHref } from '@/lib/donation-config';

export const dynamic = 'force-dynamic';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

function percent(current: number, goal: number) {
  if (goal <= 0) return 0;
  return Math.max(0, Math.min(100, (current / goal) * 100));
}

export default async function DonateAmountPage({ searchParams }: { searchParams: SearchParams }) {
  const query = await searchParams;
  const config = await getDonationConfig();
  const selection = resolveDonationSelection(config, query);
  const activePlans = config.plans.filter((plan) => plan.isActive);
  const progress = percent(config.campaign.currentCents, config.campaign.goalCents);

  return (
    <FunnelLayout step={1} title="Apoiar">
      <div className="px-5 py-6 lg:px-8">
        <span className="eyebrow text-[10px] text-vp-text-3">{config.campaign.eyebrow}</span>
        <h1 className="font-display text-[30px] lg:text-[42px] leading-[1.05] my-2 tracking-tight font-black">
          Quanto você pode contribuir?
        </h1>
        <p className="font-serif text-[15px] lg:text-[17px] text-vp-text-2 leading-relaxed mb-8">
          {config.campaign.supporterCount > 0 ? `${config.campaign.supporterCount.toLocaleString('pt-BR')} leitores sustentam o Voz Pública. ` : ''}
          {config.campaign.description}
        </p>

        <div className="mb-8 p-5 bg-vp-surface border border-vp-border">
          <div className="flex justify-between font-sans text-[11px] text-vp-text-3 mb-2 uppercase tracking-widest font-bold">
            <span>{config.campaign.goalLabel}</span>
            <span>
              <span className="text-vp-accent">{formatCurrency(config.campaign.currentCents)}</span> / {formatCurrency(config.campaign.goalCents)}
            </span>
          </div>
          <div className="h-[8px] bg-vp-bg rounded-full overflow-hidden">
            <div
              className="h-full bg-vp-accent shadow-[0_0_10px_rgba(217,119,87,0.5)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="grid gap-3">
          {activePlans.map((plan) => {
            const selected = selection.type === 'plan' && selection.key === plan.key;
            return (
              <Link
                key={plan.key}
                href={`/apoiar?tipo=plan&plano=${encodeURIComponent(plan.key)}`}
                className={`p-5 relative cursor-pointer border transition-all no-underline block ${selected ? 'border-2 border-vp-accent bg-vp-accent/5' : 'border-vp-border bg-vp-surface hover:border-vp-text-4'}`}
              >
                {plan.isHighlighted && (
                  <span className="absolute -top-3 right-5 bg-vp-accent text-vp-bg text-[10px] uppercase tracking-widest font-black px-2 py-0.5 shadow-lg">
                    Mais escolhido
                  </span>
                )}
                <div className="flex justify-between items-baseline gap-3 mb-2">
                  <span className="font-display text-[21px] font-black text-vp-text">{plan.name}</span>
                  <span className="font-display text-[24px] text-vp-accent font-black whitespace-nowrap">
                    {formatCurrency(plan.amountCents)}
                    <span className="text-[12px] text-vp-text-3 font-normal ml-1">
                      {plan.interval === 'monthly' ? '/mês' : 'único'}
                    </span>
                  </span>
                </div>
                <p className="font-serif text-[14px] text-vp-text-2 leading-snug">{plan.description}</p>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 border-t border-vp-border pt-8">
          <div className="eyebrow mb-3 text-[10px] text-vp-text-3">ou contribuição única</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            {config.oneTimeAmountsCents.map((amount) => (
              <Link
                key={amount}
                href={`/apoiar?tipo=one_time&valor=${amount}`}
                className={`vp-btn text-[11px] font-bold py-3 hover:border-vp-accent transition-all no-underline text-center ${selection.type === 'one_time' && selection.amountCents === amount ? 'border-vp-accent text-vp-accent' : ''}`}
              >
                {formatCurrency(amount)}
              </Link>
            ))}
          </div>
          <form action="/apoiar" className="grid grid-cols-[1fr_auto] gap-2">
            <input type="hidden" name="tipo" value="one_time" />
            <input name="valor" className="vp-input w-full font-serif text-[15px]" placeholder="Outro valor. Ex: 75,00" />
            <button className="vp-btn px-4 text-[11px] font-bold" type="submit">
              Usar
            </button>
          </form>
        </div>
      </div>

      <div className="p-5 border-t border-vp-border bg-vp-bg sticky bottom-0">
        <Link href={supportHref(selection)} className="vp-btn vp-btn-primary w-full py-4 text-[13px] text-center font-bold uppercase tracking-widest no-underline inline-block">
          Continuar com {formatCurrency(selection.amountCents)}{selection.interval === 'monthly' ? '/mês' : ''} →
        </Link>
      </div>
    </FunnelLayout>
  );
}
