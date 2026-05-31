'use client';

import React, { useState } from 'react';
import {
  createRSSFeed, updateRSSFeed, toggleRSSFeed,
  deleteRSSFeed, runRSSSync, previewRSSFeed, getFeedHealthStats,
} from '@/app/actions/rss';

interface RSSManagerProps {
  sections: { id: string; name: string }[];
}

type SyncSummary = {
  items: number; created: number; skipped: number; failed: number; durationMs: number; errors: string[];
};

type RSSFeedRow = {
  id: string; name: string; url: string; targetSectionId: string;
  autoPublish: boolean; requiresReview: boolean; isActive: boolean;
  syncIntervalHours: number; maxItemsPerSync: number;
  keywordFilter: string[]; blacklistKeywords: string[];
  consecutiveFailures: number; disabledAt: Date | null;
};

type SectionOption = { id: string; name: string };
type PreviewItem = { title: string; link: string; pubDate?: string };
type HealthStats = {
  successRate: number | null; lastError: string | null; avgDuration: number;
  recentLogs: { status: string; itemsCreated: number; itemsTotal: number; durationMs: number; createdAt: Date }[];
};

function FeedForm({
  initial, sections, onSubmit, onCancel, submitLabel, extra,
}: {
  initial: { name: string; url: string; targetSectionId: string; autoPublish: boolean; requiresReview: boolean; syncIntervalHours: number; maxItemsPerSync: number; keywordFilter: string[]; blacklistKeywords: string[] };
  sections: SectionOption[];
  onSubmit: (data: typeof initial) => Promise<void>;
  onCancel: () => void;
  submitLabel: string;
  extra?: React.ReactNode;
}) {
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [preview, setPreview] = useState<PreviewItem[] | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [keywordInput, setKeywordInput] = useState(initial.keywordFilter.join(', '));
  const [blacklistInput, setBlacklistInput] = useState(initial.blacklistKeywords.join(', '));

  async function handlePreview() {
    if (!form.url) return;
    setPreviewing(true);
    setPreview(null);
    setPreviewError(null);
    const result = await previewRSSFeed(form.url);
    setPreviewing(false);
    if (result.success) setPreview(result.items ?? []);
    else setPreviewError(result.error ?? 'Erro ao ler feed.');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const keywords = keywordInput.split(',').map(k => k.trim()).filter(Boolean);
    const blacklist = blacklistInput.split(',').map(k => k.trim()).filter(Boolean);
    await onSubmit({ ...form, keywordFilter: keywords, blacklistKeywords: blacklist });
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="eyebrow block mb-1.5 text-[10px]">Nome da Fonte</label>
        <input className="vp-input w-full" value={form.name} title="Nome da fonte"
          onChange={e => setForm({ ...form, name: e.target.value })} required />
      </div>

      <div>
        <label className="eyebrow block mb-1.5 text-[10px]">URL do Feed RSS</label>
        <div className="flex gap-2">
          <input className="vp-input flex-1 font-mono text-[12px]" value={form.url}
            onChange={e => { setForm({ ...form, url: e.target.value }); setPreview(null); setPreviewError(null); }}
            placeholder="https://news.google.com/rss/..." required />
          <button type="button" onClick={handlePreview} disabled={previewing || !form.url}
            className="vp-btn py-2 px-3 text-[11px] border-vp-border whitespace-nowrap"
            title="Testar feed e ver primeiros títulos">
            {previewing ? '⌛' : '▶ Testar'}
          </button>
        </div>
        {previewError && (
          <p className="mt-1 text-[11px] text-vp-urgent">{previewError}</p>
        )}
        {preview && preview.length > 0 && (
          <div className="mt-2 border border-vp-border bg-vp-surface/30 p-3 space-y-1.5">
            <p className="text-[10px] font-black uppercase tracking-widest text-vp-text-4 mb-2">
              Preview — {preview.length} item(s) encontrados
            </p>
            {preview.map((item, i) => (
              <div key={i} className="text-[12px] text-vp-text-2 leading-snug border-l-2 border-vp-accent/40 pl-2">
                {item.title}
                {item.pubDate && <span className="text-vp-text-4 ml-2 text-[10px]">{item.pubDate}</span>}
              </div>
            ))}
          </div>
        )}
        {preview && preview.length === 0 && (
          <p className="mt-1 text-[11px] text-vp-text-3">Feed válido, mas sem itens no momento.</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="eyebrow block mb-1.5 text-[10px]">Editoria Alvo</label>
          <select className="vp-input w-full" title="Editoria alvo" value={form.targetSectionId}
            onChange={e => setForm({ ...form, targetSectionId: e.target.value })}>
            {sections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div className="flex flex-col justify-end">
          <label className="flex items-center gap-2 cursor-pointer py-3">
            <input type="checkbox" checked={form.autoPublish}
              onChange={e => setForm({ ...form, autoPublish: e.target.checked })}
              className="accent-vp-accent" />
            <span className="text-[12px]">Publicar direto</span>
          </label>
        </div>
        <div className="flex flex-col justify-end">
          <label className="flex items-center gap-2 cursor-pointer py-3">
            <input type="checkbox" checked={form.requiresReview}
              onChange={e => setForm({ ...form, requiresReview: e.target.checked })}
              className="accent-vp-accent"
              disabled={form.autoPublish} />
            <span className={`text-[12px] ${form.autoPublish ? 'text-vp-text-4' : ''}`}>
              Exige revisão
            </span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="eyebrow block mb-1.5 text-[10px]">Frequência (horas)</label>
          <input type="number" min={1} max={168} className="vp-input w-full" title="Frequência em horas" value={form.syncIntervalHours}
            onChange={e => setForm({ ...form, syncIntervalHours: Number(e.target.value) })} />
        </div>
        <div>
          <label className="eyebrow block mb-1.5 text-[10px]">Máx. itens por sync</label>
          <input type="number" min={1} max={50} className="vp-input w-full" title="Máximo de itens por sincronização" value={form.maxItemsPerSync}
            onChange={e => setForm({ ...form, maxItemsPerSync: Number(e.target.value) })} />
        </div>
      </div>

      <div>
        <label className="eyebrow block mb-1.5 text-[10px]">
          Filtro de palavras-chave <span className="normal-case font-normal text-vp-text-4">(separadas por vírgula — deixe vazio para importar tudo)</span>
        </label>
        <input className="vp-input w-full text-[12px]" value={keywordInput}
          onChange={e => setKeywordInput(e.target.value)}
          placeholder="ex: Mato Grosso do Sul, MS, Campo Grande"
          title="Filtro de palavras-chave (whitelist)" />
      </div>

      <div>
        <label className="eyebrow block mb-1.5 text-[10px]">
          Blacklist <span className="normal-case font-normal text-vp-text-4">(bloqueia artigos que contenham estas palavras — separadas por vírgula)</span>
        </label>
        <input className="vp-input w-full text-[12px]" value={blacklistInput}
          onChange={e => setBlacklistInput(e.target.value)}
          placeholder="ex: patrocinado, publi, propaganda"
          title="Palavras que bloqueiam o artigo" />
      </div>

      {extra}

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel}
          className="vp-btn flex-1 py-2.5 bg-transparent border-vp-border">
          Cancelar
        </button>
        <button type="submit" disabled={loading}
          className="vp-btn vp-btn-primary flex-1 py-2.5">
          {loading ? 'Salvando...' : submitLabel}
        </button>
      </div>
    </form>
  );
}

function HealthBadge({ feedId }: { feedId: string }) {
  const [stats, setStats] = useState<HealthStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  async function load() {
    if (stats) { setOpen(true); return; }
    setLoading(true);
    const result = await getFeedHealthStats(feedId);
    setStats(result);
    setLoading(false);
    setOpen(true);
  }

  const rate = stats?.successRate ?? null;
  const color = rate === null ? 'text-vp-text-4' : rate >= 80 ? 'text-green-400' : rate >= 50 ? 'text-yellow-400' : 'text-vp-urgent';

  return (
    <div className="relative">
      <button type="button" onClick={load} className={`text-[11px] font-mono font-bold ${color} hover:underline`}
        title="Ver saúde do feed">
        {loading ? '...' : rate !== null ? `${rate}%` : stats ? 'sem dados' : '—'}
      </button>

      {open && stats && (
        <div className="absolute right-0 top-6 z-30 w-70 bg-[#1a1a18] border border-vp-border shadow-2xl p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-vp-text-4">Saúde do Feed</span>
            <button type="button" onClick={() => setOpen(false)} className="text-vp-text-4 hover:text-vp-text text-[12px]">✕</button>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-vp-surface/40 p-2 rounded">
              <div className={`text-[18px] font-black ${color}`}>{rate !== null ? `${rate}%` : '—'}</div>
              <div className="text-[9px] text-vp-text-4 uppercase tracking-wider">Sucesso</div>
            </div>
            <div className="bg-vp-surface/40 p-2 rounded">
              <div className="text-[18px] font-black text-vp-text">{stats.avgDuration > 0 ? `${(stats.avgDuration / 1000).toFixed(1)}s` : '—'}</div>
              <div className="text-[9px] text-vp-text-4 uppercase tracking-wider">Duração</div>
            </div>
            <div className="bg-vp-surface/40 p-2 rounded">
              <div className="text-[18px] font-black text-vp-text">{stats.recentLogs.length}</div>
              <div className="text-[9px] text-vp-text-4 uppercase tracking-wider">Rodadas</div>
            </div>
          </div>

          {stats.recentLogs.length > 0 && (
            <div className="space-y-1">
              <p className="text-[9px] font-black uppercase tracking-widest text-vp-text-4">Últimas rodadas</p>
              {stats.recentLogs.map((log, i) => (
                <div key={i} className="flex items-center justify-between text-[11px]">
                  <span className={log.status === 'SUCCESS' ? 'text-green-400' : log.status === 'PARTIAL' ? 'text-yellow-400' : 'text-vp-urgent'}>
                    {log.status}
                  </span>
                  <span className="text-vp-text-3">{log.itemsCreated}/{log.itemsTotal} criados</span>
                  <span className="text-vp-text-4 text-[10px]">{(log.durationMs / 1000).toFixed(1)}s</span>
                </div>
              ))}
            </div>
          )}

          {stats.lastError && (
            <div className="border border-vp-urgent/30 bg-vp-urgent/10 p-2 rounded">
              <p className="text-[9px] font-black uppercase tracking-widest text-vp-urgent mb-1">Último erro</p>
              <p className="text-[11px] text-vp-text-2 break-all line-clamp-3">{stats.lastError}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function RSSManager({ sections }: RSSManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const defaultForm = {
    name: '', url: '', targetSectionId: sections[0]?.id || '',
    autoPublish: false, requiresReview: true,
    syncIntervalHours: 6, maxItemsPerSync: 10,
    keywordFilter: [] as string[], blacklistKeywords: [] as string[],
  };

  async function handleCreate(data: typeof defaultForm) {
    const result = await createRSSFeed(data);
    if (result.success) setIsOpen(false);
    else alert(result.error || 'Erro ao salvar.');
  }

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)} className="vp-btn vp-btn-primary py-2 text-[12px]">
        + Nova Fonte RSS
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#141413] border border-vp-border w-full max-w-130 p-6 shadow-2xl my-8">
            <h2 className="text-[18px] font-display font-bold mb-5">Adicionar Fonte RSS</h2>
            <FeedForm
              initial={defaultForm}
              sections={sections}
              onSubmit={handleCreate}
              onCancel={() => setIsOpen(false)}
              submitLabel="Salvar Fonte"
            />
          </div>
        </div>
      )}
    </>
  );
}

export function RSSActions({ feed, sections }: { feed: RSSFeedRow; sections: SectionOption[] }) {
  const [isEditing, setIsEditing] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  async function handleSync() {
    setSyncing(true);
    setMessage(null);
    const result = await runRSSSync(feed.id);
    setSyncing(false);

    if (!result.success) {
      setMessage({ type: 'error', text: result.error || 'Falha.' });
      return;
    }

    const s = result.summary as SyncSummary | undefined;
    if (!s) { setMessage({ type: 'success', text: 'Sincronizado.' }); return; }

    const dur = s.durationMs > 0 ? ` (${(s.durationMs / 1000).toFixed(1)}s)` : '';
    const text = `${s.created} criadas, ${s.skipped} ignoradas, ${s.failed} falhas de ${s.items} itens${dur}.`;
    setMessage({ type: s.failed > 0 && s.created === 0 ? 'error' : 'success', text });
  }

  async function handleUpdate(data: {
    name: string; url: string; targetSectionId: string; autoPublish: boolean;
    requiresReview: boolean; syncIntervalHours: number; maxItemsPerSync: number;
    keywordFilter: string[]; blacklistKeywords: string[];
  }) {
    const result = await updateRSSFeed(feed.id, data);
    if (result.success) setIsEditing(false);
    else alert(result.error);
  }

  const isAutoDisabled = !feed.isActive && feed.disabledAt !== null;

  return (
    <>
      <div className="flex flex-col items-end gap-2">
        {isAutoDisabled && (
          <span className="text-[10px] text-vp-urgent border border-vp-urgent/30 px-2 py-0.5 rounded">
            Auto-desabilitado ({feed.consecutiveFailures} falhas)
          </span>
        )}
        {message && (
          <div className={`max-w-75 border px-2 py-1 text-[11px] ${message.type === 'success' ? 'border-vp-ok/40 bg-vp-ok/10 text-vp-ok' : 'border-vp-urgent/40 bg-vp-urgent/10 text-vp-urgent'}`}>
            {message.text}
          </div>
        )}
        <div className="flex items-center gap-3">
          <HealthBadge feedId={feed.id} />
          <button type="button" onClick={handleSync} disabled={syncing}
            className="text-[13px] text-vp-text-3 hover:text-vp-accent p-1" title="Sincronizar Agora">
            {syncing ? '⌛' : '↻'}
          </button>
          <button type="button" onClick={() => setIsEditing(true)}
            className="text-[13px] text-vp-text-3 hover:text-vp-text p-1" title="Editar">
            ✎
          </button>
          <button type="button" onClick={() => toggleRSSFeed(feed.id, !feed.isActive)}
            className={`text-[13px] p-1 ${feed.isActive ? 'text-green-500' : 'text-vp-text-4'}`}
            title={feed.isActive ? 'Desativar' : 'Ativar'}>
            {feed.isActive ? '●' : '○'}
          </button>
          <button type="button" onClick={async () => {
            if (confirm('Excluir esta fonte e todos os seus logs?')) {
              const r = await deleteRSSFeed(feed.id);
              if (!r.success) alert('Falha ao excluir.');
            }
          }} className="text-[13px] text-vp-text-3 hover:text-red-500 p-1" title="Excluir">
            ✕
          </button>
        </div>
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#141413] border border-vp-border w-full max-w-130 p-6 shadow-2xl my-8">
            <h2 className="text-[18px] font-display font-bold mb-5">Editar Fonte RSS</h2>
            <FeedForm
              initial={{
                name: feed.name, url: feed.url,
                targetSectionId: feed.targetSectionId,
                autoPublish: feed.autoPublish,
                requiresReview: feed.requiresReview,
                syncIntervalHours: feed.syncIntervalHours,
                maxItemsPerSync: feed.maxItemsPerSync,
                keywordFilter: feed.keywordFilter,
                blacklistKeywords: feed.blacklistKeywords,
              }}
              sections={sections}
              onSubmit={handleUpdate}
              onCancel={() => setIsEditing(false)}
              submitLabel="Salvar Alterações"
            />
          </div>
        </div>
      )}
    </>
  );
}
