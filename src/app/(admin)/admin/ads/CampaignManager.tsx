'use client';

import React, { useState } from 'react';
import { createCampaign, deleteCampaign, updateCampaignStatus } from './actions';
import { CampaignStatus } from '@prisma/client';

interface Campaign {
  id: string;
  name: string;
  client: string;
  slot: string;
  creative: string;
  impressions: number;
  clicks: number;
  startsAt: Date;
  endsAt: Date;
  status: CampaignStatus;
}

export function CampaignManager({ initialCampaigns }: { initialCampaigns: Campaign[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await createCampaign(formData);
      setIsModalOpen(false);
    } catch (err: any) {
      alert(err.message || "Erro ao criar campanha");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-[14px] font-black uppercase tracking-widest text-vp-text-4">Campanhas Ativas</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="vp-btn vp-btn-primary text-[11px] font-bold uppercase tracking-widest py-2 px-5"
        >
          + Nova Campanha
        </button>
      </div>

      <div className="vp-panel overflow-hidden bg-[#141413] border border-vp-border">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-vp-border bg-[#0e0e0d]">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-vp-text-4">Campanha / Cliente</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-vp-text-4">Slot</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-vp-text-4 text-right">Impressões</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-vp-text-4 text-right">Cliques</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-vp-text-4 text-center">Status</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-vp-text-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-vp-border/30">
              {initialCampaigns.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-vp-text-4 italic font-serif">
                    Nenhuma campanha cadastrada.
                  </td>
                </tr>
              ) : (
                initialCampaigns.map(c => (
                  <tr key={c.id} className="hover:bg-vp-surface/30 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="font-bold text-[14px] text-vp-text group-hover:text-vp-accent transition-colors">{c.name}</div>
                      <div className="text-[11px] text-vp-text-4 font-mono uppercase mt-1">{c.client}</div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-[12px] font-medium text-vp-text-3 font-mono">{c.slot}</span>
                    </td>
                    <td className="px-6 py-5 text-right font-mono text-[13px] text-vp-text-2">
                      {c.impressions.toLocaleString()}
                    </td>
                    <td className="px-6 py-5 text-right font-mono text-[13px] text-vp-text-2">
                      {c.clicks.toLocaleString()}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <button 
                        onClick={() => updateCampaignStatus(c.id, c.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE')}
                        className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm border transition-all ${
                          c.status === 'ACTIVE' 
                            ? 'bg-vp-ok/10 text-vp-ok border-vp-ok/20 hover:bg-vp-ok/20' 
                            : 'bg-vp-text-4/10 text-vp-text-4 border-vp-text-4/20 hover:bg-vp-text-4/20'
                        }`}
                      >
                        {c.status}
                      </button>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button 
                        onClick={() => { if(confirm('Excluir campanha?')) deleteCampaign(c.id) }}
                        className="text-vp-text-4 hover:text-vp-urgent transition-colors"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#141413] border border-vp-border w-full max-w-[600px] p-8 shadow-2xl">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-[20px] font-display font-bold">Nova Campanha Publicitária</h3>
                <p className="text-[12px] text-vp-text-3 font-serif italic mt-1">Defina os detalhes e o criativo do banner.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-vp-text-4 hover:text-vp-text">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-vp-text-4">Nome da Campanha</label>
                  <input name="name" className="vp-input w-full" placeholder="Ex: Campanha Verão 2026" required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-vp-text-4">Cliente / Anunciante</label>
                  <input name="client" className="vp-input w-full" placeholder="Ex: Banco do Brasil" required />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="slot-select" className="text-[10px] font-black uppercase tracking-widest text-vp-text-4">Slot (Posição)</label>
                <select id="slot-select" name="slot" className="vp-input w-full" required title="Selecione o slot de anúncio">
                  <option value="sidebar-top">Lateral Superior (300x250)</option>
                  <option value="leaderboard">Topo Leaderboard (728x90)</option>
                  <option value="in-article">Dentro da Matéria (600x120)</option>
                  <option value="sidebar-bottom">Lateral Inferior (300x250)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="image-file" className="text-[10px] font-black uppercase tracking-widest text-vp-text-4">Upload do Banner</label>
                  <input id="image-file" name="imageFile" type="file" accept="image/*" className="vp-input w-full text-[11px] pt-1.5" title="Selecione um arquivo de imagem para o banner" />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="creative-url" className="text-[10px] font-black uppercase tracking-widest text-vp-text-4">Ou URL da Imagem</label>
                  <input id="creative-url" name="creative" className="vp-input w-full font-mono text-[12px]" placeholder="https://..." title="Ou insira uma URL direta para a imagem" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="starts-at" className="text-[10px] font-black uppercase tracking-widest text-vp-text-4">Data de Início</label>
                  <input id="starts-at" name="startsAt" type="date" className="vp-input w-full" required title="Data de início da veiculação" />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="ends-at" className="text-[10px] font-black uppercase tracking-widest text-vp-text-4">Data de Término</label>
                  <input id="ends-at" name="endsAt" type="date" className="vp-input w-full" required title="Data de término da veiculação" />
                </div>
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
                  {loading ? 'Salvando...' : 'Ativar Campanha'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
