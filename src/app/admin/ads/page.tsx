import React from 'react';
import { getCampaigns, getAllCampaignsDailyStats } from './actions';
import { CampaignManager } from './CampaignManager';
import { AdsReportPanel } from './AdsReportPanel';

export const dynamic = 'force-dynamic';

export default async function AdminAdsPage() {
  const [campaigns, dailyStats] = await Promise.all([
    getCampaigns(),
    getAllCampaignsDailyStats(30),
  ]);

  const totalImpressions = campaigns.reduce((acc, c) => acc + c.impressions, 0);
  const totalClicks = campaigns.reduce((acc, c) => acc + c.clicks, 0);
  const avgCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
  const activeCount = campaigns.filter(c => c.status === 'ACTIVE').length;
  const now = new Date();
  const expiringCount = campaigns.filter(c =>
    c.status === 'ACTIVE' &&
    c.endsAt > now &&
    (c.endsAt.getTime() - now.getTime()) < 7 * 24 * 60 * 60 * 1000
  ).length;

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="font-display text-[32px] lg:text-[42px] font-black leading-tight">
            Gestão de Publicidade.
          </h1>
          <p className="font-serif italic text-[16px] text-vp-text-3 mt-2">
            Campanhas, inventário de slots, performance e relatórios.
          </p>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="vp-panel p-5 bg-[#0e0e0d] border border-vp-border">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-vp-text-4 mb-3">Alcance Total</h4>
          <div className="text-[30px] font-black font-display leading-none text-vp-text">
            {totalImpressions > 1_000_000
              ? `${(totalImpressions / 1_000_000).toFixed(1)}M`
              : totalImpressions.toLocaleString('pt-BR')}
          </div>
          <p className="text-[11px] text-vp-text-4 italic font-serif mt-2">Impressões acumuladas</p>
        </div>

        <div className="vp-panel p-5 bg-[#0e0e0d] border border-vp-border">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-vp-text-4 mb-3">CTR Médio</h4>
          <div className="text-[30px] font-black font-display leading-none text-vp-accent">
            {avgCtr.toFixed(2)}%
          </div>
          <p className="text-[11px] text-vp-text-4 italic font-serif mt-2">Cliques sobre visualizações</p>
        </div>

        <div className="vp-panel p-5 bg-[#0e0e0d] border border-vp-border">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-vp-text-4 mb-3">Campanhas Ativas</h4>
          <div className="text-[30px] font-black font-display leading-none text-vp-ok">
            {activeCount}
          </div>
          <p className="text-[11px] text-vp-text-4 italic font-serif mt-2">Ocupando o inventário</p>
        </div>

        <div className="vp-panel p-5 bg-[#0e0e0d] border border-vp-border">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-vp-text-4 mb-3">Expirando em breve</h4>
          <div className={`text-[30px] font-black font-display leading-none ${expiringCount > 0 ? 'text-vp-urgent' : 'text-vp-text'}`}>
            {expiringCount}
          </div>
          <p className="text-[11px] text-vp-text-4 italic font-serif mt-2">Campanhas vencem em 7 dias</p>
        </div>
      </div>

      {/* Report panel */}
      <AdsReportPanel campaigns={campaigns} initialStats={dailyStats} />

      {/* Campaign manager */}
      <CampaignManager initialCampaigns={campaigns} />
    </div>
  );
}
