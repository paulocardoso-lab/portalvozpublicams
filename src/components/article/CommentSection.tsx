'use client';

import React, { useState } from 'react';
import { submitComment } from '@/app/actions/comments';

interface Comment {
  id: string;
  body: string;
  guestName: string | null;
  user: { name: string | null } | null;
  createdAt: Date | string;
}

interface CommentSectionProps {
  articleId: string;
  comments: Comment[];
  isLoggedIn: boolean;
}

export function CommentSection({ articleId, comments, isLoggedIn }: CommentSectionProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(formData: FormData) {
    setStatus('loading');
    const result = await submitComment(formData);
    
    if (result.error) {
      setStatus('error');
      setMessage(result.error);
    } else {
      setStatus('success');
      setMessage(result.message || '');
      // Opcional: resetar formulário se necessário
    }
  }

  return (
    <div className="mt-16 border-t border-vp-border pt-12 max-w-[800px]">
      <h3 className="font-display text-[28px] mb-8">Comentários ({comments.length})</h3>

      {/* Form */}
      <div className="bg-vp-surface p-6 rounded-[2px] mb-10 border border-vp-border">
        {status === 'success' ? (
          <div className="text-vp-ok text-center py-4">
            <p className="font-bold mb-1">✓ Enviado com sucesso!</p>
            <p className="text-[14px]">{message}</p>
            <button onClick={() => setStatus('idle')} className="mt-4 text-[12px] underline">Enviar outro</button>
          </div>
        ) : (
          <form action={handleSubmit} className="space-y-4">
            <input type="hidden" name="articleId" value={articleId} />
            
            {!isLoggedIn && (
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-vp-text-3 mb-1.5">Seu Nome</label>
                <input 
                  name="guestName" 
                  className="vp-input text-[14px]" 
                  placeholder="Ex: Maria Silva"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-vp-text-3 mb-1.5">Sua Mensagem</label>
              <textarea 
                name="body" 
                className="vp-input min-h-[100px] text-[14px] py-3" 
                placeholder="O que você pensa sobre este assunto?"
                required
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <p className="text-[11px] text-vp-text-4 max-w-[300px]">
                Seu comentário passará por moderação antes de ser publicado.
              </p>
              <button 
                type="submit" 
                className="vp-btn vp-btn-primary px-8 py-3 text-[13px] font-bold disabled:opacity-50"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'ENVIANDO...' : 'POSTAR COMENTÁRIO'}
              </button>
            </div>
            {status === 'error' && <p className="text-vp-urgent text-[12px] font-bold mt-2">{message}</p>}
          </form>
        )}
      </div>

      {/* List */}
      <div className="space-y-8">
        {comments.length === 0 ? (
          <p className="text-vp-text-3 italic text-[15px]">Nenhum comentário ainda. Seja o primeiro a opinar!</p>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="border-b border-vp-border pb-8 last:border-0">
              <div className="flex justify-between items-baseline mb-2">
                <span className="font-bold text-[16px] text-vp-accent">
                  {c.user?.name || c.guestName || 'Anônimo'}
                </span>
                <span className="text-[12px] text-vp-text-4 font-mono">
                  {new Date(c.createdAt).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <p className="text-[15px] leading-relaxed text-vp-text-2">
                {c.body}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
