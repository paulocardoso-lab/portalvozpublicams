"use client";

import React, { useState } from 'react';
import { Eyebrow } from '@/components/shared/Eyebrow';

export default function AdminAdsPage() {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'slots' | 'reports'>('campaigns');

  const campaigns = [
    { id: '1', name: 'BYD — Dolphin Mini Lançamento', client: 'BYD Brasil', slot: 'Sidebar Top', impressions: 142018, clicks: 1240, ctr: '0.87%', status: 'ACTIVE', endsAt: 'há 2 dias' },
    { id: '2', name: 'Governo de MS — Rota Bioceânica', client: 'Gov MS', slot: 'Top Leaderboard', impressions: 842110, clicks: 5840, ctr: '0.69%', status: 'ACTIVE', endsAt: 'em 14 dias' },
    { id: '3', name: 'Sicredi — Crédito Rural 2026', client: 'Sicredi MS', slot: 'In-Article', impressions: 48212, clicks: 942, ctr: '1.95%', status: 'ACTIVE', endsAt: 'em 5 dias' },
    { id: '4', name: 'Unimed — Plano Família', client: 'Unimed CG', slot: 'Sidebar Bottom', impressions: 128402, clicks: 412, ctr: '0.32%', status: 'EXPIRED', endsAt: 'ontem' },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="font-display text-[32px] lg:text-[42px] font-black leading-tight">
            Gestão de Publicidade.
          </h1>
          <p className="font-serif italic text-[16px] text-vp-text-3 mt-2">
            Campanhas, inventário de slots e relatórios de performance para anunciantes.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="vp-btn text-[12px] font-bold uppercase tracking-widest py-2.5 px-6">
             Ver Inventário
          </button>
          <button className="vp-btn vp-btn-primary text-[12px] font-bold uppercase tracking-widest py-2.5 px-8">
             + Nova Campanha
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-vp-border">
        {[
          { id: 'campaigns', l: 'Campanhas Ativas' },
          { id: 'slots', l: 'Slots & Inventário' },
          { id: 'reports', l: 'Relatórios & Exportação' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`pb-4 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative ${
              activeTab === t.id ? 'text-vp-text' : 'text-vp-text-4 hover:text-vp-text-2'
            }`}
          >
            {t.l}
            {activeTab === t.id && (
              <span className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-vp-accent" />
            )}
          </button>
        ))}
      </div>

      {/* Campaigns Table */}
      {activeTab === 'campaigns' && (
        <div className="vp-panel overflow-hidden bg-[#141413] border border-vp-border">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-vp-border bg-[#0e0e0d]">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-vp-text-4">Campanha / Cliente</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-vp-text-4">Slot</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-vp-text-4 text-right">Impressões</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-vp-text-4 text-right">Cliques</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-vp-text-4 text-right">CTR</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-vp-text-4 text-center">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-vp-text-4">Expira</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-vp-border/30">
                {campaigns.map(c => (
                  <tr key={c.id} className="hover:bg-vp-surface/30 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="font-bold text-[14px] text-vp-text group-hover:text-vp-accent transition-colors">{c.name}</div>
                      <div className="text-[11px] text-vp-text-4 font-mono uppercase mt-1">{c.client}</div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-[12px] font-medium text-vp-text-3">{c.slot}</span>
                    </td>
                    <td className="px-6 py-5 text-right font-mono text-[13px] text-vp-text-2">
                      {c.impressions.toLocaleString()}
                    </td>
                    <td className="px-6 py-5 text-right font-mono text-[13px] text-vp-text-2">
                      {c.clicks.toLocaleString()}
                    </td>
                    <td className="px-6 py-5 text-right font-mono text-[13px] text-vp-accent font-bold">
                      {c.ctr}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm ${
                        c.status === 'ACTIVE' ? 'bg-vp-ok/10 text-vp-ok border border-vp-ok/20' : 'bg-vp-urgent/10 text-vp-urgent border border-vp-urgent/20'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-[11px] text-vp-text-4 italic font-serif">{c.endsAt}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="vp-panel p-6 bg-[#0e0e0d] border border-vp-border">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-vp-text-4 mb-4">Alcance Total (30d)</h4>
          <div className="text-[32px] font-black font-display leading-none text-vp-text">2.4M</div>
          <p className="text-[11px] text-vp-ok font-bold mt-2">+12.4% vs mês anterior</p>
        </div>
        <div className="vp-panel p-6 bg-[#0e0e0d] border border-vp-border">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-vp-text-4 mb-4">CTR Médio da Rede</h4>
          <div className="text-[32px] font-black font-display leading-none text-vp-text">0.74%</div>
          <p className="text-[11px] text-vp-text-4 italic font-serif mt-2">Benchmark mercado: 0.5%</p>
        </div>
        <div className="vp-panel p-6 bg-[#0e0e0d] border border-vp-border">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-vp-text-4 mb-4">Slots Disponíveis</h4>
          <div className="text-[32px] font-black font-display leading-none text-vp-text">4 / 12</div>
          <p className="text-[11px] text-vp-urgent font-bold mt-2">85% ocupação p/ Junho</p>
        </div>
      </div>
    </div>
  );
}
