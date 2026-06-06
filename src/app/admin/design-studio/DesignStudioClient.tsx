'use client';

import React, { useState, useCallback, useTransition, useRef } from 'react';
import { saveDesignTokens, resetDesignTokens, DEFAULT_TOKENS, type DesignTokens } from '@/app/actions/design-tokens';

type Tab = 'cores' | 'tipografia' | 'layout';
type Viewport = 'mobile' | 'tablet' | 'desktop';

interface Props {
  initialTokens: DesignTokens;
}

const VIEWPORT_WIDTHS: Record<Viewport, string> = {
  mobile: '390px',
  tablet: '768px',
  desktop: '100%',
};

const COLOR_TOKENS: { key: keyof DesignTokens; label: string; group: string }[] = [
  { key: 'color.bg',       label: 'Fundo principal',     group: 'Fundos' },
  { key: 'color.surface',  label: 'Surface',             group: 'Fundos' },
  { key: 'color.surface-2',label: 'Surface 2',           group: 'Fundos' },
  { key: 'color.surface-3',label: 'Surface 3',           group: 'Fundos' },
  { key: 'color.border',   label: 'Borda',               group: 'Bordas' },
  { key: 'color.border-2', label: 'Borda 2',             group: 'Bordas' },
  { key: 'color.text',     label: 'Texto principal',     group: 'Texto' },
  { key: 'color.text-2',   label: 'Texto secundário',    group: 'Texto' },
  { key: 'color.text-3',   label: 'Texto terciário',     group: 'Texto' },
  { key: 'color.text-4',   label: 'Texto sutil',         group: 'Texto' },
  { key: 'color.accent',   label: 'Cor de destaque',     group: 'Acento' },
  { key: 'color.accent-hover', label: 'Destaque hover',  group: 'Acento' },
  { key: 'color.urgent',   label: 'Urgente / Ao vivo',   group: 'Semântico' },
];

const FONT_DISPLAY_OPTIONS = [
  'Playfair Display',
  'Merriweather',
  'Lora',
  'EB Garamond',
  'Cormorant Garamond',
  'PT Serif',
];
const FONT_SERIF_OPTIONS = [
  'Source Serif 4',
  'Merriweather',
  'Lora',
  'Georgia',
  'PT Serif',
  'Noto Serif',
];
const FONT_SANS_OPTIONS = [
  'Inter',
  'DM Sans',
  'IBM Plex Sans',
  'Nunito Sans',
  'Roboto',
  'Open Sans',
];

function hexToRgbContrast(hex: string): 'dark' | 'light' {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? 'dark' : 'light';
}

function groupBy<T>(arr: T[], fn: (item: T) => string): Record<string, T[]> {
  return arr.reduce((acc, item) => {
    const key = fn(item);
    acc[key] = acc[key] ?? [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, T[]>);
}

export function DesignStudioClient({ initialTokens }: Props) {
  const [tokens, setTokens] = useState<DesignTokens>({ ...initialTokens });
  const [activeTab, setActiveTab] = useState<Tab>('cores');
  const [viewport, setViewport] = useState<Viewport>('desktop');
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const previewRef = useRef<HTMLIFrameElement>(null);

  const applyToPreview = useCallback((updated: DesignTokens) => {
    const frame = previewRef.current;
    if (!frame?.contentWindow) return;
    const cssMap: Record<string, string> = {
      '--vp-bg': updated['color.bg'],
      '--vp-surface': updated['color.surface'],
      '--vp-surface-2': updated['color.surface-2'],
      '--vp-surface-3': updated['color.surface-3'],
      '--vp-border': updated['color.border'],
      '--vp-border-2': updated['color.border-2'],
      '--vp-text': updated['color.text'],
      '--vp-text-2': updated['color.text-2'],
      '--vp-text-3': updated['color.text-3'],
      '--vp-text-4': updated['color.text-4'],
      '--vp-accent': updated['color.accent'],
      '--vp-accent-hover': updated['color.accent-hover'],
      '--vp-urgent': updated['color.urgent'],
    };
    const root = frame.contentDocument?.documentElement;
    if (root) {
      Object.entries(cssMap).forEach(([k, v]) => root.style.setProperty(k, v));
    }
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

  const handleSave = () => {
    startTransition(async () => {
      await saveDesignTokens(tokens);
      setSaved(true);
      setIsDirty(false);
    });
  };

  const handleReset = () => {
    if (!confirm('Restaurar todos os tokens para os valores padrão?')) return;
    startTransition(async () => {
      await resetDesignTokens();
      setTokens({ ...DEFAULT_TOKENS });
      applyToPreview(DEFAULT_TOKENS as DesignTokens);
      setIsDirty(false);
      setSaved(false);
    });
  };

  const colorGroups = groupBy(COLOR_TOKENS, t => t.group);

  return (
    <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 130px)' }}>
      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <aside className="w-[300px] flex-shrink-0 border-r border-vp-border flex flex-col bg-vp-surface overflow-y-auto">
        {/* Tabs */}
        <div className="flex border-b border-vp-border sticky top-0 bg-vp-surface z-10">
          {(['cores', 'tipografia', 'layout'] as Tab[]).map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-[11px] font-bold uppercase tracking-wider transition-colors ${
                activeTab === tab
                  ? 'text-vp-accent border-b-2 border-vp-accent'
                  : 'text-vp-text-3 hover:text-vp-text-2'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex-1 p-4 flex flex-col gap-6">
          {/* ── Cores ── */}
          {activeTab === 'cores' && (
            <div className="flex flex-col gap-5">
              {Object.entries(colorGroups).map(([group, items]) => (
                <div key={group}>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-vp-text-4 mb-2">{group}</p>
                  <div className="flex flex-col gap-2">
                    {items.map(({ key, label }) => (
                      <ColorRow
                        key={key}
                        label={label}
                        value={tokens[key] as string}
                        onChange={v => updateToken(key, v)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Tipografia ── */}
          {activeTab === 'tipografia' && (
            <div className="flex flex-col gap-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-vp-text-4 mb-2">Famílias</p>
                <div className="flex flex-col gap-3">
                  <SelectRow
                    label="Título / Display"
                    value={tokens['type.font-display']}
                    options={FONT_DISPLAY_OPTIONS}
                    onChange={v => updateToken('type.font-display', v)}
                  />
                  <SelectRow
                    label="Corpo / Artigo"
                    value={tokens['type.font-serif']}
                    options={FONT_SERIF_OPTIONS}
                    onChange={v => updateToken('type.font-serif', v)}
                  />
                  <SelectRow
                    label="Interface / Sans"
                    value={tokens['type.font-sans']}
                    options={FONT_SANS_OPTIONS}
                    onChange={v => updateToken('type.font-sans', v)}
                  />
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-vp-text-4 mb-2">Escala</p>
                <div className="flex flex-col gap-3">
                  <SliderRow
                    label="Tamanho base"
                    value={Number(tokens['type.size-base'])}
                    min={13} max={20} step={1}
                    unit="px"
                    onChange={v => updateToken('type.size-base', String(v))}
                  />
                  <SliderRow
                    label="Altura de linha"
                    value={Number(tokens['type.line-height'])}
                    min={1.2} max={2.0} step={0.05}
                    decimals={2}
                    onChange={v => updateToken('type.line-height', String(v))}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── Layout ── */}
          {activeTab === 'layout' && (
            <div className="flex flex-col gap-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-vp-text-4 mb-2">Estrutura</p>
                <div className="flex flex-col gap-3">
                  <SliderRow
                    label="Border radius"
                    value={Number(tokens['layout.border-radius'])}
                    min={0} max={16} step={1}
                    unit="px"
                    onChange={v => updateToken('layout.border-radius', String(v))}
                  />
                  <SliderRow
                    label="Largura máx. container"
                    value={Number(tokens['layout.container-max'])}
                    min={960} max={1600} step={40}
                    unit="px"
                    onChange={v => updateToken('layout.container-max', String(v))}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action bar */}
        <div className="border-t border-vp-border p-3 flex flex-col gap-2 sticky bottom-0 bg-vp-surface">
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
      </aside>

      {/* ── Preview ─────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col bg-[#111110] overflow-hidden">
        {/* Viewport controls */}
        <div className="flex items-center gap-3 px-5 py-2.5 border-b border-vp-border bg-vp-surface">
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

        {/* iframe wrapper */}
        <div className="flex-1 flex items-start justify-center overflow-auto p-6">
          <div
            className="transition-all duration-300 bg-white shadow-2xl"
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

// ── Sub-components ────────────────────────────────────────────────────────────

function ColorRow({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const contrast = value?.startsWith('#') ? hexToRgbContrast(value) : 'light';
  return (
    <div className="flex items-center gap-2.5">
      <label
        className="w-4 h-4 rounded-sm border border-vp-border-2 flex-shrink-0 cursor-pointer relative overflow-hidden"
        style={{ backgroundColor: value }}
        title={value}
      >
        <input
          type="color"
          value={value || '#000000'}
          onChange={e => onChange(e.target.value)}
          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
        />
      </label>
      <span className="text-[12px] text-vp-text-2 flex-1 truncate">{label}</span>
      <input
        type="text"
        value={value}
        onChange={e => {
          const v = e.target.value;
          if (/^#[0-9a-fA-F]{0,6}$/.test(v)) onChange(v);
        }}
        className="w-[76px] text-[11px] font-mono bg-vp-bg border border-vp-border rounded-sm px-1.5 py-0.5 text-vp-text-2 focus:outline-none focus:border-vp-accent"
        maxLength={7}
        spellCheck={false}
      />
    </div>
  );
}

function SelectRow({ label, value, options, onChange }: {
  label: string; value: string; options: string[]; onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] text-vp-text-3 font-bold">{label}</span>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="vp-input text-[12px] py-1.5"
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function SliderRow({ label, value, min, max, step, unit = '', decimals = 0, onChange }: {
  label: string; value: number; min: number; max: number; step: number;
  unit?: string; decimals?: number; onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <span className="text-[11px] text-vp-text-3 font-bold">{label}</span>
        <span className="text-[11px] font-mono text-vp-text-2">{value.toFixed(decimals)}{unit}</span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full accent-[var(--vp-accent)] h-1.5 cursor-pointer"
      />
    </div>
  );
}
