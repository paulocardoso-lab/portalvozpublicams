'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { createCampaign, deleteCampaign, updateCampaignStatus } from './actions';
import { CampaignStatus } from '@prisma/client';
import { AiBannerStudio } from './AiBannerStudio';

interface Campaign {
  id: string;
  name: string;
  client: string;
  slot: string;
  creative: string;
  targetUrl: string;
  impressions: number;
  clicks: number;
  weight: number;
  startsAt: Date;
  endsAt: Date;
  status: CampaignStatus;
}

// ── Slot definitions ──────────────────────────────────────────────────────────

interface SlotDef {
  label: string;
  w: number;
  h: number;
  tolerance: number; // % tolerance on ratio check
  previewH: number;  // px height for preview box
  where: string;     // descrição contextual de onde aparece no site
  device: 'desktop' | 'mobile' | 'ambos';
  maxW: number;      // max-width aplicado no AdSlot (px)
}

const SLOTS: Record<string, SlotDef> = {
  'leaderboard':    { label: 'Leaderboard topo',    w: 970, h: 90,  tolerance: 15, previewH: 44,  where: 'Logo abaixo do cabeçalho, na home — centralizado em 970px', device: 'desktop', maxW: 970 },
  'sidebar-top':    { label: 'Lateral superior',    w: 300, h: 250, tolerance: 10, previewH: 140, where: 'Topo da coluna lateral direita (home e matérias)', device: 'desktop', maxW: 300 },
  'sidebar-bottom': { label: 'Lateral inferior',    w: 300, h: 250, tolerance: 10, previewH: 140, where: 'Base da coluna lateral direita (home e matérias)', device: 'desktop', maxW: 300 },
  'in-article':     { label: 'Dentro da matéria',   w: 600, h: 120, tolerance: 15, previewH: 68,  where: 'Inserido após o 3º parágrafo do corpo da matéria', device: 'desktop', maxW: 600 },
  'mobile-top':     { label: 'Mobile topo',         w: 320, h: 50,  tolerance: 15, previewH: 36,  where: 'Topo da home no celular, abaixo do cabeçalho', device: 'mobile', maxW: 320 },
  'mobile-inline':  { label: 'Mobile entre blocos', w: 300, h: 250, tolerance: 10, previewH: 140, where: 'Entre os blocos de notícia na home mobile e em matérias', device: 'mobile', maxW: 300 },
  'sticky-bottom':  { label: 'Mobile sticky',       w: 320, h: 50,  tolerance: 15, previewH: 36,  where: 'Barra fixa no rodapé do celular (dismissível)', device: 'mobile', maxW: 320 },
  'native-feed':    { label: 'Nativo in-feed',      w: 600, h: 200, tolerance: 10, previewH: 110, where: 'Card nativo inserido no feed de notícias mobile', device: 'mobile', maxW: 600 },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function ctr(impressions: number, clicks: number) {
  if (!impressions) return '—';
  return ((clicks / impressions) * 100).toFixed(2) + '%';
}

function slotLabel(slot: string) {
  const def = SLOTS[slot];
  return def ? `${def.label} (${def.w}×${def.h})` : slot;
}

interface ImageMeta { w: number; h: number; src: string }
interface CropState { zoom: number; x: number; y: number }

function checkDimensions(meta: ImageMeta, slot: string): 'ok' | 'warn' | 'error' {
  const def = SLOTS[slot];
  if (!def) return 'ok';
  const targetRatio = def.w / def.h;
  const actualRatio = meta.w / meta.h;
  const diff = Math.abs(targetRatio - actualRatio) / targetRatio * 100;
  if (diff <= def.tolerance) return 'ok';
  if (diff <= def.tolerance * 2.5) return 'warn';
  return 'error';
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => res(reader.result as string);
    reader.onerror = rej;
    reader.readAsDataURL(file);
  });
}

function measureImage(src: string): Promise<ImageMeta> {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => res({ w: img.naturalWidth, h: img.naturalHeight, src });
    img.onerror = rej;
    img.src = src;
  });
}

function createFittedBannerDataUrl(
  src: string,
  slot: string,
  crop: CropState,
): Promise<string> {
  return new Promise((res, rej) => {
    const def = SLOTS[slot];
    if (!def) {
      res(src);
      return;
    }

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = def.w;
      canvas.height = def.h;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        rej(new Error('Canvas indisponível.'));
        return;
      }

      ctx.fillStyle = '#111111';
      ctx.fillRect(0, 0, def.w, def.h);

      const baseScale = Math.max(def.w / img.naturalWidth, def.h / img.naturalHeight);
      const scale = baseScale * crop.zoom;
      const drawW = img.naturalWidth * scale;
      const drawH = img.naturalHeight * scale;
      const maxX = Math.max(0, (drawW - def.w) / 2);
      const maxY = Math.max(0, (drawH - def.h) / 2);
      const dx = (def.w - drawW) / 2 + crop.x * maxX;
      const dy = (def.h - drawH) / 2 + crop.y * maxY;

      ctx.drawImage(img, dx, dy, drawW, drawH);
      res(canvas.toDataURL('image/webp', 0.75));
    };
    img.onerror = () => rej(new Error('Não foi possível carregar a imagem.'));
    img.src = src;
  });
}

// ── DimensionBadge ─────────────────────────────────────────────────────────

function DimensionBadge({ meta, slot }: { meta: ImageMeta; slot: string }) {
  const def = SLOTS[slot];
  const status = checkDimensions(meta, slot);
  const exact = def && meta.w === def.w && meta.h === def.h;

  const color =
    status === 'ok'    ? 'text-vp-ok border-vp-ok/30 bg-vp-ok/10' :
    status === 'warn'  ? 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10' :
                         'text-vp-urgent border-vp-urgent/30 bg-vp-urgent/10';

  const icon = status === 'ok' ? '✓' : status === 'warn' ? '⚠' : '✕';
  const hint =
    status === 'ok'   ? (exact ? 'Dimensões exatas' : 'Proporção compatível') :
    status === 'warn' ? 'Proporção levemente diferente — pode aparecer distorcido' :
                        `Proporção incompatível. Recomendado: ${def?.w}×${def?.h}px`;

  return (
    <div className={`flex items-center gap-2 px-3 py-2 border rounded-sm text-[11px] font-bold ${color}`}>
      <span className="text-[14px] leading-none">{icon}</span>
      <div>
        <span className="font-mono">{meta.w}×{meta.h}px</span>
        {def && <span className="ml-1.5 font-normal opacity-70">· recomendado {def.w}×{def.h}px</span>}
      </div>
      <span className="ml-auto font-normal opacity-80 text-[10px] max-w-[180px] text-right leading-tight">{hint}</span>
    </div>
  );
}

// ── BannerPreview ──────────────────────────────────────────────────────────

function BannerPreview({ src, slot, label }: { src: string; slot: string; label: string }) {
  const def = SLOTS[slot];
  const previewH = def?.previewH ?? 90;

  return (
    <div className="space-y-2">
      <div className="text-[10px] font-black uppercase tracking-widest text-vp-text-4">
        Preview — {slotLabel(slot)}
      </div>
      {/* Simulates the real slot proportions within a fixed container */}
      <div
        className="relative w-full bg-vp-surface border border-vp-border rounded-sm overflow-hidden flex items-center justify-center"
        style={{ height: previewH }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={label || 'Preview do banner'}
          className="max-w-full max-h-full object-contain"
          style={{ height: previewH }}
        />
        {/* "Publicidade" label like real slot */}
        <span className="absolute top-1 left-1 text-[7px] font-black uppercase tracking-widest text-vp-text-4/60 select-none">
          Publicidade
        </span>
      </div>
      {/* Slot size indicator */}
      {def && (
        <div className="text-[9px] font-mono text-vp-text-4 text-right">
          slot: {def.w}×{def.h}px
        </div>
      )}
    </div>
  );
}

function CropBannerEditor({
  source,
  output,
  crop,
  slot,
  onCropChange,
}: {
  source: string;
  output: string;
  crop: CropState;
  slot: string;
  onCropChange: (crop: CropState) => void;
}) {
  const [sourceSize, setSourceSize] = useState<{ w: number; h: number } | null>(null);
  const def = SLOTS[slot];

  useEffect(() => {
    if (!source) {
      setSourceSize(null);
      return;
    }

    let cancelled = false;
    measureImage(source)
      .then(meta => {
        if (!cancelled) setSourceSize({ w: meta.w, h: meta.h });
      })
      .catch(() => {
        if (!cancelled) setSourceSize(null);
      });

    return () => {
      cancelled = true;
    };
  }, [source]);

  if (!def) return null;

  const previewHeight = Math.max(def.previewH * 2.2, 120);
  const fitZoom = sourceSize
    ? Math.min(def.w / sourceSize.w, def.h / sourceSize.h) / Math.max(def.w / sourceSize.w, def.h / sourceSize.h)
    : 0.1;
  const minZoom = Math.max(0.05, Math.min(1, fitZoom));
  const maxZoom = 4;
  const update = (patch: Partial<CropState>) => onCropChange({ ...crop, ...patch });

  return (
    <div className="space-y-3 border border-vp-border bg-[#141413] p-3 rounded-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-[10px] font-black uppercase tracking-widest text-vp-text-4">Conversão automática para WebP</div>
          <p className="text-[10px] text-vp-text-4 mt-0.5">
            Resultado final no tamanho exato {def.w}×{def.h}px.
          </p>
        </div>
        <span className="text-[10px] font-bold text-vp-ok">WEBP pronto</span>
      </div>

      <div
        className="relative w-full overflow-hidden border border-vp-border bg-[#080808] rounded-sm"
        style={{ aspectRatio: `${def.w} / ${def.h}`, maxHeight: previewHeight }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={output || source} alt="Preview recortado do banner" className="h-full w-full object-contain" />
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onCropChange({ zoom: minZoom, x: 0, y: 0 })}
          className="vp-btn px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest"
        >
          Imagem inteira
        </button>
        <button
          type="button"
          onClick={() => onCropChange({ zoom: 1, x: 0, y: 0 })}
          className="vp-btn px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest"
        >
          Preencher slot
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <label className="grid gap-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-vp-text-4">
            Zoom <span className="font-mono text-vp-text-3">{crop.zoom.toFixed(2)}x</span>
          </span>
          <input
            type="range"
            min={minZoom}
            max={maxZoom}
            step="0.01"
            value={crop.zoom}
            onChange={e => update({ zoom: Number(e.target.value) })}
            className="accent-[var(--vp-accent)]"
          />
        </label>
        <label className="grid gap-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-vp-text-4">Horizontal</span>
          <input
            type="range"
            min="-1"
            max="1"
            step="0.01"
            value={crop.x}
            onChange={e => update({ x: Number(e.target.value) })}
            className="accent-[var(--vp-accent)]"
          />
        </label>
        <label className="grid gap-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-vp-text-4">Vertical</span>
          <input
            type="range"
            min="-1"
            max="1"
            step="0.01"
            value={crop.y}
            onChange={e => update({ y: Number(e.target.value) })}
            className="accent-[var(--vp-accent)]"
          />
        </label>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export function CampaignManager({ initialCampaigns }: { initialCampaigns: Campaign[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Creative state
  const [previewSrc, setPreviewSrc] = useState('');       // data URL or remote URL
  const [urlInput, setUrlInput] = useState('');
  const [imageMeta, setImageMeta] = useState<ImageMeta | null>(null);
  const [metaLoading, setMetaLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState('leaderboard');
  const [bannerName, setBannerName] = useState('');
  const [uploadedSource, setUploadedSource] = useState('');
  const [convertedCreative, setConvertedCreative] = useState('');
  const [crop, setCrop] = useState<CropState>({ zoom: 1, x: 0, y: 0 });

  // When studio produces a banner, inject it into the campaign form
  const handleStudioResult = useCallback((url: string, slot: string, brand: string) => {
    setSelectedSlot(slot);
    setUrlInput(url);
    setPreviewSrc(url);
    setUploadedSource('');
    setConvertedCreative('');
    if (!bannerName) setBannerName(`Banner IA — ${brand}`);
    setIsModalOpen(true);
  }, [bannerName]);

  const fileRef = useRef<HTMLInputElement>(null);
  const urlDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Measure image whenever previewSrc changes
  useEffect(() => {
    if (!previewSrc) { setImageMeta(null); return; }
    setMetaLoading(true);
    measureImage(previewSrc)
      .then(meta => setImageMeta(meta))
      .catch(() => setImageMeta(null))
      .finally(() => setMetaLoading(false));
  }, [previewSrc]);

  useEffect(() => {
    if (!uploadedSource) {
      setConvertedCreative('');
      return;
    }

    let cancelled = false;
    createFittedBannerDataUrl(uploadedSource, selectedSlot, crop)
      .then(dataUrl => {
        if (!cancelled) {
          setConvertedCreative(dataUrl);
          setPreviewSrc(dataUrl);
        }
      })
      .catch(() => {
        if (!cancelled) setConvertedCreative('');
      });

    return () => {
      cancelled = true;
    };
  }, [uploadedSource, selectedSlot, crop]);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUrlInput('');
    setPreviewSrc('');
    setUploadedSource('');
    setConvertedCreative('');
    setCrop({ zoom: 1, x: 0, y: 0 });
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setUploadedSource(dataUrl);
    } catch {}
  }, []);

  const handleUrlChange = useCallback((val: string) => {
    setUrlInput(val);
    setUploadedSource('');
    setConvertedCreative('');
    setCrop({ zoom: 1, x: 0, y: 0 });
    if (fileRef.current) fileRef.current.value = '';
    if (urlDebounce.current) clearTimeout(urlDebounce.current);
    if (!val.trim()) { setPreviewSrc(''); return; }
    urlDebounce.current = setTimeout(() => setPreviewSrc(val.trim()), 600);
  }, []);

  function resetModal() {
    setIsModalOpen(false);
    setPreviewSrc('');
    setUrlInput('');
    setImageMeta(null);
    setUploadedSource('');
    setConvertedCreative('');
    setCrop({ zoom: 1, x: 0, y: 0 });
    setSelectedSlot('leaderboard');
    setBannerName('');
    if (fileRef.current) fileRef.current.value = '';
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await createCampaign(formData);
      resetModal();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao criar campanha');
    } finally {
      setLoading(false);
    }
  }

  const dimStatus = imageMeta ? checkDimensions(imageMeta, selectedSlot) : null;
  const canSubmit = !loading && (!imageMeta || dimStatus !== 'error');

  return (
    <div className="space-y-6">
      {/* AI Banner Studio modal */}
      {isStudioOpen && (
        <AiBannerStudio
          initialSlot={selectedSlot}
          onUse={handleStudioResult}
          onClose={() => setIsStudioOpen(false)}
        />
      )}

      {/* Header */}
      <div className="flex justify-between items-center border-b border-vp-border pb-5">
        <div>
          <h2 className="text-[14px] font-black uppercase tracking-widest text-vp-text-4">Campanhas</h2>
          <p className="text-[11px] text-vp-text-4 italic font-serif mt-1">Gerencie criativos, slots e períodos de veiculação.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsStudioOpen(true)}
            className="vp-btn text-[11px] font-bold uppercase tracking-widest py-2 px-4 border-vp-accent text-vp-accent hover:bg-vp-accent/10 transition-colors flex items-center gap-1.5"
          >
            ✦ Gerar com IA
          </button>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="vp-btn vp-btn-primary text-[11px] font-bold uppercase tracking-widest py-2 px-5"
          >
            + Nova Campanha
          </button>
        </div>
      </div>

      {/* Campaign table */}
      <div className="vp-panel overflow-hidden bg-[#141413] border border-vp-border">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-vp-border bg-[#0e0e0d]">
                <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-vp-text-4">Campanha / Cliente</th>
                <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-vp-text-4">Slot</th>
                <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-vp-text-4 text-right">Impressões</th>
                <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-vp-text-4 text-right">Cliques</th>
                <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-vp-text-4 text-right">CTR</th>
                <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-vp-text-4 text-center">Peso</th>
                <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-vp-text-4 text-center">Status</th>
                <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-vp-text-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-vp-border/30">
              {initialCampaigns.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-vp-text-4 italic font-serif">
                    Nenhuma campanha cadastrada.
                  </td>
                </tr>
              ) : (
                initialCampaigns.map(c => (
                  <tr key={c.id} className="hover:bg-vp-surface/30 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {/* Thumbnail */}
                        {c.creative && (
                          <div className="w-14 h-9 bg-vp-surface rounded-sm overflow-hidden flex-shrink-0 border border-vp-border flex items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={c.creative} alt="" className="max-w-full max-h-full object-contain" />
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-[13px] text-vp-text group-hover:text-vp-accent transition-colors">{c.name}</div>
                          <div className="text-[10px] text-vp-text-4 font-mono uppercase mt-0.5">{c.client}</div>
                          {c.targetUrl && (
                            <a
                              href={c.targetUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] text-vp-accent/60 hover:text-vp-accent truncate max-w-[200px] block mt-0.5"
                            >
                              ↗ {c.targetUrl.replace(/^https?:\/\//, '')}
                            </a>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-[11px] font-mono text-vp-text-3">{slotLabel(c.slot)}</span>
                    </td>
                    <td className="px-5 py-4 text-right font-mono text-[13px] text-vp-text-2">
                      {c.impressions.toLocaleString('pt-BR')}
                    </td>
                    <td className="px-5 py-4 text-right font-mono text-[13px] text-vp-text-2">
                      {c.clicks.toLocaleString('pt-BR')}
                    </td>
                    <td className="px-5 py-4 text-right font-mono text-[13px] text-vp-accent font-bold">
                      {ctr(c.impressions, c.clicks)}
                    </td>
                    <td className="px-5 py-4 text-center font-mono text-[13px] text-vp-text-3">
                      {c.weight}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <button
                        type="button"
                        onClick={() => updateCampaignStatus(c.id, c.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE')}
                        className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm border transition-all ${
                          c.status === 'ACTIVE'
                            ? 'bg-vp-ok/10 text-vp-ok border-vp-ok/20 hover:bg-vp-ok/20'
                            : 'bg-vp-text-4/10 text-vp-text-4 border-vp-text-4/20 hover:bg-vp-text-4/20'
                        }`}
                      >
                        {c.status === 'ACTIVE' ? 'Ativo' : 'Pausado'}
                      </button>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        aria-label="Excluir campanha"
                        onClick={() => { if (confirm('Excluir campanha?')) deleteCampaign(c.id); }}
                        className="text-vp-text-4 hover:text-vp-urgent transition-colors text-[13px]"
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

      {/* ── Modal ─────────────────────────────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-[#141413] border border-vp-border w-full max-w-[760px] p-8 shadow-2xl my-8">

            {/* Modal header */}
            <div className="flex justify-between items-start mb-7">
              <div>
                <h3 className="text-[20px] font-display font-bold">Nova Campanha Publicitária</h3>
                <p className="text-[12px] text-vp-text-3 font-serif italic mt-1">
                  Defina criativo, destino, slot e período de veiculação.
                </p>
              </div>
              <button
                type="button"
                aria-label="Fechar"
                onClick={resetModal}
                className="text-vp-text-4 hover:text-vp-text text-xl leading-none"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Nome e Cliente */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="ad-name" className="text-[10px] font-black uppercase tracking-widest text-vp-text-4">
                    Nome da Campanha
                  </label>
                  <input
                    id="ad-name"
                    name="name"
                    className="vp-input w-full"
                    placeholder="Ex: Campanha Verão 2026"
                    required
                    value={bannerName}
                    onChange={e => setBannerName(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="ad-client" className="text-[10px] font-black uppercase tracking-widest text-vp-text-4">
                    Cliente / Anunciante
                  </label>
                  <input
                    id="ad-client"
                    name="client"
                    className="vp-input w-full"
                    placeholder="Ex: Banco do Brasil"
                    required
                  />
                </div>
              </div>

              {/* Slot + Peso */}
              <div className="grid grid-cols-[1fr_120px] gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="ad-slot" className="text-[10px] font-black uppercase tracking-widest text-vp-text-4">
                    Slot (Posição)
                  </label>
                  <select
                    id="ad-slot"
                    name="slot"
                    className="vp-input w-full"
                    required
                    title="Posição do banner no site"
                    value={selectedSlot}
                    onChange={e => setSelectedSlot(e.target.value)}
                  >
                    {Object.entries(SLOTS).map(([value, def]) => (
                      <option key={value} value={value}>
                        {def.label} — {def.w}×{def.h}px ({def.device === 'desktop' ? 'Desktop' : def.device === 'mobile' ? 'Mobile' : 'Desktop+Mobile'})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="ad-weight" className="text-[10px] font-black uppercase tracking-widest text-vp-text-4">
                    Peso <span className="font-normal normal-case">(rotação)</span>
                  </label>
                  <input
                    id="ad-weight"
                    name="weight"
                    type="number"
                    min="1"
                    max="100"
                    defaultValue="1"
                    className="vp-input w-full font-mono"
                    title="Peso de rotação entre campanhas do mesmo slot"
                  />
                </div>
              </div>

              {/* Slot info card */}
              {(() => {
                const def = SLOTS[selectedSlot];
                if (!def) return null;
                const deviceIcon = def.device === 'desktop' ? '🖥' : def.device === 'mobile' ? '📱' : '🖥📱';
                return (
                  <div className="flex items-start gap-3 px-3.5 py-3 bg-vp-surface/40 border border-vp-border/50 rounded-sm">
                    <span className="text-[16px] leading-none mt-0.5 select-none">{deviceIcon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-bold text-vp-text">{def.label}</span>
                        <span className="font-mono text-[10px] text-vp-accent bg-vp-accent/10 px-1.5 py-0.5 rounded-sm">
                          {def.w}×{def.h}px
                        </span>
                        <span className="font-mono text-[10px] text-vp-text-4">
                          max-width: {def.maxW}px no site
                        </span>
                      </div>
                      <p className="text-[11px] text-vp-text-3 mt-1 leading-relaxed">{def.where}</p>
                    </div>
                  </div>
                );
              })()}

              {/* URL de destino */}
              <div className="space-y-1.5">
                <label htmlFor="ad-targetUrl" className="text-[10px] font-black uppercase tracking-widest text-vp-text-4">
                  URL de Destino do Clique
                </label>
                <input
                  id="ad-targetUrl"
                  name="targetUrl"
                  className="vp-input w-full font-mono text-[12px]"
                  placeholder="https://anunciante.com.br/campanha"
                />
              </div>

              {/* ── Criativo ────────────────────────────────────────────── */}
              <div className="space-y-4 p-4 border border-vp-border rounded-sm bg-[#0e0e0d]">
                <div className="text-[10px] font-black uppercase tracking-widest text-vp-text-4">
                  Criativo do Banner
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Upload */}
                  <div className="space-y-1.5">
                    <label htmlFor="ad-imageFile" className="text-[10px] text-vp-text-3 uppercase tracking-wider">
                      Upload de arquivo
                    </label>
                    <input
                      id="ad-imageFile"
                      ref={fileRef}
                      name="imageFile"
                      type="file"
                      accept="image/*"
                      className="vp-input w-full text-[11px] pt-1.5 cursor-pointer"
                      title="Arquivo de imagem do banner"
                      onChange={handleFileChange}
                    />
                    <input type="hidden" name="convertedCreative" value={convertedCreative} />
                  </div>

                  {/* URL */}
                  <div className="space-y-1.5">
                    <label htmlFor="ad-creative" className="text-[10px] text-vp-text-3 uppercase tracking-wider">
                      Ou URL da imagem
                    </label>
                    <input
                      id="ad-creative"
                      name="creative"
                      className="vp-input w-full font-mono text-[12px]"
                      placeholder="https://..."
                      title="URL direta da imagem do banner"
                      value={urlInput}
                      onChange={e => handleUrlChange(e.target.value)}
                    />
                  </div>
                </div>

                {/* Dimension badge */}
                {metaLoading && (
                  <div className="text-[11px] text-vp-text-4 italic animate-pulse">
                    Verificando dimensões...
                  </div>
                )}
                {imageMeta && !metaLoading && (
                  <DimensionBadge meta={imageMeta} slot={selectedSlot} />
                )}

                {uploadedSource && (
                  <CropBannerEditor
                    source={uploadedSource}
                    output={convertedCreative}
                    crop={crop}
                    slot={selectedSlot}
                    onCropChange={setCrop}
                  />
                )}

                {/* Live preview */}
                {previewSrc && !metaLoading && !uploadedSource && (
                  <BannerPreview
                    src={previewSrc}
                    slot={selectedSlot}
                    label={bannerName}
                  />
                )}

                {/* Dimension error blocks submit */}
                {dimStatus === 'error' && (
                  <p className="text-[11px] text-vp-urgent font-bold">
                    As dimensões do criativo são incompatíveis com este slot. Ajuste a imagem ou escolha outro slot.
                  </p>
                )}
              </div>

              {/* Datas */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="ad-startsAt" className="text-[10px] font-black uppercase tracking-widest text-vp-text-4">
                    Data de Início
                  </label>
                  <input
                    id="ad-startsAt"
                    name="startsAt"
                    type="date"
                    className="vp-input w-full"
                    required
                    title="Data de início da veiculação"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="ad-endsAt" className="text-[10px] font-black uppercase tracking-widest text-vp-text-4">
                    Data de Término
                  </label>
                  <input
                    id="ad-endsAt"
                    name="endsAt"
                    type="date"
                    className="vp-input w-full"
                    required
                    title="Data de término da veiculação"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={resetModal}
                  className="vp-btn flex-1 py-3 text-[12px] border-vp-border hover:bg-vp-surface"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="vp-btn vp-btn-primary flex-1 py-3 text-[12px] font-bold disabled:opacity-50 disabled:cursor-not-allowed"
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
