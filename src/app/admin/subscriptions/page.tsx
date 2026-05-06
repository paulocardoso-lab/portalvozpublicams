import React from 'react';

function Stat({ label, value, delta, sub }: { label: string, value: string, delta: string, sub: string }) {
  const isPos = delta.startsWith('+') || delta.startsWith('-') === false; 
  return (
    <div className="bg-[#141413] border border-vp-border p-3.5 rounded-[4px]">
      <div className="text-[12px] font-semibold mb-1.5">{label}</div>
      <div className="font-serif text-[28px] leading-none mb-2.5">{value}</div>
      <div className="flex justify-between items-center text-[11px]">
        <span className={`font-mono ${delta.startsWith('-') && !label.includes('Churn') ? 'text-vp-urgent' : 'text-vp-ok'}`}>{delta}</span>
        <span className="text-vp-text-3">{sub}</span>
      </div>
    </div>
  );
}

export default function AdminSubscriptionsPage() {
  return (
    <div className="max-w-[1200px]">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-4.5">
        <div>
          <h1 className="text-[22px] font-semibold mb-1">Assinaturas & doações</h1>
          <p className="text-vp-text-3 text-[13px]">4.812 apoiadores · R$ 82.418/mês recorrente</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="vp-btn flex-1 sm:flex-none justify-center">Exportar</button>
          <button className="vp-btn vp-btn-primary flex-1 sm:flex-none justify-center whitespace-nowrap">+ Nova campanha</button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4.5">
        <Stat label="Apoiadores ativos" value="4.812" delta="+184" sub="este mês" />
        <Stat label="MRR (recorrente/mês)" value="R$ 82.418" delta="+6%" sub="meta R$ 100k" />
        <Stat label="Ticket médio" value="R$ 17,12" delta="+R$ 0,80" sub="modo PIX" />
        <Stat label="Churn mensal" value="3,2%" delta="-0,4%" sub="retenção boa" />
      </div>

      <div className="grid lg:grid-cols-2 gap-3.5 mb-4.5">
        <div className="bg-[#141413] border border-vp-border p-4.5 rounded-[4px]">
          <h3 className="text-[13px] font-semibold mb-3.5">Meta da campanha “Série Pantanal”</h3>
          <div className="font-serif text-[32px] text-vp-text">
            R$ 68.402 <span className="text-vp-text-3 text-[16px] font-sans">/ R$ 100.000</span>
          </div>
          <div className="h-2.5 bg-vp-border rounded-full mt-3 overflow-hidden">
            <div className="w-[68%] h-full bg-vp-accent" />
          </div>
          <div className="flex justify-between mt-2 text-[11px] text-vp-text-3">
            <span>1.412 apoiadores nessa campanha</span>
            <span>68% · faltam 22 dias</span>
          </div>
        </div>
        <div className="bg-[#141413] border border-vp-border p-4.5 rounded-[4px]">
          <h3 className="text-[13px] font-semibold mb-3.5">Planos</h3>
          {[
            ['Leitor', 'R$ 5/mês', '1.218 ativos', 12],
            ['Apoiador', 'R$ 15/mês', '2.812 ativos', 58],
            ['Guardião', 'R$ 40/mês', '618 ativos', 22],
            ['Mecenas', 'R$ 150/mês', '164 ativos', 18],
          ].map(([n, v, s, rev], i) => (
            <div key={String(n)} className={`grid grid-cols-[1fr_100px_100px_60px] gap-2.5 py-2.5 items-center text-[12px] ${i < 3 ? 'border-b border-vp-border' : ''}`}>
              <span className="font-semibold">{String(n)}</span>
              <span className="font-mono">{String(v)}</span>
              <span className="text-vp-text-3">{String(s)}</span>
              <span className="text-vp-accent font-semibold text-right">{rev}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#141413] border border-vp-border rounded-[4px] overflow-x-auto">
        <div className="min-w-[800px] p-4.5">
          <h3 className="text-[13px] font-semibold mb-3.5">Últimas transações</h3>
          <div className="grid grid-cols-[1fr_1fr_120px_100px_120px_80px] px-2.5 py-1.5 border-b border-vp-border text-[10px] uppercase tracking-[0.08em] text-vp-text-3">
            <span>Apoiador</span><span>E-mail</span><span>Plano</span><span>Valor</span><span>Método</span><span>Status</span>
          </div>
          {[
            ['Carla Menezes', 'carla.m@…', 'Apoiador', 'R$ 15,00', 'PIX', 'ok'],
            ['João de Sousa', 'jsousa@…', 'Guardião', 'R$ 40,00', 'Cartão', 'ok'],
            ['Ana Figueira', 'afig@…', 'Mecenas', 'R$ 150,00', 'Cartão', 'ok'],
            ['Leandro Paim', 'lpaim@…', 'Leitor', 'R$ 5,00', 'PIX', 'ok'],
            ['Regina Costa', 'rcosta@…', 'Apoiador', 'R$ 15,00', 'Cartão', 'falha'],
            ['Mário Ziller', 'mz@…', 'Guardião', 'R$ 40,00', 'Boleto', 'pendente'],
          ].map((t, i) => (
            <div key={i} className={`grid grid-cols-[1fr_1fr_120px_100px_120px_80px] px-2.5 py-2.5 items-center text-[12px] ${i < 5 ? 'border-b border-vp-border' : ''}`}>
              <span>{t[0]}</span>
              <span className="text-vp-text-3">{t[1]}</span>
              <span className="text-vp-accent">{t[2]}</span>
              <span className="font-mono">{t[3]}</span>
              <span className="text-vp-text-3">{t[4]}</span>
              <span className={`vp-tag bg-transparent flex justify-center text-[10px] px-0 ${t[5] === 'ok' ? 'text-vp-ok border-vp-ok' : t[5] === 'falha' ? 'text-vp-urgent border-vp-urgent' : 'text-[#e0b44a] border-[#e0b44a]'}`}>
                {t[5]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
