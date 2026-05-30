"use client";

import React from 'react';
import { updateArticlePipelineStatus } from '@/app/admin/kanban/actions';

type ArticleStatus = 'DRAFT' | 'IN_REVIEW' | 'APPROVED' | 'SCHEDULED' | 'PUBLISHED' | 'ARCHIVED';

interface KanbanCardProps {
  id: string;
  title: string;
  author: string;
  date: string;
  status: ArticleStatus;
  badge?: string;
}

const STATUS_OPTIONS: { value: ArticleStatus; label: string }[] = [
  { value: 'DRAFT', label: 'Rascunho' },
  { value: 'IN_REVIEW', label: 'Em revisão' },
  { value: 'APPROVED', label: 'Aprovado' },
  { value: 'SCHEDULED', label: 'Agendado' },
  { value: 'PUBLISHED', label: 'Publicado' },
  { value: 'ARCHIVED', label: 'Arquivado' },
];

export function KanbanCard({ id, title, author, date, status, badge }: KanbanCardProps) {
  const [pending, startTransition] = React.useTransition();
  const [currentStatus, setCurrentStatus] = React.useState(status);

  function handleStatusChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const nextStatus = event.target.value as ArticleStatus;
    const previousStatus = currentStatus;
    setCurrentStatus(nextStatus);

    startTransition(async () => {
      try {
        const result = await updateArticlePipelineStatus(id, nextStatus);
        if (result.success) return;
        setCurrentStatus(previousStatus);
        alert(result.error ?? 'Não foi possível atualizar o status da matéria.');
      } catch {
        setCurrentStatus(previousStatus);
        alert('Não foi possível atualizar o status da matéria.');
      }
    });
  }

  return (
    <div className="bg-[#0e0e0d] border border-vp-border p-4 rounded-sm shadow-sm hover:border-vp-accent/40 transition-all group">
      {badge && (
        <span className={`inline-block text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm mb-3 ${
          badge === 'urgente' ? 'bg-vp-urgent text-white' : 'bg-vp-surface-2 text-vp-text-3'
        }`}>
          {badge}
        </span>
      )}
      <h4 className="text-[13px] font-bold leading-snug text-vp-text-2 group-hover:text-vp-text transition-colors mb-4 line-clamp-3">
        {title}
      </h4>
      <div className="flex justify-between items-center text-[10px] text-vp-text-4 font-mono uppercase tracking-wider">
        <span className="font-bold text-vp-text-3">{author}</span>
        <span>{date}</span>
      </div>
      <select
        value={currentStatus}
        onChange={handleStatusChange}
        disabled={pending}
        title="Mover matéria no fluxo editorial"
        className="mt-3 w-full bg-vp-surface border border-vp-border px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider text-vp-text-2 disabled:opacity-50"
      >
        {STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value} className="bg-vp-bg text-vp-text">
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

interface KanbanColumnProps {
  title: string;
  color: string;
  count: number;
  children: React.ReactNode;
}

export function KanbanColumn({ title, color, count, children }: KanbanColumnProps) {
  return (
    <div className="bg-[#141413] border border-vp-border rounded-md flex flex-col h-full min-w-[240px] shrink-0">
      <div className="p-4 border-b-2 flex items-center justify-between" style={{ borderColor: color }}>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: color }} />
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-vp-text">{title}</h3>
        </div>
        <span className="font-mono text-[11px] text-vp-text-4">{count}</span>
      </div>
      <div className="p-2 space-y-2 flex-1 overflow-y-auto vp-scroll">
        {children}
        <a href="/admin/posts/new" className="block w-full py-3 border border-dashed border-vp-border-2 rounded text-center text-[10px] font-black uppercase tracking-widest text-vp-text-4 hover:text-vp-accent hover:border-vp-accent transition-all no-underline">
          + novo item
        </a>
      </div>
    </div>
  );
}
