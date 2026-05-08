import React from "react";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminMetricsPage() {
  const [
    totalArticles,
    publishedArticles,
    totalUsers,
    totalComments,
    pendingComments,
    topArticles,
    totalSubscribers,
  ] = await Promise.all([
    prisma.article.count(),
    prisma.article.count({ where: { status: "PUBLISHED" } }),
    prisma.user.count({ where: { status: "ACTIVE" } }),
    prisma.comment.count(),
    prisma.comment.count({ where: { status: "PENDING" } }),
    prisma.article.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { views: "desc" },
      take: 10,
      include: { section: { select: { name: true } }, authors: { select: { name: true } } },
    }),
    prisma.newsletterSubscriber.count({ where: { confirmed: true } }),
  ]);

  const stats = [
    { label: "Matérias publicadas", value: publishedArticles, sub: `${totalArticles} total` },
    { label: "Usuários ativos", value: totalUsers, sub: "na plataforma" },
    { label: "Assinantes newsletter", value: totalSubscribers, sub: "confirmados" },
    { label: "Comentários", value: totalComments, sub: `${pendingComments} aguardando` },
  ];

  return (
    <div className="max-w-[1000px]">
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold mb-1">Métricas & Tráfego</h1>
        <p className="text-vp-text-3 text-[13px]">Dados consolidados do banco de dados.</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-[#141413] border border-vp-border p-4 rounded">
            <div className="text-[32px] font-bold font-mono text-vp-text leading-none">{s.value.toLocaleString("pt-BR")}</div>
            <div className="text-[12px] font-semibold mt-2">{s.label}</div>
            <div className="text-[11px] text-vp-text-3 mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Top articles */}
      <div className="bg-[#141413] border border-vp-border rounded overflow-hidden">
        <div className="px-5 py-3.5 border-b border-vp-border">
          <h3 className="text-[13px] font-semibold">Top 10 matérias por visualizações</h3>
        </div>
        <div className="divide-y divide-vp-border">
          {topArticles.length === 0 ? (
            <div className="px-5 py-8 text-center text-vp-text-3 italic">Nenhuma matéria com visualizações ainda.</div>
          ) : (
            topArticles.map((article, i) => (
              <div key={article.id} className="px-5 py-3.5 flex items-center gap-4">
                <div className="w-6 text-[13px] font-bold font-mono text-vp-text-3 shrink-0">{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold truncate">{article.title}</div>
                  <div className="text-[11px] text-vp-text-3">
                    {article.section.name} · {article.authors.map((a) => a.name).join(", ")}
                  </div>
                </div>
                <div className="text-[14px] font-mono font-bold text-vp-accent shrink-0">
                  {article.views > 1000 ? `${(article.views / 1000).toFixed(1)}k` : article.views}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
