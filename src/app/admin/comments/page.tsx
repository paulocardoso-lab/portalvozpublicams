import React from 'react';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const STATUS_LABELS: Record<string, string> = {
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

export default async function AdminCommentsPage() {
  const [counts, comments] = await Promise.all([
    prisma.comment.groupBy({
      by: ['status'],
      _count: { _all: true },
    }),
    prisma.comment.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      select: {
        id: true,
        body: true,
        status: true,
        flags: true,
        flagReason: true,
        guestName: true,
        createdAt: true,
        user: { select: { name: true, email: true } },
        article: { select: { title: true } },
      },
    }),
  ]);

  const countByStatus = Object.fromEntries(counts.map((item) => [item.status, item._count._all]));
  const pendingCount = countByStatus.PENDING ?? 0;
  const flaggedCount = comments.filter((comment) => comment.flags > 0).length;

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

      <div className="flex flex-wrap gap-6 border-b border-vp-border">
        {Object.entries(STATUS_LABELS).map(([status, label]) => (
          <div key={status} className="pb-4 text-[11px] font-black uppercase tracking-[0.2em] text-vp-text-3">
            {label}
            <span className="ml-2 font-mono text-vp-text-4">
              ({countByStatus[status] ?? 0})
            </span>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-vp-border rounded">
            <p className="text-vp-text-4 italic font-serif">Nenhum comentário registrado.</p>
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
                    <p className="text-[12px] font-bold text-vp-accent italic">
                      &quot;{comment.article.title}&quot;
                    </p>
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
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
