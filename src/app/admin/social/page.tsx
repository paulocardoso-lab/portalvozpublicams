import React from 'react';
import { getSiteSettings, saveSiteSettings } from '../settings/actions';

export const dynamic = 'force-dynamic';

const SOCIAL_FIELDS = [
  { key: 'SOCIAL_INSTAGRAM', enabledKey: 'SOCIAL_INSTAGRAM_ENABLED', label: 'Instagram', placeholder: 'https://instagram.com/vozpublicams' },
  { key: 'SOCIAL_FACEBOOK', enabledKey: 'SOCIAL_FACEBOOK_ENABLED', label: 'Facebook', placeholder: 'https://facebook.com/vozpublicams' },
  { key: 'SOCIAL_TWITTER', enabledKey: 'SOCIAL_TWITTER_ENABLED', label: 'X / Twitter', placeholder: 'https://x.com/vozpublicams' },
  { key: 'SOCIAL_YOUTUBE', enabledKey: 'SOCIAL_YOUTUBE_ENABLED', label: 'YouTube', placeholder: 'https://youtube.com/@vozpublicams' },
  { key: 'SOCIAL_WHATSAPP', enabledKey: 'SOCIAL_WHATSAPP_ENABLED', label: 'WhatsApp', placeholder: '+5567999999999' },
  { key: 'SOCIAL_TELEGRAM', enabledKey: 'SOCIAL_TELEGRAM_ENABLED', label: 'Telegram', placeholder: 'https://t.me/vozpublicams' },
] as const;

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminSocialPage({ searchParams }: { searchParams: SearchParams }) {
  const query = await searchParams;
  const saved = firstParam(query.saved) === '1';
  const settings = await getSiteSettings();
  const isEnabled = (key: string) => settings[key] !== '0' && settings[key] !== 'false';
  const visible = SOCIAL_FIELDS.filter((field) => Boolean(settings[field.key]) && isEnabled(field.enabledKey)).length;

  return (
    <div className="max-w-[960px]">
      <div className="mb-6 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-[22px] font-semibold mb-1">Redes sociais</h1>
          <p className="text-vp-text-3 text-[13px]">
            {visible} de {SOCIAL_FIELDS.length} canais habilitados para exibição pública.
          </p>
        </div>
        <span className="w-fit border border-vp-border bg-vp-surface px-3 py-1 text-[10px] font-black uppercase tracking-widest text-vp-text-3">
          Publicação automática pendente
        </span>
      </div>
      {saved ? (
        <div className="mb-5 border border-vp-ok/30 bg-vp-ok/10 px-4 py-3 text-[12px] font-semibold text-vp-ok">
          Canais salvos com sucesso.
        </div>
      ) : null}

      <form action={saveSiteSettings} className="grid gap-5">
        <input type="hidden" name="_redirectTo" value="/admin/social" />
        <section className="bg-[#141413] border border-vp-border p-5 rounded">
          <h2 className="text-[13px] font-semibold mb-4 uppercase tracking-wider text-vp-text-3">Canais oficiais</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {SOCIAL_FIELDS.map((field) => (
              <div key={field.key} className="grid gap-2 rounded-sm border border-vp-border/70 bg-[#0e0e0d] p-3">
                <div className="flex items-center justify-between gap-3">
                  <label htmlFor={field.key} className="text-[11px] text-vp-text-3 uppercase font-semibold">
                    {field.label}
                  </label>
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-vp-text-3">
                    <input type="hidden" name={field.enabledKey} value="0" />
                    <input
                      type="checkbox"
                      name={field.enabledKey}
                      value="1"
                      defaultChecked={isEnabled(field.enabledKey)}
                      className="h-4 w-4 accent-[var(--vp-accent)]"
                    />
                    Exibir
                  </label>
                </div>
                <input
                  id={field.key}
                  name={field.key}
                  className="vp-input text-[13px] font-mono"
                  defaultValue={settings[field.key] ?? ''}
                  placeholder={field.placeholder}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-3">
          {SOCIAL_FIELDS.map((field) => {
            const hasUrl = Boolean(settings[field.key]);
            const enabled = hasUrl && isEnabled(field.enabledKey);
            return (
              <div key={field.key} className="border border-vp-border bg-[#141413] p-4">
                <div className="text-[10px] font-black uppercase tracking-widest text-vp-text-4">{field.label}</div>
                <div className={`mt-2 text-[12px] font-semibold ${enabled ? 'text-vp-ok' : 'text-vp-warn'}`}>
                  {enabled ? 'Exibindo no site' : hasUrl ? 'Oculto no site' : 'Sem canal'}
                </div>
              </div>
            );
          })}
        </section>

        <div className="flex justify-end">
          <button type="submit" className="vp-btn vp-btn-primary px-8 py-2.5 text-[13px] font-semibold">
            Salvar canais
          </button>
        </div>
      </form>
    </div>
  );
}
