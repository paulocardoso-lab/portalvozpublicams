import React from "react";
import { getSiteSettings, saveSiteSettings } from "./actions";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminSettingsPage({ searchParams }: { searchParams: SearchParams }) {
  const query = await searchParams;
  const saved = firstParam(query.saved) === "1";
  const s = await getSiteSettings();
  const hasCronSecret = Boolean(process.env.CRON_SECRET);
  const hasOpenAIKey = Boolean(process.env.OPENAI_API_KEY);
  const hasSupabaseStorage = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY));
  const hasResend = Boolean(process.env.RESEND_API_KEY);

  return (
    <div className="max-w-[860px]">
      <h1 className="text-[22px] font-semibold mb-1">Configurações gerais</h1>
      <p className="text-vp-text-3 text-[13px] mb-6">Identidade do veículo, SEO e redes sociais. Alterações são aplicadas ao site imediatamente.</p>
      {saved ? (
        <div className="mb-5 border border-vp-ok/30 bg-vp-ok/10 px-4 py-3 text-[12px] font-semibold text-vp-ok">
          Configurações salvas com sucesso.
        </div>
      ) : null}

      <form action={saveSiteSettings} className="grid gap-4">
        <input type="hidden" name="_redirectTo" value="/admin/settings" />
        {/* Identity */}
        <section className="bg-[#141413] border border-vp-border p-5 rounded">
          <h3 className="text-[13px] font-semibold mb-4 uppercase tracking-wider text-vp-text-3">Identidade do Veículo</h3>
          <div className="grid gap-3">
            <label className="grid gap-1">
              <span className="text-[11px] text-vp-text-3 uppercase font-semibold">Nome do site</span>
              <input name="SITE_NAME" className="vp-input text-[13px]" defaultValue={s["SITE_NAME"] ?? "Voz Pública MS"} required />
            </label>
            <label className="grid gap-1">
              <span className="text-[11px] text-vp-text-3 uppercase font-semibold">Descrição / Meta description</span>
              <textarea name="SITE_DESCRIPTION" className="vp-input text-[13px] h-20 resize-none" defaultValue={s["SITE_DESCRIPTION"] ?? "Jornalismo independente para Mato Grosso do Sul"} />
            </label>
            <div className="grid sm:grid-cols-2 gap-3">
              <label className="grid gap-1">
                <span className="text-[11px] text-vp-text-3 uppercase font-semibold">E-mail da redação</span>
                <input name="EMAIL_REDACAO" className="vp-input text-[13px]" defaultValue={s["EMAIL_REDACAO"] ?? ""} type="email" />
              </label>
              <label className="grid gap-1">
                <span className="text-[11px] text-vp-text-3 uppercase font-semibold">E-mail de contato</span>
                <input name="EMAIL_CONTATO" className="vp-input text-[13px]" defaultValue={s["EMAIL_CONTATO"] ?? ""} type="email" />
              </label>
            </div>
          </div>
        </section>

        {/* Indicators */}
        <section className="bg-[#141413] border border-vp-border p-5 rounded">
          <div className="flex items-center justify-between mb-4">
             <h3 className="text-[13px] font-semibold uppercase tracking-wider text-vp-text-3">Indicadores de Mercado</h3>
             <span className="text-[10px] bg-vp-accent/10 text-vp-accent px-2 py-0.5 rounded border border-vp-accent/20 font-bold uppercase tracking-widest">Atualização Manual</span>
          </div>
          <p className="text-vp-text-4 text-[12px] mb-4 italic">Valores exibidos no topo do site para cotação rápida.</p>
          <div className="grid sm:grid-cols-4 gap-3">
             <label className="grid gap-1">
               <span className="text-[11px] text-vp-text-3 uppercase font-semibold">Arroba do Boi (R$)</span>
               <input name="boi" className="vp-input text-[13px] font-mono" defaultValue={s["boi"] ?? ""} placeholder="Sem valor manual" />
             </label>
             <label className="grid gap-1">
               <span className="text-[11px] text-vp-text-3 uppercase font-semibold">Saca da Soja (R$)</span>
               <input name="soja" className="vp-input text-[13px] font-mono" defaultValue={s["soja"] ?? ""} placeholder="Sem valor manual" />
             </label>
             <label className="grid gap-1">
               <span className="text-[11px] text-vp-text-3 uppercase font-semibold">Saca do Milho (R$)</span>
               <input name="milho" className="vp-input text-[13px] font-mono" defaultValue={s["milho"] ?? ""} placeholder="Sem valor manual" />
             </label>
             <label className="grid gap-1">
               <span className="text-[11px] text-vp-text-3 uppercase font-semibold">Dólar (USD/BRL)</span>
               <input name="usd" className="vp-input text-[13px] font-mono" defaultValue={s["usd"] ?? ""} placeholder="Deixe vazio p/ auto" />
             </label>
          </div>
        </section>

        {/* Social */}
        <section className="bg-[#141413] border border-vp-border p-5 rounded">
          <h3 className="text-[13px] font-semibold mb-4 uppercase tracking-wider text-vp-text-3">Redes Sociais</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              ["SOCIAL_INSTAGRAM", "Instagram (URL)", "https://instagram.com/vozpublicams"],
              ["SOCIAL_TWITTER", "Twitter/X (URL)", "https://twitter.com/vozpublicams"],
              ["SOCIAL_FACEBOOK", "Facebook (URL)", "https://facebook.com/vozpublicams"],
              ["SOCIAL_YOUTUBE", "YouTube (URL)", "https://youtube.com/@vozpublicams"],
              ["SOCIAL_WHATSAPP", "WhatsApp (telefone ou wa.me)", "+5567999999999 ou https://wa.me/5567999999999"],
              ["SOCIAL_WHATSAPP_MESSAGE", "Mensagem inicial do WhatsApp", "Olá, vim pelo site Voz Pública MS."],
              ["SOCIAL_TELEGRAM", "Telegram (URL)", "https://t.me/vozpublicams"],
            ].map(([key, label, placeholder]) => (
              <label key={key} className="grid gap-1">
                <span className="text-[11px] text-vp-text-3 uppercase font-semibold">{label}</span>
                <input name={key} className="vp-input text-[13px] font-mono" defaultValue={s[key] ?? ""} placeholder={placeholder} />
              </label>
            ))}
          </div>
        </section>

        {/* Automations */}
        <section className="bg-[#141413] border border-vp-border p-5 rounded">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h3 className="text-[13px] font-semibold uppercase tracking-wider text-vp-text-3">Automações</h3>
              <p className="mt-1 text-[12px] text-vp-text-4 italic">Controles operacionais usados pelos crons e integrações internas.</p>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded border font-bold uppercase tracking-widest ${s["ENABLE_RSS"] === "true" ? "border-vp-ok/30 bg-vp-ok/10 text-vp-ok" : "border-vp-warn/30 bg-vp-warn/10 text-vp-warn"}`}>
              RSS {s["ENABLE_RSS"] === "true" ? "ativo" : "pausado"}
            </span>
          </div>

          <div className="grid gap-4">
            <label className="flex items-start justify-between gap-4 border border-vp-border bg-vp-surface/40 p-3">
              <span>
                <span className="block text-[12px] font-semibold">Automação RSS</span>
                <span className="mt-1 block text-[11px] text-vp-text-3">Permite que o endpoint de cron capture fontes RSS ativas.</span>
              </span>
              <input type="hidden" name="ENABLE_RSS" value="false" />
              <input
                name="ENABLE_RSS"
                type="checkbox"
                value="true"
                defaultChecked={s["ENABLE_RSS"] === "true"}
                className="mt-1 accent-vp-accent"
                title="Ativar automação RSS"
              />
            </label>

            <label className="flex items-start justify-between gap-4 border border-vp-border bg-vp-surface/40 p-3">
              <span>
                <span className="block text-[12px] font-semibold">IA — Reescrita de título, lead e tags (RSS)</span>
                <span className="mt-1 block text-[11px] text-vp-text-3">Usa OpenAI para reescrever título, lead e gerar tags das matérias importadas. Se desativado, usa o texto original da fonte.</span>
              </span>
              <input type="hidden" name="RSS_AI_REWRITE" value="false" />
              <input
                name="RSS_AI_REWRITE"
                type="checkbox"
                value="true"
                defaultChecked={s["RSS_AI_REWRITE"] !== "false"}
                className="mt-1 accent-vp-accent"
                title="Ativar reescrita IA de título/lead/tags"
              />
            </label>

            <label className="flex items-start justify-between gap-4 border border-vp-border bg-vp-surface/40 p-3">
              <span>
                <span className="block text-[12px] font-semibold">IA — Humanização do corpo da matéria (RSS)</span>
                <span className="mt-1 block text-[11px] text-vp-text-3">Usa OpenAI para reescrever os parágrafos em tom jornalístico humano. Se desativado, o corpo da matéria entra com o texto bruto da fonte.</span>
              </span>
              <input type="hidden" name="RSS_AI_HUMANIZE" value="false" />
              <input
                name="RSS_AI_HUMANIZE"
                type="checkbox"
                value="true"
                defaultChecked={s["RSS_AI_HUMANIZE"] !== "false"}
                className="mt-1 accent-vp-accent"
                title="Ativar humanização IA do corpo"
              />
            </label>

            <div className="grid gap-2 sm:grid-cols-4">
              {[
                ["Cron", hasCronSecret],
                ["OpenAI", hasOpenAIKey],
                ["Storage", hasSupabaseStorage],
                ["E-mail", hasResend],
              ].map(([label, ok]) => (
                <div key={String(label)} className="border border-vp-border bg-vp-surface/30 p-3">
                  <div className="text-[10px] font-black uppercase tracking-widest text-vp-text-4">{label}</div>
                  <div className={`mt-1 text-[12px] font-semibold ${ok ? "text-vp-ok" : "text-vp-warn"}`}>
                    {ok ? "Configurado" : "Pendente"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Analytics */}
        <section className="bg-[#141413] border border-vp-border p-5 rounded">
          <h3 className="text-[13px] font-semibold mb-4 uppercase tracking-wider text-vp-text-3">Analytics & Tracking</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <label className="grid gap-1">
              <span className="text-[11px] text-vp-text-3 uppercase font-semibold">Google Analytics ID</span>
              <input name="GA_ID" className="vp-input text-[13px] font-mono" defaultValue={s["GA_ID"] ?? ""} placeholder="G-XXXXXXXXXX" />
            </label>
            <label className="grid gap-1">
              <span className="text-[11px] text-vp-text-3 uppercase font-semibold">Google AdSense ID</span>
              <input name="ADSENSE_ID" className="vp-input text-[13px] font-mono" defaultValue={s["ADSENSE_ID"] ?? ""} placeholder="ca-pub-XXXXXXXX" />
            </label>
          </div>
        </section>

        <div className="flex justify-end pt-2">
          <button type="submit" className="vp-btn vp-btn-primary px-8 py-2.5 text-[13px] font-semibold">
            Salvar configurações
          </button>
        </div>
      </form>
    </div>
  );
}
