import React from 'react';

export default function AdminAuditPage() {
  return (
    <div className="max-w-[1200px]">
      <h1 className="text-[22px] font-semibold mb-1">Logs de auditoria</h1>
      <p className="text-vp-text-3 text-[13px] mb-5">Todas as ações sensíveis do admin nos últimos 90 dias</p>

      <div className="flex flex-wrap gap-2 mb-3.5">
        <input className="vp-input flex-1 md:max-w-[320px] text-[12px] py-1.5" placeholder="Buscar por usuário, ação, alvo…" aria-label="Buscar" />
        <select className="vp-input sm:w-[180px] text-[12px] py-1.5" aria-label="Usuário"><option>Todos usuários</option></select>
        <select className="vp-input sm:w-[180px] text-[12px] py-1.5" aria-label="Ação"><option>Todas ações</option><option>Publicação</option><option>Exclusão</option><option>Permissão alterada</option><option>Login</option></select>
        <select className="vp-input sm:w-[140px] text-[12px] py-1.5" aria-label="Período"><option>Últimos 7 dias</option><option>30 dias</option><option>90 dias</option></select>
        <button className="vp-btn md:ml-auto text-[12px] py-1.5 px-3">Exportar CSV</button>
      </div>

      <div className="bg-[#141413] border border-vp-border rounded-[4px] overflow-x-auto">
        <div className="min-w-[900px]">
          <div className="grid grid-cols-[140px_160px_130px_1fr_120px_90px] px-4 py-2.5 border-b border-vp-border text-[10px] uppercase tracking-[0.1em] text-vp-text-3">
            <span>Data/Hora</span><span>Usuário</span><span>Ação</span><span>Alvo</span><span>IP</span><span>Status</span>
          </div>
          {[
            ['22/04 14:18', 'Marina Ribeiro', 'Publicou', '“O rio que sumiu — cap. 3”', '179.218.14.2', 'ok'],
            ['22/04 13:42', 'Pedro Yoshida', 'Removeu comentário', 'em “LDO 2027”', '177.112.8.14', 'ok'],
            ['22/04 12:18', 'Guilherme Otoni', 'Alterou permissão', 'Ana Figueira → Editor de editoria', '45.180.14.2', 'ok'],
            ['22/04 11:02', 'Carlos Benites', 'Editou', '“Cinco perguntas — Plano de Manejo”', '179.218.14.88', 'ok'],
            ['22/04 09:14', 'Clarice Noveli', 'Pausou campanha', 'JBS — Institucional', '187.84.14.210', 'ok'],
            ['22/04 08:40', 'Sistema', 'Backup automático', 'banco + mídia — 4.2 GB', '—', 'ok'],
            ['22/04 02:14', 'desconhecido', 'Tentativa de login', 'marina@vp', '103.244.8.4 · CN', 'bloqueado'],
            ['21/04 22:18', 'Marina Ribeiro', 'Revogou sessão', 'Chrome Windows · IP antigo', '179.218.14.2', 'ok'],
            ['21/04 19:40', 'Guilherme Otoni', 'Gerou chave API', 'integração n8n', '45.180.14.2', 'ok'],
            ['21/04 18:12', 'Tereza Mattos', 'Agendou coluna', '“O silêncio cúmplice”', '187.118.44.2', 'ok'],
          ].map((l, i) => (
            <div key={i} className={`grid grid-cols-[140px_160px_130px_1fr_120px_90px] px-4 py-2.5 items-center text-[12px] ${i < 9 ? 'border-b border-vp-border' : ''} ${l[5] === 'bloqueado' ? 'bg-[rgba(232,93,74,0.06)]' : 'bg-transparent'}`}>
              <span className="font-mono text-vp-text-3 text-[11px]">{l[0]}</span>
              <span className="font-semibold text-vp-text truncate pr-2">{l[1]}</span>
              <span className="text-vp-accent truncate pr-2">{l[2]}</span>
              <span className="text-vp-text-2 truncate pr-2">{l[3]}</span>
              <span className="font-mono text-vp-text-3 text-[11px] truncate pr-2">{l[4]}</span>
              <span className={`vp-tag bg-transparent text-center flex justify-center text-[10px] px-0 ${l[5] === 'ok' ? 'text-vp-ok border-vp-ok' : 'text-vp-urgent border-vp-urgent'}`}>
                {l[5]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
