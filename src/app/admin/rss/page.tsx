import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-guard';
import { RSSManager, RSSActions } from './RSSManager';

export default async function RSSDashboardPage() {
  await requireAdmin();

  const [feeds, recentLogs, sections] = await prisma.$transaction([
    prisma.rSSFeed.findMany({
      include: { targetSection: true, _count: { select: { logs: true } } },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.rSSLog.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { feed: true }
    }),
    prisma.section.findMany({ select: { id: true, name: true } })
  ]);

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-[24px] font-display font-bold">Automação RSS</h1>
          <p className="text-vp-text-3 text-[13px]">Gerencie a captura automática de notícias via feeds externos.</p>
        </div>
        <RSSManager sections={sections} />
      </div>

      <div className="grid lg:grid-cols-[1fr_350px] gap-6">
        {/* Feeds List */}
        <div className="bg-[#141413] border border-vp-border overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-vp-surface border-b border-vp-border">
                <th className="p-4 text-[11px] uppercase tracking-wider text-vp-text-3 font-bold">Fonte</th>
                <th className="p-4 text-[11px] uppercase tracking-wider text-vp-text-3 font-bold">Editoria</th>
                <th className="p-4 text-[11px] uppercase tracking-wider text-vp-text-3 font-bold">Sincronismo</th>
                <th className="p-4 text-[11px] uppercase tracking-wider text-vp-text-3 font-bold">Saúde</th>
                <th className="p-4 text-[11px] uppercase tracking-wider text-vp-text-3 font-bold text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {feeds.map(feed => (
                <tr key={feed.id} className="border-b border-vp-border hover:bg-vp-surface/30 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-[14px]">{feed.name}</div>
                    <div className="text-[11px] text-vp-text-3 truncate max-w-[200px]">{feed.url}</div>
                  </td>
                  <td className="p-4">
                    <span className="bg-vp-accent/10 text-vp-accent text-[11px] px-2 py-0.5 border border-vp-accent/20">
                      {feed.targetSection.name}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="text-[12px]">{feed.lastSync ? new Date(feed.lastSync).toLocaleString('pt-BR') : 'Nunca'}</div>
                    <div className="text-[10px] text-vp-text-3">a cada {feed.syncIntervalHours}h · máx {feed.maxItemsPerSync} itens</div>
                    <div className="text-[10px] text-vp-text-3">{feed._count.logs} capturas no total</div>
                  </td>
                  <td className="p-4">
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
                  <td className="p-4 text-right">
                    <RSSActions feed={feed} sections={sections} />
                  </td>
                </tr>
              ))}
              {feeds.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-10 text-center text-vp-text-3 font-serif italic">
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
                  <div className={`w-2 h-2 rounded-full mt-1.5 ${log.status === 'SUCCESS' ? 'bg-green-500' : log.status === 'PARTIAL' ? 'bg-yellow-400' : 'bg-red-500'}`} />
                  <div>
                    <div className="text-[13px] font-bold leading-tight line-clamp-2">{log.message}</div>
                    <div className="text-[10px] text-vp-text-3 mt-1 uppercase tracking-tighter">
                      {log.feed.name} • {new Date(log.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-vp-accent/5 border border-vp-accent/20 p-5">
            <h3 className="text-[12px] font-bold text-vp-accent mb-2">Dica Pro</h3>
            <p className="text-[12px] text-vp-text-2 leading-relaxed">
              Use o RSS do Google News para capturar notícias regionais. Adicione o parâmetro <code className="bg-vp-surface px-1">hl=pt-BR&gl=BR</code> na URL para resultados em português.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
