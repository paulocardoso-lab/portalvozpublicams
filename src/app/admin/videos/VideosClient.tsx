'use client';

import React, { useState, useTransition, useEffect } from 'react';
import {
  createFeaturedVideo,
  updateFeaturedVideo,
  deleteFeaturedVideo,
  toggleFeaturedVideo,
} from '@/app/actions/videos';
import { resolveVideoEmbed } from '@/lib/video-embed';

type Video = {
  id: string;
  title: string;
  url: string;
  embedUrl: string;
  platform: string;
  thumbnailUrl: string | null;
  description: string | null;
  isActive: boolean;
  displayOrder: number;
  publishedAt: Date;
};

const PLATFORM_LABEL: Record<string, string> = {
  youtube: 'YouTube',
  vimeo: 'Vimeo',
  gif: 'GIF',
  other: 'Outro',
};

const PLATFORM_COLOR: Record<string, string> = {
  youtube: 'bg-red-600 text-white',
  vimeo: 'bg-blue-600 text-white',
  gif: 'bg-purple-600 text-white',
  other: 'bg-vp-surface-3 text-vp-text-2',
};

const EMPTY_FORM = {
  title: '',
  url: '',
  description: '',
  displayOrder: '0',
  publishedAt: new Date().toISOString().slice(0, 16),
};

interface PreviewState {
  platform: string;
  embedUrl: string;
  thumbnailUrl: string | null;
}

export function VideosClient({ initialVideos }: { initialVideos: Video[] }) {
  const [videos, setVideos] = useState(initialVideos);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [preview, setPreview] = useState<PreviewState | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Preview automático ao digitar URL
  useEffect(() => {
    const trimmed = form.url.trim();
    if (!trimmed) { setPreview(null); return; }
    try {
      const result = resolveVideoEmbed(trimmed);
      setPreview(result);
    } catch {
      setPreview(null);
    }
  }, [form.url]);

  function openCreate() {
    setEditId(null);
    setForm(EMPTY_FORM);
    setPreview(null);
    setError(null);
    setShowForm(true);
  }

  function openEdit(v: Video) {
    setEditId(v.id);
    setForm({
      title: v.title,
      url: v.url,
      description: v.description ?? '',
      displayOrder: String(v.displayOrder),
      publishedAt: new Date(v.publishedAt).toISOString().slice(0, 16),
    });
    setPreview({ platform: v.platform, embedUrl: v.embedUrl, thumbnailUrl: v.thumbnailUrl });
    setError(null);
    setShowForm(true);
  }

  function handleSave() {
    if (!form.title.trim()) { setError('O título é obrigatório.'); return; }
    if (!form.url.trim()) { setError('A URL é obrigatória.'); return; }

    startTransition(async () => {
      const data = {
        title: form.title,
        url: form.url,
        description: form.description || undefined,
        displayOrder: Number(form.displayOrder) || 0,
        publishedAt: form.publishedAt || undefined,
      };

      let result;
      if (editId) {
        result = await updateFeaturedVideo(editId, data);
      } else {
        result = await createFeaturedVideo(data);
      }

      if (!result.success) { setError('Erro ao salvar.'); return; }
      // Recarregar lista
      window.location.reload();
    });
  }

  function handleToggle(id: string, current: boolean) {
    startTransition(async () => {
      await toggleFeaturedVideo(id, !current);
      setVideos(vs => vs.map(v => v.id === id ? { ...v, isActive: !current } : v));
    });
  }

  function handleDelete(id: string) {
    if (!confirm('Excluir este vídeo?')) return;
    startTransition(async () => {
      await deleteFeaturedVideo(id);
      setVideos(vs => vs.filter(v => v.id !== id));
    });
  }

  const isGif = preview?.platform === 'gif';

  return (
    <div className="flex flex-col gap-6">
      {/* Botão novo */}
      <div className="flex justify-end">
        <button type="button" onClick={openCreate} className="vp-btn vp-btn-primary px-6 py-2.5 text-[13px] font-bold">
          + Novo vídeo
        </button>
      </div>

      {/* Formulário */}
      {showForm && (
        <div className="bg-vp-surface border border-vp-border p-6 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h2 className="font-sans text-[15px] font-bold text-vp-text uppercase tracking-wide">
              {editId ? 'Editar vídeo' : 'Novo vídeo'}
            </h2>
            <button type="button" onClick={() => setShowForm(false)} className="text-vp-text-4 hover:text-vp-text font-bold text-[18px] leading-none">×</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Coluna esquerda — campos */}
            <div className="flex flex-col gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-vp-text-3">URL do vídeo *</span>
                <input
                  type="url"
                  className="vp-input text-[13px]"
                  placeholder="https://youtube.com/watch?v=... ou URL de GIF"
                  value={form.url}
                  onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
                />
                {preview && (
                  <span className={`self-start text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 ${PLATFORM_COLOR[preview.platform] ?? 'bg-vp-surface-3 text-vp-text-2'}`}>
                    {PLATFORM_LABEL[preview.platform] ?? preview.platform} detectado
                  </span>
                )}
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-vp-text-3">Título *</span>
                <input
                  type="text"
                  className="vp-input text-[13px]"
                  placeholder="Título exibido abaixo do vídeo"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-vp-text-3">Descrição</span>
                <textarea
                  rows={3}
                  className="vp-input text-[13px] resize-y"
                  placeholder="Subtítulo ou chamada (opcional)"
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                />
              </label>

              <div className="grid grid-cols-2 gap-4">
                <label className="flex flex-col gap-1.5">
                  <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-vp-text-3">Ordem</span>
                  <input
                    type="number"
                    min={0}
                    className="vp-input text-[13px]"
                    value={form.displayOrder}
                    onChange={e => setForm(f => ({ ...f, displayOrder: e.target.value }))}
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-vp-text-3">Data</span>
                  <input
                    type="datetime-local"
                    className="vp-input text-[13px]"
                    value={form.publishedAt}
                    onChange={e => setForm(f => ({ ...f, publishedAt: e.target.value }))}
                  />
                </label>
              </div>
            </div>

            {/* Coluna direita — preview */}
            <div className="flex flex-col gap-2">
              <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-vp-text-3">Preview</span>
              <div className="border border-vp-border bg-vp-bg overflow-hidden">
                {/* Cabeçalho do card simulado */}
                <div className="px-4 py-2.5 border-b border-vp-border flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-vp-accent rotate-45 shrink-0" />
                  <span className="font-sans text-[10px] uppercase tracking-[0.14em] font-bold text-vp-text">Vídeo em Destaque</span>
                  {preview && (
                    <span className={`ml-auto text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 ${PLATFORM_COLOR[preview.platform] ?? ''}`}>
                      {PLATFORM_LABEL[preview.platform] ?? preview.platform}
                    </span>
                  )}
                </div>

                {/* Área do player */}
                <div className="relative w-full aspect-video bg-[#0a0a09] flex items-center justify-center">
                  {!preview && (
                    <span className="font-mono text-[11px] text-vp-text-4 uppercase tracking-widest">Cole uma URL acima</span>
                  )}
                  {preview && isGif && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={preview.embedUrl} alt="" className="w-full h-full object-cover" loading="lazy" />
                  )}
                  {preview && !isGif && preview.thumbnailUrl && (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={preview.thumbnailUrl} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-vp-accent flex items-center justify-center">
                          <span className="text-white text-[16px] ml-1">▶</span>
                        </div>
                      </div>
                    </>
                  )}
                  {preview && !isGif && !preview.thumbnailUrl && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-vp-accent flex items-center justify-center">
                        <span className="text-white text-[16px] ml-1">▶</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Título simulado */}
                <div className="px-4 py-3 border-t border-vp-border">
                  <p className="font-serif text-[13px] font-bold text-vp-text leading-snug">
                    {form.title || <span className="text-vp-text-4 italic">Título aparecerá aqui</span>}
                  </p>
                  {form.description && (
                    <p className="font-serif text-[12px] text-vp-text-2 leading-[1.45] line-clamp-2 mt-1">
                      {form.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {error && <p className="font-sans text-[12px] text-vp-urgent">{error}</p>}

          <div className="flex justify-end gap-3 pt-1 border-t border-vp-border">
            <button type="button" onClick={() => setShowForm(false)} className="vp-btn px-6 py-2.5 text-[13px]">
              Cancelar
            </button>
            <button type="button" onClick={handleSave} disabled={isPending} className="vp-btn vp-btn-primary px-8 py-2.5 text-[13px] font-bold">
              {isPending ? 'Salvando...' : editId ? 'Salvar alterações' : 'Criar vídeo'}
            </button>
          </div>
        </div>
      )}

      {/* Lista */}
      {videos.length === 0 ? (
        <div className="border border-vp-border bg-vp-surface p-10 text-center">
          <p className="font-serif italic text-[14px] text-vp-text-3">Nenhum vídeo cadastrado ainda.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {videos.map(v => (
            <div key={v.id} className={`bg-vp-surface border ${v.isActive ? 'border-vp-border' : 'border-vp-border opacity-50'} p-4 flex gap-4 items-start`}>
              {/* Thumbnail */}
              <div className="relative w-24 h-14 shrink-0 bg-[#0a0a09] overflow-hidden border border-vp-border">
                {v.thumbnailUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={v.thumbnailUrl} alt="" className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-vp-text-4 font-mono text-[10px]">▶</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 ${PLATFORM_COLOR[v.platform] ?? 'bg-vp-surface-3 text-vp-text-2'}`}>
                    {PLATFORM_LABEL[v.platform] ?? v.platform}
                  </span>
                  <span className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 ${v.isActive ? 'bg-vp-ok/20 text-vp-ok' : 'bg-vp-surface-3 text-vp-text-4'}`}>
                    {v.isActive ? 'Ativo' : 'Inativo'}
                  </span>
                  <span className="font-mono text-[10px] text-vp-text-4 ml-auto">
                    Ordem: {v.displayOrder}
                  </span>
                </div>
                <p className="font-sans text-[13px] font-bold text-vp-text truncate">{v.title}</p>
                {v.description && (
                  <p className="font-serif text-[12px] text-vp-text-3 truncate mt-0.5">{v.description}</p>
                )}
              </div>

              {/* Ações */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleToggle(v.id, v.isActive)}
                  disabled={isPending}
                  className={`vp-btn text-[11px] px-3 py-1.5 ${v.isActive ? '' : 'opacity-60'}`}
                >
                  {v.isActive ? 'Desativar' : 'Ativar'}
                </button>
                <button
                  type="button"
                  onClick={() => openEdit(v)}
                  className="vp-btn text-[11px] px-3 py-1.5"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(v.id)}
                  disabled={isPending}
                  className="vp-btn text-[11px] px-3 py-1.5 hover:border-vp-urgent hover:text-vp-urgent"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
