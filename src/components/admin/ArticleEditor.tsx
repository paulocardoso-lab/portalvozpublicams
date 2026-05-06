"use client";

import React, { useState } from 'react';
import { Article, Section, User, Role } from '@prisma/client';
import { saveArticle } from '@/app/admin/posts/actions';
import { TiptapEditor } from './TiptapEditor';

interface ArticleEditorProps {
  article?: Article & { authors: User[] };
  sections: Section[];
  users: User[];
}

export function ArticleEditor({ article, sections, users }: ArticleEditorProps) {
  const [slug, setSlug] = useState(article?.slug || '');
  const [title, setTitle] = useState(article?.title || '');
  const [content, setContent] = useState(() => {
    if (!article?.body) return '';
    if (typeof article.body === 'string') return article.body;
    return JSON.stringify(article.body);
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!article) {
      setSlug(val.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''));
    }
  };

  return (
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
              onChange={(e) => setSlug(e.target.value)}
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
                <img src={article.heroImage} alt="Hero preview" className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded">Imagem Atual</div>
              </div>
            )}
            <input 
              type="file" 
              name="heroImageFile" 
              accept="image/*"
              className="vp-input text-[12px] file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-vp-accent file:text-white hover:file:bg-vp-accent-2"
            />
            <p className="text-[11px] text-vp-text-3 italic">Recomendado: 1200x800px (JPG/PNG). Deixe vazio para manter a atual.</p>
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

          <div className="pt-4 space-y-3">
            <button type="submit" className="vp-btn vp-btn-primary w-full py-2.5">
              {article ? 'Salvar Alterações' : 'Publicar Matéria'}
            </button>
            <button type="button" onClick={() => window.history.back()} className="vp-btn w-full py-2.5 bg-transparent border-vp-border text-vp-text-3 hover:text-vp-text">
              Cancelar
            </button>
          </div>
        </div>

        <div className="bg-vp-warn/5 border border-vp-warn/20 p-4 rounded-[4px]">
          <h4 className="text-[11px] font-bold text-vp-warn uppercase mb-2">Checklist de Qualidade</h4>
          <ul className="text-[11px] text-vp-text-2 space-y-1 list-disc pl-4">
            <li>Título instigante e sem clickbait</li>
            <li>Lead resume o fato principal</li>
            <li>Fontes devidamente citadas</li>
            <li>Tags e Editoria corretas</li>
          </ul>
        </div>
      </aside>
    </form>
  );
}
