import React from 'react';

export default function AdminAdsPage() {
  const slots = [
    { n: 'Leaderboard topo', s: '728×90', f: '92%', r: 'R$ 8.420' },
    { n: 'Billboard inline', s: '970×120', f: '68%', r: 'R$ 4.180' },
    { n: 'Retângulo sidebar', s: '300×250', f: '100%', r: 'R$ 12.240' },
    { n: 'Skyscraper', s: '300×600', f: '84%', r: 'R$ 6.840' },
    { n: 'Nativo in-feed', s: 'flex', f: '100%', r: 'R$ 6.740' },
  ];
  
  const campaigns = [
    { n: 'BYD — ATTO 8 (abr)', c: 'Agência Z', slot: 'Leaderboard topo', imp: '412.8k', cli: '3.214', ctr: '0,78%', end: '28/04', st: 'ativa' },
    { n: 'Sicredi MS — Safra', c: 'Direto', slot: 'Retângulo sidebar', imp: '284.1k', cli: '2.114', ctr: '0,74%', end: '15/05', st: 'ativa' },
    { n: 'UFMS — Vestibular', c: 'Direto', slot: 'Billboard inline', imp: '88.2k', cli: '1.218', ctr: '1,38%', end: '05/05', st: 'ativa' },
    { n: 'JBS — Institucional', c: 'Agência X', slot: 'Skyscraper', imp: '128.3k', cli: '612', ctr: '0,48%', end: '02/05', st: 'pausada' },
    { n: 'Shop MS — Nativo', c: 'Direto', slot: 'Nativo in-feed', imp: '44.0k', cli: '1.812', ctr: '4,12%', end: '24/04', st: 'expira amanhã' },
  ];
  
  return (
    <div className="max-w-[1200px]">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-4.5">
        <div>
          <h1 className="text-[22px] font-semibold mb-1">Banners & publicidade</h1>
          <p className="text-vp-text-3 text-[13px]">5 slots · 14 campanhas ativas · R$ 38.420 faturado este mês</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="vp-btn flex-1 sm:flex-none justify-center">Relatório</button>
          <button className="vp-btn vp-btn-primary flex-1 sm:flex-none justify-center whitespace-nowrap">+ Nova campanha</button>
        </div>
      </div>

      {/* Slots */}
      <h3 className="text-[12px] uppercase tracking-[0.12em] font-semibold text-vp-text-3 mb-2.5">Slots disponíveis</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 mb-5">
        {slots.map(s => (
          <div key={s.n} className="bg-[#141413] border border-vp-border p-3.5 rounded-[4px]">
            <div className="text-[12px] font-semibold mb-0.5">{s.n}</div>
            <div className="font-mono text-[10px] text-vp-text-3 mb-2.5">{s.s}</div>
            <div className="h-1.5 bg-vp-border rounded-full mb-1 relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 bg-vp-accent" style={{ width: s.f }} />
            </div>
            <div className="flex justify-between text-[11px] text-vp-text-3">
              <span>ocupação {s.f}</span><span>{s.r}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Layout visualizer */}
      <div className="bg-[#141413] border border-vp-border p-4 mb-5">
        <h3 className="text-[13px] font-semibold mb-3">Visualização dos slots na home</h3>
        <div className="grid md:grid-cols-[1fr_220px] gap-2.5 bg-vp-bg p-3.5 border border-vp-border">
          <div className="grid gap-2.5">
            <div className="bg-vp-surface border-2 border-dashed border-vp-text-4 flex items-center justify-center text-vp-text-3 text-[11px] uppercase tracking-[0.1em] h-[56px]">
              728×90 · Leaderboard topo
            </div>
            <div className="bg-vp-surface-2 h-[140px] rounded-[2px] p-2.5 text-[10px] text-vp-text-3">conteúdo editorial · hero</div>
            <div className="bg-vp-surface border-2 border-dashed border-vp-text-4 flex items-center justify-center text-vp-text-3 text-[11px] uppercase tracking-[0.1em] h-[70px]">
              970×120 · Billboard inline
            </div>
            <div className="bg-vp-surface-2 h-[100px] rounded-[2px] p-2.5 text-[10px] text-vp-text-3">conteúdo editorial</div>
          </div>
          <div className="grid gap-2.5">
            <div className="bg-vp-surface border-2 border-dashed border-vp-text-4 flex items-center justify-center text-vp-text-3 text-[11px] uppercase tracking-[0.1em] h-[150px]">
              300×250
            </div>
            <div className="bg-vp-surface border-2 border-dashed border-vp-text-4 flex items-center justify-center text-vp-text-3 text-[11px] uppercase tracking-[0.1em] h-[220px]">
              300×600 · Skyscraper
            </div>
          </div>
        </div>
      </div>

      {/* Campaigns */}
      <div className="bg-[#141413] border border-vp-border overflow-x-auto">
        <div className="min-w-[900px]">
          <div className="grid grid-cols-[1.5fr_1fr_1.2fr_0.8fr_0.8fr_0.8fr_0.8fr_0.8fr] px-4 py-2.5 border-b border-vp-border text-[11px] uppercase tracking-[0.08em] text-vp-text-3">
            <span>Campanha</span><span>Cliente</span><span>Slot</span><span>Impressões</span><span>Cliques</span><span>CTR</span><span>Fim</span><span>Status</span>
          </div>
          {campaigns.map((c, i) => (
            <div key={i} className={`grid grid-cols-[1.5fr_1fr_1.2fr_0.8fr_0.8fr_0.8fr_0.8fr_0.8fr] px-4 py-3 items-center text-[12px] ${i < campaigns.length - 1 ? 'border-b border-vp-border' : ''}`}>
              <div className="flex gap-2.5 items-center pr-2">
                <div className="w-[40px] h-[24px] bg-vp-surface border-2 border-dashed border-vp-text-4 shrink-0" />
                <span className="font-semibold text-vp-text truncate">{c.n}</span>
              </div>
              <span className="text-vp-text-2 truncate">{c.c}</span>
              <span className="text-vp-text-2 truncate pr-2">{c.slot}</span>
              <span className="font-mono text-vp-text-2">{c.imp}</span>
              <span className="font-mono text-vp-text-2">{c.cli}</span>
              <span className="font-mono text-vp-text-2">{c.ctr}</span>
              <span className="font-mono text-vp-text-3">{c.end}</span>
              <span>
                <span className={`vp-tag bg-transparent ${c.st === 'ativa' ? 'text-vp-ok border-vp-ok' : c.st === 'pausada' ? 'text-vp-text-3 border-vp-text-3' : 'text-[#e0b44a] border-[#e0b44a]'}`}>
                  {c.st}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
