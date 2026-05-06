import React from 'react';
import { ImgPH } from '@/components/shared/ImgPH';

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

export default function AdminDashboardPage() {
  const traffic = [32,28,36,40,38,44,52,48,60,58,66,72,68,82,90,88,94,102,98,110,116,122,118,132];
  
  return (
    <div className="max-w-[1200px]">
      <div className="flex justify-between items-baseline mb-5">
        <div>
          <h1 className="text-[26px] font-semibold mb-1">Bom dia, Marina</h1>
          <div className="text-vp-text-3 text-[13px]">Quarta, 22 de abril · 14 matérias publicadas nas últimas 24h</div>
        </div>
        <div className="flex gap-2">
          <select className="vp-input w-[140px] py-1.5 px-3 text-[13px]">
            <option>Últimas 24h</option>
            <option>7 dias</option>
            <option>30 dias</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-4.5">
        <Stat label="Usuários online" value="2.418" delta="+12%" sub="vs. ontem" />
        <Stat label="Page views (24h)" value="184.502" delta="+7%" sub="141k únicos" />
        <Stat label="Assinantes news" value="43.118" delta="+184" sub="hoje" />
        <Stat label="Receita (mês)" value="R$ 38.420" delta="+4%" sub="vs. março" />
      </div>

      {/* Traffic + top content */}
      <div className="grid lg:grid-cols-[1.6fr_1fr] gap-3.5 mb-4.5">
        <div className="bg-[#141413] border border-vp-border p-5">
          <div className="flex justify-between mb-3.5">
            <div>
              <h3 className="text-[14px] font-semibold">Tráfego em tempo real</h3>
              <div className="text-[12px] text-vp-text-3">Visitantes por hora — últimas 24h</div>
            </div>
            <div className="text-[12px] text-vp-text-3 flex items-center">
              <span className="inline-block w-2 h-2 bg-vp-accent rounded-full mr-1.5" />orgânico
              <span className="inline-block w-2 h-2 bg-vp-text-3 rounded-full ml-3 mr-1.5" />direto
            </div>
          </div>
          <div className="h-[180px]"><Sparkline points={traffic} height={180} /></div>
          <div className="flex justify-between mt-2.5 font-mono text-[10px] text-vp-text-3">
            <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>agora</span>
          </div>
        </div>
        <div className="bg-[#141413] border border-vp-border p-5">
          <h3 className="text-[14px] font-semibold mb-3.5">Mais lidas agora</h3>
          <ol className="list-none p-0 m-0 grid gap-3">
            {[
              ['O rio que sumiu: como o Taquari virou corredor', '18.402'],
              ['Assembleia aprova LDO 2027 após 6h de sessão', '12.118'],
              ['Raio-X: patrimônio dos 24 deputados de MS', '9.842'],
              ['Obra da Duque de Caxias atrasa 14 meses', '6.218'],
              ['PCC nas cidades de fronteira de MS', '5.912'],
            ].map(([t,v],i) => (
              <li key={i} className="grid grid-cols-[24px_1fr_auto] gap-2.5 text-[12px]">
                <span className="font-mono text-vp-accent font-bold">{i+1}</span>
                <span className="text-vp-text-2 truncate">{t}</span>
                <span className="font-mono text-vp-text-3">{v}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Content pipeline */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-4.5">
        {[
          { t: 'Rascunhos', n: 12, c: 'bg-vp-text-3' },
          { t: 'Em revisão', n: 4, c: 'bg-vp-warn' },
          { t: 'Aprovadas hoje', n: 7, c: 'bg-vp-ok' },
          { t: 'Agendadas', n: 3, c: 'bg-vp-accent' },
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
            {[
              ['Carlos Benites', 'publicou', '“Cinco perguntas sobre o Plano de Manejo”', 'há 12min'],
              ['Ana Figueira', 'enviou para revisão', '“Dourados: prefeito enfrenta 3ª cassação”', 'há 38min'],
              ['Tereza Mattos', 'agendou coluna', '“O silêncio cúmplice da bancada”', 'há 1h'],
              ['Lucas Fragoso', 'editou', '“Quem são os donos das terras”', 'há 2h'],
              ['Moderação', 'removeu 3 comentários em', '“O rio que sumiu”', 'há 3h'],
            ].map((a,i) => (
              <li key={i} className={`grid grid-cols-[28px_1fr_auto] gap-2.5 pb-2.5 items-center ${i < 4 ? 'border-b border-vp-border' : ''}`}>
                <div className="w-[24px] h-[24px] rounded-full overflow-hidden shrink-0">
                  <ImgPH label="" width={24} height={24} />
                </div>
                <div className="min-w-0 truncate">
                  <strong className="text-vp-text font-semibold">{a[0]}</strong> <span className="text-vp-text-3">{a[1]}</span> <span className="text-vp-text-2 truncate">{a[2]}</span>
                </div>
                <span className="font-mono text-vp-text-3 text-[10px] whitespace-nowrap">{a[3]}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-[#141413] border border-vp-border p-5">
          <h3 className="text-[14px] font-semibold mb-3.5">Alertas & tarefas</h3>
          <ul className="list-none p-0 m-0 grid gap-2.5 text-[12px]">
            {[
              ['urgent', '4 comentários sinalizados aguardam moderação'],
              ['warn', 'Banner “BYD — Sidebar” expira em 2 dias'],
              ['info', 'Newsletter “Semana em MS” — envio em 3h'],
              ['info', 'Backup automático concluído (03:14)'],
              ['warn', 'Carlos Benites: 2 matérias sem imagem destacada'],
            ].map(([k,t],i) => (
              <li key={i} className="grid grid-cols-[8px_1fr_auto] gap-2.5 items-center p-2.5 bg-vp-bg border border-vp-border rounded-[4px]">
                <span className={`w-2 h-2 rounded-full shrink-0 ${k==='urgent'?'bg-vp-urgent':k==='warn'?'bg-vp-warn':'bg-vp-text-3'}`} />
                <span className="text-vp-text-2 truncate">{t}</span>
                <a className="text-vp-accent font-semibold cursor-pointer hover:underline">Ver</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
