import React from 'react';

function Stat({ label, value, delta, sub }: { label: string, value: string, delta: string, sub: string }) {
  const isPos = delta.startsWith('+');
  return (
    <div className="bg-[#141413] border border-vp-border p-3.5 rounded-[4px]">
      <div className="text-[12px] font-semibold mb-1.5">{label}</div>
      <div className="font-serif text-[28px] leading-none mb-2.5">{value}</div>
      <div className="flex justify-between items-center text-[11px]">
        <span className={`font-mono ${isPos ? 'text-vp-ok' : 'text-vp-urgent'}`}>{delta}</span>
        <span className="text-vp-text-3">{sub}</span>
      </div>
    </div>
  );
}

function Sparkline({ points }: { points: number[] }) {
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const path = points.map((p, i) => {
    const x = (i / (points.length - 1)) * 100;
    const y = 100 - ((p - min) / range) * 100;
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" className="overflow-visible">
      <path d={path} fill="none" stroke="var(--vp-accent)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      <circle cx="100" cy={100 - ((points[points.length - 1] - min) / range) * 100} r="3" fill="var(--vp-accent)" />
    </svg>
  );
}

export default function AdminMetricsPage() {
  const daily = [184,192,174,210,232,228,246,258,272,264,278,298,312,326,338,352,340,364,382,398,412,428,440,462];

  return (
    <div className="max-w-[1200px]">
      <div className="flex flex-wrap justify-between items-end gap-4 mb-4.5">
        <div>
          <h1 className="text-[22px] font-semibold mb-1">Métricas & tráfego</h1>
          <p className="text-vp-text-3 text-[13px]">Audiência, engajamento, conversão e performance editorial</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <select className="vp-input flex-1 sm:w-[140px] text-[12px] py-1.5" aria-label="Período"><option>Últimos 30 dias</option><option>Últimos 7 dias</option><option>Este ano</option></select>
          <button className="vp-btn flex-1 sm:flex-none justify-center whitespace-nowrap">Exportar CSV</button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
        <Stat label="Visitantes únicos (mês)" value="1.284.402" delta="+18%" sub="vs. mês anterior" />
        <Stat label="Pageviews" value="4.812.118" delta="+22%" sub="média 3,7/visita" />
        <Stat label="Tempo médio" value="4m 12s" delta="+8%" sub="aprofundamento alto" />
        <Stat label="Taxa de rejeição" value="38,4%" delta="-3%" sub="queda saudável" />
        <Stat label="Cadastros newsletter" value="+3.402" delta="+12%" sub="conversão 0,26%" />
      </div>

      <div className="grid lg:grid-cols-[1.6fr_1fr] gap-3.5 mb-4">
        <div className="bg-[#141413] border border-vp-border p-4.5 rounded-[4px]">
          <h3 className="text-[13px] font-semibold mb-3">Audiência diária — últimos 30 dias</h3>
          <div className="h-[220px] w-full pt-2">
            <Sparkline points={daily} />
          </div>
        </div>
        <div className="bg-[#141413] border border-vp-border p-4.5 rounded-[4px]">
          <h3 className="text-[13px] font-semibold mb-3.5">Origem do tráfego</h3>
          {[
            ['Busca orgânica', 48, 'bg-vp-accent'],
            ['Direto', 22, 'bg-vp-text-2'],
            ['Redes sociais', 18, 'bg-[#7aa2f7]'],
            ['WhatsApp', 8, 'bg-vp-ok'],
            ['Newsletter', 3, 'bg-[#c4a7e7]'],
            ['Referência', 1, 'bg-vp-text-4'],
          ].map(([n, v, c]) => (
            <div key={String(n)} className="mb-2.5">
              <div className="flex justify-between text-[12px] mb-1">
                <span className="text-vp-text-2">{String(n)}</span>
                <span className="font-mono text-vp-text-3">{v}%</span>
              </div>
              <div className="h-1.5 bg-vp-border rounded-[3px] overflow-hidden">
                <div className={`h-full ${c}`} style={{ width: `${Number(v)*2}%`, maxWidth: '100%' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-3.5 mb-4">
        <div className="bg-[#141413] border border-vp-border p-4.5 rounded-[4px]">
          <h3 className="text-[13px] font-semibold mb-3.5">Cidades no MS</h3>
          {[
            ['Campo Grande', '612.218', 48],
            ['Dourados', '168.402', 13],
            ['Três Lagoas', '94.120', 7],
            ['Corumbá', '62.410', 5],
            ['Ponta Porã', '48.212', 4],
            ['Naviraí', '32.118', 3],
          ].map(([c, v, p]) => (
            <div key={String(c)} className="grid grid-cols-[1fr_90px_40px] gap-2.5 py-2 items-center border-b border-vp-border last:border-0 text-[12px]">
              <span>{String(c)}</span>
              <span className="font-mono text-vp-text-3 text-right">{v}</span>
              <span className="text-vp-accent font-semibold text-right">{p}%</span>
            </div>
          ))}
        </div>
        <div className="bg-[#141413] border border-vp-border p-4.5 rounded-[4px]">
          <h3 className="text-[13px] font-semibold mb-3.5">Dispositivos</h3>
          <div className="grid grid-cols-3 gap-3 mb-4.5">
            {[['Mobile', 72, 'text-vp-accent'], ['Desktop', 22, 'text-[#7aa2f7]'], ['Tablet', 6, 'text-vp-ok']].map(([n, v, c]) => (
              <div key={String(n)} className="text-center">
                <div className="relative w-[90px] h-[90px] mx-auto mb-1.5">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <circle cx="18" cy="18" r="15" fill="none" className="stroke-vp-border" strokeWidth="3" />
                    <circle cx="18" cy="18" r="15" fill="none" className={`stroke-current ${c}`} strokeWidth="3" strokeDasharray={`${Number(v)*0.942} 100`} />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-serif text-[20px]">{v}%</div>
                </div>
                <div className="text-[12px] text-vp-text-2">{String(n)}</div>
              </div>
            ))}
          </div>
          <div className="text-[11px] text-vp-text-3 leading-[1.5]">
            Dica: 72% mobile reforça prioridade no redesign responsivo — seu tempo médio em mobile ainda é 38% menor que desktop.
          </div>
        </div>
      </div>

      <div className="bg-[#141413] border border-vp-border rounded-[4px] overflow-x-auto">
        <div className="min-w-[800px] p-4.5">
          <h3 className="text-[13px] font-semibold mb-3.5">Matérias com melhor performance (30d)</h3>
          <div className="grid grid-cols-[3fr_1fr_1fr_1fr_1fr_1fr] px-2.5 py-1.5 border-b border-vp-border text-[10px] uppercase tracking-[0.1em] text-vp-text-3">
            <span>Matéria</span><span>Views</span><span>Únicos</span><span>Tempo</span><span>Scroll 75%</span><span>Compart.</span>
          </div>
          {[
            ['O rio que sumiu: Taquari', '218.402', '168.112', '8m 14s', '62%', '4.218'],
            ['Raio-X dos 24 deputados de MS', '184.218', '142.018', '5m 48s', '58%', '3.412'],
            ['PCC nas cidades de fronteira', '128.412', '98.210', '6m 12s', '54%', '2.812'],
            ['Como MS virou polo da celulose', '94.218', '72.118', '4m 20s', '48%', '1.412'],
            ['Os donos do Pantanal', '88.412', '68.012', '7m 05s', '59%', '2.218'],
          ].map((r, i) => (
            <div key={i} className={`grid grid-cols-[3fr_1fr_1fr_1fr_1fr_1fr] px-2.5 py-2.5 items-center text-[12px] ${i < 4 ? 'border-b border-vp-border' : ''}`}>
              <span className="text-vp-text">{r[0]}</span>
              <span className="font-mono text-vp-text-2">{r[1]}</span>
              <span className="font-mono text-vp-text-2">{r[2]}</span>
              <span className="font-mono text-vp-text-2">{r[3]}</span>
              <span className="font-mono text-vp-accent font-semibold">{r[4]}</span>
              <span className="font-mono text-vp-text-2">{r[5]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
