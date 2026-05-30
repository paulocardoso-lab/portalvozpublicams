import React from 'react';
import { ImgPH } from '@/components/shared/ImgPH';
import { SafeImage } from '@/components/shared/SafeImage';

import prisma from '@/lib/prisma';
import Link from 'next/link';

export default async function AdminPostsPage() {
  const articles = await prisma.article.findMany({
    include: {
      authors: { select: { id: true, name: true, avatar: true } },
      section: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  const statusMap: Record<string, string> = {
    PUBLISHED: 'Publicado',
    DRAFT: 'Rascunho',
    IN_REVIEW: 'Revisão',
    APPROVED: 'Aprovado',
    SCHEDULED: 'Agendado',
    ARCHIVED: 'Arquivado',
  };


  return (
    <div className="max-w-[1200px]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-[26px] font-semibold mb-1">Matérias</h1>
          <div className="text-vp-text-3 text-[13px]">Gerencie todo o conteúdo publicado e em rascunho.</div>
        </div>
        <Link href="/admin/posts/new">
          <button className="vp-btn vp-btn-primary px-4 py-2 text-[13px]">+ Nova matéria</button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 overflow-x-auto pb-2 vp-scroll">
        <div className="flex gap-1.5 p-1 bg-[#141413] border border-vp-border rounded-[4px]">
          {['Todas','Publicadas','Rascunhos','Revisão','Agendadas'].map((t,i) => (
            <button key={t} className={`px-3 py-1.5 text-[12px] font-medium rounded-[2px] border-none cursor-pointer transition-colors ${i===0 ? 'bg-vp-surface text-vp-text' : 'bg-transparent text-vp-text-3 hover:text-vp-text'}`}>
              {t}
            </button>
          ))}
        </div>
        <select className="vp-input py-1.5 px-3 text-[12px] w-[140px] bg-[#141413]"><option>Todas editorias</option></select>
        <select className="vp-input py-1.5 px-3 text-[12px] w-[140px] bg-[#141413]"><option>Todos autores</option></select>
        <input className="vp-input py-1.5 px-4 text-[12px] flex-1 min-w-[200px] bg-[#141413]" placeholder="Filtrar por título…" />
      </div>

      {/* Posts Table */}
      <div className="bg-[#141413] border border-vp-border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-vp-border text-[11px] text-vp-text-3 uppercase tracking-[0.1em]">
              <th className="px-5 py-4 font-semibold">Matéria</th>
              <th className="px-5 py-4 font-semibold">Autor</th>
              <th className="px-5 py-4 font-semibold">Editoria</th>
              <th className="px-5 py-4 font-semibold">Status</th>
              <th className="px-5 py-4 font-semibold">Data</th>
              <th className="px-5 py-4 font-semibold text-right">Views</th>
              <th className="px-5 py-4 font-semibold"></th>
            </tr>
          </thead>
          <tbody>
            {articles.map(p => (
              <tr key={p.id} className="border-b border-vp-border last:border-none hover:bg-vp-bg/50 transition-colors group">
                <td className="px-5 py-4 min-w-[320px]">
                  <Link href={`/admin/posts/edit/${p.id}`} className="no-underline">
                    <div className="font-display text-[15px] leading-[1.3] text-vp-text group-hover:text-vp-accent transition-colors cursor-pointer">{p.title}</div>
                  </Link>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <div className="relative w-5 h-5 rounded-full overflow-hidden shrink-0">
                      {p.authors[0]?.avatar ? (
                        <SafeImage src={p.authors[0].avatar} alt="" fill sizes="20px" className="object-cover" />
                      ) : (
                        <ImgPH label="" width={20} height={20} />
                      )}
                    </div>
                    <span className="text-[13px] text-vp-text-2">{p.authors.map(a => a.name).join(', ')}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className="text-[12px] text-vp-text-3">{p.section.name}</span>
                </td>
                <td className="px-5 py-4">
                  <span className={`px-2 py-0.5 rounded-[10px] text-[10px] font-bold uppercase tracking-[0.05em] ${
                    p.status === 'PUBLISHED' ? 'bg-vp-ok/10 text-vp-ok' : 
                    p.status === 'IN_REVIEW' ? 'bg-vp-warn/10 text-vp-warn' : 'bg-vp-text-3/10 text-vp-text-3'
                  }`}>
                    {statusMap[p.status]}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className="text-[12px] text-vp-text-3 font-mono">
                    {p.publishedAt ? new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' }).format(new Date(p.publishedAt)) : '---'}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <span className="text-[13px] text-vp-text-2 font-mono">{p.views > 1000 ? `${(p.views/1000).toFixed(1)}k` : p.views}</span>
                </td>
                <td className="px-5 py-4 text-right">
                  <Link href={`/admin/posts/edit/${p.id}`} className="text-vp-text-3 hover:text-vp-text p-1">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-between items-center text-[13px] text-vp-text-3">
        <div>Mostrando {articles.length} matérias</div>
        <div className="flex gap-2">
          <button className="vp-btn px-3 py-1.5 opacity-50 cursor-not-allowed">Anterior</button>
          <button className="vp-btn px-3 py-1.5 hover:bg-vp-surface">Próxima</button>
        </div>
      </div>
    </div>
  );
}
