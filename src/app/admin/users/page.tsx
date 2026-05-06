import React from 'react';
import { ImgPH } from '@/components/shared/ImgPH';

export default function AdminUsersPage() {
  const roles = [
    { r: 'Super Admin', c: 'bg-role-admin', tc: 'text-role-admin', p: 'Acesso total, gerencia usuários, cobrança e infraestrutura' },
    { r: 'Editor-chefe', c: 'bg-role-editor', tc: 'text-role-editor', p: 'Aprova, publica e despublica qualquer conteúdo' },
    { r: 'Editor de editoria', c: 'bg-role-section', tc: 'text-role-section', p: 'Publica na editoria atribuída; revisa matérias de repórteres' },
    { r: 'Repórter', c: 'bg-role-reporter', tc: 'text-role-reporter', p: 'Cria e edita próprias matérias; envia para revisão' },
    { r: 'Colunista', c: 'bg-role-columnist', tc: 'text-role-columnist', p: 'Publica na própria coluna sem revisão' },
    { r: 'Moderador', c: 'bg-role-mod', tc: 'text-role-mod', p: 'Apenas fila de comentários' },
    { r: 'Financeiro', c: 'bg-role-finance', tc: 'text-role-finance', p: 'Apenas banners, assinaturas e métricas' },
  ];
  
  const textColors: Record<string, string> = {
    'Super Admin': 'text-role-admin',
    'Editor-chefe': 'text-role-editor',
    'Editor de editoria': 'text-role-section',
    'Repórter': 'text-role-reporter',
    'Colunista': 'text-role-columnist',
    'Moderador': 'text-role-mod',
    'Financeiro': 'text-role-finance',
  };

  const users = [
    { n: 'Marina Ribeiro', e: 'marina', r: 'Editor-chefe', s: 'online', t: 'há 2min', a: 482 },
    { n: 'Carlos Benites', e: 'carlos', r: 'Repórter', s: 'online', t: 'há 6min', a: 124 },
    { n: 'Tereza Mattos', e: 'tereza', r: 'Colunista', s: 'idle', t: 'há 40min', a: 218 },
    { n: 'Ademir Paredão', e: 'ademir', r: 'Colunista', s: 'offline', t: 'ontem', a: 96 },
    { n: 'Lucas Fragoso', e: 'lucas', r: 'Repórter', s: 'online', t: 'há 14min', a: 64 },
    { n: 'Ana Figueira', e: 'ana', r: 'Editor de editoria', s: 'online', t: 'há 1min', a: 142 },
    { n: 'Rita Duarte', e: 'rita', r: 'Repórter', s: 'offline', t: '2 dias', a: 38 },
    { n: 'Pedro Yoshida', e: 'pedro', r: 'Moderador', s: 'online', t: 'há 3min', a: 0 },
    { n: 'Clarice Noveli', e: 'clarice', r: 'Financeiro', s: 'offline', t: '3 dias', a: 0 },
    { n: 'Guilherme Otoni', e: 'gui', r: 'Super Admin', s: 'idle', t: 'há 1h', a: 0 },
  ];

  return (
    <div className="max-w-[1200px]">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-4.5">
        <div>
          <h1 className="text-[22px] font-semibold mb-1">Usuários & permissões</h1>
          <p className="text-vp-text-3 text-[13px]">10 usuários ativos · 7 níveis de acesso</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="vp-btn flex-1 sm:flex-none justify-center">Exportar</button>
          <button className="vp-btn vp-btn-primary flex-1 sm:flex-none justify-center whitespace-nowrap">+ Convidar usuário</button>
        </div>
      </div>

      {/* Role legend / matrix */}
      <div className="bg-[#141413] border border-vp-border p-4.5 mb-4.5">
        <h3 className="text-[13px] font-semibold mb-3.5">Níveis de acesso</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-[1px] bg-vp-border border border-vp-border">
          {roles.map(r => (
            <div key={r.r} className="bg-vp-surface p-3 flex flex-col">
              <div className={`w-2 h-2 rounded-full mb-2 ${r.c}`} />
              <div className="text-[12px] font-semibold mb-1 leading-tight">{r.r}</div>
              <div className="text-[11px] text-vp-text-3 leading-[1.4] mt-auto">{r.p}</div>
            </div>
          ))}
        </div>
      </div>

      {/* User table */}
      <div className="bg-[#141413] border border-vp-border overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-[1.6fr_1fr_0.9fr_0.8fr_0.6fr] px-4 py-2.5 border-b border-vp-border text-[11px] uppercase tracking-[0.1em] text-vp-text-3">
            <span>Usuário</span><span>Papel</span><span>Status</span><span>Matérias</span><span className="text-right">Ações</span>
          </div>
          {users.map((u, i) => (
            <div key={i} className={`grid grid-cols-[1.6fr_1fr_0.9fr_0.8fr_0.6fr] px-4 py-3 items-center text-[13px] ${i < users.length - 1 ? 'border-b border-vp-border' : ''}`}>
              <div className="flex gap-2.5 items-center pr-2">
                <div className="w-[32px] h-[32px] rounded-full overflow-hidden shrink-0">
                  <ImgPH label="" width={32} height={32} />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold truncate">{u.n}</div>
                  <div className="text-[11px] text-vp-text-3 truncate">{u.e}@vozpublicams.com.br</div>
                </div>
              </div>
              <span className={`font-semibold text-[12px] ${textColors[u.r] || 'text-vp-text'}`}>{u.r}</span>
              <div className="flex items-center gap-2 text-[12px] text-vp-text-2">
                <span className={`w-[7px] h-[7px] rounded-full ${u.s === 'online' ? 'bg-vp-ok' : u.s === 'idle' ? 'bg-vp-warn' : 'bg-vp-text-4'}`} />
                {u.s} <span className="text-vp-text-3 hidden sm:inline">· {u.t}</span>
              </div>
              <span className="font-mono text-vp-text-2 text-[12px]">{u.a}</span>
              <div className="text-right text-[12px]">
                <a className="text-vp-text-3 mr-2.5 cursor-pointer hover:text-vp-text hover:underline">Editar</a>
                <a className="text-vp-urgent cursor-pointer hover:underline">Suspender</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
