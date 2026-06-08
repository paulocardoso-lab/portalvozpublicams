import React from 'react';
import { getSiteSettings } from '@/app/actions/settings';
import { AmbientSoundClient } from './AmbientSoundClient';

export const dynamic = 'force-dynamic';

export default async function AdminSomAmbientePage() {
  const settings = await getSiteSettings().catch(() => ({} as Record<string, string>));

  return (
    <div className="max-w-[640px]">
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold mb-1">Som Ambiente</h1>
        <p className="text-vp-text-3 text-[13px]">
          Áudio em loop exibido no site público para os leitores. O visitante pode aceitar ou recusar via toast.
        </p>
      </div>

      <AmbientSoundClient
        initialEnabled={settings['ambient.enabled'] === 'true'}
        initialAudioUrl={settings['ambient.audio_url'] ?? ''}
        initialVolume={Number(settings['ambient.volume'] ?? '10')}
      />
    </div>
  );
}
