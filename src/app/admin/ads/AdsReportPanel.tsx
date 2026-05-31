'use client';

import React, { useState, useTransition } from 'react';
import { getCampaignDailyStats, getAllCampaignsDailyStats } from './actions';

interface Campaign {
  id: string;
  name: string;
  client: string;
  slot: string;
  impressions: number;
  clicks: number;
}

interface DayStat {
  date: string;
  impressions: number;
  clicks: number;
}

interface Props {
  campaigns: Campaign[];
  initialStats: DayStat[];
}

const PERIOD_OPTIONS = [
  { label: '7 dias', value: 7 },
  { label: '30 dias', value: 30 },
  { label: '90 dias', value: 90 },
];

function ctr(imp: number, clk: number) {
  if (!imp) return '0.00%';
  return ((clk / imp) * 100).toFixed(2) + '%';
}

function formatDate(iso: string) {
  const [, m, d] = iso.split('-');
  return `${d}/${m}`;
}

function BarChart({ data, days }: { data: DayStat[]; days: number }) {
  const W = 800;
  const H = 160;
  const PAD = { t: 10, r: 10, b: 28, l: 36 };
  const chartW = W - PAD.l - PAD.r;
  const chartH = H - PAD.t - PAD.b;

  const maxImp = Math.max(...data.map(d => d.impressions), 1);
  const barW = Math.max(2, (chartW / data.length) - 2);
  const gap = chartW / data.length;

  // Y grid lines
  const gridLines = [0, 0.25, 0.5, 0.75, 1].map(f => Math.round(f * maxImp));

  // Show date labels every N items to avoid crowding
  const labelEvery = days <= 7 ? 1 : days <= 30 ? 5 : 15;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" aria-label="Gráfico de impressões e cliques por dia">
      {/* Grid lines */}
      {gridLines.map((v, i) => {
        const y = PAD.t + chartH - (v / maxImp) * chartH;
        return (
          <g key={i}>
            <line x1={PAD.l} x2={W - PAD.r} y1={y} y2={y} stroke="#2a2a27" strokeWidth="1" />
            <text x={PAD.l - 4} y={y + 4} textAnchor="end" fontSize="9" fill="#6b6b60">{v.toLocaleString('pt-BR')}</text>
          </g>
        );
      })}

      {/* Bars */}
      {data.map((d, i) => {
        const x = PAD.l + i * gap;
        const impH = (d.impressions / maxImp) * chartH;
        const clkH = (d.clicks / maxImp) * chartH;
        const showLabel = i % labelEvery === 0;

        return (
          <g key={d.date}>
            {/* Impression bar */}
            <rect
              x={x + gap * 0.1}
              y={PAD.t + chartH - impH}
              width={barW * 0.55}
              height={impH}
              fill="#3a3a33"
              rx="1"
            >
              <title>{d.date}: {d.impressions.toLocaleString('pt-BR')} impressões</title>
            </rect>
            {/* Click bar */}
            <rect
              x={x + gap * 0.1 + barW * 0.55 + 1}
              y={PAD.t + chartH - clkH}
              width={barW * 0.35}
              height={clkH}
              fill="#d4632a"
              rx="1"
            >
              <title>{d.date}: {d.clicks.toLocaleString('pt-BR')} cliques</title>
            </rect>
            {/* Date label */}
            {showLabel && (
              <text x={x + gap / 2} y={H - 6} textAnchor="middle" fontSize="8" fill="#6b6b60">
                {formatDate(d.date)}
              </text>
            )}
          </g>
        );
      })}

      {/* X axis */}
      <line x1={PAD.l} x2={W - PAD.r} y1={PAD.t + chartH} y2={PAD.t + chartH} stroke="#2a2a27" strokeWidth="1" />
    </svg>
  );
}

export function AdsReportPanel({ campaigns, initialStats }: Props) {
  const [selectedId, setSelectedId] = useState<string>('all');
  const [days, setDays] = useState(30);
  const [stats, setStats] = useState<DayStat[]>(initialStats);
  const [isPending, startTransition] = useTransition();

  function load(id: string, d: number) {
    startTransition(async () => {
      const data = id === 'all'
        ? await getAllCampaignsDailyStats(d)
        : await getCampaignDailyStats(id, d);
      setStats(data);
    });
  }

  function handleCampaignChange(id: string) {
    setSelectedId(id);
    load(id, days);
  }

  function handleDaysChange(d: number) {
    setDays(d);
    load(selectedId, d);
  }

  const totalImp = stats.reduce((s, r) => s + r.impressions, 0);
  const totalClk = stats.reduce((s, r) => s + r.clicks, 0);

  // Per-campaign performance table
  const campaignPerf = campaigns.map(c => ({
    ...c,
    ctr: ctr(c.impressions, c.clicks),
  })).sort((a, b) => b.impressions - a.impressions);

  const csvUrl = selectedId === 'all'
    ? `/api/ads/report?format=csv&days=${days}`
    : `/api/ads/report?format=csv&days=${days}&campaignId=${selectedId}`;

  return (
    <div className="space-y-8">
      {/* Section header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-vp-border pb-5">
        <div>
          <h2 className="text-[14px] font-black uppercase tracking-widest text-vp-text-4">Relatório de Performance</h2>
          <p className="text-[11px] text-vp-text-4 italic font-serif mt-1">Impressões e cliques por dia com granularidade de evento.</p>
        </div>
        <a
          href={csvUrl}
          download
          className="vp-btn text-[11px] font-bold uppercase tracking-widest py-2 px-5 border-vp-accent text-vp-accent hover:bg-vp-accent/10 transition-colors whitespace-nowrap"
        >
          ↓ Exportar CSV
        </a>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Campaign selector */}
        <div className="flex items-center gap-2">
          <label htmlFor="report-campaign" className="text-[10px] font-black uppercase tracking-widest text-vp-text-4 whitespace-nowrap">Campanha</label>
          <select
            id="report-campaign"
            value={selectedId}
            onChange={e => handleCampaignChange(e.target.value)}
            className="vp-input text-[12px] py-1.5 min-w-[200px]"
            title="Selecionar campanha"
          >
            <option value="all">Todas as campanhas</option>
            {campaigns.map(c => (
              <option key={c.id} value={c.id}>{c.name} — {c.client}</option>
            ))}
          </select>
        </div>

        {/* Period selector */}
        <div className="flex items-center gap-1.5">
          {PERIOD_OPTIONS.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleDaysChange(opt.value)}
              className={`text-[11px] font-bold px-3 py-1.5 rounded-sm border transition-all ${
                days === opt.value
                  ? 'border-vp-accent text-vp-accent bg-vp-accent/10'
                  : 'border-vp-border text-vp-text-4 hover:border-vp-text-3 hover:text-vp-text-3'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {isPending && (
          <span className="text-[11px] text-vp-text-4 italic animate-pulse">carregando...</span>
        )}
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#0e0e0d] border border-vp-border p-4">
          <div className="text-[10px] font-black uppercase tracking-widest text-vp-text-4 mb-2">Impressões no período</div>
          <div className="text-[28px] font-black font-display leading-none text-vp-text">
            {totalImp.toLocaleString('pt-BR')}
          </div>
        </div>
        <div className="bg-[#0e0e0d] border border-vp-border p-4">
          <div className="text-[10px] font-black uppercase tracking-widest text-vp-text-4 mb-2">Cliques no período</div>
          <div className="text-[28px] font-black font-display leading-none text-vp-text">
            {totalClk.toLocaleString('pt-BR')}
          </div>
        </div>
        <div className="bg-[#0e0e0d] border border-vp-border p-4">
          <div className="text-[10px] font-black uppercase tracking-widest text-vp-text-4 mb-2">CTR no período</div>
          <div className="text-[28px] font-black font-display leading-none text-vp-accent">
            {ctr(totalImp, totalClk)}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-[#0e0e0d] border border-vp-border p-5">
        <div className="flex items-center gap-5 mb-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-vp-text-4">Evolução diária</span>
          <div className="flex items-center gap-3 ml-auto">
            <span className="flex items-center gap-1.5 text-[10px] text-vp-text-4">
              <span className="w-3 h-2.5 bg-[#3a3a33] rounded-sm inline-block" /> Impressões
            </span>
            <span className="flex items-center gap-1.5 text-[10px] text-vp-text-4">
              <span className="w-3 h-2.5 bg-vp-accent rounded-sm inline-block" /> Cliques
            </span>
          </div>
        </div>
        {stats.every(s => s.impressions === 0 && s.clicks === 0) ? (
          <div className="py-12 text-center text-vp-text-4 italic font-serif text-[13px]">
            Nenhum evento registrado neste período.<br />
            <span className="text-[11px]">Eventos só aparecem a partir de banners cadastrados com AdEvent.</span>
          </div>
        ) : (
          <BarChart data={stats} days={days} />
        )}
      </div>

      {/* Per-campaign performance table */}
      <div className="bg-[#141413] border border-vp-border overflow-hidden">
        <div className="px-5 py-3.5 border-b border-vp-border">
          <h3 className="text-[11px] font-black uppercase tracking-widest text-vp-text-4">Performance por campanha (acumulado)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-vp-border bg-[#0e0e0d]">
                <th className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-vp-text-4">Campanha</th>
                <th className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-vp-text-4">Slot</th>
                <th className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-vp-text-4 text-right">Impressões</th>
                <th className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-vp-text-4 text-right">Cliques</th>
                <th className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-vp-text-4 text-right">CTR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-vp-border/30">
              {campaignPerf.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-vp-text-4 italic font-serif text-[12px]">
                    Nenhuma campanha cadastrada.
                  </td>
                </tr>
              ) : (
                campaignPerf.map((c, i) => {
                  const maxImp = campaignPerf[0].impressions || 1;
                  const pct = (c.impressions / maxImp) * 100;
                  return (
                    <tr key={c.id} className="hover:bg-vp-surface/20 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-[13px] text-vp-text">{c.name}</div>
                        <div className="text-[10px] text-vp-text-4 font-mono uppercase mt-0.5">{c.client}</div>
                        {/* Mini progress bar */}
                        <div className="mt-1.5 h-[2px] bg-vp-border rounded-full overflow-hidden w-full max-w-[160px]">
                          <div className="h-full bg-vp-accent/60 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-[11px] font-mono text-vp-text-3">{c.slot}</span>
                      </td>
                      <td className="px-5 py-3.5 text-right font-mono text-[13px] text-vp-text-2">
                        {c.impressions.toLocaleString('pt-BR')}
                      </td>
                      <td className="px-5 py-3.5 text-right font-mono text-[13px] text-vp-text-2">
                        {c.clicks.toLocaleString('pt-BR')}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <span className={`font-mono text-[13px] font-bold ${i === 0 ? 'text-vp-ok' : 'text-vp-accent'}`}>
                          {c.ctr}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
