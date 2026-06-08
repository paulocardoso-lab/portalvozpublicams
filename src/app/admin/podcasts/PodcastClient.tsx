'use client';

import React, { useState, useRef } from 'react';
import { PodcastEpisode } from '@prisma/client';
import { savePodcastEpisode, togglePodcastEpisode, deletePodcastEpisode } from '@/app/actions/podcast';
import { uploadAudioFile } from '@/app/actions/audio';
import { useRouter } from 'next/navigation';
import { SafeImage } from '@/components/shared/SafeImage';

export function PodcastClient({ initialEpisodes }: { initialEpisodes: PodcastEpisode[] }) {
  const router = useRouter();
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>(initialEpisodes);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [embedUrl, setEmbedUrl] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [duration, setDuration] = useState('');
  const [isActive, setIsActive] = useState(true);

  // Audio upload
  const audioInputRef = useRef<HTMLInputElement>(null);
  const [audioUploading, setAudioUploading] = useState(false);
  const [audioUploadError, setAudioUploadError] = useState('');

  const startEdit = (ep: PodcastEpisode) => {
    setEditingId(ep.id);
    setIsAdding(false);
    setTitle(ep.title);
    setDescription(ep.description || '');
    setEmbedUrl(ep.embedUrl || '');
    setAudioUrl(ep.audioUrl || '');
    setCoverImage(ep.coverImage || '');
    setDuration(ep.duration || '');
    setIsActive(ep.isActive);
    setAudioUploadError('');
  };

  const startAdd = () => {
    setEditingId(null);
    setIsAdding(true);
    setTitle('');
    setDescription('');
    setEmbedUrl('');
    setAudioUrl('');
    setCoverImage('');
    setDuration('');
    setIsActive(true);
    setAudioUploadError('');
  };

  const cancel = () => {
    setEditingId(null);
    setIsAdding(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    setSaving(true);
    
    try {
      const saved = await savePodcastEpisode({
        id: editingId || undefined,
        title,
        description,
        embedUrl,
        audioUrl,
        coverImage,
        duration,
        isActive
      });

      if (editingId) {
        setEpisodes(episodes.map(a => a.id === saved.id ? saved : a));
      } else {
        setEpisodes([saved, ...episodes]);
      }
      cancel();
      router.refresh();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar episódio');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (id: string, current: boolean) => {
    try {
      await togglePodcastEpisode(id, current);
      setEpisodes(episodes.map(a => a.id === id ? { ...a, isActive: !current } : a));
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este episódio?')) return;
    try {
      await deletePodcastEpisode(id);
      setEpisodes(episodes.filter(a => a.id !== id));
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="grid gap-6">
      {!isAdding && !editingId && (
        <button onClick={startAdd} className="vp-btn vp-btn-primary w-max">
          + Novo Episódio
        </button>
      )}

      {(isAdding || editingId) && (
        <form onSubmit={handleSave} className="bg-vp-surface border border-vp-border p-6 grid gap-4">
          <h3 className="font-display text-[18px] mb-2">{isAdding ? 'Novo Episódio' : 'Editar Episódio'}</h3>
          
          <div>
            <label className="block text-[12px] uppercase tracking-[0.1em] text-vp-text-2 mb-2 font-bold" title="Título">Título</label>
            <input 
              type="text" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              className="vp-input w-full" 
              placeholder="Ex: Ep 05 - O impacto da seca..."
              required
              title="Título"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] uppercase tracking-[0.1em] text-vp-text-2 mb-2 font-bold" title="Duração">Duração</label>
              <input 
                type="text" 
                value={duration} 
                onChange={e => setDuration(e.target.value)} 
                className="vp-input w-full" 
                placeholder="Ex: 45 min"
                title="Duração"
              />
            </div>
            <div>
              <label className="block text-[12px] uppercase tracking-[0.1em] text-vp-text-2 mb-2 font-bold" title="Capa">URL da Capa (Imagem)</label>
              <input 
                type="text" 
                value={coverImage} 
                onChange={e => setCoverImage(e.target.value)} 
                className="vp-input w-full" 
                placeholder="https://..."
                title="Capa"
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] uppercase tracking-[0.1em] text-vp-text-2 mb-2 font-bold" title="Embed URL">URL do Embed (Spotify / YouTube)</label>
            <input
              type="text"
              value={embedUrl}
              onChange={e => setEmbedUrl(e.target.value)}
              className="vp-input w-full"
              placeholder="https://open.spotify.com/embed/..."
              title="Embed URL"
            />
          </div>

          <div>
            <label className="block text-[12px] uppercase tracking-[0.1em] text-vp-text-2 mb-2 font-bold" title="URL do áudio direto">URL do Áudio Direto (MP3, OGG, WAV)</label>
            <input
              type="text"
              value={audioUrl}
              onChange={e => setAudioUrl(e.target.value)}
              className="vp-input w-full mb-2"
              placeholder="https://... ou envie um arquivo abaixo"
              title="URL do áudio direto"
            />
            <input
              ref={audioInputRef}
              type="file"
              accept="audio/mpeg,audio/mp3,audio/ogg,audio/wav,audio/mp4,audio/aac,.mp3,.ogg,.wav,.m4a,.aac"
              title="Arquivo de áudio do episódio"
              className="hidden"
              onChange={async e => {
                const file = e.target.files?.[0];
                if (!file) return;
                setAudioUploading(true);
                setAudioUploadError('');
                try {
                  const fd = new FormData();
                  fd.append('file', file);
                  const url = await uploadAudioFile(fd, 'podcasts');
                  setAudioUrl(url);
                } catch (err) {
                  setAudioUploadError(err instanceof Error ? err.message : 'Erro ao enviar áudio.');
                } finally {
                  setAudioUploading(false);
                  e.target.value = '';
                }
              }}
            />
            <button
              type="button"
              disabled={audioUploading || saving}
              onClick={() => audioInputRef.current?.click()}
              className="vp-btn text-[11px] py-1.5 w-full"
            >
              {audioUploading ? 'Enviando arquivo...' : 'Enviar arquivo de áudio'}
            </button>
            {audioUploadError && (
              <span className="text-[11px] text-red-400 mt-1 block">{audioUploadError}</span>
            )}
          </div>

          <div className="flex items-center gap-2 mt-2">
            <input 
              type="checkbox" 
              id="isActive" 
              checked={isActive} 
              onChange={e => setIsActive(e.target.checked)} 
              title="Status"
            />
            <label htmlFor="isActive" className="text-[14px]">Episódio ativo/público</label>
          </div>

          <div className="flex gap-3 mt-4">
            <button type="submit" disabled={saving} className="vp-btn vp-btn-primary">
              {saving ? 'Salvando...' : 'Salvar Episódio'}
            </button>
            <button type="button" onClick={cancel} disabled={saving} className="vp-btn">
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-3">
        {episodes.length === 0 && <p className="text-vp-text-3 italic">Nenhum episódio cadastrado.</p>}
        {episodes.map(ep => (
          <div key={ep.id} className={`flex items-center justify-between p-4 border ${ep.isActive ? 'border-vp-border bg-vp-surface' : 'border-vp-border opacity-60'}`}>
            <div className="flex gap-4">
              {ep.coverImage ? (
                <div className="relative w-16 h-16 overflow-hidden rounded-sm border border-vp-border">
                  <SafeImage src={ep.coverImage} alt="Cover" fill sizes="64px" className="object-cover" />
                </div>
              ) : (
                <div className="w-16 h-16 bg-vp-bg border border-vp-border flex items-center justify-center text-[10px] text-vp-text-3">SEM CAPA</div>
              )}
              <div>
                <h4 className="font-sans text-[15px] font-semibold flex items-center gap-2">
                  {ep.title}
                  {!ep.isActive && <span className="text-[10px] bg-vp-border-2 px-1 rounded-sm">RASCUNHO</span>}
                </h4>
                <div className="text-[12px] text-vp-text-3 mt-1 flex gap-3">
                  <span>Duração: {ep.duration || '--'}</span>
                  <span>Publicado: {new Date(ep.publishedAt).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => handleToggle(ep.id, ep.isActive)} 
                className="px-3 py-1 text-[12px] border border-vp-border hover:border-vp-accent hover:text-vp-accent transition-colors"
              >
                {ep.isActive ? 'Ocultar' : 'Ativar'}
              </button>
              <button 
                onClick={() => startEdit(ep)} 
                className="px-3 py-1 text-[12px] border border-vp-border hover:border-vp-accent transition-colors"
              >
                Editar
              </button>
              <button 
                onClick={() => handleDelete(ep.id)} 
                className="px-3 py-1 text-[12px] border border-[#ff3333] text-[#ff3333] hover:bg-[#ff3333] hover:text-white transition-colors"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
