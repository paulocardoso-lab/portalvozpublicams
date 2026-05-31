'use client';

import React, { useState } from 'react';
import { saveBatchSettings } from '@/app/actions/settings';
import { useRouter } from 'next/navigation';
import { Series } from '@prisma/client';
import { BrandUploader } from './BrandUploader';

export function AppearanceClient({
  initialSettings,
  seriesList,
}: {
  initialSettings: Record<string, string>;
  seriesList: Series[];
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('home');
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    FEATURED_SERIES_ID: initialSettings['FEATURED_SERIES_ID'] || '',
    SITE_NAME: initialSettings['SITE_NAME'] || 'Voz Pública MS',
    SITE_TAGLINE: initialSettings['SITE_TAGLINE'] || 'Jornalismo independente de Mato Grosso do Sul',
    SOCIAL_FACEBOOK: initialSettings['SOCIAL_FACEBOOK'] || initialSettings['SOCIAL_FB'] || '',
    SOCIAL_INSTAGRAM: initialSettings['SOCIAL_INSTAGRAM'] || initialSettings['SOCIAL_IG'] || '',
    SOCIAL_TWITTER: initialSettings['SOCIAL_TWITTER'] || initialSettings['SOCIAL_X'] || '',
    SOCIAL_YOUTUBE: initialSettings['SOCIAL_YOUTUBE'] || initialSettings['SOCIAL_YT'] || '',
    SOCIAL_WHATSAPP: initialSettings['SOCIAL_WHATSAPP'] || initialSettings['SOCIAL_WA'] || '',
    EMAIL_CONTATO: initialSettings['EMAIL_CONTATO'] || initialSettings['CONTACT_EMAIL'] || '',
    CONTACT_PHONE: initialSettings['CONTACT_PHONE'] || '',
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveBatchSettings(form);
      alert('Configurações atualizadas com sucesso!');
      router.refresh();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar configurações.');
    } finally {
      setSaving(false);
    }
  };

  const TABS = [
    { id: 'home',     label: 'Página Inicial' },
    { id: 'brand',    label: 'Logomarca & Favicon' },
    { id: 'branding', label: 'Branding & Social' },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Tabs */}
      <div className="flex border-b border-vp-border gap-6">
        {TABS.map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 text-[14px] font-bold uppercase tracking-wider transition-all border-b-2 ${
              activeTab === tab.id
                ? 'border-vp-accent text-vp-accent'
                : 'border-transparent text-vp-text-3 hover:text-vp-text-2'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 max-w-3xl">

        {/* ── Página Inicial ── */}
        {activeTab === 'home' && (
          <div className="bg-vp-surface border border-vp-border p-6 rounded">
            <h3 className="font-display text-[20px] mb-2">Série em Destaque</h3>
            <p className="font-serif text-[13px] text-vp-text-2 mb-6">
              Selecione a série que será exibida no bloco &quot;Especial&quot; da Home.
            </p>
            <select
              value={form.FEATURED_SERIES_ID}
              onChange={e => setForm({ ...form, FEATURED_SERIES_ID: e.target.value })}
              className="vp-input w-full mb-4"
              title="Série em destaque"
            >
              <option value="">Nenhuma série em destaque (ocultar bloco)</option>
              {seriesList.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* ── Logomarca & Favicon ── */}
        {activeTab === 'brand' && (
          <div className="grid gap-6">
            {/* Info banner */}
            <div className="border border-vp-accent/20 bg-vp-accent/5 rounded-sm px-5 py-4 text-[12px] text-vp-text-3 leading-relaxed font-serif">
              Os arquivos são processados pelo servidor com{' '}
              <span className="font-bold text-vp-text">Sharp</span>, convertidos para o formato
              correto e armazenados no Supabase Storage. A alteração é aplicada em todo o portal
              imediatamente após o upload, sem necessidade de novo deploy.
            </div>

            {/* Logo */}
            <div className="bg-vp-surface border border-vp-border p-6 rounded-sm space-y-2">
              <h3 className="font-display text-[20px] text-vp-accent">Logomarca</h3>
              <p className="font-serif text-[13px] text-vp-text-2 mb-4">
                Aparece no cabeçalho do portal (desktop e mobile). Use uma imagem com fundo
                transparente para melhor resultado.
              </p>
              <BrandUploader
                type="logo"
                currentUrl={initialSettings['BRAND_LOGO_URL'] || '/logo.png'}
                label="Logo do portal"
                hint="Exibida no cabeçalho desktop (altura 96 px) e mobile (altura 32 px)."
                dimensionHint="Recomendado: proporção ~6:1 · ex. 600×100 px · fundo transparente"
                onSuccess={() => router.refresh()}
              />
            </div>

            {/* Favicon */}
            <div className="bg-vp-surface border border-vp-border p-6 rounded-sm space-y-2">
              <h3 className="font-display text-[20px] text-vp-accent">Favicon</h3>
              <p className="font-serif text-[13px] text-vp-text-2 mb-4">
                Ícone exibido na aba do navegador, favoritos e tela inicial de dispositivos móveis
                (Apple Touch Icon). Use uma imagem quadrada com símbolo ou inicial do portal.
              </p>
              <BrandUploader
                type="favicon"
                currentUrl={initialSettings['BRAND_FAVICON_URL'] || '/favicon.png'}
                label="Favicon / ícone do portal"
                hint="Exibido na aba do browser e na tela inicial de dispositivos (Apple / Android)."
                dimensionHint="Recomendado: quadrado · mín. 512×512 px · fundo transparente (PNG)"
                onSuccess={() => router.refresh()}
              />
            </div>

            {/* Preview note */}
            <div className="text-[11px] text-vp-text-4 italic font-serif px-1">
              Após o upload, recarregue a página para ver o favicon atualizado na aba do navegador.
              Alguns browsers mantêm cache do ícone por alguns minutos.
            </div>
          </div>
        )}

        {/* ── Branding & Social ── */}
        {activeTab === 'branding' && (
          <div className="grid gap-6">
            <div className="bg-vp-surface border border-vp-border p-6 rounded">
              <h3 className="font-display text-[20px] mb-4 text-vp-accent">Identidade</h3>
              <div className="grid gap-4">
                <div>
                  <label htmlFor="site-name" className="text-[11px] uppercase font-bold text-vp-text-3 block mb-1.5">
                    Nome do Site
                  </label>
                  <input
                    id="site-name"
                    className="vp-input w-full"
                    value={form.SITE_NAME}
                    onChange={e => setForm({ ...form, SITE_NAME: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="site-tagline" className="text-[11px] uppercase font-bold text-vp-text-3 block mb-1.5">
                    Slogan / Descrição Curta
                  </label>
                  <input
                    id="site-tagline"
                    className="vp-input w-full"
                    value={form.SITE_TAGLINE}
                    onChange={e => setForm({ ...form, SITE_TAGLINE: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="bg-vp-surface border border-vp-border p-6 rounded">
              <h3 className="font-display text-[20px] mb-4 text-vp-accent">Redes Sociais</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="social-fb" className="text-[11px] uppercase font-bold text-vp-text-3 block mb-1.5">Facebook (URL)</label>
                  <input id="social-fb" className="vp-input w-full" value={form.SOCIAL_FACEBOOK} onChange={e => setForm({ ...form, SOCIAL_FACEBOOK: e.target.value })} />
                </div>
                <div>
                  <label htmlFor="social-ig" className="text-[11px] uppercase font-bold text-vp-text-3 block mb-1.5">Instagram (URL)</label>
                  <input id="social-ig" className="vp-input w-full" value={form.SOCIAL_INSTAGRAM} onChange={e => setForm({ ...form, SOCIAL_INSTAGRAM: e.target.value })} />
                </div>
                <div>
                  <label htmlFor="social-x" className="text-[11px] uppercase font-bold text-vp-text-3 block mb-1.5">X / Twitter (URL)</label>
                  <input id="social-x" className="vp-input w-full" value={form.SOCIAL_TWITTER} onChange={e => setForm({ ...form, SOCIAL_TWITTER: e.target.value })} />
                </div>
                <div>
                  <label htmlFor="social-yt" className="text-[11px] uppercase font-bold text-vp-text-3 block mb-1.5">YouTube (URL)</label>
                  <input id="social-yt" className="vp-input w-full" value={form.SOCIAL_YOUTUBE} onChange={e => setForm({ ...form, SOCIAL_YOUTUBE: e.target.value })} />
                </div>
                <div className="col-span-2">
                  <label htmlFor="social-wa" className="text-[11px] uppercase font-bold text-vp-text-3 block mb-1.5">WhatsApp (Link ou Número)</label>
                  <input id="social-wa" className="vp-input w-full" value={form.SOCIAL_WHATSAPP} onChange={e => setForm({ ...form, SOCIAL_WHATSAPP: e.target.value })} />
                </div>
              </div>
            </div>

            <div className="bg-vp-surface border border-vp-border p-6 rounded">
              <h3 className="font-display text-[20px] mb-4 text-vp-accent">Contato</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-email" className="text-[11px] uppercase font-bold text-vp-text-3 block mb-1.5">E-mail de Contato</label>
                  <input id="contact-email" className="vp-input w-full" value={form.EMAIL_CONTATO} onChange={e => setForm({ ...form, EMAIL_CONTATO: e.target.value })} />
                </div>
                <div>
                  <label htmlFor="contact-phone" className="text-[11px] uppercase font-bold text-vp-text-3 block mb-1.5">Telefone / Fone</label>
                  <input id="contact-phone" className="vp-input w-full" value={form.CONTACT_PHONE} onChange={e => setForm({ ...form, CONTACT_PHONE: e.target.value })} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Save button — only for tabs with form fields */}
        {activeTab !== 'brand' && (
          <div className="sticky bottom-8 bg-vp-bg py-4 border-t border-vp-border flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="vp-btn vp-btn-primary px-8"
            >
              {saving ? 'Salvando...' : 'Salvar Todas as Configurações'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
