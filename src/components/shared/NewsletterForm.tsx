'use client';

import React, { useState } from 'react';
import { subscribeToNewsletter } from '@/app/actions/newsletter';

export function NewsletterForm({ 
  layout = 'vertical', 
  placeholder = 'seu@email.com.br',
  buttonText = 'Quero receber',
  className = ''
}: { 
  layout?: 'vertical' | 'horizontal',
  placeholder?: string,
  buttonText?: string,
  className?: string
}) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    
    const formData = new FormData(e.currentTarget);
    try {
      const result = await subscribeToNewsletter(formData);
      if (result.success) {
        setMessage({ type: 'success', text: result.message || 'Inscrito!' });
        e.currentTarget.reset();
      } else {
        setMessage({ type: 'error', text: result.error || 'Erro inesperado' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Erro de conexão' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={className}>
      <form 
        onSubmit={handleSubmit} 
        className={layout === 'vertical' ? 'flex flex-col gap-2' : 'flex gap-2'}
      >
        <input 
          name="email"
          type="email" 
          required
          placeholder={placeholder}
          className="vp-input w-full py-2.5 text-[13px]" 
          title="Seu melhor e-mail"
        />
        <button 
          type="submit" 
          disabled={loading}
          className={`vp-btn vp-btn-primary font-bold uppercase tracking-widest text-[11px] ${layout === 'vertical' ? 'w-full py-2.5' : 'px-6 py-2.5 whitespace-nowrap'}`}
        >
          {loading ? '...' : buttonText}
        </button>
      </form>
      {message && (
        <p className={`mt-2 text-[11px] font-bold uppercase tracking-wider ${message.type === 'success' ? 'text-vp-ok' : 'text-vp-urgent'}`}>
          {message.text}
        </p>
      )}
    </div>
  );
}
