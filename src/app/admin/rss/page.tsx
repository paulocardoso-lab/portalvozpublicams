import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-guard';
import Link from 'next/link';
import { RSSManager, RSSActions } from './RSSManager';

const RSS_SYSTEM_USER_ID = 'rss-system-user-0000000000000001';

export default async function RSSDashboardPage() {
  await requireAdmin();

  const rssAuthorFilter = { authors: { some: { id: RSS_SYSTEM_USER_ID } } };

  const [feeds, recentLogs, sections, totalImported, totalPublished, totalInReview, totalDead] =
    await Promise.all([
      prisma.rSSFeed.findMany({
        include: { targetSection: true, _count: { select: { logs: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.rSSLog.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { feed: true },
      }),
      prisma.section.findMany({ select: { id: true, name: true } }),
      prisma.article.count({ where: rssAuthorFilter }),
      prisma.article.count({ where: { ...rssAuthorFilter, status: 'PUBLISHED' } }),
      prisma.article.count({ where: { ...rssAuthorFilter, status: 'IN_REVIEW' } }),
      prisma.rSSDeadLetter.count({ where: { resolvedAt: null, attempts: { gte: 3 } } }),
    ]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-[24px] font-display font-bold">Automação RSS</h1>
          <p className="text-vp-text-3 text-[13px]">Gerencie a captura automática de notícias via feeds externos.</p>
        </div>
        <RSSManager sections={sections} />
      </div>

      {/* Global stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-[#141413] border border-vp-border p-4 text-center">
          <div className="text-[28px] font-black text-vp-text leading-none">{totalImported}</div>
          <div className="text-[9px] text-vp-text-4 uppercase tracking-widest mt-1">Total Importados</div>
        </div>
        <div className="bg-[#141413] border border-vp-border p-4 text-center">
          <div className="text-[28px] font-black text-green-400 leading-none">{totalPublished}</div>
          <div className="text-[9px] text-vp-text-4 uppercase tracking-widest mt-1">Publicados</div>
        </div>
        <Link href="/admin/rss/fila" className="bg-[#141413] border border-yellow-400/30 p-4 text-center hover:border-yellow-400/60 transition-colors group block">
          <div className="text-[28px] font-black text-yellow-400 leading-none group-hover:scale-105 transition-transform">{totalInReview}</div>
          <div className="text-[9px] text-vp-text-4 uppercase tracking-widest mt-1">Aguardando Revisão ↗</div>
        </Link>
        <div className="bg-[#141413] border border-vp-urgent/20 p-4 text-center">
          <div className="text-[28px] font-black text-vp-urgent leading-none">{totalDead}</div>
          <div className="text-[9px] text-vp-text-4 uppercase tracking-widest mt-1">Com Problema</div>
        </div>
      </div>

      <div className="grid xl:grid-cols-[1fr_320px] gap-6">
        {/* Feeds List */}
        <div className="bg-[#141413] border border-vp-border overflow-x-auto">
          <table className="w-full min-w-170 text-left border-collapse">
            <thead>
              <tr className="bg-vp-surface border-b border-vp-border">
                <th className="p-4 text-[11px] uppercase tracking-wider text-vp-text-3 font-bold">Fonte</th>
                <th className="p-4 text-[11px] uppercase tracking-wider text-vp-text-3 font-bold w-28">Editoria</th>
                <th className="p-4 text-[11px] uppercase tracking-wider text-vp-text-3 font-bold w-44">Sincronismo</th>
                <th className="p-4 text-[11px] uppercase tracking-wider text-vp-text-3 font-bold w-20">Saúde</th>
                <th className="p-4 text-[11px] uppercase tracking-wider text-vp-text-3 font-bold text-right w-36">Ações</th>
              </tr>
            </thead>
            <tbody>
              {feeds.map(feed => (
                <tr key={feed.id} className="border-b border-vp-border hover:bg-vp-surface/30 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-[14px]">{feed.name}</div>
                    <div className="text-[11px] text-vp-text-3 truncate max-w-50">{feed.url}</div>
                  </td>
                  <td className="p-4 w-28">
                    <span className="bg-vp-accent/10 text-vp-accent text-[11px] px-2 py-0.5 border border-vp-accent/20">
                      {feed.targetSection.name}
                    </span>
                  </td>
                  <td className="p-4 w-44">
                    <div className="text-[12px]">{feed.lastSync ? new Date(feed.lastSync).toLocaleString('pt-BR') : 'Nunca'}</div>
                    <div className="text-[10px] text-vp-text-3">a cada {feed.syncIntervalHours}h · máx {feed.maxItemsPerSync} itens</div>
                    <div className="text-[10px] text-vp-text-3">{feed._count.logs} capturas no total</div>
                  </td>
                  <td className="p-4 w-20">
                    {feed.disabledAt ? (
                      <span className="text-[10px] text-vp-urgent border border-vp-urgent/30 px-1.5 py-0.5">
                        desabilitado
                      </span>
                    ) : feed.consecutiveFailures >= 3 ? (
                      <span className="text-[10px] text-yellow-400 border border-yellow-400/30 px-1.5 py-0.5">
                        {feed.consecutiveFailures} falhas
                      </span>
                    ) : (
                      <span className="text-[10px] text-green-400">ok</span>
                    )}
                  </td>
                  <td className="p-4 text-right w-36">
                    <RSSActions feed={feed} sections={sections} />
                  </td>
                </tr>
              ))}
              {feeds.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-vp-text-3 font-serif italic">
                    Nenhuma fonte RSS configurada. Adicione uma para começar a automação.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Recent Activity */}
        <div className="space-y-4">
          <div className="bg-[#141413] border border-vp-border p-5">
            <h3 className="text-[12px] font-bold uppercase tracking-widest text-vp-accent mb-4">Últimas Capturas</h3>
            <div className="space-y-4">
              {recentLogs.map(log => (
                <div key={log.id} className="flex gap-3 items-start border-l-2 border-vp-border pl-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${log.status === 'SUCCESS' ? 'bg-green-500' : log.status === 'PARTIAL' ? 'bg-yellow-400' : 'bg-red-500'}`} />
                  <div className="min-w-0">
                    <div className="text-[13px] font-bold leading-tight line-clamp-2">{log.message}</div>
                    <div className="text-[10px] text-vp-text-3 mt-1 uppercase tracking-tighter">
                      {log.feed.name} • {new Date(log.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              {recentLogs.length === 0 && (
                <p className="text-[12px] text-vp-text-3 font-serif italic">Nenhuma captura ainda.</p>
              )}
            </div>
          </div>

          <div className="bg-vp-accent/5 border border-vp-accent/20 p-5">
            <h3 className="text-[12px] font-bold text-vp-accent mb-2">Dica Pro</h3>
            <p className="text-[12px] text-vp-text-2 leading-relaxed">
              Use o RSS do Google News para capturar notícias regionais. Adicione o parâmetro{' '}
              <code className="bg-vp-surface px-1">hl=pt-BR&gl=BR</code> na URL para resultados em português.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
