"use client";

import React, { useState } from 'react';
import { Eyebrow } from '@/components/shared/Eyebrow';

export default function AdminCommentsPage() {
  const [activeTab, setActiveTab] = useState<'pending' | 'flagged' | 'approved' | 'spam'>('flagged');

  const comments = [
    { id: 1, user: 'João de Souza', email: 'joao@email.com', body: 'Isso é uma vergonha para o nosso estado! O Taquari está morrendo e ninguém faz nada.', article: 'O rio que sumiu: Taquari', date: 'há 12min', status: 'pending' },
    { id: 2, user: 'Maria Oliveira', email: 'maria@email.com', body: 'Reportagem enviesada. Claramente atacando o governo sem ouvir o outro lado.', article: 'Assembleia aprova LDO 2027', date: 'há 45min', status: 'flagged', flags: 3, reason: 'Discurso de ódio' },
    { id: 3, user: 'Carlos Silva', email: 'carlos@email.com', body: 'Ótima investigação. Precisamos de mais jornalismo assim em MS.', article: 'Raio-X: patrimônio dos deputados', date: 'há 2h', status: 'approved' },
    { id: 4, user: 'Bot 123', email: 'spam@bot.com', body: 'GANHE DINHEIRO FÁCIL TRABALHANDO EM CASA! CLIQUE AQUI', article: 'O rio que sumiu', date: 'há 5h', status: 'spam' },
  ];

  const filtered = comments.filter(c => c.status === activeTab);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="font-display text-[26px] lg:text-[32px] font-black leading-tight">
            Moderação de Comentários.
          </h1>
          <p className="font-serif italic text-[15px] text-vp-text-3 mt-1">
            Gerencie o debate público · 12 aguardando · 3 sinalizados.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="vp-btn text-[11px] font-black uppercase tracking-widest px-4 py-2">
             Regras de Moderação
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-vp-border">
        {[
          { id: 'pending', l: 'Aguardando', count: 12 },
          { id: 'flagged', l: 'Sinalizados', count: 3, urgent: true },
          { id: 'approved', l: 'Aprovados', count: 482 },
          { id: 'spam', l: 'Spam', count: 14 }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`pb-4 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative ${
              activeTab === t.id ? 'text-vp-text' : 'text-vp-text-4 hover:text-vp-text-2'
            }`}
          >
            {t.l}
            <span className={`ml-2 font-mono ${t.urgent ? 'text-vp-urgent' : 'text-vp-text-4'}`}>
              ({t.count})
            </span>
            {activeTab === t.id && (
              <span className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-vp-accent" />
            )}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-vp-border rounded-lg">
             <p className="text-vp-text-4 italic font-serif">Nenhum comentário nesta fila.</p>
          </div>
        ) : (
          filtered.map(c => (
            <div key={c.id} className="vp-panel p-6 bg-[#141413] border border-vp-border hover:border-vp-border-2 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-vp-surface border border-vp-border flex items-center justify-center font-black text-vp-text-3 text-[14px]">
                    {c.user[0]}
                  </div>
                  <div>
                    <h4 className="text-[14px] font-black text-vp-text">{c.user}</h4>
                    <span className="text-[11px] text-vp-text-4 font-mono">{c.email}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-vp-text-4 font-black uppercase tracking-widest block mb-1">Matéria</span>
                  <p className="text-[12px] font-bold text-vp-accent italic hover:underline cursor-pointer">
                    &quot;{c.article}&quot;
                  </p>
                </div>
              </div>

              <div className="bg-vp-bg p-4 border border-vp-border mb-6">
                 {c.status === 'flagged' && (
                    <div className="flex items-center gap-2 mb-3 text-vp-urgent">
                       <span className="w-1.5 h-1.5 rounded-full bg-vp-urgent animate-pulse" />
                       <span className="text-[10px] font-black uppercase tracking-widest">Sinalizado: {c.reason} ({c.flags} denúncias)</span>
                    </div>
                 )}
                 <p className="font-serif text-[16px] text-vp-text-2 leading-relaxed italic">
                   &quot;{c.body}&quot;
                 </p>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-vp-text-4 font-mono uppercase tracking-widest">{c.date}</span>
                <div className="flex gap-2">
                  <button className="vp-btn text-[11px] font-black uppercase tracking-widest px-4 py-2 hover:bg-vp-urgent/10 hover:text-vp-urgent hover:border-vp-urgent transition-all">
                    Banir Usuário
                  </button>
                  <button className="vp-btn text-[11px] font-black uppercase tracking-widest px-4 py-2 hover:bg-vp-surface transition-all">
                    Marcar Spam
                  </button>
                  <button className="vp-btn vp-btn-primary text-[11px] font-black uppercase tracking-widest px-8 py-2">
                    Aprovar Comentário
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
