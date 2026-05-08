import React from 'react';
import Link from 'next/link';
import { Monogram } from '@/components/shared/Monogram';
import { BrandLogo } from '@/components/shared/BrandLogo';
import { Eyebrow } from '@/components/shared/Eyebrow';

export default function SignupPage() {
  return (
    <div className="flex flex-col min-h-screen bg-vp-bg w-full">
      {/* Auth Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-vp-border">
        <Link href="/">
           <BrandLogo size="md" />
        </Link>
        <Link href="/" className="text-[24px] text-vp-text-3 hover:text-vp-text transition-colors">×</Link>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center p-6 bg-vp-bg">
        <div className="max-w-[480px] w-full bg-vp-bg lg:border lg:border-vp-border lg:shadow-2xl">
          <div className="p-6 lg:p-10">
            <div className="mb-8">
              <Eyebrow className="text-[10px]">Cadastro Grátis</Eyebrow>
              <h1 className="font-display text-[32px] lg:text-[38px] leading-[1.05] my-3 tracking-tight font-black">
                Acompanhe o jornalismo de MS de perto.
              </h1>
              <p className="font-serif text-[15px] text-vp-text-2 leading-relaxed">
                Crie sua conta para comentar, salvar matérias e receber newsletters exclusivas da nossa redação.
              </p>
            </div>

            {/* Benefits Block */}
            <div className="bg-vp-surface p-5 mb-8 border border-vp-border shadow-inner">
              <div className="grid gap-3">
                {[
                  'Participe de debates moderados e construtivos',
                  'Salve reportagens especiais para ler depois',
                  'Receba "A Semana em MS" todos os sábados',
                  'Alertas de novas matérias das suas séries favoritas',
                ].map((b, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-vp-accent font-black text-[14px]">✓</span>
                    <span className="text-[13px] text-vp-text-2 leading-tight">{b}</span>
                  </div>
                ))}
              </div>
            </div>

            <form className="space-y-5">
              <div>
                <label className="eyebrow block mb-2 text-[10px]">Nome completo</label>
                <input className="vp-input w-full py-3.5" placeholder="Como devemos te chamar?" />
              </div>
              <div>
                <label className="eyebrow block mb-2 text-[10px]">E-mail</label>
                <input className="vp-input w-full py-3.5" type="email" placeholder="seu@email.com.br" />
              </div>
              <div>
                <label className="eyebrow block mb-2 text-[10px]">Senha</label>
                <input className="vp-input w-full py-3.5" type="password" placeholder="Mínimo 8 caracteres" />
                <div className="grid grid-cols-4 gap-1.5 mt-2">
                  {[1, 2, 3, 4].map(n => (
                    <div key={n} className={`h-[3px] ${n <= 3 ? 'bg-vp-ok' : 'bg-vp-border'}`} />
                  ))}
                </div>
                <p className="text-[10px] text-vp-text-3 mt-2 font-mono uppercase">Força: Boa senha</p>
              </div>
              
              <div className="space-y-4 pt-2">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" defaultChecked className="mt-1 accent-vp-accent" />
                  <span className="text-[12px] text-vp-text-2 leading-relaxed group-hover:text-vp-text transition-colors">
                    Concordo com os <a className="text-vp-accent hover:underline">termos de uso</a> e a <a className="text-vp-accent hover:underline">política de privacidade</a> (LGPD).
                  </span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" defaultChecked className="mt-1 accent-vp-accent" />
                  <span className="text-[12px] text-vp-text-2 leading-relaxed group-hover:text-vp-text transition-colors">
                    Desejo receber a newsletter semanal e alertas importantes.
                  </span>
                </label>
              </div>

              <button className="vp-btn vp-btn-primary w-full py-4 text-[13px] font-black uppercase tracking-widest mt-4">
                Criar minha conta agora →
              </button>
            </form>

            <div className="text-center mt-8 pt-6 border-t border-vp-border text-[13px] text-vp-text-3">
              Já possui uma conta? <Link href="/login" className="text-vp-accent font-bold hover:underline ml-1">Entrar aqui</Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="p-8 text-center text-[10px] text-vp-text-4 font-mono uppercase tracking-widest bg-vp-bg border-t border-vp-border">
        Voz Pública MS · Jornalismo Independente · 2026
      </footer>
    </div>
  );
}

