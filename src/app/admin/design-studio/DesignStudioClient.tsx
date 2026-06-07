'use client';

import React, { useState, useCallback, useTransition, useRef, useEffect } from 'react';
import {
  resetDesignTokens,
  saveDesignBrandLogoUrl,
  listSnapshots,
  deleteSnapshot,
  saveDesignTokensWithSnapshot,
  scheduleTheme,
  listScheduledThemes,
  cancelScheduledTheme,
  type DesignTokens,
  type DesignSnapshot,
  type ScheduledTheme,
} from '@/app/actions/design-tokens';
import { uploadBrand } from '@/app/actions/brand';
import { DEFAULT_TOKENS } from '@/lib/design-tokens-types';

type Tab = 'cores' | 'tipografia' | 'espacamento' | 'componentes' | 'marca' | 'historico' | 'agendar';
type Viewport = 'mobile' | 'tablet' | 'desktop';

interface Props {
  initialTokens: DesignTokens;
  initialLogoUrl: string;
}

const VIEWPORT_WIDTHS: Record<Viewport, string> = {
  mobile: '390px',
  tablet: '768px',
  desktop: '100%',
};

const COLOR_TOKENS: { key: keyof DesignTokens; label: string; group: string }[] = [
  { key: 'color.bg',        label: 'Fundo principal',   group: 'Fundos' },
  { key: 'color.surface',   label: 'Surface',           group: 'Fundos' },
  { key: 'color.surface-2', label: 'Surface 2',         group: 'Fundos' },
  { key: 'color.surface-3', label: 'Surface 3',         group: 'Fundos' },
  { key: 'color.border',    label: 'Borda',             group: 'Bordas' },
  { key: 'color.border-2',  label: 'Borda 2',           group: 'Bordas' },
  { key: 'color.text',      label: 'Texto principal',   group: 'Texto' },
  { key: 'color.text-2',    label: 'Texto secundário',  group: 'Texto' },
  { key: 'color.text-3',    label: 'Texto terciário',   group: 'Texto' },
  { key: 'color.text-4',    label: 'Texto sutil',       group: 'Texto' },
  { key: 'color.accent',    label: 'Cor de destaque',   group: 'Acento' },
  { key: 'color.accent-hover', label: 'Destaque hover', group: 'Acento' },
  { key: 'color.urgent',    label: 'Urgente / Ao vivo', group: 'Semântico' },
];

const FONT_DISPLAY_OPTIONS = ['Playfair Display', 'Merriweather', 'Lora', 'EB Garamond', 'Cormorant Garamond', 'PT Serif'];
const FONT_SERIF_OPTIONS   = ['Source Serif 4', 'Merriweather', 'Lora', 'Georgia', 'PT Serif', 'Noto Serif'];
const FONT_SANS_OPTIONS    = ['Inter', 'DM Sans', 'IBM Plex Sans', 'Nunito Sans', 'Roboto', 'Open Sans'];
const TEXT_ALIGN_OPTIONS   = ['left', 'justify', 'center'];
const FONT_WEIGHT_OPTIONS  = ['400', '500', '600', '700', '800'];

function groupBy<T>(arr: T[], fn: (item: T) => string): Record<string, T[]> {
  return arr.reduce((acc, item) => {
    const key = fn(item);
    acc[key] = acc[key] ?? [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, T[]>);
}

function diffTokens(a: DesignTokens, b: DesignTokens): Array<{ key: string; from: string; to: string }> {
  return Object.keys(a)
    .filter(k => a[k as keyof DesignTokens] !== b[k as keyof DesignTokens])
    .map(k => ({ key: k, from: a[k as keyof DesignTokens], to: b[k as keyof DesignTokens] }));
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: '2-digit',
    hour: '2-digit', minute: '2-digit',
  });
}

// ── Modo escuro automático ────────────────────────────────────────────────────

function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h: number, s: number, l: number): string {
  const sl = s / 100, ll = l / 100;
  const a = sl * Math.min(ll, 1 - ll);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = ll - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function invertLightness(hex: string, targetL?: number): string {
  try {
    const [h, s, l] = hexToHsl(hex);
    const newL = targetL !== undefined ? targetL : Math.max(0, Math.min(100, 100 - l));
    return hslToHex(h, s, newL);
  } catch {
    return hex;
  }
}

function generateDarkPalette(tokens: DesignTokens): Partial<DesignTokens> {
  return {
    'color.bg':        invertLightness(tokens['color.bg'], 8),
    'color.surface':   invertLightness(tokens['color.surface'], 13),
    'color.surface-2': invertLightness(tokens['color.surface-2'], 18),
    'color.surface-3': invertLightness(tokens['color.surface-3'], 22),
    'color.border':    invertLightness(tokens['color.border'], 22),
    'color.border-2':  invertLightness(tokens['color.border-2'], 28),
    'color.text':      invertLightness(tokens['color.text'], 96),
    'color.text-2':    invertLightness(tokens['color.text-2'], 80),
    'color.text-3':    invertLightness(tokens['color.text-3'], 54),
    'color.text-4':    invertLightness(tokens['color.text-4'], 36),
  };
}

function generateLightPalette(): Partial<DesignTokens> {
  return {
    'color.bg':        '#faf9f5',
    'color.surface':   '#f3f1eb',
    'color.surface-2': '#eceae2',
    'color.surface-3': '#e2e0d8',
    'color.border':    '#d8d6ce',
    'color.border-2':  '#c8c6bd',
    'color.text':      '#1a1a19',
    'color.text-2':    '#3a3a37',
    'color.text-3':    '#6a6a64',
    'color.text-4':    '#9a9a92',
  };
}

// ── CSS map for live preview ──────────────────────────────────────────────────
function buildCssMap(t: DesignTokens): Record<string, string> {
  const n = (k: keyof DesignTokens) => Number(t[k]) || 0;
  return {
    '--vp-bg': t['color.bg'],
    '--vp-surface': t['color.surface'],
    '--vp-surface-2': t['color.surface-2'],
    '--vp-surface-3': t['color.surface-3'],
    '--vp-border': t['color.border'],
    '--vp-border-2': t['color.border-2'],
    '--vp-text': t['color.text'],
    '--vp-text-2': t['color.text-2'],
    '--vp-text-3': t['color.text-3'],
    '--vp-text-4': t['color.text-4'],
    '--vp-accent': t['color.accent'],
    '--vp-accent-hover': t['color.accent-hover'],
    '--vp-urgent': t['color.urgent'],
    '--radius-md': `${n('layout.border-radius')}px`,
    '--vp-btn-radius': `${n('comp.btn-radius')}px`,
    '--vp-card-radius': `${n('comp.card-radius')}px`,
    '--vp-content-gap': `${n('layout.content-gap')}px`,
    '--vp-header-logo-size': `${n('comp.header-logo-size')}px`,
    '--vp-footer-logo-size': `${n('comp.footer-logo-size')}px`,
    '--vp-admin-logo-size': `${n('comp.admin-logo-size')}px`,
    '--vp-compact-logo-size': `${n('comp.compact-logo-size')}px`,
    '--vp-article-text-align': t['comp.article-text-align'],
  };
}

// ─────────────────────────────────────────────────────────────────────────────

export function DesignStudioClient({ initialTokens, initialLogoUrl }: Props) {
  const [tokens, setTokens] = useState<DesignTokens>({ ...initialTokens });
  const [logoUrl, setLogoUrl] = useState(initialLogoUrl || '/logo.webp');
  const [activeTab, setActiveTab] = useState<Tab>('cores');
  const [viewport, setViewport] = useState<Viewport>('desktop');
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [snapshots, setSnapshots] = useState<DesignSnapshot[]>([]);
  const [snapshotLabel, setSnapshotLabel] = useState('');
  const [diffTarget, setDiffTarget] = useState<DesignSnapshot | null>(null);
  const [snapshotsLoaded, setSnapshotsLoaded] = useState(false);
  // Agendamento
  const [scheduledThemes, setScheduledThemes] = useState<ScheduledTheme[]>([]);
  const [schedLabel, setSchedLabel] = useState('');
  const [schedDateTime, setSchedDateTime] = useState('');
  const [schedLoaded, setSchedLoaded] = useState(false);
  const previewRef = useRef<HTMLIFrameElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const applyToPreview = useCallback((updated: DesignTokens) => {
    const frame = previewRef.current;
    const root = frame?.contentDocument?.documentElement;
    if (!root) return;
    Object.entries(buildCssMap(updated)).forEach(([k, v]) => root.style.setProperty(k, v));
  }, []);

  const applyLogoToPreview = useCallback((updatedLogoUrl: string) => {
    const doc = previewRef.current?.contentDocument;
    if (!doc) return;
    doc.querySelectorAll<HTMLImageElement>('img[alt="Voz Pública MS"]').forEach(img => {
      img.src = updatedLogoUrl || '/logo.webp';
      img.style.width = 'auto';
      img.style.objectFit = 'contain';
    });
  }, []);

  const updateToken = useCallback((key: keyof DesignTokens, value: string) => {
    setTokens(prev => {
      const updated = { ...prev, [key]: value };
      applyToPreview(updated);
      return updated;
    });
    setIsDirty(true);
    setSaved(false);
  }, [applyToPreview]);

  const updateLogoUrl = useCallback((value: string) => {
    setLogoUrl(value);
    applyLogoToPreview(value);
    setIsDirty(true);
    setSaved(false);
  }, [applyLogoToPreview]);

  const loadSnapshots = useCallback(() => {
    startTransition(async () => {
      const list = await listSnapshots();
      setSnapshots(list);
      setSnapshotsLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (activeTab === 'historico' && !snapshotsLoaded) loadSnapshots();
    if (activeTab === 'agendar' && !schedLoaded) {
      startTransition(async () => {
        const list = await listScheduledThemes();
        setScheduledThemes(list);
        setSchedLoaded(true);
      });
    }
  }, [activeTab, snapshotsLoaded, loadSnapshots, schedLoaded]);

  const handleSave = () => {
    const label = snapshotLabel.trim() || `Versão ${new Date().toLocaleString('pt-BR')}`;
    startTransition(async () => {
      await saveDesignTokensWithSnapshot(tokens, label);
      await saveDesignBrandLogoUrl(logoUrl);
      setSaved(true);
      setIsDirty(false);
      setSnapshotLabel('');
      setSnapshotsLoaded(false); // invalidate cache
    });
  };

  const handleReset = () => {
    if (!confirm('Restaurar todos os tokens para os valores padrão? O estado atual será perdido.')) return;
    startTransition(async () => {
      await resetDesignTokens();
      setTokens({ ...DEFAULT_TOKENS });
      setLogoUrl('/logo.webp');
      await saveDesignBrandLogoUrl('/logo.webp');
      applyToPreview(DEFAULT_TOKENS as DesignTokens);
      setIsDirty(false);
      setSaved(false);
    });
  };

  const handleLogoUpload = (file: File | null) => {
    if (!file) return;
    startTransition(async () => {
      const formData = new FormData();
      formData.set('file', file);
      const publicUrl = await uploadBrand(formData, 'logo');
      setLogoUrl(publicUrl);
      applyLogoToPreview(publicUrl);
      setIsDirty(true);
      setSaved(false);
      if (logoInputRef.current) logoInputRef.current.value = '';
    });
  };

  const handleRollback = (snap: DesignSnapshot) => {
    if (!confirm(`Restaurar "${snap.label}"? O estado atual será salvo como snapshot antes do rollback.`)) return;
    startTransition(async () => {
      await saveDesignTokensWithSnapshot(snap.tokens, `Rollback → ${snap.label}`);
      setTokens({ ...snap.tokens });
      applyToPreview(snap.tokens);
      setIsDirty(false);
      setSaved(false);
      setDiffTarget(null);
      setSnapshotsLoaded(false);
    });
  };

  const handleDeleteSnapshot = (id: string) => {
    if (!confirm('Apagar este snapshot?')) return;
    startTransition(async () => {
      await deleteSnapshot(id);
      setSnapshots(prev => prev.filter(s => s.id !== id));
      if (diffTarget?.id === id) setDiffTarget(null);
    });
  };

  const colorGroups = groupBy(COLOR_TOKENS, t => t.group);

  const handleSchedule = () => {
    if (!schedLabel.trim() || !schedDateTime) return;
    startTransition(async () => {
      await scheduleTheme(schedLabel.trim(), tokens, new Date(schedDateTime));
      setScheduledThemes(await listScheduledThemes());
      setSchedLabel('');
      setSchedDateTime('');
    });
  };

  const handleCancelSchedule = (id: string) => {
    if (!confirm('Cancelar este tema agendado?')) return;
    startTransition(async () => {
      await cancelScheduledTheme(id);
      setScheduledThemes(prev => prev.filter(s => s.id !== id));
    });
  };

  const handleApplyDarkMode = () => {
    const dark = generateDarkPalette(tokens);
    const updated = { ...tokens, ...dark };
    setTokens(updated);
    applyToPreview(updated);
    setIsDirty(true);
    setSaved(false);
  };

  const handleApplyLightMode = () => {
    const light = generateLightPalette();
    const updated = { ...tokens, ...light };
    setTokens(updated);
    applyToPreview(updated);
    setIsDirty(true);
    setSaved(false);
  };

  const TABS: { id: Tab; label: string }[] = [
    { id: 'cores',       label: 'Cores' },
    { id: 'tipografia',  label: 'Tipo' },
    { id: 'espacamento', label: 'Espaço' },
    { id: 'componentes', label: 'Comp.' },
    { id: 'marca',       label: 'Marca' },
    { id: 'historico',   label: 'Hist.' },
    { id: 'agendar',     label: 'Agendar' },
  ];

  return (
    <div className="flex flex-1 overflow-hidden min-h-0" style={{ height: 'calc(100vh - 130px)' }}>

      {/* ── Sidebar ──────────────────────────────────────────────── */}
      <aside className="w-[300px] shrink-0 border-r border-vp-border flex flex-col bg-vp-surface overflow-hidden">

        {/* Tabs */}
        <div className="flex border-b border-vp-border sticky top-0 bg-vp-surface z-10 shrink-0">
          {TABS.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 text-[10px] font-bold uppercase tracking-wider transition-colors ${
                activeTab === tab.id
                  ? 'text-vp-accent border-b-2 border-vp-accent'
                  : 'text-vp-text-3 hover:text-vp-text-2'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5">

          {/* ── Cores ── */}
          {activeTab === 'cores' && (
            <>
              {Object.entries(colorGroups).map(([group, items]) => (
                <div key={group}>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-vp-text-4 mb-2">{group}</p>
                  <div className="flex flex-col gap-2">
                    {items.map(({ key, label }) => (
                      <ColorRow key={key} label={label} value={tokens[key] as string} onChange={v => updateToken(key, v)} />
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}

          {/* ── Tipografia ── */}
          {activeTab === 'tipografia' && (
            <>
              <SectionLabel>Famílias</SectionLabel>
              <SelectRow label="Título / Display" value={tokens['type.font-display']} options={FONT_DISPLAY_OPTIONS} onChange={v => updateToken('type.font-display', v)} />
              <SelectRow label="Corpo / Artigo"   value={tokens['type.font-serif']}   options={FONT_SERIF_OPTIONS}   onChange={v => updateToken('type.font-serif', v)} />
              <SelectRow label="Interface / Sans"  value={tokens['type.font-sans']}    options={FONT_SANS_OPTIONS}    onChange={v => updateToken('type.font-sans', v)} />
              <SectionLabel>Escala global</SectionLabel>
              <SliderRow label="Tamanho base" value={Number(tokens['type.size-base'])} min={13} max={20} step={1} unit="px" onChange={v => updateToken('type.size-base', String(v))} />
              <SliderRow label="Altura de linha" value={Number(tokens['type.line-height'])} min={1.2} max={2.0} step={0.05} decimals={2} onChange={v => updateToken('type.line-height', String(v))} />
            </>
          )}

          {/* ── Espaçamento ── */}
          {activeTab === 'espacamento' && (
            <>
              <SectionLabel>Grid & Container</SectionLabel>
              <SliderRow label="Unidade de espaço" value={Number(tokens['layout.spacing-unit'])} min={2} max={8} step={1} unit="px" onChange={v => updateToken('layout.spacing-unit', String(v))} />
              <SliderRow label="Container máximo" value={Number(tokens['layout.container-max'])} min={960} max={1600} step={40} unit="px" onChange={v => updateToken('layout.container-max', String(v))} />
              <SliderRow label="Gap entre colunas" value={Number(tokens['layout.content-gap'])} min={8} max={64} step={4} unit="px" onChange={v => updateToken('layout.content-gap', String(v))} />
              <SectionLabel>Elementos globais</SectionLabel>
              <SliderRow label="Border radius global" value={Number(tokens['layout.border-radius'])} min={0} max={16} step={1} unit="px" onChange={v => updateToken('layout.border-radius', String(v))} />
              <SliderRow label="Altura do header" value={Number(tokens['layout.header-height'])} min={40} max={120} step={4} unit="px" onChange={v => updateToken('layout.header-height', String(v))} />
              <SliderRow label="Largura da sidebar" value={Number(tokens['layout.sidebar-width'])} min={200} max={400} step={8} unit="px" onChange={v => updateToken('layout.sidebar-width', String(v))} />
            </>
          )}

          {/* ── Componentes ── */}
          {activeTab === 'componentes' && (
            <>
              <SectionLabel>Botões</SectionLabel>
              <SliderRow label="Border radius" value={Number(tokens['comp.btn-radius'])} min={0} max={24} step={1} unit="px" onChange={v => updateToken('comp.btn-radius', String(v))} />
              <SliderRow label="Tamanho da fonte" value={Number(tokens['comp.btn-font-size'])} min={10} max={18} step={1} unit="px" onChange={v => updateToken('comp.btn-font-size', String(v))} />
              <SelectRow label="Peso da fonte" value={tokens['comp.btn-font-weight']} options={FONT_WEIGHT_OPTIONS} onChange={v => updateToken('comp.btn-font-weight', v)} />
              <SliderRow label="Padding horizontal" value={Number(tokens['comp.btn-padding-x'])} min={6} max={40} step={2} unit="px" onChange={v => updateToken('comp.btn-padding-x', String(v))} />
              <SliderRow label="Padding vertical" value={Number(tokens['comp.btn-padding-y'])} min={4} max={20} step={1} unit="px" onChange={v => updateToken('comp.btn-padding-y', String(v))} />

              <SectionLabel>Cards de matéria</SectionLabel>
              <SliderRow label="Border radius" value={Number(tokens['comp.card-radius'])} min={0} max={16} step={1} unit="px" onChange={v => updateToken('comp.card-radius', String(v))} />
              <SliderRow label="Espessura da borda" value={Number(tokens['comp.card-border-width'])} min={0} max={4} step={1} unit="px" onChange={v => updateToken('comp.card-border-width', String(v))} />
              <SliderRow label="Gap entre cards" value={Number(tokens['comp.card-gap'])} min={4} max={48} step={4} unit="px" onChange={v => updateToken('comp.card-gap', String(v))} />
              <SliderRow label="Proporção da imagem (%)" value={Number(tokens['comp.card-image-ratio'])} min={40} max={75} step={5} unit="%" onChange={v => updateToken('comp.card-image-ratio', String(v))} />

              <SectionLabel>Cabeçalho</SectionLabel>
              <SliderRow label="Fonte da nav" value={Number(tokens['comp.header-nav-font-size'])} min={10} max={16} step={1} unit="px" onChange={v => updateToken('comp.header-nav-font-size', String(v))} />
              <SelectRow label="Peso da nav" value={tokens['comp.header-nav-font-weight']} options={FONT_WEIGHT_OPTIONS} onChange={v => updateToken('comp.header-nav-font-weight', v)} />

              <SectionLabel>Corpo do artigo</SectionLabel>
              <SliderRow label="Largura máxima" value={Number(tokens['comp.article-max-width'])} min={480} max={960} step={16} unit="px" onChange={v => updateToken('comp.article-max-width', String(v))} />
              <SliderRow label="Tamanho da fonte" value={Number(tokens['comp.article-font-size'])} min={14} max={24} step={1} unit="px" onChange={v => updateToken('comp.article-font-size', String(v))} />
              <SelectRow label="Alinhamento do texto" value={tokens['comp.article-text-align']} options={TEXT_ALIGN_OPTIONS} onChange={v => updateToken('comp.article-text-align', v)} />
              <SliderRow label="Espaço entre parágrafos" value={Number(tokens['comp.article-paragraph-gap'])} min={12} max={48} step={4} unit="px" onChange={v => updateToken('comp.article-paragraph-gap', String(v))} />
            </>
          )}

          {/* ── Marca ── */}
          {activeTab === 'marca' && (
            <>
              <SectionLabel>Logomarca principal</SectionLabel>
              <div className="border border-vp-border rounded-sm bg-vp-bg p-3 flex flex-col gap-3">
                <div className="min-h-20 flex items-center justify-center bg-vp-surface border border-vp-border rounded-sm p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logoUrl || '/logo.webp'}
                    alt="Prévia da logomarca"
                    className="max-w-full object-contain"
                    style={{ height: `${Number(tokens['comp.header-logo-size']) || 48}px`, width: 'auto' }}
                  />
                </div>
                <div>
                  <label htmlFor="brand-logo-url" className="text-[10px] text-vp-text-4 font-bold uppercase tracking-wider block mb-1">
                    URL da logomarca
                  </label>
                  <input
                    id="brand-logo-url"
                    type="text"
                    value={logoUrl}
                    onChange={e => updateLogoUrl(e.target.value)}
                    className="vp-input text-[12px] py-1.5 w-full"
                    placeholder="/logo.webp"
                  />
                </div>
                <div>
                  <input
                    ref={logoInputRef}
                    id="brand-logo-upload"
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                    onChange={e => handleLogoUpload(e.target.files?.[0] ?? null)}
                    className="sr-only"
                  />
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    disabled={isPending}
                    className="vp-btn w-full text-[11px] py-2"
                  >
                    {isPending ? 'Enviando...' : 'Enviar nova logomarca'}
                  </button>
                </div>
                <p className="text-[10px] text-vp-text-4 leading-relaxed">
                  A imagem e todos os tamanhos abaixo preservam a proporção original. Não use versões esticadas ou comprimidas.
                </p>
              </div>

              <SectionLabel>Tamanhos por contexto</SectionLabel>
              <SliderRow label="Cabeçalho principal" value={Number(tokens['comp.header-logo-size'])} min={24} max={120} step={2} unit="px" onChange={v => updateToken('comp.header-logo-size', String(v))} />
              <SliderRow label="Rodapé" value={Number(tokens['comp.footer-logo-size'])} min={24} max={120} step={2} unit="px" onChange={v => updateToken('comp.footer-logo-size', String(v))} />
              <SliderRow label="Painel administrativo" value={Number(tokens['comp.admin-logo-size'])} min={24} max={120} step={2} unit="px" onChange={v => updateToken('comp.admin-logo-size', String(v))} />
              <SliderRow label="Menus, login e fluxos compactos" value={Number(tokens['comp.compact-logo-size'])} min={20} max={72} step={2} unit="px" onChange={v => updateToken('comp.compact-logo-size', String(v))} />
            </>
          )}

          {/* ── Histórico ── */}
          {activeTab === 'historico' && (
            <div className="flex flex-col gap-4">
              {!snapshotsLoaded ? (
                <p className="text-[12px] text-vp-text-3 italic">Carregando histórico...</p>
              ) : snapshots.length === 0 ? (
                <div className="text-[12px] text-vp-text-3 italic text-center py-8">
                  Nenhum snapshot salvo ainda.<br />
                  <span className="text-[11px]">Ao publicar alterações um snapshot é criado automaticamente.</span>
                </div>
              ) : (
                snapshots.map(snap => (
                  <div key={snap.id} className={`border rounded-sm p-3 flex flex-col gap-2 ${diffTarget?.id === snap.id ? 'border-vp-accent bg-vp-accent/5' : 'border-vp-border bg-vp-bg'}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[12px] font-bold text-vp-text leading-tight">{snap.label}</p>
                        <p className="text-[10px] text-vp-text-4 font-mono mt-0.5">{formatDate(snap.createdAt)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteSnapshot(snap.id)}
                        className="text-[10px] text-vp-text-4 hover:text-vp-urgent transition-colors shrink-0"
                        title="Apagar snapshot"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => setDiffTarget(diffTarget?.id === snap.id ? null : snap)}
                        className="vp-btn text-[10px] py-1 px-2 flex-1"
                      >
                        {diffTarget?.id === snap.id ? 'Fechar diff' : 'Ver diff'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRollback(snap)}
                        disabled={isPending}
                        className="vp-btn vp-btn-primary text-[10px] py-1 px-2 flex-1"
                      >
                        Restaurar
                      </button>
                    </div>
                    {/* Diff view */}
                    {diffTarget?.id === snap.id && (
                      <DiffPanel current={tokens} snapshot={snap} />
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* ── Agendar ── */}
          {activeTab === 'agendar' && (
            <div className="flex flex-col gap-5">
              {/* Modo claro/escuro automático */}
              <div>
                <SectionLabel>Modo claro / Modo escuro</SectionLabel>
                <p className="text-[11px] text-vp-text-3 leading-relaxed mb-3 mt-1">
                  Gera automaticamente a paleta de cores invertida com base nas cores atuais do portal. As outras configurações (tipografia, espaçamento) são mantidas.
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleApplyDarkMode}
                    className="vp-btn flex-1 text-[11px] py-2 flex items-center justify-center gap-1.5"
                  >
                    🌙 Gerar escuro
                  </button>
                  <button
                    type="button"
                    onClick={handleApplyLightMode}
                    className="vp-btn flex-1 text-[11px] py-2 flex items-center justify-center gap-1.5"
                  >
                    ☀️ Gerar claro
                  </button>
                </div>
                <p className="text-[10px] text-vp-text-4 mt-2 italic">
                  Após gerar, revise as cores na aba Cores e publique quando estiver satisfeito.
                </p>
              </div>

              {/* Agendamento */}
              <div>
                <SectionLabel>Publicação agendada</SectionLabel>
                <p className="text-[11px] text-vp-text-3 leading-relaxed mb-3 mt-1">
                  Agenda o tema atual para ser aplicado automaticamente no próximo cron diário após a data e hora escolhidas.
                </p>
                <div className="flex flex-col gap-2">
                  <div>
                    <label htmlFor="sched-label" className="text-[10px] text-vp-text-4 font-bold uppercase tracking-wider block mb-1">Nome do tema</label>
                    <input
                      id="sched-label"
                      type="text"
                      placeholder="Ex: Tema de Natal"
                      value={schedLabel}
                      onChange={e => setSchedLabel(e.target.value)}
                      className="vp-input text-[12px] py-1.5 w-full"
                    />
                  </div>
                  <div>
                    <label htmlFor="sched-datetime" className="text-[10px] text-vp-text-4 font-bold uppercase tracking-wider block mb-1">Data e hora</label>
                    <input
                      id="sched-datetime"
                      type="datetime-local"
                      value={schedDateTime}
                      onChange={e => setSchedDateTime(e.target.value)}
                      className="vp-input text-[12px] py-1.5 w-full"
                      title="Data e hora de publicação"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSchedule}
                    disabled={isPending || !schedLabel.trim() || !schedDateTime}
                    className="vp-btn vp-btn-primary w-full text-[12px] font-bold py-2 disabled:opacity-40"
                  >
                    {isPending ? 'Agendando...' : '📅 Agendar publicação'}
                  </button>
                </div>
              </div>

              {/* Lista de agendamentos */}
              {schedLoaded && scheduledThemes.length > 0 && (
                <div>
                  <SectionLabel>Agendamentos ativos</SectionLabel>
                  <div className="flex flex-col gap-2 mt-2">
                    {scheduledThemes.map(s => (
                      <div key={s.id} className="border border-vp-border rounded-sm p-2.5 bg-vp-bg flex items-start justify-between gap-2">
                        <div>
                          <p className="text-[12px] font-bold text-vp-text leading-tight">{s.label}</p>
                          <p className="text-[10px] text-vp-accent font-mono mt-0.5">📅 {formatDate(s.scheduledFor)}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCancelSchedule(s.id)}
                          className="text-[10px] text-vp-text-4 hover:text-vp-urgent transition-colors shrink-0"
                          title="Cancelar agendamento"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {schedLoaded && scheduledThemes.length === 0 && (
                <p className="text-[11px] text-vp-text-4 italic text-center py-4">Nenhum agendamento ativo.</p>
              )}
            </div>
          )}
        </div>

        {/* Action bar */}
        {activeTab !== 'historico' && activeTab !== 'agendar' && (
          <div className="border-t border-vp-border p-3 flex flex-col gap-2 flex-shrink-0 bg-vp-surface">
            <input
              type="text"
              placeholder="Nome do snapshot (opcional)"
              value={snapshotLabel}
              onChange={e => setSnapshotLabel(e.target.value)}
              className="vp-input text-[11px] py-1.5"
              aria-label="Nome do snapshot"
              title="Nome do snapshot"
            />
            <button
              type="button"
              onClick={handleSave}
              disabled={isPending || !isDirty}
              className={`vp-btn vp-btn-primary w-full text-[12px] font-bold py-2 ${!isDirty ? 'opacity-40' : ''}`}
            >
              {isPending ? 'Publicando...' : saved ? '✓ Publicado' : 'Publicar alterações'}
            </button>
            <button
              type="button"
              onClick={handleReset}
              disabled={isPending}
              className="vp-btn w-full text-[11px] text-vp-text-3 py-1.5"
            >
              Restaurar padrão
            </button>
          </div>
        )}
      </aside>

      {/* ── Preview ──────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col bg-[#111110] overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-2.5 border-b border-vp-border bg-vp-surface shrink-0">
          <span className="text-[11px] text-vp-text-4 font-mono uppercase tracking-wider">Preview</span>
          <div className="flex gap-1 ml-2">
            {(['mobile', 'tablet', 'desktop'] as Viewport[]).map(v => (
              <button
                key={v}
                type="button"
                onClick={() => setViewport(v)}
                className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-sm transition-colors ${
                  viewport === v
                    ? 'bg-vp-accent text-[#1a1a19]'
                    : 'text-vp-text-3 hover:text-vp-text-2 border border-vp-border'
                }`}
              >
                {v === 'mobile' ? '📱' : v === 'tablet' ? '📟' : '🖥'} {v}
              </button>
            ))}
          </div>
          {isDirty && (
            <span className="ml-auto text-[11px] text-vp-accent font-mono animate-pulse">
              ● alterações não publicadas
            </span>
          )}
        </div>

        <div className="flex-1 flex items-start justify-center overflow-auto p-6">
          <div
            className="transition-all duration-300 shadow-2xl"
            style={{ width: VIEWPORT_WIDTHS[viewport], maxWidth: '100%', minHeight: '600px', height: '100%' }}
          >
            <iframe
              ref={previewRef}
              src="/"
              title="Preview do portal"
              className="w-full h-full border-0"
              style={{ minHeight: '600px' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── DiffPanel ─────────────────────────────────────────────────────────────────

function DiffPanel({ current, snapshot }: { current: DesignTokens; snapshot: DesignSnapshot }) {
  const diffs = diffTokens(snapshot.tokens, current);
  if (diffs.length === 0) {
    return <p className="text-[11px] text-vp-text-3 italic">Sem diferenças em relação ao estado atual.</p>;
  }
  return (
    <div className="flex flex-col gap-1 mt-1">
      <p className="text-[10px] text-vp-text-4 font-mono uppercase tracking-wider mb-1">
        {diffs.length} token{diffs.length > 1 ? 's' : ''} diferente{diffs.length > 1 ? 's' : ''}
      </p>
      {diffs.map(d => (
        <div key={d.key} className="text-[10px] font-mono grid grid-cols-[1fr_auto_auto] gap-1 items-center">
          <span className="text-vp-text-3 truncate">{d.key}</span>
          <span className="text-red-400 truncate max-w-15" title={d.from}>{d.from.length > 8 ? d.from.slice(0, 7) + '…' : d.from}</span>
          <span className="text-green-400 truncate max-w-15" title={d.to}>{d.to.length > 8 ? d.to.slice(0, 7) + '…' : d.to}</span>
        </div>
      ))}
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-vp-text-4 mt-1">{children}</p>;
}

function ColorRow({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const id = `color-${label.replace(/\s+/g, '-').toLowerCase()}`;
  return (
    <div className="flex items-center gap-2.5">
      <label
        htmlFor={id}
        className="w-4 h-4 rounded-sm border border-vp-border-2 shrink-0 cursor-pointer relative overflow-hidden"
        style={{ backgroundColor: value }}
        title={`${label}: ${value}`}
      >
        <input
          id={id}
          type="color"
          value={value || '#000000'}
          onChange={e => onChange(e.target.value)}
          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
          aria-label={label}
        />
      </label>
      <span className="text-[12px] text-vp-text-2 flex-1 truncate">{label}</span>
      <input
        type="text"
        value={value}
        onChange={e => { const v = e.target.value; if (/^#[0-9a-fA-F]{0,6}$/.test(v)) onChange(v); }}
        className="w-19 text-[11px] font-mono bg-vp-bg border border-vp-border rounded-sm px-1.5 py-0.5 text-vp-text-2 focus:outline-none focus:border-vp-accent"
        maxLength={7}
        spellCheck={false}
        aria-label={`${label} hex`}
        title={`${label} hex`}
        placeholder="#000000"
      />
    </div>
  );
}

function SelectRow({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  const id = `select-${label.replace(/\s+/g, '-').toLowerCase()}`;
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-[11px] text-vp-text-3 font-bold">{label}</label>
      <select id={id} value={value} onChange={e => onChange(e.target.value)} className="vp-input text-[12px] py-1.5" title={label}>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function SliderRow({ label, value, min, max, step, unit = '', decimals = 0, onChange }: {
  label: string; value: number; min: number; max: number; step: number; unit?: string; decimals?: number; onChange: (v: number) => void;
}) {
  const id = `slider-${label.replace(/\s+/g, '-').toLowerCase()}`;
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <label htmlFor={id} className="text-[11px] text-vp-text-3 font-bold">{label}</label>
        <span className="text-[11px] font-mono text-vp-text-2">{value.toFixed(decimals)}{unit}</span>
      </div>
      <input
        id={id}
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full accent-[var(--vp-accent)] h-1.5 cursor-pointer"
        title={`${label}: ${value.toFixed(decimals)}${unit}`}
      />
    </div>
  );
}
