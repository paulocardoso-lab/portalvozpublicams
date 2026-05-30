import React from "react";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import { updateSubscriptionStatus } from "./actions";
import { SubStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function AdminSubscriptionsPage() {
  await requireAdmin();

  const subscriptions = await prisma.subscription.findMany({
    select: {
      id: true,
      plan: true,
      amount: true,
      method: true,
      status: true,
      startedAt: true,
      user: { select: { name: true, email: true } },
    },
    orderBy: { startedAt: "desc" },
  });

  const total = subscriptions.filter((s) => s.status === "ACTIVE").reduce((sum, s) => sum + s.amount, 0);

  const PLAN_LABELS: Record<string, string> = {
    READER: "Leitor",
    SUPPORTER: "Apoiador",
    GUARDIAN: "Guardião",
    PATRON: "Patrono",
    CUSTOM: "Personalizado",
  };

  const STATUS_COLORS: Record<string, string> = {
    ACTIVE: "text-vp-ok border-vp-ok bg-vp-ok/10",
    PAST_DUE: "text-vp-warn border-vp-warn bg-vp-warn/10",
    CANCELLED: "text-vp-text-3 border-vp-text-3 bg-vp-text-3/10",
    PAUSED: "text-vp-accent border-vp-accent bg-vp-accent/10",
  };

  return (
    <div className="max-w-[1000px]">
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold mb-1">Assinaturas & Doações</h1>
        <p className="text-vp-text-3 text-[13px]">
          {subscriptions.filter((s) => s.status === "ACTIVE").length} assinaturas ativas · R$ {(total / 100).toFixed(2).replace(".", ",")} / mês
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
        {["ACTIVE", "PAST_DUE", "CANCELLED", "PAUSED"].map((status) => {
          const count = subscriptions.filter((s) => s.status === status).length;
          return (
            <div key={status} className="bg-[#141413] border border-vp-border p-3.5 rounded">
              <div className="text-[24px] font-bold font-mono">{count}</div>
              <div className="text-[11px] text-vp-text-3 uppercase tracking-wider mt-0.5">
                {status === "ACTIVE" ? "Ativas" : status === "PAST_DUE" ? "Inadimplentes" : status === "CANCELLED" ? "Canceladas" : "Pausadas"}
              </div>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-[#141413] border border-vp-border rounded overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-[12px] min-w-[700px]">
          <thead>
            <tr className="border-b border-vp-border text-[10px] text-vp-text-3 uppercase tracking-wider">
              <th className="px-4 py-3">Assinante</th>
              <th className="px-4 py-3">Plano</th>
              <th className="px-4 py-3">Valor</th>
              <th className="px-4 py-3">Método</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Desde</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-vp-border">
            {subscriptions.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-vp-text-3 italic">
                  Nenhuma assinatura ainda.
                </td>
              </tr>
            ) : (
              subscriptions.map((sub) => (
                <tr key={sub.id} className="hover:bg-vp-surface/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-[13px]">{sub.user.name}</div>
                    <div className="text-[11px] text-vp-text-3">{sub.user.email}</div>
                  </td>
                  <td className="px-4 py-3 font-semibold">{PLAN_LABELS[sub.plan] ?? sub.plan}</td>
                  <td className="px-4 py-3 font-mono">R$ {(sub.amount / 100).toFixed(2).replace(".", ",")}</td>
                  <td className="px-4 py-3 text-vp-text-3">{sub.method}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${STATUS_COLORS[sub.status] ?? ""}`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-vp-text-3">
                    {sub.startedAt.toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap justify-end gap-1.5">
                      {sub.status !== "ACTIVE" && (
                        <form action={updateSubscriptionStatus.bind(null, sub.id, SubStatus.ACTIVE)}>
                          <button type="submit" className="vp-btn text-[10px] px-2 py-1 text-vp-ok border-vp-ok">
                            Ativar
                          </button>
                        </form>
                      )}
                      {sub.status !== "PAUSED" && (
                        <form action={updateSubscriptionStatus.bind(null, sub.id, SubStatus.PAUSED)}>
                          <button type="submit" className="vp-btn text-[10px] px-2 py-1">
                            Pausar
                          </button>
                        </form>
                      )}
                      {sub.status !== "PAST_DUE" && (
                        <form action={updateSubscriptionStatus.bind(null, sub.id, SubStatus.PAST_DUE)}>
                          <button type="submit" className="vp-btn text-[10px] px-2 py-1 text-vp-warn border-vp-warn">
                            Inadimplente
                          </button>
                        </form>
                      )}
                      {sub.status !== "CANCELLED" && (
                        <form action={updateSubscriptionStatus.bind(null, sub.id, SubStatus.CANCELLED)}>
                          <button type="submit" className="vp-btn text-[10px] px-2 py-1 text-vp-urgent border-vp-urgent">
                            Cancelar
                          </button>
                        </form>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
