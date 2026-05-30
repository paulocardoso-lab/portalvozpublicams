import React from 'react';
import { getCampaigns } from './actions';
import { CampaignManager } from './CampaignManager';

export const dynamic = 'force-dynamic';

export default async function AdminAdsPage() {
  const campaigns = await getCampaigns();

  // Calcular estatísticas básicas
  const totalImpressions = campaigns.reduce((acc, c) => acc + c.impressions, 0);
  const totalClicks = campaigns.reduce((acc, c) => acc + c.clicks, 0);
  const avgCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
  const activeCount = campaigns.filter(c => c.status === 'ACTIVE').length;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="font-display text-[32px] lg:text-[42px] font-black leading-tight">
            Gestão de Publicidade.
          </h1>
          <p className="font-serif italic text-[16px] text-vp-text-3 mt-2">
            Campanhas reais, inventário de slots e relatórios de performance.
          </p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="vp-panel p-6 bg-[#0e0e0d] border border-vp-border">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-vp-text-4 mb-4">Alcance Total</h4>
          <div className="text-[32px] font-black font-display leading-none text-vp-text">
            {totalImpressions > 1000000 ? `${(totalImpressions / 1000000).toFixed(1)}M` : totalImpressions.toLocaleString()}
          </div>
          <p className="text-[11px] text-vp-text-4 italic font-serif mt-2">Impressões acumuladas em todas as campanhas</p>
        </div>
        <div className="vp-panel p-6 bg-[#0e0e0d] border border-vp-border">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-vp-text-4 mb-4">CTR Médio</h4>
          <div className="text-[32px] font-black font-display leading-none text-vp-text">{avgCtr.toFixed(2)}%</div>
          <p className="text-[11px] text-vp-text-4 italic font-serif mt-2">Taxa de clique sobre visualizações</p>
        </div>
        <div className="vp-panel p-6 bg-[#0e0e0d] border border-vp-border">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-vp-text-4 mb-4">Campanhas Ativas</h4>
          <div className="text-[32px] font-black font-display leading-none text-vp-text">{activeCount}</div>
          <p className="text-[11px] text-vp-ok font-bold mt-2">Ocupando o inventário do portal</p>
        </div>
      </div>

      <CampaignManager initialCampaigns={campaigns} />
    </div>
  );
}
