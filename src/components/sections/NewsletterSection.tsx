"use client";

import React, { useState } from 'react';
import { subscribeToNewsletter } from '@/app/actions/newsletter';

export function NewsletterSection() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(formData: FormData) {
    setStatus('loading');
    const result = await subscribeToNewsletter(formData);
    
    if (result.error) {
      setStatus('error');
      setMessage(result.error);
    } else {
      setStatus('success');
      setMessage(result.message || 'Obrigado por se inscrever!');
    }
  }

  return (
    <section className="bg-vp-surface border-y border-vp-border py-16 px-6 my-12">
      <div className="max-w-[1200px] mx-auto grid md:grid-cols-[1.5fr_1fr] items-center gap-12">
        <div>
          <h2 className="font-display text-[48px] leading-[0.95] mb-4 tracking-tighter">
            A verdade direto no <span className="italic text-vp-accent">seu e-mail.</span>
          </h2>
          <p className="text-vp-text-2 text-[18px] leading-relaxed max-w-[500px]">
            Assine nossa newsletter e receba as principais investigações e análises do Mato Grosso do Sul todas as manhãs.
          </p>
        </div>
        
        <div className="flex flex-col gap-3">
          {status === 'success' ? (
            <div className="bg-vp-ok/10 border border-vp-ok text-vp-ok p-6 rounded-[2px] text-center">
              <h3 className="font-display text-[24px] mb-2">Inscrição confirmada!</h3>
              <p className="text-[14px]">{message}</p>
            </div>
          ) : (
            <form action={handleSubmit} className="flex flex-col gap-3">
              <input 
                name="email"
                type="email" 
                placeholder="Seu melhor e-mail..." 
                className="vp-input py-4 px-5 text-[16px]"
                required
                disabled={status === 'loading'}
              />
              <button 
                type="submit" 
                className="vp-btn vp-btn-primary py-4 text-[14px] font-bold tracking-widest disabled:opacity-50"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'PROCESSANDO...' : 'QUERO RECEBER'}
              </button>
              {status === 'error' && (
                <p className="text-[12px] text-vp-urgent font-semibold text-center">{message}</p>
              )}
              <p className="text-[11px] text-vp-text-4 text-center">
                Ao se inscrever, você concorda com nossa Política de Privacidade.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
