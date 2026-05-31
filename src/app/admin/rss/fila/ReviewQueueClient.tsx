'use client';

import React, { useState, useTransition } from 'react';
import { bulkApproveArticles, bulkRejectArticles, bulkDeleteArticles } from '@/app/actions/rss';

type QueueArticle = {
  id: string;
  title: string;
  lead: string | null;
  sourceUrl: string | null;
  heroImage: string | null;
  createdAt: Date;
  section: { name: string };
  deadLetter: boolean;
};

type Filter = 'all' | 'dead';

export function ReviewQueueClient({ articles: initial }: { articles: QueueArticle[] }) {
  const [articles, setArticles] = useState(initial);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<Filter>('all');
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const visible = filter === 'dead'
    ? articles.filter((a) => a.deadLetter)
    : articles;

  const allSelected = visible.length > 0 && visible.every((a) => selected.has(a.id));

  function toggleAll() {
    if (allSelected) {
      setSelected((prev) => {
        const next = new Set(prev);
        visible.forEach((a) => next.delete(a.id));
        return next;
      });
    } else {
      setSelected((prev) => new Set([...prev, ...visible.map((a) => a.id)]));
    }
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function getSelectedIds() {
    return [...selected].filter((id) => visible.some((a) => a.id === id));
  }

  async function handleBulk(action: 'approve' | 'reject' | 'delete') {
    const ids = getSelectedIds();
    if (ids.length === 0) { setFeedback({ type: 'err', text: 'Selecione ao menos um artigo.' }); return; }
    if (action === 'delete' && !confirm(`Excluir ${ids.length} artigo(s)? Esta ação não pode ser desfeita.`)) return;

    startTransition(async () => {
      setFeedback(null);
      const fn = action === 'approve' ? bulkApproveArticles
        : action === 'reject' ? bulkRejectArticles
        : bulkDeleteArticles;

      const result = await fn(ids);
      if (!result.success) {
        setFeedback({ type: 'err', text: result.error ?? 'Falha na operação.' });
        return;
      }

      setArticles((prev) =>
        action === 'delete'
          ? prev.filter((a) => !ids.includes(a.id))
          : prev.map((a) =>
              ids.includes(a.id)
                ? { ...a, deadLetter: false }
                : a
            ).filter((a) => action !== 'approve' || !ids.includes(a.id))
      );

      setSelected(new Set());
      setFeedback({
        type: 'ok',
        text: action === 'approve'
          ? `${ids.length} artigo(s) publicado(s).`
          : action === 'reject'
          ? `${ids.length} artigo(s) movido(s) para rascunho.`
          : `${ids.length} artigo(s) excluído(s).`,
      });
    });
  }

  const deadCount = articles.filter((a) => a.deadLetter).length;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1 border border-vp-border">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-[11px] uppercase tracking-wider font-bold transition-colors ${filter === 'all' ? 'bg-vp-accent text-white' : 'text-vp-text-3 hover:text-vp-text'}`}
          >
            Todos ({articles.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('dead')}
            className={`px-3 py-1.5 text-[11px] uppercase tracking-wider font-bold transition-colors ${filter === 'dead' ? 'bg-vp-urgent text-white' : 'text-vp-text-3 hover:text-vp-text'}`}
          >
            Problema ({deadCount})
          </button>
        </div>

        {selected.size > 0 && (
          <div className="flex items-center gap-2 ml-auto flex-wrap">
            <span className="text-[11px] text-vp-text-3">{selected.size} selecionado(s)</span>
            <button
              type="button"
              onClick={() => handleBulk('approve')}
              disabled={isPending}
              className="vp-btn py-1.5 px-3 text-[11px] bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20"
            >
              ✓ Publicar
            </button>
            <button
              type="button"
              onClick={() => handleBulk('reject')}
              disabled={isPending}
              className="vp-btn py-1.5 px-3 text-[11px] bg-yellow-500/10 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20"
            >
              ↩ Rascunho
            </button>
            <button
              type="button"
              onClick={() => handleBulk('delete')}
              disabled={isPending}
              className="vp-btn py-1.5 px-3 text-[11px] bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20"
            >
              ✕ Excluir
            </button>
          </div>
        )}
      </div>

      {feedback && (
        <div className={`border px-3 py-2 text-[12px] ${feedback.type === 'ok' ? 'border-green-500/30 bg-green-500/10 text-green-400' : 'border-vp-urgent/30 bg-vp-urgent/10 text-vp-urgent'}`}>
          {feedback.text}
        </div>
      )}

      {visible.length === 0 ? (
        <div className="bg-[#141413] border border-vp-border p-12 text-center">
          <p className="text-vp-text-3 font-serif italic">
            {filter === 'dead' ? 'Nenhum artigo com problema.' : 'Fila vazia — nenhum artigo aguarda revisão.'}
          </p>
        </div>
      ) : (
        <div className="bg-[#141413] border border-vp-border overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-vp-surface border-b border-vp-border">
                <th className="p-3 w-10">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="accent-vp-accent"
                    title="Selecionar todos"
                  />
                </th>
                <th className="p-3 text-[10px] uppercase tracking-wider text-vp-text-3 font-bold">Artigo</th>
                <th className="p-3 text-[10px] uppercase tracking-wider text-vp-text-3 font-bold hidden md:table-cell">Editoria</th>
                <th className="p-3 text-[10px] uppercase tracking-wider text-vp-text-3 font-bold hidden lg:table-cell">Importado em</th>
                <th className="p-3 text-[10px] uppercase tracking-wider text-vp-text-3 font-bold">Status</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((article) => (
                <tr
                  key={article.id}
                  className={`border-b border-vp-border transition-colors cursor-pointer ${selected.has(article.id) ? 'bg-vp-accent/5' : 'hover:bg-vp-surface/30'}`}
                  onClick={() => toggleOne(article.id)}
                >
                  <td className="p-3" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selected.has(article.id)}
                      onChange={() => toggleOne(article.id)}
                      className="accent-vp-accent"
                      title="Selecionar artigo"
                    />
                  </td>
                  <td className="p-3">
                    <div className="flex items-start gap-3">
                      {article.heroImage && (
                        <img
                          src={article.heroImage}
                          alt=""
                          className="w-14 h-10 object-cover flex-shrink-0 hidden sm:block"
                        />
                      )}
                      <div className="min-w-0">
                        <div className="font-bold text-[13px] leading-tight line-clamp-2">{article.title}</div>
                        {article.lead && (
                          <div className="text-[11px] text-vp-text-3 line-clamp-1 mt-0.5">{article.lead}</div>
                        )}
                        {article.sourceUrl && (
                          <a
                            href={article.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-vp-accent/70 hover:text-vp-accent truncate block mt-0.5 max-w-[300px]"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {article.sourceUrl}
                          </a>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-3 hidden md:table-cell">
                    <span className="bg-vp-accent/10 text-vp-accent text-[10px] px-2 py-0.5 border border-vp-accent/20">
                      {article.section.name}
                    </span>
                  </td>
                  <td className="p-3 text-[11px] text-vp-text-3 hidden lg:table-cell whitespace-nowrap">
                    {new Date(article.createdAt).toLocaleString('pt-BR')}
                  </td>
                  <td className="p-3">
                    {article.deadLetter ? (
                      <span className="text-[10px] text-vp-urgent border border-vp-urgent/30 px-1.5 py-0.5">
                        problema
                      </span>
                    ) : (
                      <span className="text-[10px] text-yellow-400 border border-yellow-400/30 px-1.5 py-0.5">
                        aguarda
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
