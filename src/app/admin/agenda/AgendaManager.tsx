'use client';

import React, { useState, useTransition } from 'react';
import { createEvent, deleteEvent, toggleEventStatus, getEventsByDate } from './actions';
import { AgendaEvent } from '@prisma/client';

function toLocalDateStr(d: Date) {
  return d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
}

function isoDate(d: Date) {
  return d.toISOString().split('T')[0];
}

function addDays(d: Date, n: number) {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

export function AgendaManager({ initialEvents }: { initialEvents: AgendaEvent[] }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [events, setEvents]             = useState<AgendaEvent[]>(initialEvents);
  const [isModalOpen, setIsModalOpen]   = useState(false);
  const [loading, setLoading]           = useState(false);
  const [isPending, startTransition]    = useTransition();

  async function navigateTo(d: Date) {
    setSelectedDate(d);
    startTransition(async () => {
      const fetched = await getEventsByDate(isoDate(d));
      setEvents(fetched);
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    // inject selected date into formData
    formData.set('date', isoDate(selectedDate));
    try {
      await createEvent(formData);
      setIsModalOpen(false);
      e.currentTarget.reset();
      const fetched = await getEventsByDate(isoDate(selectedDate));
      setEvents(fetched);
    } catch {
      alert('Erro ao salvar evento');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Remover evento da agenda?')) return;
    await deleteEvent(id);
    setEvents(prev => prev.filter(ev => ev.id !== id));
  }

  async function handleToggle(id: string, status: string) {
    await toggleEventStatus(id, status);
    const fetched = await getEventsByDate(isoDate(selectedDate));
    setEvents(fetched);
  }

  const isToday = isoDate(selectedDate) === isoDate(today);
  const isPast  = selectedDate < today;

  return (
    <div className="space-y-6">
      {/* ── Date navigator ── */}
      <div className="flex items-center gap-4 border-b border-vp-border pb-5">
        <button
          onClick={() => navigateTo(addDays(selectedDate, -1))}
          className="vp-btn px-3 py-2 text-[13px] hover:bg-vp-surface"
          title="Dia anterior"
        >
          ←
        </button>

        <div className="flex-1 text-center">
          <div className="font-mono text-[10px] uppercase tracking-widest text-vp-text-4">
            {isToday ? 'Hoje' : isPast ? 'Passado' : 'Futuro'}
          </div>
          <div className="font-display text-[18px] font-black capitalize text-vp-text">
            {toLocalDateStr(selectedDate)}
          </div>
        </div>

        <input
          type="date"
          value={isoDate(selectedDate)}
          onChange={e => {
            const [y, m, d] = e.target.value.split('-').map(Number);
            const nd = new Date(y, m - 1, d);
            navigateTo(nd);
          }}
          className="vp-input text-[11px] px-2 py-1.5 w-[130px]"
          title="Selecionar data"
        />

        <button
          onClick={() => navigateTo(addDays(selectedDate, 1))}
          className="vp-btn px-3 py-2 text-[13px] hover:bg-vp-surface"
          title="Próximo dia"
        >
          →
        </button>

        <button
          onClick={() => setIsModalOpen(true)}
          className="vp-btn vp-btn-primary text-[11px] font-bold uppercase tracking-widest py-2 px-5 ml-2"
        >
          + Novo Evento
        </button>
      </div>

      {/* ── Events list ── */}
      <div className={`space-y-4 transition-opacity ${isPending ? 'opacity-50' : 'opacity-100'}`}>
        {events.length === 0 ? (
          <div className="vp-panel p-10 text-center text-vp-text-3 italic font-serif bg-[#141413] border border-vp-border">
            Nenhum evento cadastrado para esta data.
            <br />
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 vp-btn vp-btn-primary text-[11px] font-bold uppercase tracking-widest py-2 px-5"
            >
              + Adicionar evento
            </button>
          </div>
        ) : (
          events.map(ev => (
            <div
              key={ev.id}
              className="vp-panel p-6 bg-[#141413] border border-vp-border flex items-center gap-8 group hover:border-vp-accent/30 transition-all"
            >
              <div className="text-center min-w-[80px]">
                <div className="font-mono text-[20px] font-black text-vp-text">{ev.time}</div>
                <button
                  onClick={() => handleToggle(ev.id, ev.status)}
                  className={`text-[9px] font-black uppercase tracking-widest mt-1 px-2 py-0.5 rounded-sm border transition-all ${
                    ev.status === 'CONFIRMED'
                      ? 'bg-vp-ok/10 text-vp-ok border-vp-ok/20 hover:bg-vp-ok/20'
                      : 'bg-vp-urgent/10 text-vp-urgent border-vp-urgent/20 hover:bg-vp-urgent/20'
                  }`}
                >
                  {ev.status === 'CONFIRMED' ? 'Confirmado' : 'Cancelado'}
                </button>
              </div>

              <div className="flex-1">
                <div className="text-[11px] font-black text-vp-accent uppercase tracking-widest mb-1">{ev.organ}</div>
                <h3 className="text-[15px] font-bold text-vp-text group-hover:text-vp-accent transition-colors">
                  {ev.description}
                </h3>
              </div>

              <button
                onClick={() => handleDelete(ev.id)}
                className="text-vp-text-4 hover:text-vp-urgent transition-colors text-[18px]"
                title="Excluir"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>

      {/* ── Create modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#141413] border border-vp-border w-full max-w-[500px] p-8 shadow-2xl">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-[20px] font-display font-bold">Adicionar à Agenda</h3>
                <p className="text-[12px] text-vp-text-3 font-serif italic mt-1 capitalize">
                  {toLocalDateStr(selectedDate)}
                </p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-vp-text-4 hover:text-vp-text">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="event-time" className="text-[10px] font-black uppercase tracking-widest text-vp-text-4">
                    Horário
                  </label>
                  <input
                    id="event-time"
                    name="time"
                    type="time"
                    className="vp-input w-full"
                    required
                    title="Hora do evento"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="event-organ" className="text-[10px] font-black uppercase tracking-widest text-vp-text-4">
                    Órgão / Instituição
                  </label>
                  <input
                    id="event-organ"
                    name="organ"
                    className="vp-input w-full"
                    placeholder="Ex: ALMS, TJ-MS, GOV"
                    required
                    title="Órgão responsável"
                    list="organs-list"
                  />
                  <datalist id="organs-list">
                    {['ALMS', 'TJ-MS', 'GOV-MS', 'PMCG', 'TCE-MS', 'MPE-MS', 'TRE-MS', 'TJMS', 'SENADO', 'STF'].map(o => (
                      <option key={o} value={o} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="event-desc" className="text-[10px] font-black uppercase tracking-widest text-vp-text-4">
                  Descrição do Evento
                </label>
                <textarea
                  id="event-desc"
                  name="description"
                  className="vp-input w-full h-24 resize-none"
                  placeholder="O que será discutido ou realizado?"
                  required
                  title="Descrição detalhada"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="vp-btn flex-1 py-3 text-[12px] border-vp-border hover:bg-vp-surface"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="vp-btn vp-btn-primary flex-1 py-3 text-[12px] font-bold"
                >
                  {loading ? 'Salvando...' : 'Publicar na Agenda'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
