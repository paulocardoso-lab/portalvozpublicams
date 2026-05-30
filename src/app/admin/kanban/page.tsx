import React from 'react';
import prisma from '@/lib/prisma';
import { KanbanColumn, KanbanCard } from '@/components/admin/kanban/KanbanComponents';

export const dynamic = 'force-dynamic';

const columns = [
  { status: 'DRAFT', title: 'Rascunho', color: '#e0b44a' },
  { status: 'IN_REVIEW', title: 'Em Revisão', color: '#d97757' },
  { status: 'APPROVED', title: 'Aprovado', color: '#10b981' },
  { status: 'SCHEDULED', title: 'Agendado', color: '#7aa2f7' },
  { status: 'PUBLISHED', title: 'Publicado', color: '#4b4b4a' },
  { status: 'ARCHIVED', title: 'Arquivado', color: '#4b4b4a' },
] as const;

function cardDate(article: { publishedAt: Date | null; scheduledAt: Date | null; updatedAt: Date }) {
  const date = article.scheduledAt || article.publishedAt || article.updatedAt;
  return date.toLocaleDateString('pt-BR');
}

export default async function AdminKanbanPage() {
  const articles = await prisma.article.findMany({
    orderBy: { updatedAt: 'desc' },
    take: 100,
    select: {
      id: true,
      title: true,
      status: true,
      publishedAt: true,
      scheduledAt: true,
      updatedAt: true,
      authors: { select: { name: true } },
    },
  });

  const inProgress = articles.filter((article) => !['PUBLISHED', 'ARCHIVED'].includes(article.status)).length;
  const scheduled = articles.filter((article) => article.status === 'SCHEDULED').length;

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="font-display text-[26px] lg:text-[32px] font-black leading-tight">
            Fila Editorial.
          </h1>
          <p className="font-serif italic text-[15px] text-vp-text-3 mt-1">
            Gestão visual do pipeline jornalístico · {inProgress} matérias em curso · {scheduled} agendadas.
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto pb-4 vp-scroll">
        <div className="flex gap-4 h-full min-w-max">
          {columns.map((column) => {
            const items = articles.filter((article) => article.status === column.status);
            return (
              <KanbanColumn key={column.status} title={column.title} color={column.color} count={items.length}>
                {items.length === 0 ? (
                  <div className="text-[12px] text-vp-text-4 italic px-2 py-6 text-center">
                    Nenhuma matéria.
                  </div>
                ) : (
                  items.map((article) => (
                    <KanbanCard
                      key={article.id}
                      id={article.id}
                      title={article.title}
                      author={article.authors.map((author) => author.name).join(', ') || 'Sem autor'}
                      date={cardDate(article)}
                      status={article.status}
                    />
                  ))
                )}
              </KanbanColumn>
            );
          })}
        </div>
      </div>
    </div>
  );
}
