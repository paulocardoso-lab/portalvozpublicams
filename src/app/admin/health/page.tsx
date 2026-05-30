import React from "react";
import { getAdminHealthChecks, type AdminHealthStatus } from "@/lib/admin/health";

export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<AdminHealthStatus, string> = {
  ok: "Operacional",
  warn: "Atenção",
  fail: "Crítico",
};

const STATUS_CLASSES: Record<AdminHealthStatus, string> = {
  ok: "border-vp-ok/40 bg-vp-ok/10 text-vp-ok",
  warn: "border-vp-warn/40 bg-vp-warn/10 text-vp-warn",
  fail: "border-vp-urgent/40 bg-vp-urgent/10 text-vp-urgent",
};

export default async function AdminHealthPage() {
  const checks = await getAdminHealthChecks();
  const failed = checks.filter((check) => check.status === "fail").length;
  const warnings = checks.filter((check) => check.status === "warn").length;
  const ok = checks.filter((check) => check.status === "ok").length;

  return (
    <div className="max-w-[1000px]">
      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-[22px] font-semibold mb-1">Saúde do sistema</h1>
          <p className="text-vp-text-3 text-[13px]">
            {ok} operacionais · {warnings} em atenção · {failed} críticos
          </p>
        </div>
        <span
          className={`w-fit border px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
            failed > 0 ? STATUS_CLASSES.fail : warnings > 0 ? STATUS_CLASSES.warn : STATUS_CLASSES.ok
          }`}
        >
          {failed > 0 ? "Ação necessária" : warnings > 0 ? "Monitorar" : "Pronto para operação"}
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {checks.map((check) => (
          <section key={check.id} className="border border-vp-border bg-[#141413] p-5">
            <div className="mb-3 flex items-start justify-between gap-4">
              <h2 className="text-[14px] font-semibold">{check.label}</h2>
              <span className={`border px-2 py-0.5 text-[10px] font-black uppercase tracking-widest ${STATUS_CLASSES[check.status]}`}>
                {STATUS_LABELS[check.status]}
              </span>
            </div>
            <p className="text-[13px] leading-relaxed text-vp-text-2">{check.detail}</p>
            {check.action && (
              <p className="mt-3 border-l-2 border-vp-accent pl-3 text-[12px] leading-relaxed text-vp-text-3">
                {check.action}
              </p>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
