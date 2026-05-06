import React from 'react';
import { Monogram } from '@/components/shared/Monogram';

export default function MobileSignup() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-vp-bg max-w-[480px] mx-auto border-x border-vp-border">
      <div className="flex items-center px-4 py-3 justify-between">
        <button aria-label="Voltar" className="bg-transparent border-none text-vp-text text-[18px] cursor-pointer hover:text-vp-accent">‹</button>
        <Monogram size="sm" />
        <span className="w-[18px]" />
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5 pb-6 vp-scroll">
        <span className="eyebrow text-[10px]">Cadastro grátis</span>
        <h1 className="font-display text-[28px] leading-[1.05] my-2 tracking-[-0.015em]">Acompanhe MS de perto</h1>

        {/* Benefits */}
        <div className="bg-vp-surface p-3.5 mb-5 border border-vp-border">
          {[
            'Comente e participe de debates moderados',
            'Salve matérias para ler depois',
            'Newsletter A Semana em MS aos sábados',
            'Avise-me quando esta série tiver novo capítulo',
          ].map((b,i) => (
            <div key={i} className="flex items-start gap-2.5 py-1.5">
              <span className="text-vp-accent font-bold text-[12px]">✓</span>
              <span className="text-[12px] text-vp-text-2">{b}</span>
            </div>
          ))}
        </div>

        <div className="grid gap-3">
          <div>
            <label className="eyebrow block mb-1.5 text-[10px]">Nome</label>
            <input className="vp-input w-full" placeholder="Como devemos te chamar?" />
          </div>
          <div>
            <label className="eyebrow block mb-1.5 text-[10px]">E-mail</label>
            <input className="vp-input w-full" type="email" placeholder="seu@email.com.br" />
          </div>
          <div>
            <label className="eyebrow block mb-1.5 text-[10px]">Senha</label>
            <input className="vp-input w-full" type="password" placeholder="Mínimo 8 caracteres" />
            <div className="grid grid-cols-4 gap-1 mt-1.5">
              {[1,2,3,4].map(n => <div key={n} className={`h-[3px] ${n <= 3 ? 'bg-vp-ok' : 'bg-vp-border'}`} />)}
            </div>
            <div className="text-[10px] text-vp-text-3 mt-1">Boa senha</div>
          </div>
          <div>
            <label className="eyebrow block mb-1.5 text-[10px]">Cidade em MS (opcional)</label>
            <select aria-label="Cidade em MS" className="vp-input w-full" defaultValue="cg">
              <option value="cg">Campo Grande</option>
              <option value="dr">Dourados</option>
              <option value="tl">Três Lagoas</option>
              <option value="cb">Corumbá</option>
              <option value="">Outra…</option>
            </select>
          </div>

          <label className="flex items-start gap-2.5 mt-1 cursor-pointer">
            <input type="checkbox" defaultChecked className="mt-0.5 accent-vp-accent" />
            <span className="text-[12px] text-vp-text-2 leading-[1.4]">Aceito os <a className="text-vp-accent hover:underline">termos</a> e a <a className="text-vp-accent hover:underline">política de privacidade</a> (LGPD).</span>
          </label>
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input type="checkbox" defaultChecked className="mt-0.5 accent-vp-accent" />
            <span className="text-[12px] text-vp-text-2 leading-[1.4]">Inscrever-me na newsletter A Semana em MS.</span>
          </label>
        </div>

        <button className="vp-btn vp-btn-primary w-full p-3.5 text-[13px] mt-5">Criar minha conta</button>

        <div className="text-center mt-3.5 text-[12px] text-vp-text-2">
          Já tem conta? <a className="text-vp-accent font-semibold cursor-pointer hover:underline">Entrar</a>
        </div>
      </div>
    </div>
  );
}
