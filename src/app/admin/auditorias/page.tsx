import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import { EditorialAuditStatus } from "@prisma/client";
import { createEditorialAudit, updateEditorialAudit } from "./actions";

export const dynamic = "force-dynamic";

const statusLabels: Record<EditorialAuditStatus, string> = {
  PLANNED: "Planejada",
  IN_PROGRESS: "Em andamento",
  COMPLETED: "Concluida",
  ARCHIVED: "Arquivada",
};

const statusStyles: Record<EditorialAuditStatus, string> = {
  PLANNED: "border-vp-border bg-vp-surface text-vp-text-2",
  IN_PROGRESS: "border-vp-accent/40 bg-vp-accent/10 text-vp-accent",
  COMPLETED: "border-vp-ok/40 bg-vp-ok/10 text-vp-ok",
  ARCHIVED: "border-vp-text-4/40 bg-[#0a0a09] text-vp-text-4",
};

function dateForInput(date: Date | null) {
  if (!date) return "";
  return date.toISOString().slice(0, 10);
}

function displayDate(date: Date | null) {
  if (!date) return "-";
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function AuditForm({
  action,
  submitLabel,
  audit,
}: {
  action: (formData: FormData) => void | Promise<void>;
  submitLabel: string;
  audit?: {
    title: string;
    scope: string | null;
    summary: string;
    status: EditorialAuditStatus;
    owner: string | null;
    dueDate: Date | null;
    completedAt: Date | null;
    evidenceUrl: string | null;
    findings: string | null;
    recommendations: string | null;
  };
}) {
  const inputClass = "vp-input w-full text-[13px]";
  const labelClass = "grid gap-1.5 text-[11px] font-bold uppercase tracking-widest text-vp-text-3";

  return (
    <form action={action} className="grid gap-4">
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <label className={labelClass}>
          Titulo
          <input name="title" className={inputClass} defaultValue={audit?.title ?? ""} required maxLength={140} />
        </label>
        <label className={labelClass}>
          Status
          <select name="status" className={inputClass} defaultValue={audit?.status ?? "PLANNED"}>
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <label className={labelClass}>
          Escopo
          <input name="scope" className={inputClass} defaultValue={audit?.scope ?? ""} placeholder="Ex: publicidade, LGPD, editoria" />
        </label>
        <label className={labelClass}>
          Responsavel
          <input name="owner" className={inputClass} defaultValue={audit?.owner ?? ""} />
        </label>
        <label className={labelClass}>
          Prazo
          <input name="dueDate" type="date" className={inputClass} defaultValue={dateForInput(audit?.dueDate ?? null)} />
        </label>
      </div>

      <label className={labelClass}>
        Resumo
        <textarea name="summary" className={`${inputClass} min-h-24 resize-y`} defaultValue={audit?.summary ?? ""} required />
      </label>

      <div className="grid gap-4 lg:grid-cols-[1fr_180px]">
        <label className={labelClass}>
          Link de evidencias
          <input name="evidenceUrl" type="url" className={inputClass} defaultValue={audit?.evidenceUrl ?? ""} placeholder="https://..." />
        </label>
        <label className={labelClass}>
          Conclusao
          <input name="completedAt" type="date" className={inputClass} defaultValue={dateForInput(audit?.completedAt ?? null)} />
        </label>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <label className={labelClass}>
          Achados
          <textarea name="findings" className={`${inputClass} min-h-28 resize-y`} defaultValue={audit?.findings ?? ""} />
        </label>
        <label className={labelClass}>
          Recomendacoes
          <textarea name="recommendations" className={`${inputClass} min-h-28 resize-y`} defaultValue={audit?.recommendations ?? ""} />
        </label>
      </div>

      <div>
        <button type="submit" className="vp-btn vp-btn-primary px-5 py-2 text-[12px]">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

export default async function AdminAuditoriasPage() {
  await requireAdmin();

  const audits = await prisma.editorialAudit.findMany({
    orderBy: [{ status: "asc" }, { dueDate: "asc" }, { createdAt: "desc" }],
  });

  const counts = audits.reduce<Record<EditorialAuditStatus, number>>(
    (acc, audit) => {
      acc[audit.status] += 1;
      return acc;
    },
    { PLANNED: 0, IN_PROGRESS: 0, COMPLETED: 0, ARCHIVED: 0 }
  );

  return (
    <div className="max-w-[1120px] space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-[24px] font-display font-bold">Auditorias</h1>
          <p className="mt-1 text-[13px] text-vp-text-3">
            Cadastre e acompanhe auditorias editoriais, operacionais e de conformidade do portal.
          </p>
        </div>
        <a href="/admin/audit" className="vp-btn px-4 py-2 text-[12px] no-underline">
          Ver logs tecnicos
        </a>
      </div>

      <div className="grid gap-2 sm:grid-cols-4">
        {Object.entries(statusLabels).map(([status, label]) => (
          <div key={status} className="border border-vp-border bg-[#141413] p-3">
            <div className="text-[10px] font-black uppercase tracking-widest text-vp-text-4">{label}</div>
            <div className="mt-1 font-mono text-[22px] font-bold">{counts[status as EditorialAuditStatus]}</div>
          </div>
        ))}
      </div>

      <details className="vp-panel p-5" open={audits.length === 0}>
        <summary className="cursor-pointer text-[14px] font-bold uppercase tracking-widest text-vp-accent">
          Criar nova auditoria
        </summary>
        <div className="mt-5 border-t border-vp-border pt-5">
          <AuditForm action={createEditorialAudit} submitLabel="Criar auditoria" />
        </div>
      </details>

      <div className="space-y-3">
        {audits.length === 0 ? (
          <div className="vp-panel p-8 text-center text-[13px] italic text-vp-text-3">
            Nenhuma auditoria cadastrada ainda.
          </div>
        ) : (
          audits.map((audit) => {
            const updateAction = updateEditorialAudit.bind(null, audit.id);

            return (
              <details key={audit.id} className="border border-vp-border bg-[#141413] p-4">
                <summary className="cursor-pointer list-none">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`rounded border px-2 py-0.5 text-[10px] font-black uppercase tracking-widest ${statusStyles[audit.status]}`}>
                          {statusLabels[audit.status]}
                        </span>
                        <span className="text-[11px] text-vp-text-4">Prazo: {displayDate(audit.dueDate)}</span>
                      </div>
                      <h2 className="mt-2 truncate text-[17px] font-bold">{audit.title}</h2>
                      <p className="mt-1 line-clamp-2 text-[13px] text-vp-text-3">{audit.summary}</p>
                    </div>
                    <div className="shrink-0 text-[11px] text-vp-text-4">
                      Responsavel: <span className="text-vp-text-2">{audit.owner ?? "-"}</span>
                    </div>
                  </div>
                </summary>

                <div className="mt-5 border-t border-vp-border pt-5">
                  <AuditForm action={updateAction} submitLabel="Salvar alteracoes" audit={audit} />
                </div>
              </details>
            );
          })
        )}
      </div>
    </div>
  );
}
