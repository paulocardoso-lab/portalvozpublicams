import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

async function getTopArticlesByPeriod(startDate: Date, take = 10) {
  const ranked = await prisma.articleViewDaily.groupBy({
    by: ["articleId"],
    where: { date: { gte: startDate } },
    _sum: { views: true },
    orderBy: { _sum: { views: "desc" } },
    take,
  });

  const ids = ranked.map((item) => item.articleId);
  if (ids.length === 0) return [];

  const articles = await prisma.article.findMany({
    where: { id: { in: ids } },
    select: {
      id: true,
      title: true,
      slug: true,
      section: { select: { name: true } },
    },
  });

  const articleById = new Map(articles.map((article) => [article.id, article]));
  return ranked
    .map((item) => {
      const article = articleById.get(item.articleId);
      if (!article) return null;
      return {
        ...article,
        periodViews: item._sum.views ?? 0,
      };
    })
    .filter((article): article is NonNullable<typeof article> => Boolean(article));
}

function formatCompact(value: number) {
  return value > 1000 ? `${(value / 1000).toFixed(1)}k` : value.toLocaleString("pt-BR");
}

function PeriodRanking({
  title,
  articles,
  empty,
}: {
  title: string;
  articles: Awaited<ReturnType<typeof getTopArticlesByPeriod>>;
  empty: string;
}) {
  return (
    <div className="bg-[#141413] border border-vp-border rounded overflow-hidden">
      <div className="px-5 py-3.5 border-b border-vp-border">
        <h3 className="text-[13px] font-semibold">{title}</h3>
      </div>
      <div className="divide-y divide-vp-border">
        {articles.length === 0 ? (
          <div className="px-5 py-8 text-center text-vp-text-3 italic">{empty}</div>
        ) : (
          articles.map((article, i) => (
            <div key={article.id} className="px-5 py-3.5 flex items-center gap-4">
              <div className="w-6 text-[13px] font-bold font-mono text-vp-text-3 shrink-0">{i + 1}</div>
              <div className="flex-1 min-w-0">
                <Link href={`/materia/${article.slug}`} className="text-[13px] font-semibold truncate block hover:text-vp-accent">
                  {article.title}
                </Link>
                <div className="text-[11px] text-vp-text-3">{article.section.name}</div>
              </div>
              <div className="text-[14px] font-mono font-bold text-vp-accent shrink-0">
                {formatCompact(article.periodViews)}
              </div>
              <Link href={`/admin/metrics/artigo/${article.id}`} className="text-[11px] text-vp-text-3 hover:text-vp-accent shrink-0" title="Auditoria detalhada">
                ↗
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default async function AdminMetricsPage() {
  const today = startOfDay(new Date());
  const weekStart = startOfDay(new Date());
  weekStart.setDate(weekStart.getDate() - 6);

  const [
    totalArticles,
    publishedArticles,
    totalUsers,
    totalComments,
    pendingComments,
    topArticles,
    topToday,
    topWeek,
    todayMetric,
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
    getTopArticlesByPeriod(today, 10),
    getTopArticlesByPeriod(weekStart, 10),
    prisma.siteMetric.findUnique({ where: { date: today } }),
    prisma.newsletterSubscriber.count({ where: { confirmed: true } }),
  ]);

  const stats = [
    { label: "Matérias publicadas", value: publishedArticles, sub: `${totalArticles} total` },
    { label: "Usuários ativos", value: totalUsers, sub: "na plataforma" },
    { label: "Pageviews hoje", value: todayMetric?.views ?? 0, sub: `${(todayMetric?.visitors ?? 0).toLocaleString("pt-BR")} visitantes únicos estimados` },
    { label: "Assinantes newsletter", value: totalSubscribers, sub: "confirmados" },
    { label: "Comentários", value: totalComments, sub: `${pendingComments} aguardando` },
  ];

  return (
    <div className="max-w-[1000px]">
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold mb-1">Métricas & Tráfego</h1>
        <p className="text-vp-text-3 text-[13px]">Dados consolidados do banco de dados.</p>
      </div>

      <div className="mb-6">
        <Link href="/admin/metrics/market" className="vp-btn vp-btn-primary px-4 py-2 text-[12px]">
          Configurar indicadores do cabeçalho
        </Link>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-[#141413] border border-vp-border p-4 rounded">
            <div className="text-[32px] font-bold font-mono text-vp-text leading-none">{s.value.toLocaleString("pt-BR")}</div>
            <div className="text-[12px] font-semibold mt-2">{s.label}</div>
            <div className="text-[11px] text-vp-text-3 mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5 mb-8">
        <PeriodRanking
          title="Mais lidas hoje"
          articles={topToday}
          empty="Nenhuma visualização registrada hoje ainda."
        />
        <PeriodRanking
          title="Mais lidas nos últimos 7 dias"
          articles={topWeek}
          empty="Nenhuma visualização registrada nos últimos 7 dias ainda."
        />
      </div>

      <div className="bg-[#141413] border border-vp-border rounded overflow-hidden">
        <div className="px-5 py-3.5 border-b border-vp-border">
          <h3 className="text-[13px] font-semibold">Top 10 histórico por visualizações</h3>
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
                  {formatCompact(article.views)}
                </div>
                <Link href={`/admin/metrics/artigo/${article.id}`} className="text-[11px] text-vp-text-3 hover:text-vp-accent shrink-0" title="Auditoria detalhada">
                  ↗
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
