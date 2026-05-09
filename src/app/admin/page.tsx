import React from 'react';
import { auth } from '@/auth';
import { DashboardStat } from '@/components/admin/DashboardStat';
import { DashboardSparkline } from '@/components/admin/DashboardSparkline';
import { ImgPH } from '@/components/shared/ImgPH';
import { Eyebrow } from '@/components/shared/Eyebrow';

export default async function AdminDashboardPage() {
  console.log("--> EXECUTING ADMIN PAGE!");
  const session = await auth();
  const userName = session?.user?.name || session?.user?.email?.split('@')[0] || "Administrador";
  
  const trafficData = [32, 28, 45, 38, 52, 48, 65, 58, 72, 68, 85, 80, 95, 90, 110, 105, 125, 120, 140, 135, 150, 145, 160, 155];
  
  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="font-display text-[32px] lg:text-[42px] font-black leading-tight">
            Bom dia, {userName}.
          </h1>
          <p className="font-serif italic text-[16px] text-vp-text-3 mt-2">
            Quarta-feira, 22 de abril · 14 matérias publicadas nas últimas 24h.
          </p>
        </div>
        <div className="flex gap-3">
          <select className="vp-input text-[12px] font-bold uppercase tracking-widest py-2.5 px-4 bg-[#141413]">
            <option>Últimas 24 horas</option>
            <option>Últimos 7 dias</option>
            <option>Últimos 30 dias</option>
          </select>
          <button className="vp-btn text-[12px] font-bold uppercase tracking-widest py-2.5 px-4">
             Exportar Relatório
          </button>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardStat label="Usuários Online Agora" value="2.418" delta="+12%" sub="vs. média 24h" />
        <DashboardStat label="Page Views (Hoje)" value="184.502" delta="+7.2%" sub="141k visitantes únicos" />
        <DashboardStat label="Novos Assinantes" value="184" delta="+14%" sub="meta: 200/dia" />
        <DashboardStat label="Receita Anúncios" value="R$ 38.4k" delta="+4.1%" sub="vs. mês anterior" />
      </div>

      {/* Traffic Chart & Top Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 vp-panel p-8 bg-[#141413] border border-vp-border">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-[15px] font-black uppercase tracking-widest mb-1">Tráfego em Tempo Real</h3>
              <p className="text-[12px] text-vp-text-4 italic font-serif">Visitantes por hora — ciclo de 24h</p>
            </div>
            <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-vp-text-4">
               <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-vp-accent" />
                  <span>Orgânico</span>
               </div>
               <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-vp-text-4" />
                  <span>Direto / Social</span>
               </div>
            </div>
          </div>
          
          <div className="h-[200px] flex flex-col justify-end">
            <DashboardSparkline points={trafficData} height={200} />
          </div>
          
          <div className="flex justify-between mt-6 px-2 font-mono text-[10px] text-vp-text-4 uppercase tracking-widest border-t border-vp-border pt-4">
             <span>00:00</span>
             <span>06:00</span>
             <span>12:00</span>
             <span>18:00</span>
             <span className="text-vp-accent font-black animate-pulse">Agora</span>
          </div>
        </div>

        <div className="vp-panel p-8 bg-[#141413] border border-vp-border">
          <h3 className="text-[15px] font-black uppercase tracking-widest mb-8">Mais Lidas Agora</h3>
          <div className="space-y-6">
            {[
              ['O rio que sumiu: como o Taquari virou corredor de sedimentos', '18.402'],
              ['Assembleia aprova LDO 2027 após 6h de sessão tensa', '12.118'],
              ['Raio-X: o patrimônio dos 24 deputados de MS em detalhes', '9.842'],
              ['Obra da Duque de Caxias atrasa 14 meses e custa 60% a mais', '6.218'],
              ['PCC nas cidades de fronteira de MS: a rota do tráfico', '5.912'],
            ].map(([title, views], i) => (
              <div key={i} className="grid grid-cols-[30px_1fr_auto] gap-4 items-start group cursor-pointer">
                <span className="font-mono text-[18px] text-vp-accent font-black leading-none">{i + 1}</span>
                <p className="text-[13px] leading-snug font-bold text-vp-text-2 group-hover:text-vp-text transition-colors line-clamp-2">
                  {title}
                </p>
                <span className="font-mono text-[11px] text-vp-text-4">{views}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Production Pipeline */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { t: 'Rascunhos', n: 12, c: 'border-vp-text-4' },
          { t: 'Em Revisão', n: 4, c: 'border-yellow-600' },
          { t: 'Aprovadas Hoje', n: 7, c: 'border-vp-ok' },
          { t: 'Agendadas', n: 3, c: 'border-vp-accent' },
        ].map(p => (
          <div key={p.t} className={`vp-panel p-6 bg-[#0e0e0d] border-l-4 ${p.c} flex items-center justify-between`}>
            <div>
              <div className="text-[10px] text-vp-text-4 font-black uppercase tracking-widest mb-1">{p.t}</div>
              <div className="font-display text-[28px] font-black text-vp-text">{p.n}</div>
            </div>
            <button className="text-[11px] font-black uppercase text-vp-accent hover:underline">Ver fila</button>
          </div>
        ))}
      </div>

      {/* Bottom Grid: Activity & Alerts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="vp-panel p-8 bg-[#141413] border border-vp-border">
          <h3 className="text-[15px] font-black uppercase tracking-widest mb-8">Atividade da Redação</h3>
          <div className="space-y-6">
            {[
              ['Carlos Benites', 'publicou', '“Cinco perguntas sobre o Plano de Manejo”', 'há 12min'],
              ['Ana Figueira', 'enviou para revisão', '“Dourados: prefeito enfrenta 3ª cassação”', 'há 38min'],
              ['Tereza Mattos', 'agendou coluna', '“O silêncio cúmplice da bancada”', 'há 1h'],
              ['Lucas Fragoso', 'editou', '“Quem são os donos das terras em MS”', 'há 2h'],
              ['Moderação', 'removeu 3 comentários em', '“O rio que sumiu”', 'há 3h'],
            ].map((a, i) => (
              <div key={i} className="flex items-start gap-4 pb-6 border-b border-vp-border/30 last:border-0 last:pb-0">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-vp-border shrink-0">
                   <ImgPH label="" width={32} height={32} />
                </div>
                <div className="flex-1">
                  <p className="text-[13px] leading-relaxed">
                    <span className="font-black text-vp-text">{a[0]}</span>{' '}
                    <span className="text-vp-text-3 italic font-serif">{a[1]}</span>{' '}
                    <span className="font-bold text-vp-text-2 italic">&quot;{a[2]}&quot;</span>
                  </p>
                  <span className="text-[10px] text-vp-text-4 font-mono uppercase mt-1 block">{a[3]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="vp-panel p-8 bg-[#141413] border border-vp-border">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-[15px] font-black uppercase tracking-widest">Alertas & Tarefas</h3>
            <span className="bg-vp-urgent text-vp-bg text-[10px] font-black px-2 py-0.5 rounded-sm">2 Urgentes</span>
          </div>
          <div className="space-y-3">
            {[
              ['urgent', '4 comentários sinalizados aguardam moderação urgente'],
              ['warn', 'Banner “BYD — Sidebar” expira em menos de 48 horas'],
              ['info', 'Newsletter “A Semana em MS” — fechamento em 3h'],
              ['info', 'Backup automático concluído com sucesso (03:14 AM)'],
              ['warn', 'Carlos Benites: 2 matérias sem imagem destacada ou legenda'],
            ].map(([k, t], i) => (
              <div key={i} className={`flex items-center gap-4 p-4 border rounded-sm transition-all hover:bg-vp-bg ${
                k === 'urgent' ? 'border-vp-urgent/30 bg-vp-urgent/5' : 'border-vp-border bg-vp-surface/30'
              }`}>
                <span className={`w-2 h-2 rounded-full shrink-0 ${
                  k === 'urgent' ? 'bg-vp-urgent shadow-[0_0_8px_rgba(255,0,0,0.5)]' : k === 'warn' ? 'bg-yellow-500' : 'bg-vp-text-4'
                }`} />
                <span className="text-[13px] text-vp-text-2 flex-1 font-bold">{t}</span>
                <button className="text-[10px] font-black uppercase text-vp-accent hover:underline">Resolver</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
