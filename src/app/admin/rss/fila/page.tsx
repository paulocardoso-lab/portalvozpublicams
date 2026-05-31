import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-guard';
import Link from 'next/link';
import { ReviewQueueClient } from './ReviewQueueClient';

export default async function RSSReviewQueuePage() {
  await requireAdmin();

  const RSS_SYSTEM_USER_ID = 'rss-system-user-0000000000000001';

  // Artigos IN_REVIEW criados pelo importador RSS
  const articles = await prisma.article.findMany({
    where: {
      status: 'IN_REVIEW',
      authors: { some: { id: RSS_SYSTEM_USER_ID } },
    },
    orderBy: { createdAt: 'desc' },
    include: {
      section: { select: { name: true } },
    },
    take: 200,
  });

  // IDs de artigos em dead-letter (falha ao processar pela engine)
  const deadLetterUrls = new Set(
    (await prisma.rSSDeadLetter.findMany({
      where: { resolvedAt: null, attempts: { gte: 3 } },
      select: { url: true },
    })).map((d) => d.url)
  );

  const rows = articles.map((a) => ({
    id: a.id,
    title: a.title,
    lead: a.lead,
    sourceUrl: a.sourceUrl,
    heroImage: a.heroImage,
    createdAt: a.createdAt,
    section: a.section,
    deadLetter: a.sourceUrl ? deadLetterUrls.has(a.sourceUrl) : false,
  }));

  return (
    <div className="max-w-[1100px] mx-auto">
      <div className="flex items-center gap-2 text-[11px] text-vp-text-4 mb-5">
        <Link href="/admin/rss" className="hover:text-vp-text transition-colors">Automação RSS</Link>
        <span>/</span>
        <span className="text-vp-text">Fila de Revisão</span>
      </div>

      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-[24px] font-display font-bold">Fila de Revisão</h1>
          <p className="text-vp-text-3 text-[13px]">
            Artigos importados pelo RSS aguardando aprovação editorial.
          </p>
        </div>
        <div className="flex gap-3 items-center">
          <div className="text-center">
            <div className="text-[28px] font-black text-yellow-400 leading-none">{articles.length}</div>
            <div className="text-[9px] text-vp-text-4 uppercase tracking-widest">Aguardando</div>
          </div>
          <div className="text-center">
            <div className="text-[28px] font-black text-vp-urgent leading-none">{deadLetterUrls.size}</div>
            <div className="text-[9px] text-vp-text-4 uppercase tracking-widest">Com Problema</div>
          </div>
        </div>
      </div>

      <ReviewQueueClient articles={rows} />
    </div>
  );
}
