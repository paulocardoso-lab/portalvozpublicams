"use client";

import React, { useState } from 'react';
import { Article, Section, Role } from '@prisma/client';

import { saveArticle, restoreVersion } from '@/app/admin/posts/actions';
import { TiptapEditor } from './TiptapEditor';
import { SafeImage } from '@/components/shared/SafeImage';
type AuthorOption = {
  id: string;
  name: string;
  role: Role;
};

interface ArticleEditorProps {
  article?: Article & { 
    authors: AuthorOption[];
    versions?: {
      id: string;
      createdAt: Date;
      author: { name: string };
    }[];
  };
  sections: Section[];
  users: AuthorOption[];
}

export function ArticleEditor({ article, sections, users }: ArticleEditorProps) {
  const [activeTab, setActiveTab] = useState<'edit' | 'history'>('edit');
  const [slug, setSlug] = useState(article?.slug || '');
  const [title, setTitle] = useState(article?.title || '');
  const [content, setContent] = useState(() => {
    if (!article?.body) return '';
    if (typeof article.body === 'string') return article.body;
    return JSON.stringify(article.body);
  });

  const slugify = (text: string) =>
    text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-');

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (!article?.slug) setSlug(slugify(e.target.value));
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(slugify(e.target.value));
  };

  const handleRestore = async (versionId: string) => {
    if (confirm('Tem certeza que deseja restaurar esta versão? O rascunho atual será sobrescrito.')) {
      try {
        await restoreVersion(versionId);
        window.location.reload();
      } catch {
        alert('Erro ao restaurar versão.');
      }
    }
  };

  return (
    <div className="space-y-6">
      {article?.id && (
        <div className="flex gap-4 border-b border-vp-border mb-6">
          <button 
            onClick={() => setActiveTab('edit')}
            className={`pb-3 px-1 text-[13px] font-bold uppercase tracking-wider transition-colors ${activeTab === 'edit' ? 'text-vp-accent border-b-2 border-vp-accent' : 'text-vp-text-3 hover:text-vp-text'}`}
          >
            Editor
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`pb-3 px-1 text-[13px] font-bold uppercase tracking-wider transition-colors ${activeTab === 'history' ? 'text-vp-accent border-b-2 border-vp-accent' : 'text-vp-text-3 hover:text-vp-text'}`}
          >
            Histórico de Versões
          </button>
        </div>
      )}

      {activeTab === 'edit' ? (
        <form action={saveArticle} className="grid grid-cols-[1fr_320px] gap-8 max-w-[1200px]">
          <input type="hidden" name="id" value={article?.id} />
          
          <div className="space-y-6">
            <div>
              <label className="block text-[12px] font-bold uppercase tracking-wider text-vp-text-3 mb-2">Título da Matéria</label>
              <input 
                name="title"
                value={title}
                onChange={handleTitleChange}
                className="vp-input text-[24px] font-display py-3" 
                placeholder="Ex: O silêncio que engole o Pantanal..."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-bold uppercase tracking-wider text-vp-text-3 mb-2">Slug (URL)</label>
                <input 
                  name="slug"
                  value={slug}
                  onChange={handleSlugChange}
                  className="vp-input font-mono text-[13px]" 
                  placeholder="o-silencio-pantanal"
                  required
                />
              </div>
              <div>
                <label className="block text-[12px] font-bold uppercase tracking-wider text-vp-text-3 mb-2">Chapéu (Eyebrow)</label>
                <input 
                  name="eyebrow"
                  defaultValue={article?.eyebrow || ''}
                  className="vp-input text-[13px]" 
                  placeholder="Ex: Especial Pantanal"
                />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-bold uppercase tracking-wider text-vp-text-3 mb-2">Imagem de Destaque</label>
              <div className="flex flex-col gap-3">
                {article?.heroImage && (
                  <div className="relative w-full h-[200px] bg-vp-surface border border-vp-border overflow-hidden rounded-[4px]">
                    <SafeImage src={article.heroImage} alt="Hero preview" fill sizes="320px" className="object-cover" />
                    <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded">Imagem Atual</div>
                  </div>
                )}
                <input 
                  type="file" 
                  name="heroImageFile" 
                  accept="image/*"
                  className="vp-input text-[12px] file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-vp-accent file:text-white hover:file:bg-vp-accent-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-bold uppercase tracking-wider text-vp-text-3 mb-2">Linha de Apoio (Lead)</label>
              <textarea 
                name="lead"
                defaultValue={article?.lead || ''}
                className="vp-input min-h-[80px] text-[15px] font-serif italic py-3" 
                placeholder="Um breve resumo que instigue a leitura..."
              />
            </div>

            <div>
              <label className="block text-[12px] font-bold uppercase tracking-wider text-vp-text-3 mb-2">Corpo da Matéria</label>
              <TiptapEditor 
                content={content} 
                onChange={setContent} 
              />
              <input type="hidden" name="content" value={content} />
            </div>
          </div>

          <aside className="space-y-6">
            <div className="bg-vp-surface border border-vp-border p-5 rounded-[4px] space-y-4">
              <h3 className="text-[14px] font-bold border-b border-vp-border pb-3 mb-2">Publicação</h3>
              
              <div>
                <label className="block text-[11px] text-vp-text-3 uppercase font-bold mb-1.5">Status</label>
                <select name="status" defaultValue={article?.status || 'DRAFT'} className="vp-input text-[13px]">
                  <option value="DRAFT">Rascunho</option>
                  <option value="IN_REVIEW">Em Revisão</option>
                  <option value="PUBLISHED">Publicado</option>
                  <option value="ARCHIVED">Arquivado</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-vp-text-3 uppercase font-bold mb-1.5">Editoria Principal</label>
                <select name="sectionId" defaultValue={article?.sectionId || ''} className="vp-input text-[13px]" required>
                  <option value="" disabled>Selecione...</option>
                  {sections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-vp-text-3 uppercase font-bold mb-1.5">Autores</label>
                <div className="max-h-[150px] overflow-y-auto border border-vp-border p-2 space-y-1 vp-scroll">
                  {users.filter(u => u.role !== Role.READER).map(u => (
                    <label key={u.id} className="flex items-center gap-2 text-[12px] cursor-pointer hover:text-vp-accent">
                      <input 
                        type="checkbox" 
                        name="authorIds" 
                        value={u.id} 
                        defaultChecked={article?.authors.some(a => a.id === u.id) || users.length === 1}
                      />
                      {u.name}
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-t border-vp-border pt-4">
                <label className="flex items-center justify-between gap-3 cursor-pointer group">
                  <span className="text-[11px] text-vp-text-3 uppercase font-bold">Permitir comentários</span>
                  <input
                    type="checkbox"
                    name="allowComments"
                    defaultChecked={article?.allowComments ?? true}
                    className="w-4 h-4 accent-vp-accent cursor-pointer"
                  />
                </label>
              </div>

              <div className="pt-4 space-y-3">
                <button type="submit" className="vp-btn vp-btn-primary w-full py-2.5">
                  {article ? 'Salvar Alterações' : 'Publicar Matéria'}
                </button>
                <button type="button" onClick={() => window.history.back()} className="vp-btn w-full py-2.5 bg-transparent border-vp-border text-vp-text-3 hover:text-vp-text">
                  Cancelar
                </button>
              </div>
            </div>
          </aside>
        </form>
      ) : (
        <div className="max-w-[800px] bg-vp-surface border border-vp-border rounded-[4px] overflow-hidden">
          <table className="w-full text-[13px]">
            <thead className="bg-vp-surface-2 border-b border-vp-border">
              <tr>
                <th className="text-left py-3 px-4 font-bold uppercase text-[11px] text-vp-text-3">Data</th>
                <th className="text-left py-3 px-4 font-bold uppercase text-[11px] text-vp-text-3">Autor</th>
                <th className="text-right py-3 px-4 font-bold uppercase text-[11px] text-vp-text-3">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-vp-border">
              {article?.versions?.length ? (
                article.versions.map(v => (
                  <tr key={v.id} className="hover:bg-vp-surface-2 transition-colors">
                    <td className="py-3 px-4 text-vp-text-2">
                      {new Date(v.createdAt).toLocaleString('pt-BR')}
                    </td>
                    <td className="py-3 px-4 font-medium">
                      {v.author.name}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button 
                        onClick={() => handleRestore(v.id)}
                        className="text-vp-accent hover:underline font-bold"
                      >
                        Restaurar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-vp-text-3 italic">
                    Nenhuma versão anterior encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
