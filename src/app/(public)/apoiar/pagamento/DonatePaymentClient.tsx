'use client';

import React from 'react';
import Link from 'next/link';
import type { DonationPaymentMethodsConfig, DonationPixConfig, DonationSelection } from '@/lib/donation-config';

type Method = 'pix' | 'card' | 'boleto' | 'bankTransfer';

const METHOD_LABELS: Record<Method, string> = {
  pix: 'PIX',
  card: 'Cartão',
  boleto: 'Boleto',
  bankTransfer: 'Transferência',
};

function formatCurrency(cents: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(cents / 100);
}

function enabledMethods(methods: DonationPaymentMethodsConfig) {
  return (Object.entries(methods) as Array<[Method, boolean]>)
    .filter(([, enabled]) => enabled)
    .map(([method]) => method);
}

export function DonatePaymentClient({
  selection,
  methods,
  pix,
}: {
  selection: DonationSelection;
  methods: DonationPaymentMethodsConfig;
  pix: DonationPixConfig;
}) {
  const availableMethods = enabledMethods(methods);
  const safeMethods: Method[] = availableMethods.length > 0 ? availableMethods : ['pix'];
  const [method, setMethod] = React.useState<Method>(safeMethods[0]);
  const [copyStatus, setCopyStatus] = React.useState('');
  const amountLabel = `${formatCurrency(selection.amountCents)}${selection.interval === 'monthly' ? '/mês' : ''}`;

  async function copyPix() {
    const value = pix.copyPaste || pix.key;
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopyStatus('Copiado');
  }

  return (
    <>
      <div className="grid border-b border-vp-border bg-vp-surface" style={{ gridTemplateColumns: `repeat(${safeMethods.length}, minmax(0, 1fr))` }}>
        {safeMethods.map((item) => (
          <button
            key={item}
            onClick={() => setMethod(item)}
            className={`py-4 font-sans text-[11px] font-black uppercase tracking-widest transition-all border-b-2 ${
              method === item
                ? 'text-vp-accent border-vp-accent bg-vp-bg'
                : 'text-vp-text-3 border-transparent hover:text-vp-text'
            }`}
          >
            {METHOD_LABELS[item]}
          </button>
        ))}
      </div>

      <div className="px-4 sm:px-5 py-6 sm:py-8 lg:px-10">
        <div className="bg-vp-surface border border-vp-border p-5 mb-8">
          <div className="flex justify-between gap-4 mb-2">
            <span className="text-[12px] text-vp-text-3 uppercase tracking-wider">
              {selection.interval === 'monthly' ? 'Assinatura mensal' : 'Contribuição única'}
            </span>
            <span className="font-bold text-right">{selection.name}</span>
          </div>
          <div className="flex justify-between items-baseline pt-4 border-t border-vp-border mt-4">
            <span className="font-sans text-[13px] font-bold text-vp-text uppercase tracking-widest">Total hoje</span>
            <span className="font-display text-[32px] text-vp-accent font-black">{amountLabel}</span>
          </div>
        </div>

        {method === 'pix' && (
          <div className="space-y-6">
            <div className="bg-vp-surface border border-vp-border p-5">
              <div className="text-[10px] text-vp-text-3 uppercase tracking-widest font-bold mb-3">Dados PIX</div>
              <div className="grid gap-2 text-[13px]">
                <div className="flex justify-between gap-4">
                  <span className="text-vp-text-3">Favorecido</span>
                  <span className="font-semibold text-right">{pix.receiverName || 'Não configurado'}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-vp-text-3">Tipo</span>
                  <span className="font-mono text-right">{pix.keyType || 'PIX'}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-vp-text-3">Chave</span>
                  <span className="font-mono text-right break-all">{pix.key || 'Configure a chave no painel'}</span>
                </div>
                {pix.city ? (
                  <div className="flex justify-between gap-4">
                    <span className="text-vp-text-3">Cidade</span>
                    <span className="text-right">{pix.city}</span>
                  </div>
                ) : null}
              </div>
            </div>

            {pix.copyPaste ? (
              <div>
                <div className="bg-vp-surface border border-vp-border p-4 font-mono text-[10px] break-all text-vp-text-3 mb-4 rounded-sm">
                  {pix.copyPaste}
                </div>
                <button onClick={copyPix} className="vp-btn w-full py-3.5 font-bold uppercase tracking-widest text-[12px] min-h-11">
                  Copiar código PIX
                </button>
                {copyStatus ? <div className="text-[11px] text-vp-ok text-center mt-2">{copyStatus}</div> : null}
              </div>
            ) : (
              <button onClick={copyPix} className="vp-btn w-full py-3.5 font-bold uppercase tracking-widest text-[12px]" disabled={!pix.key}>
                Copiar chave PIX
              </button>
            )}

            <p className="text-[12px] text-vp-text-3 leading-relaxed text-center">
              {pix.instructions || 'Após o pagamento, envie o comprovante para a equipe para identificação do apoio.'}
            </p>
          </div>
        )}

        {method === 'bankTransfer' && (
          <div className="bg-vp-surface border border-vp-border p-5 text-[13px] space-y-2">
            <div className="flex justify-between gap-4"><span className="text-vp-text-3">Banco</span><span>{pix.bankName || 'Não configurado'}</span></div>
            <div className="flex justify-between gap-4"><span className="text-vp-text-3">Agência</span><span className="font-mono">{pix.agency || '-'}</span></div>
            <div className="flex justify-between gap-4"><span className="text-vp-text-3">Conta</span><span className="font-mono">{pix.account || '-'}</span></div>
            <div className="flex justify-between gap-4"><span className="text-vp-text-3">Favorecido</span><span>{pix.receiverName || '-'}</span></div>
          </div>
        )}

        {method === 'card' && (
          <div className="bg-vp-surface border border-vp-border p-5 text-[13px] text-vp-text-2">
            Pagamento por cartão será conectado ao provedor financeiro no próximo sprint.
          </div>
        )}

        {method === 'boleto' && (
          <div className="bg-vp-surface border border-vp-border p-5 text-[13px] text-vp-text-2">
            Emissão de boleto será conectada ao provedor financeiro no próximo sprint.
          </div>
        )}

        <Link href="/apoiar/sucesso" className="vp-btn vp-btn-primary w-full py-3 sm:py-4 font-bold uppercase tracking-widest text-[13px] mt-6 sm:mt-8 no-underline inline-flex items-center justify-center min-h-11 text-center">
          Concluir orientação de apoio
        </Link>
      </div>
    </>
  );
}
