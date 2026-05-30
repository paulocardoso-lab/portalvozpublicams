import React from "react";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function maskIp(ip: string | null) {
  if (!ip) return "-";
  if (ip.includes(":")) return `${ip.split(":").slice(0, 3).join(":")}:...`;

  const parts = ip.split(".");
  if (parts.length !== 4) return "mascarado";

  return `${parts[0]}.${parts[1]}.${parts[2]}.0`;
}

export default async function AdminAuditPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAdmin();

  const query = await searchParams;
  const q = (firstParam(query.q) ?? "").trim();
  const status = (firstParam(query.status) ?? "").trim();
  const days = Number(firstParam(query.days) ?? "7");
  const safeDays = [1, 7, 30, 90].includes(days) ? days : 7;
  const since = new Date(Date.now() - safeDays * 24 * 60 * 60 * 1000);

  const where: Prisma.AuditLogWhereInput = {
    createdAt: { gte: since },
    ...(status ? { status } : {}),
    ...(q
      ? {
          OR: [
            { action: { contains: q, mode: "insensitive" } },
            { target: { contains: q, mode: "insensitive" } },
            { status: { contains: q, mode: "insensitive" } },
            { user: { name: { contains: q, mode: "insensitive" } } },
          ],
        }
      : {}),
  };

  const [logs, statusCounts] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      select: {
        id: true,
        userId: true,
        action: true,
        target: true,
        status: true,
        details: true,
        ip: true,
        createdAt: true,
        user: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
    prisma.auditLog.groupBy({
      by: ["status"],
      where: { createdAt: { gte: since } },
      _count: { _all: true },
    }),
  ]);

  const countByStatus = Object.fromEntries(statusCounts.map((item) => [item.status, item._count._all]));
  const knownStatuses = Array.from(new Set(["OK", "SUCCESS", "FAILED", "ERROR", ...Object.keys(countByStatus)])).filter(Boolean);

  return (
    <div className="max-w-[1100px]">
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold mb-1">Logs de Auditoria</h1>
        <p className="text-vp-text-3 text-[13px]">
          {logs.length} registros filtrados - janela de {safeDays} dia(s)
        </p>
      </div>

      <form action="/admin/audit" className="mb-5 grid gap-3 rounded border border-vp-border bg-[#141413] p-4 lg:grid-cols-[1fr_160px_140px_auto] lg:items-end">
        <label className="grid gap-1">
          <span className="text-[11px] text-vp-text-3 uppercase font-semibold">Buscar</span>
          <input name="q" className="vp-input text-[13px]" defaultValue={q} placeholder="Ação, alvo, usuário ou status" />
        </label>

        <label className="grid gap-1">
          <span className="text-[11px] text-vp-text-3 uppercase font-semibold">Status</span>
          <select name="status" className="vp-input text-[13px]" defaultValue={status} title="Filtrar por status">
            <option value="">Todos</option>
            {knownStatuses.map((item) => (
              <option key={item} value={item}>
                {item} ({countByStatus[item] ?? 0})
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1">
          <span className="text-[11px] text-vp-text-3 uppercase font-semibold">Período</span>
          <select name="days" className="vp-input text-[13px]" defaultValue={String(safeDays)} title="Filtrar por período">
            <option value="1">24 horas</option>
            <option value="7">7 dias</option>
            <option value="30">30 dias</option>
            <option value="90">90 dias</option>
          </select>
        </label>

        <div className="flex gap-2">
          <button type="submit" className="vp-btn vp-btn-primary px-5 py-2 text-[12px]">
            Filtrar
          </button>
          <a href="/admin/audit" className="vp-btn px-4 py-2 text-[12px] no-underline">
            Limpar
          </a>
        </div>
      </form>

      <div className="mb-5 grid gap-2 sm:grid-cols-4">
        {knownStatuses.slice(0, 4).map((item) => (
          <div key={item} className="border border-vp-border bg-[#141413] p-3">
            <div className="text-[10px] font-black uppercase tracking-widest text-vp-text-4">{item}</div>
            <div className="mt-1 font-mono text-[22px] font-bold">{countByStatus[item] ?? 0}</div>
          </div>
        ))}
      </div>

      <div className="bg-[#141413] border border-vp-border rounded overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-[12px] min-w-[820px]">
          <thead>
            <tr className="border-b border-vp-border text-[10px] text-vp-text-3 uppercase tracking-wider">
              <th className="px-4 py-3">Data/Hora</th>
              <th className="px-4 py-3">Usuário</th>
              <th className="px-4 py-3">Ação</th>
              <th className="px-4 py-3">Alvo</th>
              <th className="px-4 py-3">Detalhes</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">IP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-vp-border">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-vp-text-3 italic">
                  Nenhum log encontrado para os filtros selecionados.
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
                  <td className="px-4 py-3 text-vp-text-3 max-w-[180px] truncate">{log.target ?? "-"}</td>
                  <td className="px-4 py-3 text-vp-text-3 max-w-[220px] truncate">
                    {log.details ? JSON.stringify(log.details) : "-"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${log.status === "OK" || log.status === "SUCCESS" ? "bg-vp-ok/10 text-vp-ok border-vp-ok/30" : "bg-vp-urgent/10 text-vp-urgent border-vp-urgent/30"}`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-vp-text-3">{maskIp(log.ip)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
