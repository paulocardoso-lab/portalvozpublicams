import React from 'react';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function AdminDenunciasPage() {
  const tips = await prisma.tip.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="max-w-[1000px]">
      <div className="mb-8">
        <h1 className="text-[26px] font-semibold mb-1">Denúncias & Vazamentos</h1>
        <p className="text-vp-text-3 text-[13px]">
          Gerencie os relatos enviados pelos cidadãos através do canal seguro.
        </p>
      </div>

      <div className="bg-[#141413] border border-vp-border rounded-[4px] overflow-hidden">
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-vp-border bg-vp-surface">
              <th className="px-5 py-3 font-semibold text-vp-text-3 uppercase tracking-wider text-[10px]">Data</th>
              <th className="px-5 py-3 font-semibold text-vp-text-3 uppercase tracking-wider text-[10px]">Fonte</th>
              <th className="px-5 py-3 font-semibold text-vp-text-3 uppercase tracking-wider text-[10px]">Conteúdo</th>
              <th className="px-5 py-3 font-semibold text-vp-text-3 uppercase tracking-wider text-[10px]">Status</th>
              <th className="px-5 py-3 font-semibold text-vp-text-3 uppercase tracking-wider text-[10px]">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-vp-border">
            {tips.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-vp-text-3 italic">
                  Nenhuma denúncia recebida até o momento.
                </td>
              </tr>
            )}
            {tips.map((tip) => (
              <tr key={tip.id} className="hover:bg-vp-surface/50 transition-colors">
                <td className="px-5 py-4 whitespace-nowrap text-vp-text-2 font-mono">
                  {tip.createdAt.toLocaleDateString('pt-BR')}
                </td>
                <td className="px-5 py-4">
                  <div className="font-semibold text-vp-text">{tip.name || 'Anônimo'}</div>
                  <div className="text-[11px] text-vp-text-3">{tip.email || 'Nenhum e-mail'}</div>
                </td>
                <td className="px-5 py-4 max-w-[400px]">
                  <p className="truncate text-vp-text-2">
                    {tip.content}
                  </p>
                </td>
                <td className="px-5 py-4 whitespace-nowrap">
                  <span className={`px-2 py-0.5 rounded-[10px] text-[10px] font-bold uppercase tracking-wider ${
                    tip.status === 'NEW' ? 'bg-vp-accent/20 text-vp-accent border border-vp-accent/30' :
                    tip.status === 'INVESTIGATING' ? 'bg-vp-warn/20 text-vp-warn border border-vp-warn/30' :
                    'bg-vp-text-3/20 text-vp-text-3'
                  }`}>
                    {tip.status}
                  </span>
                </td>
                <td className="px-5 py-4 whitespace-nowrap">
                  <button className="text-vp-accent hover:underline font-semibold">
                    Abrir Detalhes
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
