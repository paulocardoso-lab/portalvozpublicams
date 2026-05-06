import React from 'react';
import { prisma } from '@/lib/prisma';
import { saveAgendaEvent, deleteAgendaEvent } from './actions';

export const dynamic = 'force-dynamic';

export default async function AdminAgendaPage() {
  const events = await prisma.agendaEvent.findMany({
    orderBy: [{ date: 'desc' }, { time: 'asc' }],
    take: 50
  });

  return (
    <div className="max-w-[1000px]">
      <div className="flex justify-between items-baseline mb-8">
        <div>
          <h1 className="text-[26px] font-semibold mb-1">Agenda Pública</h1>
          <p className="text-vp-text-3 text-[13px]">
            Gerencie compromissos, sessões e audiências exibidos na Home.
          </p>
        </div>
      </div>

      {/* Form to add new */}
      <div className="bg-[#141413] border border-vp-border p-6 rounded-[4px] mb-8">
        <h3 className="text-[14px] font-bold mb-4 uppercase tracking-wider">Novo Compromisso</h3>
        <form action={saveAgendaEvent} className="grid grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-[11px] text-vp-text-3 uppercase font-bold mb-1.5">Hora</label>
            <input name="time" placeholder="09:00" className="vp-input text-[13px]" required />
          </div>
          <div>
            <label className="block text-[11px] text-vp-text-3 uppercase font-bold mb-1.5">Órgão</label>
            <input name="organ" placeholder="ALMS" className="vp-input text-[13px]" required />
          </div>
          <div className="col-span-2 flex gap-3 items-end">
            <div className="flex-1">
              <label className="block text-[11px] text-vp-text-3 uppercase font-bold mb-1.5">Descrição</label>
              <input name="description" placeholder="Votação do PL 123..." className="vp-input text-[13px]" required />
            </div>
            <button type="submit" className="vp-btn vp-btn-primary py-2.5 px-6 whitespace-nowrap">Adicionar</button>
          </div>
        </form>
      </div>

      {/* List */}
      <div className="bg-[#141413] border border-vp-border rounded-[4px] overflow-hidden">
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-vp-border bg-vp-surface">
              <th className="px-5 py-3 font-semibold text-vp-text-3 uppercase tracking-wider text-[10px]">Hora</th>
              <th className="px-5 py-3 font-semibold text-vp-text-3 uppercase tracking-wider text-[10px]">Órgão</th>
              <th className="px-5 py-3 font-semibold text-vp-text-3 uppercase tracking-wider text-[10px]">Descrição</th>
              <th className="px-5 py-3 font-semibold text-vp-text-3 uppercase tracking-wider text-[10px] text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-vp-border">
            {events.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center text-vp-text-3 italic">Nenhum compromisso agendado.</td>
              </tr>
            )}
            {events.map((ev) => (
              <tr key={ev.id} className="hover:bg-vp-surface/30 transition-colors group">
                <td className="px-5 py-4 font-mono text-vp-accent font-bold">{ev.time}</td>
                <td className="px-5 py-4">
                  <span className="bg-vp-surface px-2 py-0.5 border border-vp-border rounded text-[11px] text-vp-text-2 font-bold">{ev.organ}</span>
                </td>
                <td className="px-5 py-4 text-vp-text-2">{ev.description}</td>
                <td className="px-5 py-4 text-right">
                  <form action={async (fd) => { 'use server'; await deleteAgendaEvent(ev.id); }}>
                    <button type="submit" className="text-vp-urgent hover:underline text-[12px] cursor-pointer bg-transparent border-none">Excluir</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
