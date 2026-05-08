'use client';

import React, { useState } from 'react';
import { createRSSFeed, updateRSSFeed, toggleRSSFeed, deleteRSSFeed, runRSSSync } from '@/app/actions/rss';

interface RSSManagerProps {
  sections: { id: string; name: string }[];
}

export function RSSManager({ sections }: RSSManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    targetSectionId: sections[0]?.id || '',
    autoPublish: false
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // Validação básica de URL
    const urlPattern = /^https?:\/\/.+/i;
    if (!urlPattern.test(formData.url)) {
      alert('Por favor, insira uma URL de feed RSS válida (começando com http:// ou https://)');
      return;
    }

    setLoading(true);
    try {
      const result = await createRSSFeed(formData);
      setLoading(false);
      
      if (result.success) {
        setIsOpen(false);
        setFormData({ ...formData, name: '', url: '' });
      } else {
        alert(result.error || 'Erro desconhecido ao salvar fonte RSS.');
      }
    } catch (err) {
      setLoading(false);
      console.error('RSS Submit Error:', err);
      alert('Ocorreu um erro de rede ou o servidor demorou muito para responder. Tente novamente.');
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="vp-btn vp-btn-primary py-2 text-[12px]"
      >
        Nova Fonte RSS
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#141413] border border-vp-border w-full max-w-[500px] p-6 shadow-2xl">
            <h2 className="text-[18px] font-display font-bold mb-4">Adicionar Fonte RSS</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="eyebrow block mb-1.5 text-[10px]">Nome da Fonte (Ex: Google News Política)</label>
                <input 
                  className="vp-input w-full" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  required 
                  title="Nome descritivo da fonte"
                />
              </div>
              
              <div>
                <label className="eyebrow block mb-1.5 text-[10px]">URL do Feed RSS</label>
                <input 
                  className="vp-input w-full font-mono text-[12px]" 
                  value={formData.url}
                  onChange={e => setFormData({...formData, url: e.target.value})}
                  placeholder="https://news.google.com/rss/..."
                  required 
                  title="URL completa do feed XML"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="eyebrow block mb-1.5 text-[10px]">Editoria Alvo</label>
                  <select 
                    className="vp-input w-full"
                    value={formData.targetSectionId}
                    onChange={e => setFormData({...formData, targetSectionId: e.target.value})}
                    title="Editoria onde as notícias serão postadas"
                  >
                    {sections.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2 cursor-pointer py-3">
                    <input 
                      type="checkbox" 
                      checked={formData.autoPublish}
                      onChange={e => setFormData({...formData, autoPublish: e.target.checked})}
                      className="accent-vp-accent" 
                    />
                    <span className="text-[12px]">Publicar direto</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="vp-btn flex-1 py-2.5 bg-transparent border-vp-border"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="vp-btn vp-btn-primary flex-1 py-2.5"
                >
                  {loading ? 'Salvando...' : 'Salvar Fonte'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export function RSSActions({ feed, sections }: { feed: any, sections: any[] }) {
  const [isEditing, setIsEditing] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: feed.name,
    url: feed.url,
    targetSectionId: feed.targetSectionId,
    autoPublish: feed.autoPublish
  });

  async function handleSync() {
    setSyncing(true);
    await runRSSSync(feed.id);
    setSyncing(false);
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const result = await updateRSSFeed(feed.id, formData);
    setLoading(false);
    if (result.success) setIsEditing(false);
    else alert(result.error);
  }

  return (
    <>
      <div className="flex gap-2 justify-end">
        <button 
          onClick={handleSync}
          disabled={syncing}
          className="text-[12px] text-vp-text-3 hover:text-vp-accent p-1"
          title="Sincronizar Agora"
        >
          {syncing ? '⌛' : '↻'}
        </button>
        <button 
          onClick={() => setIsEditing(true)}
          className="text-[12px] text-vp-text-3 hover:text-vp-text p-1"
          title="Editar"
        >
          ✎
        </button>
        <button 
          onClick={() => toggleRSSFeed(feed.id, !feed.isActive)}
          className={`text-[12px] p-1 ${feed.isActive ? 'text-green-500' : 'text-vp-text-3'}`}
          title={feed.isActive ? 'Desativar' : 'Ativar'}
        >
          {feed.isActive ? '●' : '○'}
        </button>
        <button 
          onClick={() => {
            if(confirm('Excluir esta fonte?')) deleteRSSFeed(feed.id);
          }}
          className="text-[12px] text-vp-text-3 hover:text-red-500 p-1"
          title="Excluir"
        >
          ✕
        </button>
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#141413] border border-vp-border w-full max-w-[500px] p-6 shadow-2xl">
            <h2 className="text-[18px] font-display font-bold mb-4">Editar Fonte RSS</h2>
            
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="eyebrow block mb-1.5 text-[10px]">Nome da Fonte</label>
                <input 
                  className="vp-input w-full" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  required 
                  title="Nome descritivo"
                />
              </div>
              
              <div>
                <label className="eyebrow block mb-1.5 text-[10px]">URL do Feed RSS</label>
                <input 
                  className="vp-input w-full font-mono text-[12px]" 
                  value={formData.url}
                  onChange={e => setFormData({...formData, url: e.target.value})}
                  required 
                  title="URL do feed"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="eyebrow block mb-1.5 text-[10px]">Editoria Alvo</label>
                  <select 
                    className="vp-input w-full"
                    value={formData.targetSectionId}
                    onChange={e => setFormData({...formData, targetSectionId: e.target.value})}
                    title="Seção alvo"
                  >
                    {sections.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2 cursor-pointer py-3">
                    <input 
                      type="checkbox" 
                      checked={formData.autoPublish}
                      onChange={e => setFormData({...formData, autoPublish: e.target.checked})}
                      className="accent-vp-accent" 
                    />
                    <span className="text-[12px]">Publicar direto</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4 text-left">
                <button 
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="vp-btn flex-1 py-2.5 bg-transparent border-vp-border"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="vp-btn vp-btn-primary flex-1 py-2.5"
                >
                  {loading ? 'Atualizando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
