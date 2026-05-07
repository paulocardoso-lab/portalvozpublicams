import React from "react";
import prisma from "@/lib/prisma";
import { updateTipStatus, deleteTip } from "./actions";

export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  NEW: { label: "Nova", color: "bg-vp-accent/20 text-vp-accent border-vp-accent/30" },
  INVESTIGATING: { label: "Investigando", color: "bg-vp-warn/20 text-vp-warn border-vp-warn/30" },
  PUBLISHED: { label: "Publicada", color: "bg-vp-ok/20 text-vp-ok border-vp-ok/30" },
  ARCHIVED: { label: "Arquivada", color: "bg-vp-text-3/20 text-vp-text-3 border-vp-text-3/30" },
};

export default async function AdminDenunciasPage() {
  const tips = await prisma.tip.findMany({ orderBy: { createdAt: "desc" } });

  const counts = {
    NEW: tips.filter((t) => t.status === "NEW").length,
    INVESTIGATING: tips.filter((t) => t.status === "INVESTIGATING").length,
    PUBLISHED: tips.filter((t) => t.status === "PUBLISHED").length,
    ARCHIVED: tips.filter((t) => t.status === "ARCHIVED").length,
  };

  return (
    <div className="max-w-[1000px]">
      <div className="mb-6">
        <h1 className="text-[26px] font-semibold mb-1">Denúncias & Vazamentos</h1>
        <p className="text-vp-text-3 text-[13px]">
          Relatos recebidos pelo canal seguro de cidadãos.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
        {Object.entries(counts).map(([key, count]) => (
          <div key={key} className="bg-[#141413] border border-vp-border p-3.5 rounded">
            <div className="text-[24px] font-bold font-mono">{count}</div>
            <div className="text-[11px] text-vp-text-3 uppercase tracking-wider mt-0.5">
              {STATUS_LABELS[key].label}
            </div>
          </div>
        ))}
      </div>

      {/* List */}
      <div className="bg-[#141413] border border-vp-border rounded overflow-hidden">
        {tips.length === 0 ? (
          <div className="px-5 py-12 text-center text-vp-text-3 italic">
            Nenhuma denúncia recebida até o momento.
          </div>
        ) : (
          <div className="divide-y divide-vp-border">
            {tips.map((tip) => {
              const st = STATUS_LABELS[tip.status] ?? STATUS_LABELS.NEW;
              return (
                <div key={tip.id} className="p-5">
                  <div className="flex flex-wrap gap-3 items-start justify-between mb-3">
                    <div>
                      <div className="font-semibold text-[14px]">{tip.name || "Anônimo"}</div>
                      <div className="text-[11px] text-vp-text-3">
                        {tip.email || "Sem e-mail"} · {tip.createdAt.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${st.color}`}>
                      {st.label}
                    </span>
                  </div>

                  <p className="text-[13px] text-vp-text-2 leading-relaxed mb-4 bg-vp-bg border border-vp-border p-3 rounded font-serif">
                    {tip.content}
                  </p>

                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-2">
                    {tip.status !== "INVESTIGATING" && (
                      <form action={updateTipStatus.bind(null, tip.id, "INVESTIGATING")}>
                        <button type="submit" className="vp-btn text-[11px] py-1.5 px-3 text-vp-warn border-vp-warn hover:bg-vp-warn/10">
                          Investigar
                        </button>
                      </form>
                    )}
                    {tip.status !== "PUBLISHED" && (
                      <form action={updateTipStatus.bind(null, tip.id, "PUBLISHED")}>
                        <button type="submit" className="vp-btn text-[11px] py-1.5 px-3 text-vp-ok border-vp-ok hover:bg-vp-ok/10">
                          Publicar
                        </button>
                      </form>
                    )}
                    {tip.status !== "ARCHIVED" && (
                      <form action={updateTipStatus.bind(null, tip.id, "ARCHIVED")}>
                        <button type="submit" className="vp-btn text-[11px] py-1.5 px-3">
                          Arquivar
                        </button>
                      </form>
                    )}
                    <form action={deleteTip.bind(null, tip.id)}>
                      <button type="submit" className="vp-btn text-[11px] py-1.5 px-3 text-vp-urgent border-vp-urgent hover:bg-vp-urgent/10">
                        Excluir
                      </button>
                    </form>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
