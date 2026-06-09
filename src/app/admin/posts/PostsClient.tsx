'use client';

import React, { useState, useRef, useEffect, useTransition } from 'react';
import Link from 'next/link';
import { SafeImage } from '@/components/shared/SafeImage';
import { ImgPH } from '@/components/shared/ImgPH';
import { updatePostMeta } from '@/app/actions/article';

export interface ArticleRow {
  id: string;
  title: string;
  status: string;
  views: number;
  publishedAt: Date | null;
  authors: { id: string; name: string; avatar: string | null }[];
  section: { id: string; name: string };
}

export interface AuthorOption  { id: string; name: string; avatar: string | null }
export interface SectionOption { id: string; name: string }

const STATUS_LABEL: Record<string, string> = {
  PUBLISHED: 'Publicado', DRAFT: 'Rascunho', IN_REVIEW: 'Revisão',
  APPROVED: 'Aprovado', SCHEDULED: 'Agendado', ARCHIVED: 'Arquivado',
};

// ── Inline dropdown ───────────────────────────────────────────────────────────

function InlineSelect({
  label, options, current, onSelect,
}: {
  label: string;
  options: { id: string; label: string }[];
  current: string;
  onSelect: (id: string) => void;
}) {
  const [open, setOpen]   = useState(false);
  const ref               = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="group/ib flex items-center gap-1 text-[12px] text-vp-text-3 hover:text-vp-accent transition-colors rounded px-1 -mx-1 py-0.5 cursor-pointer"
        title={`Alterar ${label}`}
      >
        <span>{current}</span>
        <svg className="opacity-0 group-hover/ib:opacity-60 transition-opacity shrink-0" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>
      </button>

      {open && (
        <div className="absolute z-50 top-full left-0 mt-1 min-w-[160px] bg-[#1a1a19] border border-vp-border rounded shadow-lg py-1">
          {options.map(o => (
            <button
              key={o.id}
              type="button"
              onClick={() => { onSelect(o.id); setOpen(false); }}
              className={`w-full text-left px-3 py-1.5 text-[12px] hover:bg-vp-surface transition-colors ${o.label === current ? 'text-vp-accent font-semibold' : 'text-vp-text-2'}`}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function PostsClient({
  initialArticles, authors, sections,
}: {
  initialArticles: ArticleRow[];
  authors: AuthorOption[];
  sections: SectionOption[];
}) {
  const [articles, setArticles] = useState(initialArticles);
  const [filter, setFilter]     = useState('Todas');
  const [secFilter, setSecFilter] = useState('');
  const [authorFilter, setAuthorFilter] = useState('');
  const [titleFilter, setTitleFilter] = useState('');
  const [, startTransition]     = useTransition();

  function handleAuthorChange(articleId: string, authorId: string) {
    const author = authors.find(a => a.id === authorId)!;
    setArticles(prev => prev.map(a =>
      a.id === articleId ? { ...a, authors: [author] } : a
    ));
    startTransition(async () => {
      await updatePostMeta(articleId, { authorId });
    });
  }

  function handleSectionChange(articleId: string, sectionId: string) {
    const section = sections.find(s => s.id === sectionId)!;
    setArticles(prev => prev.map(a =>
      a.id === articleId ? { ...a, section } : a
    ));
    startTransition(async () => {
      await updatePostMeta(articleId, { sectionId });
    });
  }

  const STATUS_FILTERS: Record<string, string | null> = {
    'Todas': null, 'Publicadas': 'PUBLISHED', 'Rascunhos': 'DRAFT',
    'Revisão': 'IN_REVIEW', 'Agendadas': 'SCHEDULED',
  };

  const visible = articles.filter(a => {
    if (STATUS_FILTERS[filter] && a.status !== STATUS_FILTERS[filter]) return false;
    if (secFilter && a.section.id !== secFilter) return false;
    if (authorFilter && !a.authors.some(u => u.id === authorFilter)) return false;
    if (titleFilter && !a.title.toLowerCase().includes(titleFilter.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="max-w-[1200px]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-[26px] font-semibold mb-1">Matérias</h1>
          <div className="text-vp-text-3 text-[13px]">Gerencie todo o conteúdo publicado e em rascunho.</div>
        </div>
        <Link href="/admin/posts/new">
          <button className="vp-btn vp-btn-primary px-4 py-2 text-[13px]">+ Nova matéria</button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 overflow-x-auto pb-2 vp-scroll">
        <div className="flex gap-1.5 p-1 bg-[#141413] border border-vp-border rounded-[4px]">
          {Object.keys(STATUS_FILTERS).map(t => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-3 py-1.5 text-[12px] font-medium rounded-[2px] border-none cursor-pointer transition-colors ${filter === t ? 'bg-vp-surface text-vp-text' : 'bg-transparent text-vp-text-3 hover:text-vp-text'}`}
            >
              {t}
            </button>
          ))}
        </div>
        <select
          className="vp-input py-1.5 px-3 text-[12px] w-[160px] bg-[#141413]"
          value={secFilter}
          onChange={e => setSecFilter(e.target.value)}
          title="Filtrar por editoria"
        >
          <option value="">Todas editorias</option>
          {sections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <select
          className="vp-input py-1.5 px-3 text-[12px] w-[160px] bg-[#141413]"
          value={authorFilter}
          onChange={e => setAuthorFilter(e.target.value)}
          title="Filtrar por autor"
        >
          <option value="">Todos autores</option>
          {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
        <input
          className="vp-input py-1.5 px-4 text-[12px] flex-1 min-w-[200px] bg-[#141413]"
          placeholder="Filtrar por título…"
          value={titleFilter}
          onChange={e => setTitleFilter(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="bg-[#141413] border border-vp-border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-vp-border text-[11px] text-vp-text-3 uppercase tracking-[0.1em]">
              <th className="px-5 py-4 font-semibold">Matéria</th>
              <th className="px-5 py-4 font-semibold">Autor</th>
              <th className="px-5 py-4 font-semibold">Editoria</th>
              <th className="px-5 py-4 font-semibold">Status</th>
              <th className="px-5 py-4 font-semibold">Data</th>
              <th className="px-5 py-4 font-semibold text-right">Views</th>
              <th className="px-5 py-4 font-semibold"></th>
            </tr>
          </thead>
          <tbody>
            {visible.map(p => (
              <tr key={p.id} className="border-b border-vp-border last:border-none hover:bg-vp-bg/50 transition-colors group">
                <td className="px-5 py-4 min-w-[320px]">
                  <Link href={`/admin/posts/edit/${p.id}`} className="no-underline">
                    <div className="font-display text-[15px] leading-[1.3] text-vp-text group-hover:text-vp-accent transition-colors cursor-pointer">
                      {p.title}
                    </div>
                  </Link>
                </td>

                {/* Autor — inline edit */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <div className="relative w-5 h-5 rounded-full overflow-hidden shrink-0">
                      {p.authors[0]?.avatar ? (
                        <SafeImage src={p.authors[0].avatar} alt="" fill sizes="20px" className="object-cover" />
                      ) : (
                        <ImgPH label="" width={20} height={20} />
                      )}
                    </div>
                    <InlineSelect
                      label="autor"
                      current={p.authors.map(a => a.name).join(', ') || '—'}
                      options={authors.map(a => ({ id: a.id, label: a.name }))}
                      onSelect={id => handleAuthorChange(p.id, id)}
                    />
                  </div>
                </td>

                {/* Editoria — inline edit */}
                <td className="px-5 py-4">
                  <InlineSelect
                    label="editoria"
                    current={p.section.name}
                    options={sections.map(s => ({ id: s.id, label: s.name }))}
                    onSelect={id => handleSectionChange(p.id, id)}
                  />
                </td>

                <td className="px-5 py-4">
                  <span className={`px-2 py-0.5 rounded-[10px] text-[10px] font-bold uppercase tracking-[0.05em] ${
                    p.status === 'PUBLISHED' ? 'bg-vp-ok/10 text-vp-ok' :
                    p.status === 'IN_REVIEW'  ? 'bg-vp-warn/10 text-vp-warn' : 'bg-vp-text-3/10 text-vp-text-3'
                  }`}>
                    {STATUS_LABEL[p.status] ?? p.status}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <span className="text-[12px] text-vp-text-3 font-mono">
                    {p.publishedAt
                      ? new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' }).format(new Date(p.publishedAt))
                      : '---'}
                  </span>
                </td>

                <td className="px-5 py-4 text-right">
                  <span className="text-[13px] text-vp-text-2 font-mono">
                    {p.views > 1000 ? `${(p.views / 1000).toFixed(1)}k` : p.views}
                  </span>
                </td>

                <td className="px-5 py-4 text-right">
                  <Link href={`/admin/posts/edit/${p.id}`} className="text-vp-text-3 hover:text-vp-text p-1">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>
                    </svg>
                  </Link>
                </td>
              </tr>
            ))}

            {visible.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-[13px] text-vp-text-4">
                  Nenhuma matéria encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-between items-center text-[13px] text-vp-text-3">
        <div>Mostrando {visible.length} matérias</div>
        <div className="flex gap-2">
          <button className="vp-btn px-3 py-1.5 opacity-50 cursor-not-allowed">Anterior</button>
          <button className="vp-btn px-3 py-1.5 hover:bg-vp-surface">Próxima</button>
        </div>
      </div>
    </div>
  );
}
