import React from 'react';
import Link from 'next/link';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { DashboardStat } from '@/components/admin/DashboardStat';
import { DashboardSparkline } from '@/components/admin/DashboardSparkline';

export const dynamic = 'force-dynamic';

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('pt-BR').format(value);
}

function formatCurrencyFromCents(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value / 100);
}

function greetingFor(date: Date) {
  const hour = Number(
    new Intl.DateTimeFormat('pt-BR', { hour: 'numeric', hour12: false, timeZone: 'America/Campo_Grande' }).format(date)
  );
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

function relativeTime(date: Date) {
  const seconds = Math.max(1, Math.floor((Date.now() - date.getTime()) / 1000));
  if (seconds < 60) return 'agora';

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `ha ${minutes}min`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `ha ${hours}h`;

  const days = Math.floor(hours / 24);
  return `ha ${days}d`;
}

export default async function AdminDashboardPage() {
  const session = await auth();
  const userName = session?.user?.name || session?.user?.email?.split('@')[0] || "Administrador";

  const now = new Date();
  const today = startOfDay(now);
  const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const next48h = new Date(now.getTime() + 48 * 60 * 60 * 1000);

  const [
    publishedLast24h,
    totalUsers,
    todayMetric,
    activeSubscriptions,
    newSubscriptionsToday,
    activeCampaigns,
    pendingComments,
    spamComments,
    draftArticles,
    reviewArticles,
    approvedToday,
    scheduledArticles,
    missingHeroImages,
    expiringCampaigns,
    topArticles,
    recentMetrics,
    recentAuditLogs,
  ] = await Promise.all([
    prisma.article.count({
      where: { status: 'PUBLISHED', publishedAt: { gte: last24h } },
    }),
    prisma.user.count(),
    prisma.siteMetric.findFirst({
      where: { date: { gte: today } },
      orderBy: { date: 'desc' },
    }),
    prisma.subscription.findMany({
      where: { status: 'ACTIVE' },
      select: { amount: true },
    }),
    prisma.subscription.count({
      where: { startedAt: { gte: today } },
    }),
    prisma.campaign.count({
      where: { status: 'ACTIVE' },
    }),
    prisma.comment.count({
      where: { status: 'PENDING' },
    }),
    prisma.comment.count({
      where: { status: { in: ['SPAM', 'BANNED'] } },
    }),
    prisma.article.count({
      where: { status: 'DRAFT' },
    }),
    prisma.article.count({
      where: { status: 'IN_REVIEW' },
    }),
    prisma.article.count({
      where: { status: 'APPROVED', updatedAt: { gte: today } },
    }),
    prisma.article.count({
      where: { status: 'SCHEDULED' },
    }),
    prisma.article.count({
      where: { heroImage: null },
    }),
    prisma.campaign.count({
      where: { status: 'ACTIVE', endsAt: { gte: now, lte: next48h } },
    }),
    prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: [{ views: 'desc' }, { publishedAt: 'desc' }],
      take: 5,
      select: { id: true, title: true, views: true },
    }),
    prisma.siteMetric.findMany({
      orderBy: { date: 'asc' },
      take: 24,
      select: { views: true, date: true },
    }),
    prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        action: true,
        target: true,
        status: true,
        createdAt: true,
        user: { select: { name: true, email: true } },
      },
    }),
  ]);

  const monthlyRecurringRevenue = activeSubscriptions.reduce((sum, sub) => sum + sub.amount, 0);
  const trafficData = recentMetrics.map((metric) => metric.views);
  const hasTrafficData = trafficData.some((value) => value > 0);

  const alerts = [
    pendingComments > 0 ? {
      level: 'urgent',
      text: `${pendingComments} comentario${pendingComments === 1 ? '' : 's'} aguardando moderacao`,
      href: '/admin/comments',
    } : null,
    spamComments > 0 ? {
      level: 'warn',
      text: `${spamComments} comentario${spamComments === 1 ? '' : 's'} marcado${spamComments === 1 ? '' : 's'} como spam/bloqueado`,
      href: '/admin/comments',
    } : null,
    expiringCampaigns > 0 ? {
      level: 'warn',
      text: `${expiringCampaigns} campanha${expiringCampaigns === 1 ? '' : 's'} expira${expiringCampaigns === 1 ? '' : 'm'} em ate 48 horas`,
      href: '/admin/ads',
    } : null,
    missingHeroImages > 0 ? {
      level: 'info',
      text: `${missingHeroImages} materia${missingHeroImages === 1 ? '' : 's'} sem imagem destacada`,
      href: '/admin/posts',
    } : null,
  ].filter((alert): alert is { level: string; text: string; href: string } => Boolean(alert));

  return (
    <div className="space-y-10">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="font-display text-[32px] lg:text-[42px] font-black leading-tight">
            {greetingFor(now)}, {userName}.
          </h1>
          <p className="font-serif italic text-[16px] text-vp-text-3 mt-2">
            {new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' }).format(now)}
            {' '}· {formatNumber(publishedLast24h)} materia{publishedLast24h === 1 ? '' : 's'} publicada{publishedLast24h === 1 ? '' : 's'} nas ultimas 24h.
          </p>
        </div>
        <div className="flex gap-3">
          <select className="vp-input text-[12px] font-bold uppercase tracking-widest py-2.5 px-4 bg-[#141413]" aria-label="Periodo do dashboard">
            <option>Ultimas 24 horas</option>
            <option>Ultimos 7 dias</option>
            <option>Ultimos 30 dias</option>
          </select>
          <button className="vp-btn text-[12px] font-bold uppercase tracking-widest py-2.5 px-4" type="button">
            Exportar relatorio
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardStat label="Usuarios cadastrados" value={formatNumber(totalUsers)} sub="total na plataforma" />
        <DashboardStat label="Page views hoje" value={formatNumber(todayMetric?.views ?? 0)} sub={`${formatNumber(todayMetric?.visitors ?? 0)} visitantes`} />
        <DashboardStat label="Novos assinantes" value={formatNumber(newSubscriptionsToday)} sub="hoje" />
        <DashboardStat label="Receita mensal" value={formatCurrencyFromCents(monthlyRecurringRevenue)} sub={`${formatNumber(activeCampaigns)} campanhas ativas`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 vp-panel p-6 bg-[#141413] border border-vp-border overflow-hidden">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-[15px] font-black uppercase tracking-widest mb-1">Trafego registrado</h3>
              <p className="text-[12px] text-vp-text-4 italic font-serif">Metricas gravadas no banco</p>
            </div>
          </div>

          {hasTrafficData ? (
            <>
              <div className="h-[200px] overflow-hidden">
                <DashboardSparkline points={trafficData} height={200} />
              </div>
              <div className="flex justify-between mt-4 font-mono text-[10px] text-vp-text-4 uppercase tracking-widest border-t border-vp-border pt-4">
                <span>{recentMetrics[0]?.date.toLocaleDateString('pt-BR') ?? 'Inicio'}</span>
                <span className="text-vp-accent font-black">Hoje</span>
              </div>
            </>
          ) : (
            <div className="h-[200px] border border-dashed border-vp-border rounded flex items-center justify-center text-center px-6">
              <p className="text-[13px] text-vp-text-3 italic">
                Nenhuma metrica de trafego registrada ainda.
              </p>
            </div>
          )}
        </div>

        <div className="vp-panel p-6 bg-[#141413] border border-vp-border overflow-hidden">
          <h3 className="text-[15px] font-black uppercase tracking-widest mb-6">Mais lidas</h3>
          {topArticles.length === 0 ? (
            <p className="text-[13px] text-vp-text-3 italic">Nenhuma materia publicada ainda.</p>
          ) : (
            <div className="space-y-4">
              {topArticles.map((article, i) => (
                <div key={article.id} className="grid grid-cols-[24px_1fr_40px] gap-3 items-start group">
                  <span className="font-mono text-[16px] text-vp-accent font-black leading-none pt-0.5">{i + 1}</span>
                  <p className="text-[12px] leading-snug font-bold text-vp-text-2 group-hover:text-vp-text transition-colors line-clamp-2 min-w-0">
                    {article.title}
                  </p>
                  <span className="font-mono text-[11px] text-vp-text-4 text-right tabular-nums pt-0.5">{formatNumber(article.views)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { t: 'Rascunhos', n: draftArticles, c: 'border-vp-text-4', href: '/admin/posts' },
          { t: 'Em revisao', n: reviewArticles, c: 'border-yellow-600', href: '/admin/posts' },
          { t: 'Aprovadas hoje', n: approvedToday, c: 'border-vp-ok', href: '/admin/posts' },
          { t: 'Agendadas', n: scheduledArticles, c: 'border-vp-accent', href: '/admin/posts' },
        ].map((p) => (
          <div key={p.t} className={`vp-panel p-6 bg-[#0e0e0d] border-l-4 ${p.c} flex items-center justify-between`}>
            <div>
              <div className="text-[10px] text-vp-text-4 font-black uppercase tracking-widest mb-1">{p.t}</div>
              <div className="font-display text-[28px] font-black text-vp-text">{formatNumber(p.n)}</div>
            </div>
            <Link href={p.href} className="text-[11px] font-black uppercase text-vp-accent hover:underline">
              Ver fila
            </Link>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="vp-panel p-8 bg-[#141413] border border-vp-border">
          <h3 className="text-[15px] font-black uppercase tracking-widest mb-8">Atividade da redacao</h3>
          {recentAuditLogs.length === 0 ? (
            <p className="text-[13px] text-vp-text-3 italic">Nenhuma atividade registrada ainda.</p>
          ) : (
            <div className="space-y-6">
              {recentAuditLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-4 pb-6 border-b border-vp-border/30 last:border-0 last:pb-0">
                  <div className="w-8 h-8 rounded-full border border-vp-border shrink-0 bg-vp-surface flex items-center justify-center font-mono text-[10px] text-vp-text-3">
                    {(log.user?.name || log.user?.email || 'S').slice(0, 1).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] leading-relaxed">
                      <span className="font-black text-vp-text">{log.user?.name ?? log.user?.email ?? 'Sistema'}</span>{' '}
                      <span className="text-vp-text-3 italic font-serif">{log.action}</span>{' '}
                      {log.target && <span className="font-bold text-vp-text-2">{log.target}</span>}
                    </p>
                    <span className="text-[10px] text-vp-text-4 font-mono uppercase mt-1 block">
                      {relativeTime(log.createdAt)} · {log.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="vp-panel p-8 bg-[#141413] border border-vp-border">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-[15px] font-black uppercase tracking-widest">Alertas & tarefas</h3>
            {alerts.length > 0 && (
              <span className="bg-vp-urgent text-vp-bg text-[10px] font-black px-2 py-0.5 rounded-sm">
                {alerts.length} alerta{alerts.length === 1 ? '' : 's'}
              </span>
            )}
          </div>
          {alerts.length === 0 ? (
            <p className="text-[13px] text-vp-text-3 italic">Nenhum alerta operacional no momento.</p>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.text} className={`flex items-center gap-4 p-4 border rounded-sm transition-all hover:bg-vp-bg ${
                  alert.level === 'urgent' ? 'border-vp-urgent/30 bg-vp-urgent/5' : 'border-vp-border bg-vp-surface/30'
                }`}>
                  <span className={`w-2 h-2 rounded-full shrink-0 ${
                    alert.level === 'urgent' ? 'bg-vp-urgent shadow-[0_0_8px_rgba(255,0,0,0.5)]' : alert.level === 'warn' ? 'bg-yellow-500' : 'bg-vp-text-4'
                  }`} />
                  <span className="text-[13px] text-vp-text-2 flex-1 font-bold">{alert.text}</span>
                  <Link href={alert.href} className="text-[10px] font-black uppercase text-vp-accent hover:underline">
                    Ver
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
