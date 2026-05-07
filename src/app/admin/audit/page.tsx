import React from "react";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminAuditPage() {
  const logs = await prisma.auditLog.findMany({
    include: {
      user: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="max-w-[1000px]">
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold mb-1">Logs de Auditoria</h1>
        <p className="text-vp-text-3 text-[13px]">{logs.length} registros recentes</p>
      </div>

      <div className="bg-[#141413] border border-vp-border rounded overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-[12px] min-w-[700px]">
          <thead>
            <tr className="border-b border-vp-border text-[10px] text-vp-text-3 uppercase tracking-wider">
              <th className="px-4 py-3">Data/Hora</th>
              <th className="px-4 py-3">Usuário</th>
              <th className="px-4 py-3">Ação</th>
              <th className="px-4 py-3">Alvo</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">IP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-vp-border">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-vp-text-3 italic">
                  Nenhum log registrado ainda.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-vp-surface/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-vp-text-3 whitespace-nowrap">
                    {log.createdAt.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" })}
                  </td>
                  <td className="px-4 py-3 text-vp-text-2">{log.user?.name ?? log.userId ?? "sistema"}</td>
                  <td className="px-4 py-3 font-semibold font-mono text-vp-accent">{log.action}</td>
                  <td className="px-4 py-3 text-vp-text-3 max-w-[200px] truncate">{log.target ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${log.status === "OK" || log.status === "SUCCESS" ? "bg-vp-ok/10 text-vp-ok border-vp-ok/30" : "bg-vp-urgent/10 text-vp-urgent border-vp-urgent/30"}`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-vp-text-3">{log.ip ?? "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
