import React from "react";
import prisma from "@/lib/prisma";
import { updateTipStatus, deleteTip, saveTipNotes } from "./actions";
import { requireAdmin } from "@/lib/auth-guard";

export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  NEW:          { label: "Nova",           color: "bg-vp-accent/20 text-vp-accent border-vp-accent/30" },
  INVESTIGATING:{ label: "Investigando",   color: "bg-vp-warn/20 text-vp-warn border-vp-warn/30" },
  PUBLISHED:    { label: "Publicada",      color: "bg-vp-ok/20 text-vp-ok border-vp-ok/30" },
  ARCHIVED:     { label: "Arquivada",      color: "bg-vp-text-3/20 text-vp-text-3 border-vp-text-3/30" },
};

export default async function AdminDenunciasPage() {
  await requireAdmin();

  const tips = await prisma.tip.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      content: true,
      status: true,
      internalNotes: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const counts = {
    NEW:          tips.filter((t) => t.status === "NEW").length,
    INVESTIGATING:tips.filter((t) => t.status === "INVESTIGATING").length,
    PUBLISHED:    tips.filter((t) => t.status === "PUBLISHED").length,
    ARCHIVED:     tips.filter((t) => t.status === "ARCHIVED").length,
  };

  return (
    <div className="max-w-[1000px]">
      <div className="mb-6">
        <h1 className="text-[26px] font-semibold mb-1">Denúncias & Vazamentos</h1>
        <p className="text-vp-text-3 text-[13px]">
          Canal seguro de recebimento de relatos. Alterações de status geram log de auditoria e enviam e-mail ao denunciante quando aplicável.
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
      <div className="grid gap-4">
        {tips.length === 0 ? (
          <div className="bg-[#141413] border border-vp-border rounded px-5 py-12 text-center text-vp-text-3 italic">
            Nenhuma denúncia recebida até o momento.
          </div>
        ) : (
          tips.map((tip) => {
            const st = STATUS_LABELS[tip.status] ?? STATUS_LABELS.NEW;
            return (
              <div key={tip.id} className="bg-[#141413] border border-vp-border rounded overflow-hidden">
                {/* Header */}
                <div className="flex flex-wrap gap-3 items-start justify-between p-5 border-b border-vp-border">
                  <div>
                    <div className="font-semibold text-[14px] flex items-center gap-2">
                      {tip.name || "Anônimo"}
                      {tip.email && (
                        <span className="text-[10px] font-normal bg-vp-accent/10 text-vp-accent border border-vp-accent/20 px-1.5 py-0.5 rounded">
                          📧 receberá e-mail
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-vp-text-3 mt-0.5">
                      {tip.email || "Sem e-mail"} · {tip.createdAt.toLocaleDateString("pt-BR", {
                        day: "2-digit", month: "2-digit", year: "numeric",
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold uppercase border px-2 py-0.5 rounded ${st.color}`}>
                    {st.label}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 border-b border-vp-border">
                  <p className="text-[13px] text-vp-text-2 leading-relaxed font-serif bg-vp-bg border border-vp-border p-3 rounded">
                    {tip.content}
                  </p>
                </div>

                {/* Internal notes */}
                <div className="p-5 border-b border-vp-border">
                  <div className="text-[11px] text-vp-text-3 uppercase font-semibold mb-2">
                    📝 Notas internas da equipe
                  </div>
                  <form action={saveTipNotes.bind(null, tip.id)} className="flex gap-2">
                    <textarea
                      name="notes"
                      defaultValue={tip.internalNotes ?? ""}
                      placeholder="Registre observações, fontes consultadas, prazos, responsável pela apuração..."
                      className="vp-input text-[13px] flex-1 h-16 resize-none font-sans"
                    />
                    <button type="submit" className="vp-btn text-[11px] py-1 px-3 shrink-0 self-start">
                      Salvar nota
                    </button>
                  </form>
                  {tip.internalNotes && (
                    <p className="mt-2 text-[11px] text-vp-text-3 italic">
                      Última nota salva em {tip.updatedAt.toLocaleDateString("pt-BR")}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="px-5 py-3.5 flex flex-wrap gap-2 bg-vp-bg/30">
                  {tip.status !== "INVESTIGATING" && (
                    <form action={updateTipStatus.bind(null, tip.id, "INVESTIGATING")}>
                      <button type="submit" className="vp-btn text-[11px] py-1.5 px-3 text-vp-warn border-vp-warn hover:bg-vp-warn/10">
                        🔍 Investigar
                        {tip.email && <span className="ml-1 text-[10px] opacity-60">(envia e-mail)</span>}
                      </button>
                    </form>
                  )}
                  {tip.status !== "PUBLISHED" && (
                    <form action={updateTipStatus.bind(null, tip.id, "PUBLISHED")}>
                      <button type="submit" className="vp-btn text-[11px] py-1.5 px-3 text-vp-ok border-vp-ok hover:bg-vp-ok/10">
                        ✓ Publicar
                        {tip.email && <span className="ml-1 text-[10px] opacity-60">(envia e-mail)</span>}
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
                  <form action={deleteTip.bind(null, tip.id)} className="ml-auto">
                    <button type="submit" className="vp-btn text-[11px] py-1.5 px-3 text-vp-urgent border-vp-urgent hover:bg-vp-urgent/10">
                      Excluir
                    </button>
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
