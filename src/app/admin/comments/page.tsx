import React from "react";
import prisma from "@/lib/prisma";
import { updateCommentStatus, deleteComment } from "./actions";

export const dynamic = "force-dynamic";

const STATUS_CONFIG: Record<string, { label: string; bg: string }> = {
  PENDING:  { label: "Aguardando", bg: "bg-vp-accent/10 text-vp-accent border-vp-accent/30" },
  APPROVED: { label: "Aprovado",   bg: "bg-vp-ok/10 text-vp-ok border-vp-ok/30" },
  HIDDEN:   { label: "Oculto",     bg: "bg-vp-text-3/10 text-vp-text-3 border-vp-text-3/30" },
  SPAM:     { label: "Spam",       bg: "bg-vp-warn/10 text-vp-warn border-vp-warn/30" },
  BANNED:   { label: "Banido",     bg: "bg-vp-urgent/10 text-vp-urgent border-vp-urgent/30" },
};

export default async function AdminCommentsPage() {
  const comments = await prisma.comment.findMany({
    include: {
      user: { select: { name: true, email: true, image: true } },
      article: { select: { title: true, slug: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const pending = comments.filter((c) => c.status === "PENDING").length;
  const spam = comments.filter((c) => c.status === "SPAM").length;

  return (
    <div className="max-w-[1100px]">
      <div className="mb-5">
        <h1 className="text-[22px] font-semibold mb-1">Comentários</h1>
        <p className="text-vp-text-3 text-[13px]">
          Fila de moderação · {pending} aguardando · {spam} sinalizados como spam
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-5">
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
          const count = comments.filter((c) => c.status === key).length;
          return (
            <div key={key} className="bg-[#141413] border border-vp-border p-3 rounded text-center">
              <div className="text-[22px] font-bold font-mono">{count}</div>
              <div className="text-[10px] text-vp-text-3 uppercase tracking-wider">{cfg.label}</div>
            </div>
          );
        })}
      </div>

      {/* Comment list */}
      <div className="bg-[#141413] border border-vp-border rounded overflow-hidden divide-y divide-vp-border">
        {comments.length === 0 ? (
          <div className="px-5 py-12 text-center text-vp-text-3 italic">
            Nenhum comentário ainda.
          </div>
        ) : (
          comments.map((cm) => {
            const st = STATUS_CONFIG[cm.status] ?? STATUS_CONFIG.PENDING;
            const authorName = cm.user?.name ?? cm.guestName ?? "Anônimo";
            const authorEmail = cm.user?.email ?? "—";
            return (
              <div key={cm.id} className={`p-5 ${cm.status === "SPAM" ? "bg-vp-warn/5" : cm.status === "BANNED" ? "bg-vp-urgent/5" : ""}`}>
                <div className="flex flex-wrap gap-3 items-start justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-vp-surface-2 border border-vp-border flex items-center justify-center text-[12px] font-bold text-vp-accent uppercase shrink-0">
                      {cm.user?.image ? (
                        <img src={cm.user.image} alt="" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        authorName.charAt(0)
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-[13px]">{authorName}</div>
                      <div className="text-[11px] text-vp-text-3">{authorEmail} · {cm.createdAt.toLocaleDateString("pt-BR")}</div>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold uppercase border px-2 py-0.5 rounded ${st.bg}`}>
                    {st.label}
                  </span>
                </div>

                <p className="font-serif text-[14px] text-vp-text-2 leading-relaxed mb-2">{cm.body}</p>
                <div className="text-[11px] text-vp-text-3 mb-3">
                  em <span className="text-vp-accent">{cm.article?.title ?? "artigo removido"}</span>
                  {cm.flags > 0 && ` · ${cm.flags} denúncia(s)`}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-1.5">
                  {cm.status !== "APPROVED" && (
                    <form action={updateCommentStatus.bind(null, cm.id, "APPROVED")}>
                      <button type="submit" className="vp-btn text-[11px] py-1 px-2.5 text-vp-ok border-vp-ok hover:bg-vp-ok/10">Aprovar</button>
                    </form>
                  )}
                  {cm.status !== "HIDDEN" && (
                    <form action={updateCommentStatus.bind(null, cm.id, "HIDDEN")}>
                      <button type="submit" className="vp-btn text-[11px] py-1 px-2.5">Ocultar</button>
                    </form>
                  )}
                  {cm.status !== "SPAM" && (
                    <form action={updateCommentStatus.bind(null, cm.id, "SPAM")}>
                      <button type="submit" className="vp-btn text-[11px] py-1 px-2.5 text-vp-warn border-vp-warn hover:bg-vp-warn/10">Marcar spam</button>
                    </form>
                  )}
                  <form action={deleteComment.bind(null, cm.id)}>
                    <button type="submit" className="vp-btn text-[11px] py-1 px-2.5 text-vp-urgent border-vp-urgent hover:bg-vp-urgent/10">Excluir</button>
                  </form>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
