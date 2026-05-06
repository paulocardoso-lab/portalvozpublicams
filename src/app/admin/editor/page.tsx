"use client";

import React, { useState } from 'react';
import { ImgPH } from '@/components/shared/ImgPH';

export default function AdminEditorPage() {
  const [content, setContent] = useState(
    `O Taquari amanhece cor de terra. Um pescador que há trinta anos puxa pintado dessas águas abaixa a voz para contar o que já não espera: "o rio acabou, moço". Para chegar até ele, o Voz Pública atravessou 420 quilômetros de leito em três expedições.\n\nDados inéditos obtidos por Lei de Acesso mostram que, desde 2016, o volume de sedimento despejado no baixo curso cresceu 182%.`
  );

  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-5">
      <div className="min-w-0">
        {/* Status bar */}
        <div className="flex flex-wrap gap-2.5 items-center mb-3.5 text-[12px]">
          <span className="vp-tag vp-tag-outline border-vp-border text-vp-text">Rascunho</span>
          <span className="text-vp-text-3">Salvo automaticamente há 12s · v14</span>
          <span className="text-vp-text-3 hidden sm:inline">· editando com Carlos Benites</span>
          <div className="ml-auto flex gap-2">
            <button className="vp-btn text-[12px] py-1.5 hidden sm:block">Histórico</button>
            <button className="vp-btn text-[12px] py-1.5 hidden sm:block">Pré-visualizar</button>
            <button className="vp-btn text-[12px] py-1.5">Enviar para revisão</button>
            <button className="vp-btn vp-btn-primary text-[12px] py-1.5">Publicar</button>
          </div>
        </div>

        {/* Editor canvas */}
        <div className="bg-vp-bg border border-vp-border p-5 lg:p-8">
          <div className="mb-4 text-[11px] text-vp-text-3 tracking-[0.12em] uppercase">Eyebrow</div>
          <input className="vp-input w-full mb-4.5 text-[13px]" defaultValue="Investigação · Pantanal · 8 meses de apuração" aria-label="Eyebrow" />

          <input
            className="vp-input w-full font-display text-[28px] lg:text-[38px] font-bold p-2.5 mb-3.5 leading-[1.1]"
            defaultValue="O rio que sumiu: como o Taquari virou corredor de sedimentos"
            aria-label="Título"
          />
          <textarea
            className="vp-input w-full font-serif italic text-[16px] lg:text-[18px] min-h-[60px] mb-4.5 resize-y"
            defaultValue="Em oito meses de apuração, nossa equipe percorreu 420 km do leito do principal afluente do Pantanal sul — e encontrou uma bacia travada por assoreamento."
            aria-label="Subtítulo"
          />

          {/* Toolbar */}
          <div className="flex flex-wrap gap-1 p-1.5 bg-vp-surface border border-vp-border rounded-[4px] mb-2.5 text-[12px]">
            {['B','I','U','S'].map(b => (
              <button key={b} className={`w-7 h-7 bg-transparent border-none text-vp-text font-bold cursor-pointer ${b==='I'?'italic':''} ${b==='U'?'underline':''} ${b==='S'?'line-through':''}`}>{b}</button>
            ))}
            <div className="w-[1px] bg-vp-border my-1 mx-1" />
            <select className="bg-transparent text-vp-text-2 border-none text-[12px] cursor-pointer" aria-label="Formato">
              <option>Parágrafo</option><option>Título H2</option><option>Título H3</option><option>Citação</option><option>Destaque</option>
            </select>
            <div className="w-[1px] bg-vp-border my-1 mx-1" />
            {['❝ Quote','⌾ Imagem','⊡ Galeria','▭ Vídeo','∿ Embed','≡ Lista','① Dado','↯ Divisor'].map(b => (
              <button key={b} className="vp-btn py-1 px-2 text-[11px] border-none">{b}</button>
            ))}
            <span className="ml-auto text-vp-text-3 text-[11px] self-center hidden xl:inline">2.318 palavras · ~14 min de leitura</span>
          </div>

          {/* Featured image block */}
          <div className="border-2 border-dashed border-vp-border-2 p-2 mb-4.5">
            <ImgPH label="foto destacada · clique para substituir" height={220} />
            <input className="vp-input w-full mt-2 text-[12px] italic" defaultValue="Trecho do Taquari em Coxim, março de 2026. Foto: Bruno Kelly / Voz Pública" aria-label="Legenda da foto" />
          </div>

          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            className="vp-input w-full font-serif text-[16px] lg:text-[17px] leading-[1.6] min-h-[280px] resize-y"
            aria-label="Conteúdo da matéria"
          />

          {/* Inline quote block preview */}
          <blockquote className="border-l-[3px] border-vp-accent pl-5 my-4.5 font-display text-[22px] italic text-vp-text">
            “O Taquari não está doente. Ele está sendo engolido.”
            <div className="text-[11px] not-italic text-vp-text-3 mt-2 uppercase tracking-[0.08em]">Débora Calheiros, Embrapa Pantanal · bloco citação</div>
          </blockquote>
        </div>
      </div>

      {/* Right sidebar — publishing options */}
      <aside className="grid gap-3.5 self-start">
        <div className="bg-[#141413] border border-vp-border p-4">
          <h4 className="text-[12px] mb-3 uppercase tracking-[0.1em] text-vp-text-3">Publicação</h4>
          <div className="grid gap-2.5 text-[12px]">
            <label className="flex flex-col gap-1">Status
              <select className="vp-input w-full"><option>Rascunho</option><option>Em revisão</option><option>Aprovado</option><option>Agendado</option></select>
            </label>
            <label className="flex flex-col gap-1">Data de publicação
              <input className="vp-input w-full" type="datetime-local" defaultValue="2026-04-22T06:00" />
            </label>
            <label className="flex flex-col gap-1">Editoria
              <select className="vp-input w-full">
                <option>Pantanal</option><option>Política</option><option>Cidades</option><option>Indígenas</option>
              </select>
            </label>
            <label className="flex flex-col gap-1">Série
              <select className="vp-input w-full"><option>O rio que sumiu (3/5)</option><option>—</option></select>
            </label>
          </div>
        </div>

        <div className="bg-[#141413] border border-vp-border p-4">
          <h4 className="text-[12px] mb-3 uppercase tracking-[0.1em] text-vp-text-3">Autores</h4>
          {['Marina Ribeiro','Carlos Benites'].map(a => (
            <div key={a} className="flex items-center gap-2 py-1.5">
              <div className="w-[24px] h-[24px] rounded-full overflow-hidden shrink-0"><ImgPH label="" width={24} height={24} /></div>
              <span className="flex-1 text-[12px]">{a}</span>
              <button className="text-[14px] text-vp-text-3 hover:text-vp-text cursor-pointer bg-transparent border-none">×</button>
            </div>
          ))}
          <button className="vp-btn w-full mt-2 text-[11px]">+ Adicionar autor</button>
        </div>

        <div className="bg-[#141413] border border-vp-border p-4">
          <h4 className="text-[12px] mb-3 uppercase tracking-[0.1em] text-vp-text-3">Tags</h4>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {['pantanal','taquari','ibama','semadesc','investigação'].map(t => (
              <span key={t} className="vp-tag vp-tag-outline border-vp-accent text-vp-accent cursor-pointer hover:bg-vp-accent/10">#{t} ×</span>
            ))}
          </div>
          <input className="vp-input w-full text-[12px]" placeholder="Adicionar tag…" aria-label="Adicionar tag" />
        </div>

        <div className="bg-[#141413] border border-vp-border p-4">
          <h4 className="text-[12px] mb-3 uppercase tracking-[0.1em] text-vp-text-3">SEO & redes</h4>
          <div className="grid gap-2.5 text-[12px]">
            <label className="flex flex-col gap-1">Slug
              <input className="vp-input w-full font-mono text-[11px]" defaultValue="/pantanal/o-rio-que-sumiu-taquari" />
            </label>
            <label className="flex flex-col gap-1">Meta description
              <textarea className="vp-input w-full resize-y" rows={3} defaultValue="420 km percorridos, 8 meses de apuração e a radiografia do colapso do Taquari." />
            </label>
            <div className="p-2.5 bg-vp-bg rounded-[4px] border border-vp-border">
              <div className="text-[10px] text-vp-text-3">vozpublicams.com.br</div>
              <div className="text-[#7aa2f7] text-[13px] mt-0.5">O rio que sumiu: como o Taquari virou…</div>
              <div className="text-[10px] text-vp-text-3 mt-0.5 leading-[1.4]">420 km percorridos, 8 meses de apuração e a radiografia do colapso…</div>
            </div>
          </div>
        </div>

        <div className="bg-[#141413] border border-vp-border p-4">
          <h4 className="text-[12px] mb-2.5 uppercase tracking-[0.1em] text-vp-text-3">Opções</h4>
          {[['Comentários abertos', true],['Permitir indexação', true],['Aparecer na home', true],['Paywall/assinantes', false],['Enviar push', true],['Incluir na newsletter', true]].map(([l,v]) => (
            <label key={String(l)} className="flex items-center justify-between py-1.5 text-[12px] cursor-pointer">
              <span>{String(l)}</span>
              <div className={`w-7 h-4 rounded-full relative transition-colors ${v ? 'bg-vp-accent' : 'bg-vp-border-2'}`}>
                <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${v ? 'left-3.5' : 'left-0.5'}`} />
              </div>
            </label>
          ))}
        </div>
      </aside>
    </div>
  );
}
