import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { startOfDay } from "@/lib/analytics-helpers";
import ViewsSparkline from "./ViewsSparkline";

export const dynamic = "force-dynamic";

function formatDate(date: Date) {
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function formatCompact(value: number) {
  return value > 1000 ? `${(value / 1000).toFixed(1)}k` : value.toLocaleString("pt-BR");
}

async function getArticleAudit(id: string, days: number) {
  const article = await prisma.article.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      slug: true,
      views: true,
      publishedAt: true,
      status: true,
      section: { select: { name: true } },
      authors: { select: { name: true } },
    },
  });

  if (!article) return null;

  const since = startOfDay(new Date());
  since.setDate(since.getDate() - (days - 1));

  const daily = await prisma.articleViewDaily.findMany({
    where: { articleId: id, date: { gte: since } },
    orderBy: { date: "desc" },
  });

  return { article, daily, since };
}

export default async function ArticleAuditPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ days?: string }>;
}) {
  const { id } = await params;
  const { days: daysParam } = await searchParams;
  const days = Math.min(90, Math.max(7, Number(daysParam) || 30));

  const data = await getArticleAudit(id, days);
  if (!data) notFound();

  const { article, daily } = data;

  const periodViews = daily.reduce((sum, d) => sum + d.views, 0);
  const avgPerDay = daily.length > 0 ? Math.round(periodViews / daily.length) : 0;
  const peakDay = daily.reduce<{ date: Date; views: number } | null>((best, d) => {
    if (!best || d.views > best.views) return d;
    return best;
  }, null);

  const PERIODS = [7, 30, 90];

  return (
    <div className="max-w-[900px]">
      {/* Breadcrumb */}
      <div className="text-[12px] text-vp-text-3 mb-4 flex items-center gap-1.5">
        <Link href="/admin/metrics" className="hover:text-vp-accent">Métricas</Link>
        <span>/</span>
        <span className="truncate max-w-[400px]">{article.title}</span>
      </div>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-[20px] font-semibold mb-1 leading-snug">{article.title}</h1>
        <div className="text-[12px] text-vp-text-3 flex flex-wrap gap-3">
          <span>{article.section.name}</span>
          {article.authors.length > 0 && <span>· {article.authors.map((a) => a.name).join(", ")}</span>}
          {article.publishedAt && <span>· publicado em {formatDate(article.publishedAt)}</span>}
          <Link href={`/materia/${article.slug}`} target="_blank" className="hover:text-vp-accent ml-1">
            ver matéria ↗
          </Link>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total histórico", value: formatCompact(article.views) },
          { label: `Views (${days}d)`, value: formatCompact(periodViews) },
          { label: "Média/dia", value: formatCompact(avgPerDay) },
          { label: "Pico do período", value: peakDay ? formatCompact(peakDay.views) : "—", sub: peakDay ? formatDate(peakDay.date) : undefined },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-[#141413] border border-vp-border rounded p-4">
            <div className="text-[28px] font-bold font-mono text-vp-text leading-none">{kpi.value}</div>
            <div className="text-[11px] font-semibold mt-2">{kpi.label}</div>
            {kpi.sub && <div className="text-[10px] text-vp-text-3 mt-0.5">{kpi.sub}</div>}
          </div>
        ))}
      </div>

      {/* Sparkline */}
      {daily.length > 0 && (
        <div className="bg-[#141413] border border-vp-border rounded p-5 mb-6">
          <div className="text-[12px] font-semibold mb-4">Views por dia</div>
          <ViewsSparkline daily={daily.map((d) => ({ date: d.date.toISOString(), views: d.views }))} />
        </div>
      )}

      {/* Period selector */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[12px] text-vp-text-3">Período:</span>
        {PERIODS.map((p) => (
          <Link
            key={p}
            href={`/admin/metrics/artigo/${id}?days=${p}`}
            className={`text-[12px] px-3 py-1 rounded border transition-colors ${
              days === p
                ? "border-vp-accent text-vp-accent"
                : "border-vp-border text-vp-text-3 hover:text-vp-text hover:border-vp-text-3"
            }`}
          >
            {p}d
          </Link>
        ))}
      </div>

      {/* Daily table */}
      <div className="bg-[#141413] border border-vp-border rounded overflow-hidden">
        <div className="px-5 py-3.5 border-b border-vp-border">
          <h3 className="text-[13px] font-semibold">Detalhamento diário</h3>
        </div>
        {daily.length === 0 ? (
          <div className="px-5 py-8 text-center text-vp-text-3 italic text-[13px]">
            Nenhuma visualização registrada neste período.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-vp-border text-vp-text-3 text-[11px] uppercase tracking-wide">
                  <th className="text-left px-5 py-2.5 font-semibold">Data</th>
                  <th className="text-right px-5 py-2.5 font-semibold">Views</th>
                  <th className="text-right px-5 py-2.5 font-semibold hidden sm:table-cell">% do total</th>
                  <th className="px-5 py-2.5 hidden sm:table-cell"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-vp-border">
                {daily.map((row) => {
                  const pct = periodViews > 0 ? (row.views / periodViews) * 100 : 0;
                  const barWidth = Math.max(1, Math.round(pct));
                  return (
                    <tr key={row.id} className="hover:bg-white/[0.02]">
                      <td className="px-5 py-3 font-mono text-[12px] text-vp-text-3">
                        {formatDate(row.date)}
                      </td>
                      <td className="px-5 py-3 text-right font-mono font-bold text-vp-accent">
                        {row.views.toLocaleString("pt-BR")}
                      </td>
                      <td className="px-5 py-3 text-right font-mono text-[11px] text-vp-text-3 hidden sm:table-cell">
                        {pct.toFixed(1)}%
                      </td>
                      <td className="px-5 py-3 hidden sm:table-cell w-32">
                        <div className="h-1.5 bg-vp-border rounded-full overflow-hidden">
                          <div
                            className="h-full bg-vp-accent rounded-full"
                            style={{ width: `${barWidth}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t border-vp-border bg-white/[0.02]">
                  <td className="px-5 py-3 text-[12px] font-semibold">Total período</td>
                  <td className="px-5 py-3 text-right font-mono font-bold text-vp-accent">
                    {periodViews.toLocaleString("pt-BR")}
                  </td>
                  <td className="hidden sm:table-cell" />
                  <td className="hidden sm:table-cell" />
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
