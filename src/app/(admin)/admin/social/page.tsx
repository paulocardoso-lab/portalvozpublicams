import React from 'react';

export default function AdminSocialPage() {
  const channels = [
    { n: 'Instagram', u: '@vozpublicams', f: '48.2k', a: 'conectado', c: 'bg-[#c4a7e7]', tc: 'text-[#1a1a19]' },
    { n: 'Facebook', u: '/vozpublicams', f: '32.1k', a: 'conectado', c: 'bg-[#7aa2f7]', tc: 'text-[#1a1a19]' },
    { n: 'X / Twitter', u: '@vozpublicams', f: '18.4k', a: 'conectado', c: 'bg-vp-text', tc: 'text-vp-bg' },
    { n: 'YouTube', u: 'Voz Pública MS', f: '12.8k', a: 'conectado', c: 'bg-vp-urgent', tc: 'text-white' },
    { n: 'TikTok', u: '@vozpublicams', f: '22.4k', a: 'conectado', c: 'bg-vp-text', tc: 'text-vp-bg' },
    { n: 'WhatsApp Canal', u: 'Voz Pública MS', f: '84.1k', a: 'conectado', c: 'bg-vp-ok', tc: 'text-[#1a1a19]' },
    { n: 'LinkedIn', u: '/company/vp', f: '4.2k', a: 'desconectado', c: 'bg-[#7aa2f7]', tc: 'text-[#1a1a19]' },
    { n: 'Bluesky', u: '@vp.bsky.social', f: '2.1k', a: 'desconectado', c: 'bg-[#7aa2f7]', tc: 'text-[#1a1a19]' },
  ];

  return (
    <div className="max-w-[1200px]">
      <h1 className="text-[22px] font-semibold mb-1">Redes sociais</h1>
      <p className="text-vp-text-3 text-[13px] mb-5">Conecte canais, agende publicações e acompanhe desempenho</p>

      {/* Channels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-5.5">
        {channels.map(c => (
          <div key={c.n} className="bg-[#141413] border border-vp-border p-4 rounded-[4px]">
            <div className="flex items-center gap-2.5 mb-3">
              <div className={`w-7 h-7 flex items-center justify-center text-[11px] font-bold rounded-[4px] ${c.c} ${c.tc}`}>
                {c.n[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold truncate">{c.n}</div>
                <div className="text-[10px] text-vp-text-3 truncate">{c.u}</div>
              </div>
              <span className={`w-[7px] h-[7px] rounded-full shrink-0 ${c.a === 'conectado' ? 'bg-vp-ok' : 'bg-vp-text-4'}`} />
            </div>
            <div className="flex justify-between text-[11px] text-vp-text-3 mb-2.5">
              <span>Seguidores</span><span className="font-mono text-vp-text">{c.f}</span>
            </div>
            <button className="vp-btn w-full text-[11px] justify-center">{c.a === 'conectado' ? 'Gerenciar' : 'Conectar'}</button>
          </div>
        ))}
      </div>

      {/* Auto-post rules + scheduler */}
      <div className="grid md:grid-cols-2 gap-4.5">
        <div className="bg-[#141413] border border-vp-border p-4.5 rounded-[4px]">
          <h3 className="text-[13px] font-semibold mb-3.5">Publicação automática</h3>
          {[
            ['Ao publicar matéria, postar no Instagram (carrossel)', true],
            ['Ao publicar matéria, postar no Facebook', true],
            ['Ao publicar matéria, tweetar no X', true],
            ['Ao publicar matéria, enviar no Canal WhatsApp', true],
            ['Criar reel vertical automático para TikTok', false],
            ['Push notification em matérias de urgência', true],
          ].map(([t, v], i) => (
            <label key={i} className={`flex justify-between items-center py-2.5 text-[13px] ${i < 5 ? 'border-b border-vp-border' : ''} cursor-pointer`}>
              <span className="pr-4 leading-[1.35]">{String(t)}</span>
              <span className={`inline-block w-7 h-4 rounded-full relative transition-colors shrink-0 ${v ? 'bg-vp-accent' : 'bg-vp-border-2'}`}>
                <span className={`absolute top-[2px] w-3 h-3 bg-white rounded-full transition-all ${v ? 'left-[14px]' : 'left-[2px]'}`} />
              </span>
            </label>
          ))}
        </div>

        <div className="bg-[#141413] border border-vp-border p-4.5 rounded-[4px]">
          <h3 className="text-[13px] font-semibold mb-3.5">Fila de publicação</h3>
          {[
            { c: 'Instagram', t: '“O rio que sumiu” — carrossel 8 cards', h: 'hoje, 18:00', st: 'agendado' },
            { c: 'X', t: '“Assembleia aprova LDO 2027 após 6h de sessão”', h: 'hoje, 15:30', st: 'agendado' },
            { c: 'WhatsApp', t: 'Newsletter A Semana em MS', h: 'sáb, 08:00', st: 'agendado' },
            { c: 'TikTok', t: 'Vídeo: o dia em que o fogo chegou…', h: 'ontem, 20:00', st: 'publicado' },
          ].map((p, i) => (
            <div key={i} className={`grid grid-cols-[70px_1fr_auto] gap-2.5 py-3 items-center ${i < 3 ? 'border-b border-vp-border' : ''}`}>
              <span className="vp-tag bg-transparent border-vp-border text-[10px] text-center px-0 flex justify-center w-full">{p.c}</span>
              <div className="min-w-0">
                <div className="text-[13px] text-vp-text-2 truncate">{p.t}</div>
                <div className="text-[11px] text-vp-text-3 mt-0.5">{p.h}</div>
              </div>
              <span className={`text-[11px] font-medium ${p.st === 'publicado' ? 'text-vp-ok' : 'text-vp-accent'}`}>{p.st}</span>
            </div>
          ))}
          <button className="vp-btn w-full mt-3 text-[12px] justify-center">+ Agendar publicação</button>
        </div>
      </div>
    </div>
  );
}
