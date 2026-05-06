import React from 'react';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import Link from 'next/link';

export default function DonatePayPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-vp-bg w-full">
      <div className="hidden md:block"><SiteHeader /></div>

      <div className="flex-1 flex flex-col max-w-[600px] mx-auto w-full md:py-10 bg-vp-bg md:border-x border-vp-border">
        {/* Mobile Header */}
        <div className="flex items-center px-4 py-3 border-b border-vp-border gap-3 md:hidden">
          <Link href="/apoiar/dados" className="bg-transparent border-none text-vp-text text-[18px] p-0 cursor-pointer text-decoration-none">‹</Link>
          <span className="font-sans text-[11px] text-vp-text-3 uppercase tracking-[0.1em] flex-1 text-center">Pagamento · 3 de 3</span>
          <span className="w-[18px]" />
        </div>

        {/* Step indicator */}
        <div className="grid grid-cols-3 gap-1 px-4 py-2.5">
          {[1,2,3].map(n => (
            <div key={n} className="h-[3px] bg-vp-accent" />
          ))}
        </div>

        <div className="flex-1 overflow-y-auto vp-scroll">
          {/* Method tabs */}
          <div className="grid grid-cols-3 px-4 border-b border-vp-border">
            {[['PIX',true],['Cartão',false],['Boleto',false]].map(([t,a],i) => (
              <button key={i} className={`bg-transparent py-3.5 font-sans text-[12px] font-semibold uppercase tracking-[0.06em] cursor-pointer border-b-2 ${a ? 'text-vp-text border-vp-accent' : 'text-vp-text-3 border-transparent hover:text-vp-text-2'}`}>
                {t}
              </button>
            ))}
          </div>

          <div className="px-4.5 py-5">
            {/* Summary */}
            <div className="bg-vp-surface border border-vp-border p-4 mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-[12px] text-vp-text-3">Plano Apoiador</span>
                <strong className="text-[14px]">R$ 39,00</strong>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-[12px] text-vp-text-3">Recorrência</span>
                <span className="text-[12px]">Mensal</span>
              </div>
              <div className="border-t border-vp-border pt-2 flex justify-between items-baseline mt-1">
                <span className="text-[13px] font-semibold">Total hoje</span>
                <span className="font-display text-[22px] text-vp-accent font-bold">R$ 39,00</span>
              </div>
            </div>

            {/* QR PIX */}
            <div className="bg-white p-6 flex justify-center mb-3.5 border border-vp-border">
              <div className="w-[200px] h-[200px] relative bg-white">
                <div className="absolute inset-0 opacity-90" style={{ backgroundImage: 'repeating-conic-gradient(#000 0% 25%, #fff 0% 50%)', backgroundSize: '14px 14px' }} />
                <div className="absolute top-0 left-0 w-[50px] h-[50px] border-[8px] border-black bg-white flex items-center justify-center"><div className="w-4 h-4 bg-black" /></div>
                <div className="absolute top-0 right-0 w-[50px] h-[50px] border-[8px] border-black bg-white flex items-center justify-center"><div className="w-4 h-4 bg-black" /></div>
                <div className="absolute bottom-0 left-0 w-[50px] h-[50px] border-[8px] border-black bg-white flex items-center justify-center"><div className="w-4 h-4 bg-black" /></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 bg-vp-accent flex items-center justify-center text-white font-display text-[16px] font-bold">
                  VP
                </div>
              </div>
            </div>

            <div className="text-center mb-3.5">
              <div className="font-sans text-[11px] text-vp-text-3 uppercase tracking-[0.1em] mb-1">Aponte a câmera do banco</div>
              <div className="text-[12px] text-vp-text-2">ou copie o código abaixo</div>
            </div>

            <div className="bg-vp-surface border border-vp-border p-3 font-mono text-[10px] break-all text-vp-text-2 mb-2">
              00020126580014br.gov.bcb.pix0136f8e2a4d1-9c0b-4f5a-8b89-a3b4c5d6e7f8520400005303986540539.005802BR5915Voz Publica MS6012Campo Grande62070503***63041A2B
            </div>
            
            <Link href="/apoiar/sucesso" className="vp-btn w-full text-[12px] py-3 bg-vp-surface hover:border-vp-accent text-center no-underline block">
              Copiar código PIX
            </Link>

            <div className="mt-4.5 p-3 border border-vp-border flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-vp-text-3 shrink-0 animate-pulse" />
              <span className="text-[11px] text-vp-text-2 leading-[1.4]">
                Aguardando confirmação… Você será redirecionado assim que o pagamento for compensado.
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden md:block"><SiteFooter /></div>
    </div>
  );
}
