"use client";

import React, { useState } from 'react';

export function NewsletterForm() {
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
    <div className="px-5 py-8 lg:px-12 border-b border-vp-border">
      {status === 'success' ? (
        <div className="bg-vp-ok/10 text-vp-ok p-6 text-[14px] border border-vp-ok text-center rounded-sm font-bold">
          Inscrição confirmada! Verifique sua caixa de entrada para o link de ativação.
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-3">
          <input 
            className="vp-input text-[16px] flex-1 py-4 px-5" 
            placeholder="seu@email.com.br" 
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={status === 'loading'}
          />
          <button 
            onClick={handleSubscribe}
            disabled={status === 'loading'}
            className="vp-btn vp-btn-primary px-8 py-4 text-[13px] font-black uppercase tracking-widest whitespace-nowrap"
          >
            {status === 'loading' ? 'Enviando...' : 'Receber grátis →'}
          </button>
        </div>
      )}
      {status === 'error' && <p className="text-vp-urgent text-[11px] mt-3 font-bold">Ocorreu um erro. Tente novamente ou fale conosco.</p>}
      <p className="text-[11px] text-vp-text-3 mt-4 leading-relaxed lg:max-w-[450px]">
        Jornalismo independente custa caro, mas esta newsletter é grátis. Cancele quando quiser. Respeitamos sua privacidade e a LGPD.
      </p>
    </div>
  );
}
