import React from 'react';
import { Monogram } from '@/components/shared/Monogram';

export default function MobileLogin() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-vp-bg max-w-[480px] mx-auto border-x border-vp-border">
      <div className="flex items-center px-4 py-3 justify-between">
        <button aria-label="Fechar" className="bg-transparent border-none text-vp-text text-[20px] cursor-pointer hover:text-vp-accent">×</button>
        <Monogram size="sm" />
        <span className="w-[18px]" />
      </div>

      <div className="flex-1 px-5 py-5 pb-6 flex flex-col">
        <div className="mb-7">
          <span className="eyebrow text-[10px]">Bem-vindo de volta</span>
          <h1 className="font-display text-[32px] leading-[1.05] my-2 tracking-[-0.015em]">Entre na sua conta</h1>
          <p className="font-serif text-[14px] text-vp-text-2">Para comentar, salvar matérias e gerenciar seu apoio.</p>
        </div>

        <div className="grid gap-3 mb-[18px]">
          <div>
            <label className="eyebrow block mb-1.5 text-[10px]">E-mail</label>
            <input className="vp-input w-full" type="email" placeholder="seu@email.com.br" />
          </div>
          <div>
            <div className="flex justify-between mb-1.5">
              <label className="eyebrow text-[10px]">Senha</label>
              <a className="text-[10px] text-vp-accent uppercase tracking-[0.06em] cursor-pointer hover:underline">Esqueci</a>
            </div>
            <input className="vp-input w-full" type="password" placeholder="••••••••" />
          </div>
          <label className="flex items-center gap-2 mt-1 cursor-pointer">
            <input type="checkbox" defaultChecked className="accent-vp-accent" />
            <span className="text-[12px] text-vp-text-2">Manter conectado neste dispositivo</span>
          </label>
        </div>

        <button className="vp-btn vp-btn-primary w-full p-3.5 text-[13px] mb-[18px]">Entrar</button>

        <div className="flex items-center gap-2.5 my-1.5 mb-4">
          <div className="flex-1 h-[1px] bg-vp-border" />
          <span className="text-[10px] text-vp-text-3 uppercase tracking-[0.1em]">ou</span>
          <div className="flex-1 h-[1px] bg-vp-border" />
        </div>

        <div className="grid gap-2">
          <button className="vp-btn p-3 text-[12px] justify-center w-full">Continuar com Google</button>
          <button className="vp-btn p-3 text-[12px] justify-center w-full">Continuar com Apple</button>
        </div>

        <div className="mt-auto text-center pt-6 text-[13px] text-vp-text-2">
          Não tem conta? <a className="text-vp-accent font-semibold cursor-pointer hover:underline">Cadastre-se grátis</a>
        </div>
      </div>
    </div>
  );
}
