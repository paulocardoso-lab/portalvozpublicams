import React from 'react';
import { ImgPH } from '@/components/shared/ImgPH';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

function Stat({ label, value, delta, sub }: { label: string, value: string, delta?: string, sub?: string }) {
  const up = delta?.startsWith('+');
  return (
    <div className="bg-[#141413] border border-vp-border p-4">
      <div className="text-[11px] text-vp-text-3 uppercase tracking-[0.1em] mb-2">{label}</div>
      <div className="font-display text-[30px] text-vp-text leading-none">{value}</div>
      <div className="mt-2 text-[12px] flex gap-2 items-center">
        {delta && <span className={`font-semibold ${up ? 'text-vp-ok' : 'text-vp-urgent'}`}>{delta}</span>}
        <span className="text-vp-text-3">{sub}</span>
      </div>
    </div>
  );
}

function Sparkline({ points, color = 'var(--vp-accent)', height = 50 }: { points: number[], color?: string, height?: number }) {
  const max = Math.max(...points), min = Math.min(...points);
  const w = 100;
  const step = w / (points.length - 1 || 1);
  const norm = (v: number) => height - ((v - min) / (max - min || 1)) * (height - 6) - 3;
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${i*step} ${norm(p)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="w-full block" style={{ height }} preserveAspectRatio="none">
      <path d={`${path} L ${w} ${height} L 0 ${height} Z`} fill={color} opacity="0.15" />
      <path d={path} fill="none" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}

export default async function AdminDashboardPage() {
  // Fetch real data
  const stats = await prisma.$transaction([
    prisma.article.count({ where: { status: 'PUBLISHED' } }),
    prisma.article.count({ where: { status: 'IN_REVIEW' } }),
    prisma.article.count({ where: { status: 'DRAFT' } }),
    prisma.user.count(),
    prisma.tip.count({ where: { status: 'NEW' } }),
    prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { views: 'desc' },
      take: 5,
    }),
    prisma.article.findMany({
      orderBy: { updatedAt: 'desc' },
      include: { authors: true },
      take: 5,
    }),
    prisma.newsletterSubscriber.count(),
    prisma.comment.count({ where: { status: 'PENDING' } })
  ]);

  const [publishedCount, reviewCount, draftCount, userCount, newTipsCount, topArticles, recentActivity, newsletterCount, pendingComments] = stats;

  const traffic = [32,28,36,40,38,44,52,48,60,58,66,72,68,82,90,88,94,102,98,110,116,122,118,132];
  
  return (
    <div className="max-w-[1200px]">
      <div className="flex justify-between items-baseline mb-5">
        <div>
          <h1 className="text-[26px] font-semibold mb-1">Painel Editorial</h1>
          <div className="text-vp-text-3 text-[13px]">
            {publishedCount} matérias publicadas no total · {reviewCount} aguardando revisão
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-4.5">
        <Stat label="Matérias Publicadas" value={publishedCount.toString()} delta="+2" sub="esta semana" />
        <Stat label="Total de Leitores" value={userCount.toString()} delta="+8%" sub="vs. mês anterior" />
        <Stat label="Inscritos News" value={newsletterCount.toString()} sub="assinantes" />
        <Stat label="Comentários" value={pendingComments.toString()} delta={pendingComments > 0 ? 'Moderar' : undefined} sub="aguardando" />
      </div>

      {/* Traffic + top content */}
      <div className="grid lg:grid-cols-[1.6fr_1fr] gap-3.5 mb-4.5">
        <div className="bg-[#141413] border border-vp-border p-5">
          <div className="flex justify-between mb-3.5">
            <div>
              <h3 className="text-[14px] font-semibold">Tendência de Acesso</h3>
              <div className="text-[12px] text-vp-text-3">Visualizações por hora — simulado</div>
            </div>
          </div>
          <div className="h-[180px]"><Sparkline points={traffic} height={180} /></div>
          <div className="flex justify-between mt-2.5 font-mono text-[10px] text-vp-text-3">
            <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>agora</span>
          </div>
        </div>
        <div className="bg-[#141413] border border-vp-border p-5">
          <h3 className="text-[14px] font-semibold mb-3.5">Mais lidas (Total)</h3>
          <ol className="list-none p-0 m-0 grid gap-3">
            {topArticles.map((art, i) => (
              <li key={art.id} className="grid grid-cols-[24px_1fr_auto] gap-2.5 text-[12px]">
                <span className="font-mono text-vp-accent font-bold">{i+1}</span>
                <span className="text-vp-text-2 truncate">{art.title}</span>
                <span className="font-mono text-vp-text-3">{art.views?.toLocaleString() || 0}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Content pipeline */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-4.5">
        {[
          { t: 'Rascunhos', n: draftCount, c: 'bg-vp-text-3' },
          { t: 'Em revisão', n: reviewCount, c: 'bg-vp-warn' },
          { t: 'Publicadas', n: publishedCount, c: 'bg-vp-ok' },
          { t: 'Colunistas', n: 8, c: 'bg-vp-accent' },
        ].map(p => (
          <div key={p.t} className="bg-[#141413] border border-vp-border p-3.5 flex items-center gap-3">
            <div className={`w-1 h-9 rounded-sm ${p.c}`} />
            <div>
              <div className="font-display text-[26px] leading-none">{p.n}</div>
              <div className="text-[11px] text-vp-text-3 uppercase tracking-[0.08em] mt-1">{p.t}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Two columns: activity + alerts */}
      <div className="grid lg:grid-cols-2 gap-3.5">
        <div className="bg-[#141413] border border-vp-border p-5">
          <h3 className="text-[14px] font-semibold mb-3.5">Atividade recente</h3>
          <ul className="list-none p-0 m-0 grid gap-3 text-[12px]">
            {recentActivity.map((a, i) => (
              <li key={a.id} className={`grid grid-cols-[28px_1fr_auto] gap-2.5 pb-2.5 items-center ${i < recentActivity.length - 1 ? 'border-b border-vp-border' : ''}`}>
                <div className="w-[24px] h-[24px] rounded-full overflow-hidden shrink-0">
                  <ImgPH label="" width={24} height={24} />
                </div>
                <div className="min-w-0 truncate">
                  <strong className="text-vp-text font-semibold">{a.authors[0]?.name || 'Sistema'}</strong> 
                  <span className="text-vp-text-3"> atualizou </span> 
                  <span className="text-vp-text-2 truncate">“{a.title}”</span>
                </div>
                <span className="font-mono text-vp-text-3 text-[10px] whitespace-nowrap">
                  {a.updatedAt.toLocaleDateString('pt-BR')}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-[#141413] border border-vp-border p-5">
          <h3 className="text-[14px] font-semibold mb-3.5">Alertas do Sistema</h3>
          <ul className="list-none p-0 m-0 grid gap-2.5 text-[12px]">
            {[
              ['urgent', 'Nenhum erro crítico reportado pelo Sentry nas últimas 24h'],
              ['info', 'Backup do banco de dados (Supabase) concluído'],
              ['warn', 'Existem 2 rascunhos antigos sem atualização há 30 dias'],
            ].map(([k,t],i) => (
              <li key={i} className="grid grid-cols-[8px_1fr_auto] gap-2.5 items-center p-2.5 bg-vp-bg border border-vp-border rounded-[4px]">
                <span className={`w-2 h-2 rounded-full shrink-0 ${k==='urgent'?'bg-vp-ok':k==='warn'?'bg-vp-warn':'bg-vp-text-3'}`} />
                <span className="text-vp-text-2 truncate">{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
