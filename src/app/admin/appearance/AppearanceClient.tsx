'use client';

import React, { useState } from 'react';
import { saveBatchSettings } from '@/app/actions/settings';
import { useRouter } from 'next/navigation';
import { Series } from '@prisma/client';

export function AppearanceClient({ 
  initialSettings, 
  seriesList 
}: { 
  initialSettings: Record<string, string>, 
  seriesList: Series[] 
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('home');
  const [saving, setSaving] = useState(false);

  // Form states
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

  return (
    <div className="flex flex-col gap-8">
      {/* Tabs */}
      <div className="flex border-b border-vp-border gap-6">
        <button 
          onClick={() => setActiveTab('home')}
          className={`pb-3 text-[14px] font-bold uppercase tracking-wider transition-all border-b-2 ${activeTab === 'home' ? 'border-vp-accent text-vp-accent' : 'border-transparent text-vp-text-3'}`}
        >
          Página Inicial
        </button>
        <button 
          onClick={() => setActiveTab('branding')}
          className={`pb-3 text-[14px] font-bold uppercase tracking-wider transition-all border-b-2 ${activeTab === 'branding' ? 'border-vp-accent text-vp-accent' : 'border-transparent text-vp-text-3'}`}
        >
          Branding & Social
        </button>
      </div>

      <div className="grid gap-6 max-w-3xl">
        {activeTab === 'home' && (
          <div className="bg-vp-surface border border-vp-border p-6 rounded">
            <h3 className="font-display text-[20px] mb-2">Série em Destaque</h3>
            <p className="font-serif text-[13px] text-vp-text-2 mb-6">
              Selecione a série que será exibida no bloco &quot;Especial&quot; da Home.
            </p>

            <select 
              value={form.FEATURED_SERIES_ID} 
              onChange={(e) => setForm({...form, FEATURED_SERIES_ID: e.target.value})}
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

        {activeTab === 'branding' && (
          <div className="grid gap-6">
            <div className="bg-vp-surface border border-vp-border p-6 rounded">
              <h3 className="font-display text-[20px] mb-4 text-vp-accent">Identidade</h3>
              <div className="grid gap-4">
                <div>
                  <label htmlFor="site-name" className="text-[11px] uppercase font-bold text-vp-text-3 block mb-1.5">Nome do Site</label>
                  <input 
                    id="site-name"
                    className="vp-input w-full"
                    value={form.SITE_NAME}
                    onChange={(e) => setForm({...form, SITE_NAME: e.target.value})}
                  />
                </div>
                <div>
                  <label htmlFor="site-tagline" className="text-[11px] uppercase font-bold text-vp-text-3 block mb-1.5">Slogan / Descrição Curta</label>
                  <input 
                    id="site-tagline"
                    className="vp-input w-full"
                    value={form.SITE_TAGLINE}
                    onChange={(e) => setForm({...form, SITE_TAGLINE: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="bg-vp-surface border border-vp-border p-6 rounded">
              <h3 className="font-display text-[20px] mb-4 text-vp-accent">Redes Sociais</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="social-fb" className="text-[11px] uppercase font-bold text-vp-text-3 block mb-1.5">Facebook (URL)</label>
                  <input 
                    id="social-fb"
                    className="vp-input w-full"
                    value={form.SOCIAL_FACEBOOK}
                    onChange={(e) => setForm({...form, SOCIAL_FACEBOOK: e.target.value})}
                  />
                </div>
                <div>
                  <label htmlFor="social-ig" className="text-[11px] uppercase font-bold text-vp-text-3 block mb-1.5">Instagram (URL)</label>
                  <input 
                    id="social-ig"
                    className="vp-input w-full"
                    value={form.SOCIAL_INSTAGRAM}
                    onChange={(e) => setForm({...form, SOCIAL_INSTAGRAM: e.target.value})}
                  />
                </div>
                <div>
                  <label htmlFor="social-x" className="text-[11px] uppercase font-bold text-vp-text-3 block mb-1.5">X / Twitter (URL)</label>
                  <input 
                    id="social-x"
                    className="vp-input w-full"
                    value={form.SOCIAL_TWITTER}
                    onChange={(e) => setForm({...form, SOCIAL_TWITTER: e.target.value})}
                  />
                </div>
                <div>
                  <label htmlFor="social-yt" className="text-[11px] uppercase font-bold text-vp-text-3 block mb-1.5">YouTube (URL)</label>
                  <input 
                    id="social-yt"
                    className="vp-input w-full"
                    value={form.SOCIAL_YOUTUBE}
                    onChange={(e) => setForm({...form, SOCIAL_YOUTUBE: e.target.value})}
                  />
                </div>
                <div className="col-span-2">
                  <label htmlFor="social-wa" className="text-[11px] uppercase font-bold text-vp-text-3 block mb-1.5">WhatsApp (Link ou Número)</label>
                  <input 
                    id="social-wa"
                    className="vp-input w-full"
                    value={form.SOCIAL_WHATSAPP}
                    onChange={(e) => setForm({...form, SOCIAL_WHATSAPP: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="bg-vp-surface border border-vp-border p-6 rounded">
              <h3 className="font-display text-[20px] mb-4 text-vp-accent">Contato</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-email" className="text-[11px] uppercase font-bold text-vp-text-3 block mb-1.5">E-mail de Contato</label>
                  <input 
                    id="contact-email"
                    className="vp-input w-full"
                    value={form.EMAIL_CONTATO}
                    onChange={(e) => setForm({...form, EMAIL_CONTATO: e.target.value})}
                  />
                </div>
                <div>
                  <label htmlFor="contact-phone" className="text-[11px] uppercase font-bold text-vp-text-3 block mb-1.5">Telefone / Fone</label>
                  <input 
                    id="contact-phone"
                    className="vp-input w-full"
                    value={form.CONTACT_PHONE}
                    onChange={(e) => setForm({...form, CONTACT_PHONE: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="sticky bottom-8 bg-vp-bg py-4 border-t border-vp-border flex justify-end">
          <button 
            onClick={handleSave}
            disabled={saving}
            className="vp-btn vp-btn-primary px-8"
          >
            {saving ? 'Salvando...' : 'Salvar Todas as Configurações'}
          </button>
        </div>
      </div>
    </div>
  );
}
