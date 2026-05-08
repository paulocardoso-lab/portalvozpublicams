"use client";

import React, { useState } from 'react';
import { Eyebrow } from '@/components/shared/Eyebrow';

export default function AdminAgendaPage() {
  const events = [
    { id: '1', time: '09:00', organ: 'ALMS', description: 'Votação da LDO 2027 em segunda discussão', status: 'CONFIRMED' },
    { id: '2', time: '14:00', organ: 'TJ-MS', description: 'Julgamento de recurso: Caso Mineração Pantanal', status: 'CONFIRMED' },
    { id: '3', time: '16:30', organ: 'GOV-MS', description: 'Coletiva: Lançamento do pacote de infraestrutura regional', status: 'CONFIRMED' },
    { id: '4', time: '10:00', organ: 'CÂMARA CG', description: 'Audiência pública: Plano Diretor de Transporte', status: 'CANCELLED' },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="font-display text-[32px] lg:text-[42px] font-black leading-tight">
            Agenda do Poder (MS).
          </h1>
          <p className="font-serif italic text-[16px] text-vp-text-3 mt-2">
            Monitoramento de sessões, audiências e coletivas dos órgãos públicos de Mato Grosso do Sul.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="vp-btn text-[12px] font-bold uppercase tracking-widest py-2.5 px-6">
             Importar do DOE
          </button>
          <button className="vp-btn vp-btn-primary text-[12px] font-bold uppercase tracking-widest py-2.5 px-8">
             + Novo Evento
          </button>
        </div>
      </div>

      {/* Days Scroller (Mock) */}
      <div className="flex gap-4 border-b border-vp-border pb-6 overflow-x-auto vp-scroll">
        {[22, 23, 24, 25, 26, 27, 28].map(day => (
          <button 
            key={day}
            className={`min-w-[80px] p-4 rounded-sm border transition-all text-center ${
              day === 22 ? 'bg-vp-accent border-vp-accent text-vp-bg' : 'bg-[#141413] border-vp-border text-vp-text-3 hover:border-vp-accent/40'
            }`}
          >
            <div className="text-[10px] font-black uppercase tracking-widest mb-1">Abril</div>
            <div className="text-[24px] font-black leading-none">{day}</div>
            <div className="text-[10px] font-bold uppercase mt-1">Qua</div>
          </button>
        ))}
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {events.map(ev => (
          <div key={ev.id} className="vp-panel p-6 bg-[#141413] border border-vp-border flex items-center gap-8 group hover:border-vp-accent/30 transition-all">
            <div className="text-center min-w-[80px]">
               <div className="font-mono text-[20px] font-black text-vp-text">{ev.time}</div>
               <div className={`text-[9px] font-black uppercase tracking-widest mt-1 px-2 py-0.5 rounded-sm ${
                 ev.status === 'CONFIRMED' ? 'bg-vp-ok/10 text-vp-ok' : 'bg-vp-urgent/10 text-vp-urgent'
               }`}>
                 {ev.status === 'CONFIRMED' ? 'Confirmado' : 'Cancelado'}
               </div>
            </div>
            
            <div className="flex-1">
               <div className="text-[11px] font-black text-vp-accent uppercase tracking-widest mb-1">{ev.organ}</div>
               <h3 className="text-[15px] font-bold text-vp-text group-hover:text-vp-accent transition-colors">
                 {ev.description}
               </h3>
            </div>

            <div className="flex gap-2">
               <button className="text-vp-text-4 hover:text-vp-text text-[12px] font-bold uppercase">Editar</button>
               <button className="text-vp-text-4 hover:text-vp-urgent text-[12px] font-bold uppercase">Remover</button>
            </div>
          </div>
        ))}
      </div>

      {/* Scraper Sidebar Alert */}
      <div className="vp-panel p-8 bg-[#0a0a09] border border-vp-urgent/30 border-dashed relative overflow-hidden">
         <div className="absolute top-0 right-0 p-4 bg-vp-urgent/10 text-vp-urgent font-mono text-[10px] font-black uppercase tracking-widest">
            Alerta de Scraping IA
         </div>
         <h3 className="text-[18px] font-black mb-4">Detecções Automáticas (Diário Oficial)</h3>
         <p className="text-[13px] text-vp-text-3 italic mb-6">
           Nossa IA identificou 2 novos eventos prováveis no DOE-MS de hoje que ainda não estão na agenda:
         </p>
         <ul className="space-y-3">
            <li className="flex items-center gap-4 text-[13px]">
               <span className="w-1.5 h-1.5 rounded-full bg-vp-urgent animate-pulse" />
               <span className="text-vp-text-2"><strong>Assembleia:</strong> Sessão extraordinária convocada para sexta-feira (24/04) às 10:00.</span>
               <button className="text-vp-accent font-black uppercase text-[10px] hover:underline">Adicionar +</button>
            </li>
            <li className="flex items-center gap-4 text-[13px]">
               <span className="w-1.5 h-1.5 rounded-full bg-vp-urgent animate-pulse" />
               <span className="text-vp-text-2"><strong>Governo:</strong> Inauguração da nova ala do Hospital Regional — Sábado (25/04).</span>
               <button className="text-vp-accent font-black uppercase text-[10px] hover:underline">Adicionar +</button>
            </li>
         </ul>
      </div>
    </div>
  );
}
