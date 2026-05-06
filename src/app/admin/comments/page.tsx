import React from 'react';
import { ImgPH } from '@/components/shared/ImgPH';

export default function AdminCommentsPage() {
  return (
    <div className="max-w-[1200px]">
      <h1 className="text-[22px] font-semibold mb-1.5">Comentários</h1>
      <p className="text-vp-text-3 text-[13px] mb-4.5">Fila de moderação · 12 aguardando · 4 sinalizados</p>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-3.5 text-[12px]">
        {['Aguardando (12)','Sinalizados (4)','Aprovados','Ocultos','Banidos'].map((t,i) => (
          <button key={t} className={`vp-btn py-1.5 px-3 ${i===0 ? 'bg-vp-surface-2 border-vp-accent text-vp-text' : 'bg-transparent border-vp-border hover:border-vp-accent text-vp-text-2'}`}>
            {t}
          </button>
        ))}
        <div className="ml-auto flex gap-2 w-full md:w-auto mt-2 md:mt-0">
          <input className="vp-input flex-1 md:w-[220px] py-1.5 px-3 text-[12px]" placeholder="Buscar comentário…" aria-label="Buscar comentário" />
          <select className="vp-input md:w-[180px] py-1.5 px-3 text-[12px]" aria-label="Filtrar por editoria">
            <option>Toda editoria</option><option>Pantanal</option><option>Política</option>
          </select>
        </div>
      </div>

      {/* List */}
      <div className="bg-[#141413] border border-vp-border">
        {[
          { n:'Elza Morais', e:'elza.morais@email.com', c:'Sou de Coxim. O rio realmente mudou, e a cobertura de vocês é a primeira a ouvir ribeirinhos em vez de só fontes oficiais. Obrigada.', a:'O rio que sumiu', t:'há 12min', k:'ok' },
          { n:'Anônimo', e:'temp91@mail.com', c:'vocês são comprados pelo governo petista, só vale o que os patrões dos fazendeiros falam seus pilantras [palavrão removido automaticamente]', a:'O rio que sumiu', t:'há 22min', k:'flag', reasons:['insulto','palavrão'] },
          { n:'João Vicentini', e:'jvicentini@fazendaj.com.br', c:'Faltou ouvir produtor rural da margem. O texto dá um recorte só.', a:'O rio que sumiu', t:'há 38min', k:'ok' },
          { n:'visitante_123', e:'-', c:'http://site-duvidoso.ru/ganhe-r500 clique aqui e ganhe R$ 500 na hora', a:'Assembleia aprova LDO', t:'há 1h', k:'spam', reasons:['link suspeito','padrão de spam'] },
          { n:'Ana Lúcia Paes', e:'analp@ufms.br', c:'Publiquem os dados brutos em CSV, não só no repositório. Muita gente aqui não usa GitHub.', a:'O rio que sumiu', t:'há 1h', k:'ok' },
        ].map((cm,i) => (
          <div key={i} className={`grid sm:grid-cols-[40px_1fr_140px] md:grid-cols-[40px_1fr_220px] gap-3.5 p-4 ${i < 4 ? 'border-b border-vp-border' : ''} items-start ${cm.k==='flag' ? 'bg-vp-urgent/5' : cm.k==='spam' ? 'bg-vp-warn/5' : 'bg-transparent'}`}>
            <div className="w-[36px] h-[36px] rounded-full overflow-hidden shrink-0 mt-1">
              <ImgPH label="" width={36} height={36} />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap gap-2.5 items-center mb-1.5">
                <strong className="text-[13px]">{cm.n}</strong>
                <span className="text-vp-text-3 text-[11px] truncate max-w-[150px]">{cm.e}</span>
                {cm.k==='flag' && <span className="vp-tag bg-vp-urgent text-white border-transparent">Sinalizado</span>}
                {cm.k==='spam' && <span className="vp-tag bg-vp-warn text-[#1a1a19] border-transparent">Provável spam</span>}
                <span className="sm:ml-auto text-[11px] text-vp-text-3 w-full sm:w-auto">{cm.t}</span>
              </div>
              <p className="font-serif text-[14px] text-vp-text-2 leading-[1.5] mb-2">{cm.c}</p>
              <div className="text-[11px] text-vp-text-3">
                em <a className="text-vp-accent cursor-pointer hover:underline">{cm.a}</a>
                {cm.reasons && ` · motivos: ${cm.reasons.join(', ')}`}
              </div>
            </div>
            <div className="flex sm:flex-col gap-1.5 mt-2 sm:mt-0 overflow-x-auto pb-2 sm:pb-0">
              <button className="vp-btn vp-btn-primary text-[11px] py-1.5 shrink-0">Aprovar</button>
              <button className="vp-btn text-[11px] py-1.5 shrink-0">Responder</button>
              <button className="vp-btn text-[11px] py-1.5 shrink-0">Ocultar</button>
              <button className="vp-btn text-[11px] py-1.5 shrink-0 text-vp-urgent border-vp-urgent hover:bg-vp-urgent/10">Banir usuário</button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-3.5 text-[12px] text-vp-text-3">
        <div className="flex items-center gap-1.5">
          <input type="checkbox" className="accent-vp-accent cursor-pointer" aria-label="Selecionar todos" />
          <span>Selecionar todos</span>
          <span className="hidden sm:inline"> · </span>
          <a className="text-vp-accent cursor-pointer hover:underline hidden sm:inline">Aprovar em massa</a>
          <span className="hidden sm:inline"> · </span>
          <a className="text-vp-accent cursor-pointer hover:underline hidden sm:inline">Excluir em massa</a>
        </div>
        <div>Exibindo 1–5 de 12</div>
      </div>
    </div>
  );
}
