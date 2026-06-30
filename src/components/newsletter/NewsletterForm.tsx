'use client';

import React, { useState } from 'react';
import { subscribeToNewsletter } from '@/app/actions/newsletter';

export function NewsletterForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    try {
      const result = await subscribeToNewsletter(formData);
      if (result.success) {
        setMessage({ type: 'success', text: result.message || 'Inscrito!' });
        (e.currentTarget as HTMLFormElement).reset();
      } else {
        setMessage({ type: 'error', text: result.error || 'Erro inesperado' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Erro de conexão' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="px-5 py-8 lg:px-12 border-b border-vp-border">
      {message?.type === 'success' ? (
        <div className="bg-vp-ok/10 text-vp-ok p-6 text-[14px] border border-vp-ok text-center rounded-sm font-bold">
          {message.text}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-3">
          <input
            name="email"
            type="email"
            required
            className="vp-input text-[16px] flex-1 py-4 px-5"
            placeholder="seu@email.com.br"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="vp-btn vp-btn-primary px-8 py-4 text-[13px] font-black uppercase tracking-widest whitespace-nowrap"
          >
            {loading ? 'Enviando...' : 'Receber grátis →'}
          </button>
        </form>
      )}
      {message?.type === 'error' && (
        <p className="text-vp-urgent text-[11px] mt-3 font-bold">{message.text}</p>
      )}
      <p className="text-[11px] text-vp-text-3 mt-4 leading-relaxed lg:max-w-112.5">
        Jornalismo independente custa caro, mas esta newsletter é grátis. Cancele quando quiser. Respeitamos sua privacidade e a LGPD.
      </p>
    </div>
  );
}
