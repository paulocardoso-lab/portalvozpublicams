'use client';

import { useActionState } from 'react';
import { sendContactMessage, type ContactFormState } from '@/app/actions/contact';

const initial: ContactFormState = { status: 'idle' };

export function ContactForm() {
  const [state, action, pending] = useActionState(sendContactMessage, initial);

  if (state.status === 'success') {
    return (
      <div className="border border-green-500/30 bg-green-500/5 p-6 text-center">
        <p className="font-display text-[20px] font-black text-green-400 mb-2">Mensagem enviada!</p>
        <p className="font-serif text-[15px] text-vp-text-2">
          Recebemos seu contato e retornaremos em até 2 dias úteis para o e-mail informado.
        </p>
      </div>
    );
  }

  const errors = state.status === 'error' ? state.errors : {};

  return (
    <form action={action} className="space-y-5">
      {errors._form && (
        <p className="text-[13px] text-vp-urgent border border-vp-urgent/30 px-4 py-3">{errors._form}</p>
      )}

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-widest text-vp-text-3 mb-1.5" htmlFor="name">
            Nome completo *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            className="vp-input w-full"
            placeholder="Seu nome"
          />
          {errors.name && <p className="text-[12px] text-vp-urgent mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-widest text-vp-text-3 mb-1.5" htmlFor="email">
            E-mail *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            className="vp-input w-full"
            placeholder="seu@email.com"
          />
          {errors.email && <p className="text-[12px] text-vp-urgent mt-1">{errors.email}</p>}
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-bold uppercase tracking-widest text-vp-text-3 mb-1.5" htmlFor="subject">
          Assunto *
        </label>
        <select id="subject" name="subject" className="vp-input w-full bg-vp-surface">
          <option value="">Selecione...</option>
          <option value="geral">Contato geral</option>
          <option value="correcao">Solicitação de correção</option>
          <option value="denuncia">Denúncia / informação de interesse público</option>
          <option value="publicidade">Publicidade</option>
          <option value="outro">Outro</option>
        </select>
        {errors.subject && <p className="text-[12px] text-vp-urgent mt-1">{errors.subject}</p>}
      </div>

      <div>
        <label className="block text-[11px] font-bold uppercase tracking-widest text-vp-text-3 mb-1.5" htmlFor="message">
          Mensagem *
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          className="vp-input w-full resize-none"
          placeholder="Descreva sua mensagem..."
        />
        {errors.message && <p className="text-[12px] text-vp-urgent mt-1">{errors.message}</p>}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="vp-btn vp-btn-primary text-[12px] font-bold px-8 py-3 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {pending ? 'Enviando...' : 'Enviar mensagem →'}
      </button>
    </form>
  );
}
