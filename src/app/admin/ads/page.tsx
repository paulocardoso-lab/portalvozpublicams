import React from "react";
import prisma from "@/lib/prisma";
import { createCampaign, updateCampaignStatus, deleteCampaign, AD_SLOTS } from "./actions";

export const dynamic = "force-dynamic";

const STATUS_COLORS: Record<string, string> = {
  ativa: "text-vp-ok border-vp-ok bg-vp-ok/10",
  pausada: "text-vp-text-3 border-vp-text-3 bg-vp-text-3/10",
  encerrada: "text-vp-urgent border-vp-urgent bg-vp-urgent/10",
  agendada: "text-vp-accent border-vp-accent bg-vp-accent/10",
};

const today = () => new Date();

export default async function AdminAdsPage() {
  const campaigns = await prisma.campaign.findMany({
    orderBy: { startsAt: "desc" },
  });

  const active = campaigns.filter((c) => c.status === "ativa");
  const totalImpressions = campaigns.reduce((s, c) => s + c.impressions, 0);
  const totalClicks = campaigns.reduce((s, c) => s + c.clicks, 0);
  const globalCTR = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : "0,00";

  // Slot occupancy: count active campaigns per slot
  const slotOccupancy = AD_SLOTS.map((slot) => ({
    name: slot,
    count: active.filter((c) => c.slot === slot).length,
  }));

  return (
    <div className="max-w-[1200px]">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold mb-1">Banners & Publicidade</h1>
        <p className="text-vp-text-3 text-[13px]">
          {active.length} campanhas ativas · {campaigns.length} total
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Campanhas ativas", value: active.length },
          { label: "Impressões totais", value: totalImpressions.toLocaleString("pt-BR") },
          { label: "Cliques totais", value: totalClicks.toLocaleString("pt-BR") },
          { label: "CTR médio", value: `${globalCTR}%` },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-[#141413] border border-vp-border p-4 rounded">
            <div className="text-[28px] font-bold font-mono leading-none">{kpi.value}</div>
            <div className="text-[11px] text-vp-text-3 uppercase tracking-wider mt-1.5">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Slot overview */}
      <div className="mb-6">
        <h3 className="text-[11px] uppercase tracking-[0.12em] font-semibold text-vp-text-3 mb-2.5">Slots de anúncio</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {slotOccupancy.map((slot) => (
            <div key={slot.name} className="bg-[#141413] border border-vp-border p-3.5 rounded">
              <div className="text-[12px] font-semibold mb-1 leading-tight">{slot.name}</div>
              <div className={`text-[22px] font-bold font-mono mt-2 ${slot.count > 0 ? "text-vp-ok" : "text-vp-text-4"}`}>
                {slot.count}
              </div>
              <div className="text-[11px] text-vp-text-3">{slot.count === 0 ? "disponível" : `campanha${slot.count > 1 ? "s" : ""} ativa${slot.count > 1 ? "s" : ""}`}</div>
            </div>
          ))}
        </div>
      </div>

      {/* New campaign form */}
      <div className="bg-[#141413] border border-vp-border p-5 rounded mb-6">
        <h3 className="text-[13px] font-semibold mb-4 uppercase tracking-wider text-vp-text-3">Nova Campanha</h3>
        <form action={createCampaign} className="grid gap-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <label className="grid gap-1">
              <span className="text-[11px] text-vp-text-3 uppercase font-semibold">Nome da campanha *</span>
              <input name="name" className="vp-input text-[13px]" placeholder="BYD — ATTO 8 (mai/2026)" required />
            </label>
            <label className="grid gap-1">
              <span className="text-[11px] text-vp-text-3 uppercase font-semibold">Anunciante / Cliente *</span>
              <input name="client" className="vp-input text-[13px]" placeholder="Agência X / Direto" required />
            </label>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            <label className="grid gap-1">
              <span className="text-[11px] text-vp-text-3 uppercase font-semibold">Slot *</span>
              <select name="slot" className="vp-input text-[13px]" required>
                {AD_SLOTS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-1">
              <span className="text-[11px] text-vp-text-3 uppercase font-semibold">Início *</span>
              <input name="startsAt" type="date" className="vp-input text-[13px] font-mono" required />
            </label>
            <label className="grid gap-1">
              <span className="text-[11px] text-vp-text-3 uppercase font-semibold">Fim *</span>
              <input name="endsAt" type="date" className="vp-input text-[13px] font-mono" required />
            </label>
          </div>
          <label className="grid gap-1">
            <span className="text-[11px] text-vp-text-3 uppercase font-semibold">URL do criativo (imagem ou HTML)</span>
            <input name="creative" className="vp-input text-[13px] font-mono" placeholder="https://cdn.vozpublicams.com.br/ads/banner-byd.jpg" />
          </label>
          <div className="flex justify-end pt-1">
            <button type="submit" className="vp-btn vp-btn-primary px-6 py-2.5 text-[13px] font-semibold">
              + Criar campanha
            </button>
          </div>
        </form>
      </div>

      {/* Campaigns table */}
      <div className="bg-[#141413] border border-vp-border rounded overflow-hidden overflow-x-auto">
        <div className="px-5 py-3.5 border-b border-vp-border flex items-center justify-between">
          <h3 className="text-[13px] font-semibold">Campanhas</h3>
          <span className="text-[11px] text-vp-text-3">{campaigns.length} total</span>
        </div>
        {campaigns.length === 0 ? (
          <div className="px-5 py-10 text-center text-vp-text-3 italic">
            Nenhuma campanha cadastrada. Use o formulário acima para criar a primeira.
          </div>
        ) : (
          <table className="w-full text-left text-[12px] min-w-[900px]">
            <thead>
              <tr className="border-b border-vp-border text-[10px] text-vp-text-3 uppercase tracking-wider">
                <th className="px-4 py-3">Campanha</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Slot</th>
                <th className="px-4 py-3 text-right">Impressões</th>
                <th className="px-4 py-3 text-right">Cliques</th>
                <th className="px-4 py-3 text-right">CTR</th>
                <th className="px-4 py-3">Período</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-vp-border">
              {campaigns.map((c) => {
                const ctr = c.impressions > 0 ? ((c.clicks / c.impressions) * 100).toFixed(2) : "0.00";
                const isExpired = new Date(c.endsAt) < today();
                const statusColor = STATUS_COLORS[c.status] ?? STATUS_COLORS.pausada;
                return (
                  <tr key={c.id} className="hover:bg-vp-surface/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-[13px] truncate max-w-[180px]">{c.name}</div>
                      {isExpired && c.status === "ativa" && (
                        <div className="text-[10px] text-vp-urgent mt-0.5">⚠ Expirada</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-vp-text-2">{c.client}</td>
                    <td className="px-4 py-3 text-vp-text-3 text-[11px]">{c.slot}</td>
                    <td className="px-4 py-3 font-mono text-right">{c.impressions.toLocaleString("pt-BR")}</td>
                    <td className="px-4 py-3 font-mono text-right">{c.clicks.toLocaleString("pt-BR")}</td>
                    <td className="px-4 py-3 font-mono text-right">{ctr}%</td>
                    <td className="px-4 py-3 font-mono text-[11px] text-vp-text-3 whitespace-nowrap">
                      {c.startsAt.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}
                      {" → "}
                      {c.endsAt.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${statusColor}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5 flex-wrap">
                        {c.status === "ativa" ? (
                          <form action={updateCampaignStatus.bind(null, c.id, "pausada")}>
                            <button type="submit" className="vp-btn text-[10px] py-0.5 px-2">Pausar</button>
                          </form>
                        ) : c.status === "pausada" ? (
                          <form action={updateCampaignStatus.bind(null, c.id, "ativa")}>
                            <button type="submit" className="vp-btn text-[10px] py-0.5 px-2 text-vp-ok border-vp-ok hover:bg-vp-ok/10">Ativar</button>
                          </form>
                        ) : null}
                        <form action={deleteCampaign.bind(null, c.id)}>
                          <button type="submit" className="vp-btn text-[10px] py-0.5 px-2 text-vp-urgent border-vp-urgent hover:bg-vp-urgent/10">Excluir</button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
