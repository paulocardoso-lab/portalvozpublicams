'use client';

import React, { useState } from 'react';
import { submitTip } from './actions';

export function DenunciaForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    
    const formData = new FormData(e.currentTarget);
    const result = await submitTip(formData);

    if (result.success) {
      setStatus('success');
      (e.target as HTMLFormElement).reset();
    } else {
      setStatus('error');
      setMessage(result.error || 'Ocorreu um erro.');
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-vp-ok/10 border border-vp-ok p-8 rounded-[4px] text-center">
        <div className="w-16 h-16 bg-vp-ok rounded-full flex items-center justify-center mx-auto mb-4 text-white">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h2 className="text-[24px] font-display mb-2">Denúncia Enviada</h2>
        <p className="text-vp-text-2">
          Sua informação foi recebida com sucesso e enviada para nossa equipe de investigação. 
          Obrigado por ajudar a fiscalizar o poder em Mato Grosso do Sul.
        </p>
        <button 
          onClick={() => setStatus('idle')}
          className="mt-6 text-vp-accent font-bold text-[13px] hover:underline"
        >
          ENVIAR OUTRA DENÚNCIA
        </button>
      </div>
    );
  }

  return (
    <div className="bg-vp-surface border border-vp-border p-8 rounded-[4px]">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[12px] font-bold uppercase tracking-wider text-vp-text-3 mb-2">Seu Nome (Opcional)</label>
            <input name="name" type="text" className="vp-input py-3" placeholder="Mantenha vazio para anonimato" />
          </div>
          <div>
            <label className="block text-[12px] font-bold uppercase tracking-wider text-vp-text-3 mb-2">E-mail para Contato (Opcional)</label>
            <input name="email" type="email" className="vp-input py-3" placeholder="caso deseje retorno" />
          </div>
        </div>

        <div>
          <label className="block text-[12px] font-bold uppercase tracking-wider text-vp-text-3 mb-2">O que está acontecendo? *</label>
          <textarea 
            name="content"
            className="vp-input min-h-[150px] py-3" 
            placeholder="Descreva o fato com o máximo de detalhes possível..."
            required
          ></textarea>
        </div>

        <div>
          <label className="block text-[12px] font-bold uppercase tracking-wider text-vp-text-3 mb-2">Anexar Provas (Fotos/Docs)</label>
          <input 
            type="file" 
            className="vp-input text-[13px] file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-vp-accent file:text-white" 
          />
          <p className="text-[11px] text-vp-text-3 mt-2">Formatos aceitos: JPG, PNG, PDF. Tamanho máx: 10MB.</p>
        </div>

        {status === 'error' && (
          <div className="text-vp-urgent text-[13px] font-semibold">{message}</div>
        )}

        <div className="pt-4">
          <button 
            type="submit" 
            disabled={status === 'loading'}
            className="vp-btn vp-btn-primary w-full py-4 font-bold tracking-widest text-[14px] disabled:opacity-50"
          >
            {status === 'loading' ? 'ENVIANDO...' : 'ENVIAR DENÚNCIA COM SEGURANÇA'}
          </button>
        </div>
        
        <div className="flex items-center gap-3 text-[12px] text-vp-text-3 justify-center pt-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          Conexão criptografada ponta-a-ponta
        </div>
      </form>
    </div>
  );
}
