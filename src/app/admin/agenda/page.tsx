import React from 'react';
import { getEvents } from './actions';
import { AgendaManager } from './AgendaManager';

export const dynamic = 'force-dynamic';

export default async function AdminAgendaPage() {
  const events = await getEvents();

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="font-display text-[32px] lg:text-[42px] font-black leading-tight">
            Agenda do Poder (MS).
          </h1>
          <p className="font-serif italic text-[16px] text-vp-text-3 mt-2">
            Monitoramento em tempo real de sessões, audiências e coletivas dos órgãos públicos.
          </p>
        </div>
      </div>

      <AgendaManager initialEvents={events} />

      {/* Scraper Sidebar Alert (Still conceptual, but looks real) */}
      <div className="vp-panel p-8 bg-[#0a0a09] border border-vp-urgent/30 border-dashed relative overflow-hidden">
         <div className="absolute top-0 right-0 p-4 bg-vp-urgent/10 text-vp-urgent font-mono text-[10px] font-black uppercase tracking-widest">
            Alerta de Scraping IA
         </div>
         <h3 className="text-[18px] font-black mb-4">Detecções Automáticas (Diário Oficial)</h3>
         <p className="text-[13px] text-vp-text-3 italic mb-6">
           Nossa IA identificou novos eventos prováveis no DOE-MS de hoje:
         </p>
         <ul className="space-y-3">
            <li className="flex items-center gap-4 text-[13px]">
               <span className="w-1.5 h-1.5 rounded-full bg-vp-urgent animate-pulse" />
               <span className="text-vp-text-2"><strong>Assembleia:</strong> Sessão extraordinária convocada para sexta-feira às 10:00.</span>
               <button className="text-vp-accent font-black uppercase text-[10px] hover:underline">Importar +</button>
            </li>
         </ul>
      </div>
    </div>
  );
}
