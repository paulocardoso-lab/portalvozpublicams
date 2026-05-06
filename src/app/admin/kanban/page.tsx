import React from 'react';

export default function AdminKanbanPage() {
  const cols = [
    { t: 'Pauta', c: 'bg-vp-text-3', bc: 'border-vp-text-3', items: [
      { h: 'Escolas rurais sem transporte em Bonito', a: 'L. Fragoso', d: 'pauta · 2 dias' },
      { h: 'Auditoria do TCE sobre Iluminação CG', a: 'R. Duarte', d: 'pauta · hoje' },
      { h: 'Perfil: nova juíza auxiliar do TJ-MS', a: 'T. Mattos', d: 'pauta · 1 dia' },
    ]},
    { t: 'Apuração', c: 'bg-[#7aa2f7]', bc: 'border-[#7aa2f7]', items: [
      { h: 'Patrimônio dos 24 deputados de MS', a: 'M. Ribeiro', d: 'apurando · 6 dias', badge: 'sigiloso' },
      { h: 'PCC na fronteira — parte 2', a: 'C. Benites', d: 'apurando · 14 dias' },
    ]},
    { t: 'Rascunho', c: 'bg-vp-warn', bc: 'border-vp-warn', items: [
      { h: 'Cinco perguntas sobre Plano de Manejo', a: 'L. Fragoso', d: 'rascunho · 95% pronto' },
      { h: 'Raio-X do orçamento municipal CG', a: 'R. Duarte', d: 'rascunho · aguarda dados' },
      { h: 'Opinião — reforma tributária e MS', a: 'S. Yoko', d: 'rascunho · hoje' },
    ]},
    { t: 'Em revisão', c: 'bg-vp-accent', bc: 'border-vp-accent', items: [
      { h: 'Dourados: 3ª tentativa de cassação', a: 'A. Figueira → M. Ribeiro', d: 'revisão · 3h', badge: 'urgente' },
      { h: 'Dados · 72% das autuações prescrevem', a: 'R. Duarte → C. Benites', d: 'revisão · 1 dia' },
    ]},
    { t: 'Agendado', c: 'bg-vp-ok', bc: 'border-vp-ok', items: [
      { h: 'O rio que sumiu — capítulo 4', a: 'M. Ribeiro', d: 'publica amanhã, 06h' },
      { h: 'Newsletter A Semana em MS', a: 'Editoria', d: 'publica sáb, 08h' },
    ]},
    { t: 'Publicado (hoje)', c: 'bg-vp-text-3', bc: 'border-vp-text-3', items: [
      { h: 'O rio que sumiu — capítulo 3', a: 'M. Ribeiro', d: '06:00 · 18.402 vis.' },
      { h: 'Assembleia aprova LDO 2027', a: 'L. Fragoso', d: '12:40 · 12.118 vis.' },
    ]},
  ];

  return (
    <div className="max-w-[1400px]">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-4.5">
        <div>
          <h1 className="text-[22px] font-semibold mb-1">Fila editorial</h1>
          <p className="text-vp-text-3 text-[13px]">Kanban da redação · 14 matérias em curso · 3 agendadas</p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <select className="vp-input flex-1 sm:w-[160px] py-1.5 px-3 text-[12px]" aria-label="Filtrar por editoria"><option>Toda redação</option><option>Pantanal</option><option>Política</option></select>
          <select className="vp-input flex-1 sm:w-[160px] py-1.5 px-3 text-[12px]" aria-label="Filtrar por autor"><option>Todos autores</option><option>Eu</option></select>
          <button className="vp-btn vp-btn-primary py-1.5 px-3 text-[12px] whitespace-nowrap">+ Pauta</button>
        </div>
      </div>
      
      <div className="flex overflow-x-auto gap-3 pb-4 snap-x items-start">
        {cols.map(col => (
          <div key={col.t} className="bg-vp-surface border border-vp-border rounded-[6px] p-2.5 min-w-[260px] flex-1 shrink-0 snap-center flex flex-col">
            <div className={`flex items-center gap-2 px-1 pb-2.5 border-b-2 ${col.bc}`}>
              <span className={`w-2 h-2 rounded-full ${col.c}`} />
              <span className="text-[11px] uppercase tracking-[0.1em] font-bold text-vp-text">{col.t}</span>
              <span className="ml-auto font-mono text-[11px] text-vp-text-3">{col.items.length}</span>
            </div>
            <div className="grid gap-2 pt-2.5">
              {col.items.map((it, i) => (
                <div key={i} className="bg-vp-bg border border-vp-border p-2.5 rounded-[4px] cursor-grab active:cursor-grabbing hover:border-vp-text-4 transition-colors">
                  {it.badge && (
                    <span className={`vp-tag text-white mb-1.5 border-transparent ${it.badge==='urgente' ? 'bg-vp-urgent' : 'bg-vp-surface-3'}`}>
                      {it.badge}
                    </span>
                  )}
                  <div className="text-[13px] leading-[1.35] text-vp-text mb-2 font-medium">{it.h}</div>
                  <div className="flex justify-between text-[10px] text-vp-text-3">
                    <span className="truncate mr-2">{it.a}</span>
                    <span className="whitespace-nowrap">{it.d}</span>
                  </div>
                </div>
              ))}
              <button className="bg-transparent border border-dashed border-vp-border-2 p-2 text-vp-text-3 text-[11px] rounded-[4px] cursor-pointer hover:text-vp-text hover:border-vp-text transition-colors">
                + novo
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
