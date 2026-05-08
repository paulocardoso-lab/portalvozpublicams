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
    <section className="bg-vp-surface border-y border-vp-border py-[64px] px-[28px] my-[48px]">
      <div className="max-w-[1440px] mx-auto grid md:grid-cols-[1.5fr_1fr] items-center gap-[48px]">
        <div>
          <h2 className="vp-headline text-[48px] mb-[16px]">
            A verdade direto no <span className="italic text-vp-accent">seu e-mail.</span>
          </h2>
          <p className="text-vp-text-2 font-serif text-[18px] leading-[1.5] max-w-[500px]">
            Assine nossa newsletter e receba as principais investigações e análises do Mato Grosso do Sul todas as manhãs.
          </p>
        </div>
        
        <div className="flex flex-col gap-[12px]">
          {status === 'success' ? (
            <div className="bg-vp-accent-soft border border-vp-accent text-vp-accent p-[24px] rounded-[2px] text-center">
              <h3 className="font-display text-[24px] font-bold mb-[8px]">Inscrição confirmada!</h3>
              <p className="font-serif text-[14px]">{message}</p>
            </div>
          ) : (
            <form action={handleSubmit} className="flex flex-col gap-[12px]">
              <input 
                name="email"
                type="email" 
                placeholder="Seu melhor e-mail..." 
                className="vp-input py-[16px] px-[20px] text-[16px]"
                required
                disabled={status === 'loading'}
              />
              <button 
                type="submit" 
                className="vp-btn vp-btn-primary py-[16px] text-[14px] font-bold tracking-[0.1em] disabled:opacity-50"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'PROCESSANDO...' : 'QUERO RECEBER'}
              </button>
              {status === 'error' && (
                <p className="text-[12px] text-vp-live font-semibold text-center">{message}</p>
              )}
              <p className="text-[11px] text-vp-text-4 text-center font-sans">
                Ao se inscrever, você concorda com nossa Política de Privacidade.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
