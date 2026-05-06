"use client";

import React, { useState } from 'react';
import { Monogram } from '@/components/shared/Monogram';

export default function MobileNewsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubscribe() {
    if (!email) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (res.ok) setStatus('success');
      else setStatus('error');
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="flex flex-col min-h-[100dvh] bg-vp-bg max-w-[480px] mx-auto border-x border-vp-border">
      <div className="flex items-center px-4 py-3 border-b border-vp-border gap-3">
        <button aria-label="Fechar" className="bg-transparent border-none text-vp-text text-[20px] p-0 cursor-pointer hover:text-vp-accent">×</button>
        <Monogram size="sm" />
        <span className="w-[18px]" />
      </div>

      <div className="flex-1 overflow-y-auto vp-scroll">
        {/* Hero */}
        <div className="px-5 pt-8 pb-6 border-b border-vp-border bg-vp-surface">
          <span className="eyebrow text-[10px]">Newsletter · Sábados, 7h</span>
          <h1 className="font-display text-[38px] leading-none my-3 tracking-[-0.02em]">
            A Semana<br/>em <span className="text-vp-accent italic">MS</span>.
          </h1>
          <p className="font-serif text-[16px] text-vp-text-2 leading-[1.45] italic">
            O resumo do que importou em Mato Grosso do Sul, escrito à mão pela editora-chefe Marina Ribeiro.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 border-b border-vp-border">
          {[['12.483','leitores'],['68%','abrem'],['3 anos','no ar']].map(([n,l],i) => (
            <div key={i} className={`py-5 px-2 text-center ${i < 2 ? 'border-r border-vp-border' : ''}`}>
              <div className="font-display text-[22px] text-vp-accent font-bold">{n}</div>
              <div className="text-[10px] text-vp-text-3 uppercase tracking-[0.06em] mt-0.5">{l}</div>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="px-5 py-6 border-b border-vp-border">
          {status === 'success' ? (
            <div className="bg-[#1a2f20] text-vp-ok p-4 text-[13px] border border-vp-ok text-center mb-2">
              Inscrição confirmada! Cheque seu email.
            </div>
          ) : (
            <>
              <input 
                className="vp-input mb-2.5 text-[14px] w-full" 
                placeholder="seu@email.com.br" 
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={status === 'loading'}
              />
              <button 
                onClick={handleSubscribe}
                disabled={status === 'loading'}
                className="vp-btn vp-btn-primary w-full p-3.5 text-[13px]"
              >
                {status === 'loading' ? 'Enviando...' : 'Receber aos sábados →'}
              </button>
            </>
          )}
          {status === 'error' && <p className="text-vp-urgent text-[11px] mt-2">Erro ao assinar. Tente novamente.</p>}
          <p className="text-[10px] text-vp-text-3 mt-2.5 leading-[1.4]">
            Grátis e sem spam. Cancele quando quiser. Não compartilhamos seu e-mail.
          </p>
        </div>

        {/* What you get */}
        <div className="px-5 py-6">
          <h2 className="font-sans text-[11px] uppercase tracking-[0.14em] font-bold mb-[18px]">O que vai chegar no seu e-mail</h2>
          {[
            ['1','A pauta da semana','Os 3 fatos que moveram MS, sem a urgência da timeline.'],
            ['2','Bastidores','Como uma reportagem foi feita — fontes, dúvidas, recortes que sobraram.'],
            ['3','O número','Um dado de MS que você ainda não viu, com contexto.'],
            ['4','Recomendação','Um livro, podcast ou doc que conversa com o estado.'],
          ].map(([n,t,d]) => (
            <div key={n} className="grid grid-cols-[32px_1fr] gap-3.5 mb-[18px]">
              <span className="font-display text-[26px] text-vp-accent leading-none font-bold">{n}</span>
              <div>
                <div className="font-display text-[17px] mb-1">{t}</div>
                <p className="font-serif text-[13px] text-vp-text-2 leading-[1.5]">{d}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Last edition preview */}
        <div className="px-5 py-5 pb-6 bg-vp-surface border-t border-vp-border">
          <div className="eyebrow mb-2.5 text-[10px]">Edição #142 · 19 abr</div>
          <h3 className="font-display text-[22px] leading-[1.15] mb-2.5">&quot;O Pantanal não acabou em 2024. Continua acabando em 2026.&quot;</h3>
          <p className="font-serif italic text-[13px] text-vp-text-2 leading-[1.5] mb-3.5">
            Quando a fumaça saiu da capa dos jornais, quem ficou foi o fogo…
          </p>
          <a className="meta text-vp-accent cursor-pointer hover:underline">Ler edição completa →</a>
        </div>

        <div className="p-5 text-center text-[11px] text-vp-text-3">
          Outras newsletters · <a className="text-vp-accent cursor-pointer hover:underline">Pantanal Diário</a> · <a className="text-vp-accent cursor-pointer hover:underline">Política MS</a>
        </div>
      </div>
    </div>
  );
}
