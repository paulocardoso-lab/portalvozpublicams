import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { FunnelLayout } from '@/components/subscription/FunnelLayout';
import { formatCurrency, getDonationConfig, isDonationsEnabled, paymentHref, resolveDonationSelection } from '@/lib/donation-config';

export const dynamic = 'force-dynamic';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function DonateDataPage({ searchParams }: { searchParams: SearchParams }) {
  if (!(await isDonationsEnabled())) redirect('/');
  const query = await searchParams;
  const config = await getDonationConfig();
  const selection = resolveDonationSelection(config, query);
  const amountLabel = `${formatCurrency(selection.amountCents)}${selection.interval === 'monthly' ? '/mês' : ''}`;

  return (
    <FunnelLayout step={2} title="Seus dados">
      <div className="px-4 sm:px-5 py-5 sm:py-6 lg:px-8">
        <h1 className="font-display text-[26px] lg:text-[32px] leading-tight mb-2 tracking-tight">
          Quase lá... precisamos te identificar
        </h1>
        <p className="font-serif text-[14px] text-vp-text-2 mb-8">
          {selection.type === 'plan' ? 'Plano' : 'Apoio'} <strong className="text-vp-text">{selection.name} · {amountLabel}</strong>.{' '}
          <Link href="/apoiar" className="text-vp-accent hover:underline">Trocar</Link>
        </p>

        <form className="space-y-6">
          <input type="hidden" name="tipo" value={selection.type} />
          <input type="hidden" name="plano" value={selection.key} />
          <input type="hidden" name="valor" value={selection.amountCents} />

          <div className="grid gap-5">
            <div>
              <label className="eyebrow block mb-2 text-[10px]">Nome completo</label>
              <input className="vp-input w-full min-h-11" placeholder="Como devemos te chamar?" />
            </div>
            <div>
              <label className="eyebrow block mb-2 text-[10px]">E-mail</label>
              <input className="vp-input w-full min-h-11" type="email" placeholder="seu@email.com.br" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="eyebrow block mb-2 text-[10px]">CPF</label>
                <input className="vp-input w-full font-mono min-h-11" placeholder="000.000.000-00" />
              </div>
              <div>
                <label className="eyebrow block mb-2 text-[10px]">Celular</label>
                <input className="vp-input w-full font-mono min-h-11" placeholder="(67) 99999-9999" />
              </div>
            </div>
            <div className="grid grid-cols-[1fr_80px] gap-4">
              <div>
                <label className="eyebrow block mb-2 text-[10px]">Cidade</label>
                <input className="vp-input w-full" placeholder="Ex: Campo Grande" />
              </div>
              <div>
                <label className="eyebrow block mb-2 text-[10px]">UF</label>
                <input className="vp-input w-full" defaultValue="MS" />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input type="checkbox" className="mt-1" defaultChecked />
              <span className="text-[12px] text-vp-text-2 leading-relaxed group-hover:text-vp-text transition-colors">
                Quero receber a newsletter <strong>A Semana em MS</strong> aos sábados com os bastidores da redação.
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer group">
              <input type="checkbox" className="mt-1" defaultChecked />
              <span className="text-[12px] text-vp-text-2 leading-relaxed group-hover:text-vp-text transition-colors">
                Concordo com os <a className="text-vp-accent hover:underline">termos de uso</a> e a <a className="text-vp-accent hover:underline">política de privacidade</a> (LGPD).
              </span>
            </label>
          </div>
        </form>

        <div className="mt-10 p-4 border border-vp-border bg-vp-surface flex gap-3 items-center">
          <span className="text-[20px]">#</span>
          <p className="text-[11px] text-vp-text-3 leading-tight">
            Seus dados serao usados apenas para identificar o apoio e emitir comprovantes quando aplicavel.
          </p>
        </div>
      </div>

      <div className="px-4 sm:px-5 py-3 sm:py-4 border-t border-vp-border bg-vp-bg sticky bottom-0 pb-[env(safe-area-inset-bottom,12px)]">
        <Link href={paymentHref(selection)} className="vp-btn vp-btn-primary w-full py-3 sm:py-4 text-[13px] text-center font-bold uppercase tracking-widest no-underline inline-flex items-center justify-center min-h-11">
          Ir para pagamento →
        </Link>
      </div>
    </FunnelLayout>
  );
}
