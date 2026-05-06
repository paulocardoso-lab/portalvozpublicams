import React from 'react';
import { ImgPH } from '@/components/shared/ImgPH';

export default function AdminPostsPage() {
  const posts = [
    { id: 1, title: 'Empresas do agro receberam R$ 2,1 bi do BNDES sem regularização', author: 'Marina Ribeiro', editoria: 'Pantanal', status: 'Publicado', date: '22/04/26 · 06:00', views: '18.4k' },
    { id: 2, title: 'Governador sanciona lei que amplia isenção para frigoríficos', author: 'Carlos Benites', editoria: 'Política', status: 'Publicado', date: '22/04/26 · 04:00', views: '12.1k' },
    { id: 3, title: 'Obra da Duque de Caxias atrasa 14 meses e custa 60% a mais', author: 'Ana Figueira', editoria: 'Cidades', status: 'Revisão', date: 'Agendado: 14:00', views: '-' },
    { id: 4, title: '“Estão abrindo o mato com trator”: Guarani Kaiowá denunciam invasão', author: 'Lucas Fragoso', editoria: 'Indígenas', status: 'Rascunho', date: 'Editado há 2h', views: '-' },
    { id: 5, title: 'O rio que sumiu: como o Taquari virou corredor de sedimentos', author: 'Marina Ribeiro', editoria: 'Pantanal', status: 'Publicado', date: '21/04/26 · 18:30', views: '24.2k' },
    { id: 6, title: 'Assembleia aprova LDO 2027 após 6h de sessão', author: 'Carlos Benites', editoria: 'Política', status: 'Publicado', date: '21/04/26 · 16:15', views: '8.9k' },
  ];

  return (
    <div className="max-w-[1200px]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-[26px] font-semibold mb-1">Matérias</h1>
          <div className="text-vp-text-3 text-[13px]">Gerencie todo o conteúdo publicado e em rascunho.</div>
        </div>
        <button className="vp-btn vp-btn-primary px-4 py-2 text-[13px]">+ Nova matéria</button>
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
            {posts.map(p => (
              <tr key={p.id} className="border-b border-vp-border last:border-none hover:bg-vp-bg/50 transition-colors group">
                <td className="px-5 py-4 min-w-[320px]">
                  <div className="font-display text-[15px] leading-[1.3] text-vp-text group-hover:text-vp-accent transition-colors cursor-pointer">{p.title}</div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full overflow-hidden shrink-0"><ImgPH label="" width={20} height={20} /></div>
                    <span className="text-[13px] text-vp-text-2">{p.author}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className="text-[12px] text-vp-text-3">{p.editoria}</span>
                </td>
                <td className="px-5 py-4">
                  <span className={`px-2 py-0.5 rounded-[10px] text-[10px] font-bold uppercase tracking-[0.05em] ${
                    p.status === 'Publicado' ? 'bg-vp-ok/10 text-vp-ok' : 
                    p.status === 'Revisão' ? 'bg-vp-warn/10 text-vp-warn' : 'bg-vp-text-3/10 text-vp-text-3'
                  }`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className="text-[12px] text-vp-text-3 font-mono">{p.date}</span>
                </td>
                <td className="px-5 py-4 text-right">
                  <span className="text-[13px] text-vp-text-2 font-mono">{p.views}</span>
                </td>
                <td className="px-5 py-4 text-right">
                  <button className="text-vp-text-3 hover:text-vp-text p-1 cursor-pointer bg-transparent border-none">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-between items-center text-[13px] text-vp-text-3">
        <div>Mostrando 6 de 1.412 matérias</div>
        <div className="flex gap-2">
          <button className="vp-btn px-3 py-1.5 opacity-50 cursor-not-allowed">Anterior</button>
          <button className="vp-btn px-3 py-1.5 hover:bg-vp-surface">Próxima</button>
        </div>
      </div>
    </div>
  );
}
