import React from 'react';
import { KanbanColumn, KanbanCard } from '@/components/admin/kanban/KanbanComponents';

export default function AdminKanbanPage() {
  const columns = [
    { t: 'Pauta', c: '#4b4b4a', items: [
      { id: '1', h: 'Escolas rurais sem transporte em Bonito', a: 'L. Fragoso', d: '2 dias' },
      { id: '2', h: 'Auditoria do TCE sobre Iluminação CG', a: 'R. Duarte', d: 'hoje' },
      { id: '3', h: 'Perfil: nova juíza auxiliar do TJ-MS', a: 'T. Mattos', d: '1 dia' },
    ]},
    { t: 'Apuração', c: '#7aa2f7', items: [
      { id: '4', h: 'Patrimônio dos 24 deputados de MS', a: 'M. Ribeiro', d: '6 dias', b: 'sigiloso' },
      { id: '5', h: 'PCC na fronteira — parte 2: as rotas', a: 'C. Benites', d: '14 dias' },
    ]},
    { t: 'Rascunho', c: '#e0b44a', items: [
      { id: '6', h: 'Cinco perguntas sobre Plano de Manejo', a: 'L. Fragoso', d: '95% pronto' },
      { id: '7', h: 'Raio-X do orçamento municipal CG 2026', a: 'R. Duarte', d: 'aguarda dados' },
      { id: '8', h: 'Opinião — reforma tributária e MS', a: 'S. Yoko', d: 'hoje' },
    ]},
    { t: 'Em Revisão', c: '#d97757', items: [
      { id: '9', h: 'Dourados: 3ª tentativa de cassação do prefeito', a: 'A. Figueira', d: '3h', b: 'urgente' },
      { id: '10', h: 'Dados · 72% das autuações prescrevem', a: 'R. Duarte', d: '1 dia' },
    ]},
    { t: 'Agendado', c: '#10b981', items: [
      { id: '11', h: 'O rio que sumiu — capítulo 4: o fim', a: 'M. Ribeiro', d: 'amanhã, 06h' },
      { id: '12', h: 'Newsletter A Semana em MS #143', a: 'Redação', d: 'sábado, 08h' },
    ]},
    { t: 'Publicado', c: '#4b4b4a', items: [
      { id: '13', h: 'O rio que sumiu — capítulo 3', a: 'M. Ribeiro', d: '18.402 vis.' },
      { id: '14', h: 'Assembleia aprova LDO 2027', a: 'L. Fragoso', d: '12.118 vis.' },
    ]},
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      {/* Kanban Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="font-display text-[26px] lg:text-[32px] font-black leading-tight">
            Fila Editorial.
          </h1>
          <p className="font-serif italic text-[15px] text-vp-text-3 mt-1">
            Gestão visual do pipeline jornalístico · 14 matérias em curso · 3 agendadas.
          </p>
        </div>
        <div className="flex gap-3">
          <select className="vp-input text-[11px] font-bold uppercase tracking-widest py-2 px-4 bg-[#141413]">
             <option>Toda a Redação</option>
             <option>Política</option>
             <option>Pantanal</option>
          </select>
          <button className="vp-btn vp-btn-primary text-[11px] font-bold uppercase tracking-widest py-2 px-6">
             + Nova Pauta
          </button>
        </div>
      </div>

      {/* Board Viewport */}
      <div className="flex-1 overflow-x-auto pb-4 vp-scroll">
        <div className="flex gap-4 h-full min-w-max">
          {columns.map(col => (
            <KanbanColumn key={col.t} title={col.t} color={col.c} count={col.items.length}>
              {col.items.map(it => (
                <KanbanCard 
                  key={it.id}
                  id={it.id}
                  title={it.h}
                  author={it.a}
                  date={it.d}
                  badge={it.b}
                />
              ))}
            </KanbanColumn>
          ))}
        </div>
      </div>
    </div>
  );
}
