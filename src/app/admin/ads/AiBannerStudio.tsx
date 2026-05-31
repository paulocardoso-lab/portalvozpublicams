'use client';

import React, { useState, useRef } from 'react';

interface SlotDef { label: string; w: number; h: number; previewH: number }

const SLOTS: Record<string, SlotDef> = {
  'leaderboard':    { label: 'Leaderboard topo',       w: 970, h: 90,  previewH: 44  },
  'sidebar-top':    { label: 'Lateral superior',        w: 300, h: 250, previewH: 140 },
  'sidebar-bottom': { label: 'Lateral inferior',        w: 300, h: 250, previewH: 140 },
  'in-article':     { label: 'Dentro da matéria',       w: 600, h: 120, previewH: 68  },
  'mobile-top':     { label: 'Mobile topo',             w: 320, h: 50,  previewH: 36  },
  'mobile-inline':  { label: 'Mobile entre blocos',     w: 300, h: 250, previewH: 140 },
  'sticky-bottom':  { label: 'Mobile sticky',           w: 320, h: 50,  previewH: 36  },
  'native-feed':    { label: 'Nativo in-feed',          w: 600, h: 200, previewH: 110 },
};

interface GenerateResult {
  url: string;
  copy: { headline: string; subline: string; cta: string; bg: string; fg: string; accent: string };
  scrape: { title: string; brandName: string; description: string };
  dims: { w: number; h: number };
}

interface AiBannerStudioProps {
  onUse: (url: string, slot: string, brandName: string) => void;
  onClose: () => void;
  initialSlot?: string;
}

type Phase = 'input' | 'generating' | 'result' | 'error';

export function AiBannerStudio({ onUse, onClose, initialSlot = 'sidebar-top' }: AiBannerStudioProps) {
  const [phase, setPhase]       = useState<Phase>('input');
  const [slot, setSlot]         = useState(initialSlot);
  const [sourceUrl, setSourceUrl] = useState('');
  const [prompt, setPrompt]     = useState('');
  const [result, setResult]     = useState<GenerateResult | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [history, setHistory]   = useState<GenerateResult[]>([]);
  const promptRef               = useRef<HTMLTextAreaElement>(null);

  const slotDef = SLOTS[slot];

  async function generate() {
    setPhase('generating');
    setErrorMsg('');
    try {
      const res = await fetch('/api/ads/generate-banner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceUrl: sourceUrl.trim() || undefined, prompt: prompt.trim() || undefined, slot }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
        throw new Error(err.error || `HTTP ${res.status}`);
      }
      const data: GenerateResult = await res.json();
      setResult(data);
      setHistory(prev => [data, ...prev].slice(0, 5));
      setPhase('result');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Erro desconhecido.');
      setPhase('error');
    }
  }

  function handleUse() {
    if (!result) return;
    onUse(result.url, slot, result.scrape.brandName || 'AI Banner');
    onClose();
  }

  const canGenerate = phase !== 'generating' && (sourceUrl.trim() || prompt.trim());

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-[60] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0e0e0d] border border-vp-border w-full max-w-[780px] shadow-2xl my-8 rounded-sm">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-vp-border">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-vp-accent text-[16px]">✦</span>
              <h3 className="text-[18px] font-display font-bold">Estúdio de Banner IA</h3>
            </div>
            <p className="text-[12px] text-vp-text-3 font-serif italic mt-0.5">
              Cole uma URL, descreva o banner — a IA gera o criativo no tamanho exato do slot.
            </p>
          </div>
          <button type="button" aria-label="Fechar" onClick={onClose}
            className="text-vp-text-4 hover:text-vp-text transition-colors text-[20px] leading-none">✕</button>
        </div>

        <div className="p-8 space-y-6">

          {/* ── Slot selector ── */}
          <div className="grid grid-cols-[1fr_auto] gap-4 items-end">
            <div className="space-y-1.5">
              <label htmlFor="ai-slot" className="text-[10px] font-black uppercase tracking-widest text-vp-text-4">
                Slot de destino
              </label>
              <select id="ai-slot" value={slot} onChange={e => setSlot(e.target.value)}
                className="vp-input w-full" title="Slot do banner">
                {Object.entries(SLOTS).map(([k, v]) => (
                  <option key={k} value={k}>{v.label} ({v.w}×{v.h}px)</option>
                ))}
              </select>
            </div>
            <div className="text-[11px] font-mono text-vp-text-4 pb-2 whitespace-nowrap">
              {slotDef.w} × {slotDef.h} px
            </div>
          </div>

          {/* ── URL input ── */}
          <div className="space-y-1.5">
            <label htmlFor="ai-url" className="text-[10px] font-black uppercase tracking-widest text-vp-text-4">
              URL do anunciante <span className="font-normal normal-case">(opcional — extrai marca, logo e cores)</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-vp-text-4 text-[13px] select-none">↗</span>
              <input id="ai-url" type="url" value={sourceUrl}
                onChange={e => setSourceUrl(e.target.value)}
                className="vp-input w-full pl-8 font-mono text-[12px]"
                placeholder="https://anunciante.com.br"
              />
            </div>
          </div>

          {/* ── Prompt ── */}
          <div className="space-y-1.5">
            <label htmlFor="ai-prompt" className="text-[10px] font-black uppercase tracking-widest text-vp-text-4">
              Descrição do banner <span className="font-normal normal-case">(opcional — descreva estilo, mensagem, cores)</span>
            </label>
            <textarea id="ai-prompt" ref={promptRef} value={prompt}
              onChange={e => setPrompt(e.target.value)}
              rows={3}
              className="vp-input w-full resize-none text-[13px] leading-relaxed"
              placeholder={`Ex: "Banner de fundo escuro para promoção de imóveis, destaque 'Compre seu apartamento', paleta bege e dourado, CTA: Simule agora"`}
            />
            {/* Quick prompt suggestions */}
            <div className="flex flex-wrap gap-1.5 mt-1">
              {[
                'Fundo escuro, texto branco, moderno',
                'Cores da marca, botão laranja',
                'Minimalista, produto em destaque',
                'Promoção verão, cores vibrantes',
              ].map(s => (
                <button key={s} type="button"
                  onClick={() => setPrompt(s)}
                  className="text-[10px] px-2 py-0.5 border border-vp-border rounded-sm text-vp-text-3 hover:border-vp-accent hover:text-vp-accent transition-colors">
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* ── Generate button ── */}
          <button
            type="button"
            onClick={generate}
            disabled={!canGenerate}
            className="w-full py-3.5 vp-btn vp-btn-primary font-bold text-[13px] uppercase tracking-widest disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2.5"
          >
            {phase === 'generating' ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Gerando banner — scraping + IA + render...
              </>
            ) : (
              <>✦ Gerar Banner com IA</>
            )}
          </button>

          {/* ── Error ── */}
          {phase === 'error' && (
            <div className="px-4 py-3 border border-vp-urgent/30 bg-vp-urgent/5 rounded-sm text-[13px] text-vp-urgent font-bold">
              ✕ {errorMsg}
            </div>
          )}

          {/* ── Result preview ── */}
          {phase === 'result' && result && (
            <div className="space-y-4 border-t border-vp-border pt-6">
              <div className="flex items-center justify-between">
                <div className="text-[11px] font-black uppercase tracking-widest text-vp-text-4">
                  Preview — {result.dims.w}×{result.dims.h}px
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-vp-ok font-bold">✓ Criativo gerado</span>
                </div>
              </div>

              {/* Banner preview */}
              <div
                className="w-full overflow-hidden border border-vp-border rounded-sm bg-[#111] flex items-center justify-center"
                style={{ height: Math.max(slotDef.previewH * 1.5, 80) }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={result.url}
                  alt="Banner gerado"
                  className="max-w-full max-h-full object-contain"
                  style={{ maxHeight: Math.max(slotDef.previewH * 1.5, 80) }}
                />
              </div>

              {/* Copy details */}
              <div className="grid grid-cols-3 gap-3 text-[11px]">
                <div className="bg-vp-surface p-3 rounded-sm border border-vp-border">
                  <div className="text-[9px] font-black uppercase tracking-widest text-vp-text-4 mb-1">Headline</div>
                  <div className="font-bold text-vp-text">{result.copy.headline}</div>
                </div>
                <div className="bg-vp-surface p-3 rounded-sm border border-vp-border">
                  <div className="text-[9px] font-black uppercase tracking-widest text-vp-text-4 mb-1">Subline</div>
                  <div className="text-vp-text-2">{result.copy.subline || '—'}</div>
                </div>
                <div className="bg-vp-surface p-3 rounded-sm border border-vp-border">
                  <div className="text-[9px] font-black uppercase tracking-widest text-vp-text-4 mb-1">CTA</div>
                  <div className="font-bold" style={{ color: result.copy.accent }}>{result.copy.cta}</div>
                </div>
              </div>

              {/* Color palette */}
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-black uppercase tracking-widest text-vp-text-4">Paleta:</span>
                {[result.copy.bg, result.copy.fg, result.copy.accent].map((c, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded-sm border border-vp-border/50" style={{ background: c }} />
                    <span className="text-[9px] font-mono text-vp-text-4">{c}</span>
                  </div>
                ))}
              </div>

              {/* Brand info */}
              {result.scrape.brandName && (
                <div className="text-[11px] text-vp-text-4 italic font-serif">
                  Extraído de: <span className="text-vp-text-2 not-italic font-bold">{result.scrape.brandName}</span>
                  {result.scrape.title && ` — ${result.scrape.title.substring(0, 60)}`}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={generate}
                  className="vp-btn flex-1 py-2.5 text-[12px] font-bold border-vp-border hover:border-vp-accent hover:text-vp-accent transition-colors flex items-center justify-center gap-2">
                  ↺ Regenerar
                </button>
                <button type="button" onClick={handleUse}
                  className="vp-btn vp-btn-primary flex-1 py-2.5 text-[12px] font-bold flex items-center justify-center gap-2">
                  ✓ Usar este banner
                </button>
              </div>
            </div>
          )}

          {/* ── History ── */}
          {history.length > 1 && (
            <div className="border-t border-vp-border pt-4">
              <div className="text-[9px] font-black uppercase tracking-widest text-vp-text-4 mb-2">Versões anteriores</div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {history.slice(1).map((h, i) => (
                  <button key={i} type="button"
                    onClick={() => { setResult(h); setPhase('result'); }}
                    className="flex-shrink-0 border border-vp-border rounded-sm overflow-hidden hover:border-vp-accent transition-colors"
                    style={{ width: 80, height: 40 }}
                    title={`Versão ${i + 2}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={h.url} alt={`v${i + 2}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
