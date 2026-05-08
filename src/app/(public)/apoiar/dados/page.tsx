import React from 'react';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import Link from 'next/link';

export default function DonateDataPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-vp-bg w-full">
      <div className="hidden md:block"><SiteHeader /></div>

      <div className="flex-1 flex flex-col max-w-[600px] mx-auto w-full md:py-10 bg-vp-bg md:border-x border-vp-border">
        {/* Mobile Header */}
        <div className="flex items-center px-4 py-3 border-b border-vp-border gap-3 md:hidden">
          <Link href="/apoiar" className="bg-transparent border-none text-vp-text text-[18px] p-0 cursor-pointer text-decoration-none">‹</Link>
          <span className="font-sans text-[11px] text-vp-text-3 uppercase tracking-[0.1em] flex-1 text-center">Apoiar · 2 de 3</span>
          <span className="w-[18px]" />
        </div>

        {/* Step indicator */}
        <div className="grid grid-cols-3 gap-1 px-4 py-2.5">
          {[1,2,3].map(n => (
            <div key={n} className={`h-[3px] ${n<=2 ? 'bg-vp-accent' : 'bg-vp-border'}`} />
          ))}
        </div>

        <div className="flex-1 overflow-y-auto vp-scroll px-4.5 py-3 pb-6">
          <h1 className="font-display text-[26px] leading-[1.1] my-1">Seus dados</h1>
          <p className="font-serif text-[13px] text-vp-text-2 mb-5">
            Plano <strong className="text-vp-text font-bold">Apoiador · R$ 39/mês</strong>. <Link href="/apoiar" className="text-vp-accent hover:underline">Trocar</Link>
          </p>

          <form className="grid gap-3.5">
            <div>
              <label htmlFor="full-name" className="eyebrow block mb-1.5 text-[10px]">Nome completo</label>
              <input id="full-name" name="name" className="vp-input w-full" defaultValue="Marina Ribeiro Alves" required />
            </div>
            <div>
              <label htmlFor="email" className="eyebrow block mb-1.5 text-[10px]">E-mail</label>
              <input id="email" name="email" className="vp-input w-full" type="email" defaultValue="marina@email.com" required />
            </div>
            <div>
              <label htmlFor="cpf" className="eyebrow block mb-1.5 text-[10px]">CPF</label>
              <input id="cpf" name="cpf" className="vp-input w-full font-mono text-[13px]" defaultValue="000.000.000-00" required />
            </div>
            <div>
              <label htmlFor="phone" className="eyebrow block mb-1.5 text-[10px]">Celular</label>
              <input id="phone" name="phone" className="vp-input w-full font-mono text-[13px]" defaultValue="(67) 99999-9999" required />
            </div>
            <div className="grid grid-cols-[1fr_100px] gap-2.5">
              <div>
                <label htmlFor="city" className="eyebrow block mb-1.5 text-[10px]">Cidade</label>
                <input id="city" name="city" className="vp-input w-full" defaultValue="Campo Grande" />
              </div>
              <div>
                <label htmlFor="uf" className="eyebrow block mb-1.5 text-[10px]">UF</label>
                <input id="uf" name="uf" className="vp-input w-full" defaultValue="MS" />
              </div>
            </div>

            <label className="flex items-start gap-2.5 mt-1.5 cursor-pointer">
              <input type="checkbox" className="mt-0.5 accent-vp-accent" />
              <span className="text-[12px] text-vp-text-2 leading-[1.4]">
                Quero receber a newsletter <strong className="font-bold text-vp-text">A Semana em MS</strong> aos sábados.
              </span>
            </label>
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input type="checkbox" className="mt-0.5 accent-vp-accent" defaultChecked />
              <span className="text-[12px] text-vp-text-2 leading-[1.4]">
                Concordo com os <span className="text-vp-accent hover:underline">termos</span> e a <span className="text-vp-accent hover:underline">política de privacidade</span> (LGPD).
              </span>
            </label>
          </form>

          <div className="mt-5.5 p-3 border border-vp-border bg-vp-surface flex items-center gap-2.5">
            <span className="text-[18px]">🔒</span>
            <span className="text-[11px] text-vp-text-2 leading-[1.4]">
              Seus dados são processados pela Pagar.me. Voz Pública nunca armazena dados de cartão.
            </span>
          </div>
        </div>

        <div className="p-4 border-t border-vp-border bg-vp-bg">
          <Link href="/apoiar/pagamento" className="vp-btn vp-btn-primary w-full py-3.5 text-[13px] text-center no-underline inline-block">
            Ir para pagamento →
          </Link>
        </div>
      </div>

      <div className="hidden md:block"><SiteFooter /></div>
    </div>
  );
}
