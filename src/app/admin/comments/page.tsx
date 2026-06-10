import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { deleteComment, updateCommentStatus } from './actions';
import { CommentStatus } from '@prisma/client';

export const dynamic = 'force-dynamic';

const STATUS_LABELS: Record<string, string> = {
  ALL: 'Todos',
  PENDING: 'Aguardando',
  APPROVED: 'Aprovados',
  HIDDEN: 'Ocultos',
  SPAM: 'Spam',
  BANNED: 'Banidos',
};

function relativeTime(date: Date) {
  const seconds = Math.max(1, Math.floor((Date.now() - date.getTime()) / 1000));
  if (seconds < 60) return 'agora';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `ha ${minutes}min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `ha ${hours}h`;
  return date.toLocaleDateString('pt-BR');
}

export default async function AdminCommentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: statusParam } = await searchParams;
  const activeStatus = statusParam && statusParam in STATUS_LABELS && statusParam !== 'ALL'
    ? (statusParam as CommentStatus)
    : null;

  const [counts, comments] = await Promise.all([
    prisma.comment.groupBy({
      by: ['status'],
      _count: { _all: true },
    }),
    prisma.comment.findMany({
      where: activeStatus ? { status: activeStatus } : undefined,
      orderBy: { createdAt: 'desc' },
      take: 100,
      select: {
        id: true,
        body: true,
        status: true,
        flags: true,
        flagReason: true,
        guestName: true,
        createdAt: true,
        user: { select: { name: true, email: true } },
        article: { select: { title: true, slug: true } },
      },
    }),
  ]);

  const countByStatus = Object.fromEntries(counts.map((item) => [item.status, item._count._all]));
  const totalAll = counts.reduce((sum, item) => sum + item._count._all, 0);
  const pendingCount = countByStatus.PENDING ?? 0;
  const flaggedCount = comments.filter((c) => c.flags > 0).length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="font-display text-[26px] lg:text-[32px] font-black leading-tight">
            Moderação de Comentários.
          </h1>
          <p className="font-serif italic text-[15px] text-vp-text-3 mt-1">
            Gerencie o debate público · {pendingCount} aguardando · {flaggedCount} sinalizados.
          </p>
        </div>
      </div>

      {/* Tabs de filtro */}
      <div className="flex flex-wrap gap-1 border-b border-vp-border">
        {Object.entries(STATUS_LABELS).map(([status, label]) => {
          const count = status === 'ALL' ? totalAll : (countByStatus[status] ?? 0);
          const isActive = status === 'ALL' ? !activeStatus : activeStatus === status;
          return (
            <Link
              key={status}
              href={status === 'ALL' ? '/admin/comments' : `/admin/comments?status=${status}`}
              className={`pb-3 px-4 text-[11px] font-black uppercase tracking-[0.15em] border-b-2 transition-colors ${
                isActive
                  ? 'border-vp-accent text-vp-accent'
                  : 'border-transparent text-vp-text-3 hover:text-vp-text'
              }`}
            >
              {label}
              <span className="ml-2 font-mono opacity-60">({count})</span>
            </Link>
          );
        })}
      </div>

      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-vp-border rounded">
            <p className="text-vp-text-4 italic font-serif">Nenhum comentário encontrado.</p>
          </div>
        ) : (
          comments.map((comment) => {
            const author = comment.user?.name || comment.guestName || 'Visitante';
            const email = comment.user?.email;

            return (
              <div key={comment.id} className="vp-panel p-6 bg-[#141413] border border-vp-border hover:border-vp-border-2 transition-all group">
                <div className="flex justify-between items-start mb-4 gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-vp-surface border border-vp-border flex items-center justify-center font-black text-vp-text-3 text-[14px]">
                      {author.slice(0, 1).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-[14px] font-black text-vp-text">{author}</h4>
                      <span className="text-[11px] text-vp-text-4 font-mono">{email ?? 'sem e-mail'}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-vp-text-4 font-black uppercase tracking-widest block mb-1">Matéria</span>
                    <Link
                      href={`/materia/${comment.article.slug}`}
                      target="_blank"
                      className="text-[12px] font-bold text-vp-accent italic hover:underline"
                    >
                      &quot;{comment.article.title}&quot;
                    </Link>
                  </div>
                </div>

                <div className="bg-vp-bg p-4 border border-vp-border mb-6">
                  {comment.flags > 0 && (
                    <div className="flex items-center gap-2 mb-3 text-vp-urgent">
                      <span className="w-1.5 h-1.5 rounded-full bg-vp-urgent animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        Sinalizado: {comment.flagReason ?? 'sem motivo informado'} ({comment.flags})
                      </span>
                    </div>
                  )}
                  <p className="font-serif text-[16px] text-vp-text-2 leading-relaxed italic">
                    &quot;{comment.body}&quot;
                  </p>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-[11px] text-vp-text-4 font-mono uppercase tracking-widest">
                    {STATUS_LABELS[comment.status] ?? comment.status} · {relativeTime(comment.createdAt)}
                  </span>
                  <div className="flex flex-wrap justify-end gap-2">
                    {comment.status !== 'APPROVED' && (
                      <form action={updateCommentStatus.bind(null, comment.id, CommentStatus.APPROVED)}>
                        <button type="submit" className="vp-btn text-[11px] px-3 py-1 text-vp-ok border-vp-ok">
                          Aprovar
                        </button>
                      </form>
                    )}
                    {comment.status !== 'HIDDEN' && (
                      <form action={updateCommentStatus.bind(null, comment.id, CommentStatus.HIDDEN)}>
                        <button type="submit" className="vp-btn text-[11px] px-3 py-1">
                          Ocultar
                        </button>
                      </form>
                    )}
                    {comment.status !== 'SPAM' && (
                      <form action={updateCommentStatus.bind(null, comment.id, CommentStatus.SPAM)}>
                        <button type="submit" className="vp-btn text-[11px] px-3 py-1 text-vp-warn border-vp-warn">
                          Spam
                        </button>
                      </form>
                    )}
                    {comment.status !== 'BANNED' && (
                      <form action={updateCommentStatus.bind(null, comment.id, CommentStatus.BANNED)}>
                        <button type="submit" className="vp-btn text-[11px] px-3 py-1 text-vp-urgent border-vp-urgent">
                          Banir
                        </button>
                      </form>
                    )}
                    <form action={deleteComment.bind(null, comment.id)}>
                      <button type="submit" className="vp-btn text-[11px] px-3 py-1 text-vp-urgent border-vp-urgent">
                        Excluir
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
