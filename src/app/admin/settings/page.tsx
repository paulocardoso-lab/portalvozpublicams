import React from "react";
import { getSiteSettings, saveSiteSettings } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const s = await getSiteSettings();

  return (
    <div className="max-w-[860px]">
      <h1 className="text-[22px] font-semibold mb-1">Configurações gerais</h1>
      <p className="text-vp-text-3 text-[13px] mb-6">Identidade do veículo, SEO e redes sociais. Alterações são aplicadas ao site imediatamente.</p>

      <form action={saveSiteSettings} className="grid gap-4">
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

        {/* Social */}
        <section className="bg-[#141413] border border-vp-border p-5 rounded">
          <h3 className="text-[13px] font-semibold mb-4 uppercase tracking-wider text-vp-text-3">Redes Sociais</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              ["SOCIAL_INSTAGRAM", "Instagram (URL)", "https://instagram.com/vozpublicams"],
              ["SOCIAL_TWITTER", "Twitter/X (URL)", "https://twitter.com/vozpublicams"],
              ["SOCIAL_FACEBOOK", "Facebook (URL)", "https://facebook.com/vozpublicams"],
              ["SOCIAL_YOUTUBE", "YouTube (URL)", "https://youtube.com/@vozpublicams"],
              ["SOCIAL_WHATSAPP", "WhatsApp (número)", "+5567999999999"],
              ["SOCIAL_TELEGRAM", "Telegram (URL)", "https://t.me/vozpublicams"],
            ].map(([key, label, placeholder]) => (
              <label key={key} className="grid gap-1">
                <span className="text-[11px] text-vp-text-3 uppercase font-semibold">{label}</span>
                <input name={key} className="vp-input text-[13px] font-mono" defaultValue={s[key] ?? ""} placeholder={placeholder} />
              </label>
            ))}
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
