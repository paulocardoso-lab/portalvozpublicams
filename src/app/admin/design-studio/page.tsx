import React from 'react';
import { getDesignTokens } from '@/app/actions/design-tokens';
import { getSiteSettings } from '@/app/actions/settings';
import { DesignStudioClient } from './DesignStudioClient';

export default async function DesignStudioPage() {
  const [tokens, settings] = await Promise.all([
    getDesignTokens(),
    getSiteSettings(),
  ]);

  return (
    <div className="flex flex-col h-full">
      <div className="px-7 pt-6 pb-4 border-b border-vp-border">
        <h1 className="font-display text-[26px] mb-1">Design Studio</h1>
        <p className="text-vp-text-3 text-[13px] font-serif">
          Edite cores, tipografia e layout do portal em tempo real. As alterações são aplicadas imediatamente sem necessidade de deploy.
        </p>
      </div>
      <DesignStudioClient initialTokens={tokens} initialLogoUrl={settings['BRAND_LOGO_URL'] || '/logo.webp'} />
    </div>
  );
}
