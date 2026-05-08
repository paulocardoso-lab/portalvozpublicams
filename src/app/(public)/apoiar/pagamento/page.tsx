"use client";

import React from 'react';
import Link from 'next/link';
import { FunnelLayout } from '@/components/subscription/FunnelLayout';

export default function DonatePayPage() {
  const [method, setMethod] = React.useState<'pix' | 'card' | 'boleto'>('pix');

  return (
    <FunnelLayout step={3} title="Pagamento">
      {/* Method Tabs */}
      <div className="grid grid-cols-3 border-b border-vp-border bg-vp-surface">
        {(['pix', 'card', 'boleto'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMethod(m)}
            className={`py-4 font-sans text-[11px] font-black uppercase tracking-widest transition-all border-b-2 ${
              method === m 
                ? 'text-vp-accent border-vp-accent bg-vp-bg' 
                : 'text-vp-text-3 border-transparent hover:text-vp-text'
            }`}
          >
            {m === 'pix' ? 'PIX' : m === 'card' ? 'Cartão' : 'Boleto'}
          </button>
        ))}
      </div>

      <div className="px-5 py-8 lg:px-10">
        {/* Summary Card */}
        <div className="bg-vp-surface border border-vp-border p-5 mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-[12px] text-vp-text-3 uppercase tracking-wider">Assinatura Mensal</span>
            <span className="font-bold">Plano Apoiador</span>
          </div>
          <div className="flex justify-between items-baseline pt-4 border-t border-vp-border mt-4">
            <span className="font-sans text-[13px] font-bold text-vp-text uppercase tracking-widest">Total hoje</span>
            <span className="font-display text-[32px] text-vp-accent font-black">R$ 39,00</span>
          </div>
        </div>

        {method === 'pix' && (
          <div className="flex flex-col items-center">
            {/* Fake QR Code */}
            <div className="bg-white p-6 rounded-sm mb-6 shadow-xl">
              <div className="w-[200px] h-[200px] relative bg-white">
                <div className="absolute inset-0 opacity-90" style={{ backgroundImage: 'repeating-conic-gradient(#000 0% 25%, #fff 0% 50%)', backgroundSize: '14px 14px' }} />
                <div className="absolute top-0 left-0 w-12 h-12 border-[6px] border-black bg-white flex items-center justify-center">
                   <div className="w-4 h-4 bg-black" />
                </div>
                <div className="absolute top-0 right-0 w-12 h-12 border-[6px] border-black bg-white flex items-center justify-center">
                   <div className="w-4 h-4 bg-black" />
                </div>
                <div className="absolute bottom-0 left-0 w-12 h-12 border-[6px] border-black bg-white flex items-center justify-center">
                   <div className="w-4 h-4 bg-black" />
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-vp-accent text-white font-display font-black text-[18px] px-2 py-1">
                  VP
                </div>
              </div>
            </div>

            <div className="text-center mb-6">
              <p className="eyebrow text-[10px] text-vp-text-3 mb-1">Escaneie o código com seu banco</p>
              <p className="font-serif text-[14px] text-vp-text-2 italic">A liberação do acesso é imediata via PIX.</p>
            </div>

            <div className="w-full">
              <div className="bg-vp-surface border border-vp-border p-4 font-mono text-[10px] break-all text-vp-text-3 mb-4 rounded-sm">
                00020126580014br.gov.bcb.pix0136f8e2a4d1-9c0b-4f5a-8b1e-7d2e4a5f6a7b520400005303986540539.005802BR5913Voz Publica MS6009Campo Grande62070503***6304E2A1
              </div>
              <button className="vp-btn w-full py-3.5 font-bold uppercase tracking-widest text-[12px] flex items-center justify-center gap-2">
                <span>📋</span> Copiar código PIX
              </button>
            </div>

            <div className="mt-10 flex items-center gap-4 text-vp-text-4">
              <div className="w-2 h-2 rounded-full bg-vp-accent animate-pulse" />
              <span className="font-sans text-[11px] uppercase tracking-widest font-bold">Aguardando confirmação do pagamento...</span>
            </div>
            
            {/* Button to simulate success */}
            <Link href="/apoiar/sucesso" className="mt-8 text-[11px] text-vp-text-4 hover:text-vp-accent transition-colors underline">
              Simular confirmação (apenas desenvolvimento)
            </Link>
          </div>
        )}

        {method === 'card' && (
          <div className="space-y-6">
             <div>
              <label className="eyebrow block mb-2 text-[10px]">Número do cartão</label>
              <input className="vp-input w-full font-mono" placeholder="0000 0000 0000 0000" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="eyebrow block mb-2 text-[10px]">Validade</label>
                <input className="vp-input w-full font-mono" placeholder="MM/AA" />
              </div>
              <div>
                <label className="eyebrow block mb-2 text-[10px]">CVC</label>
                <input className="vp-input w-full font-mono" placeholder="123" />
              </div>
            </div>
            <div>
              <label className="eyebrow block mb-2 text-[10px]">Nome no cartão</label>
              <input className="vp-input w-full" placeholder="COMO ESTÁ NO CARTÃO" />
            </div>
            <button className="vp-btn vp-btn-primary w-full py-4 font-bold uppercase tracking-widest text-[13px] mt-4">
              Finalizar assinatura segura
            </button>
          </div>
        )}
      </div>
    </FunnelLayout>
  );
}
