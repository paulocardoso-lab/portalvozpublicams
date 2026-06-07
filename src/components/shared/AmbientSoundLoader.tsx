import { getSiteSettings } from '@/app/actions/settings';
import { AmbientSound } from './AmbientSound';

export async function AmbientSoundLoader() {
  const settings = await getSiteSettings().catch(() => ({} as Record<string, string>));

  const enabled = settings['ambient.enabled'] === 'true';
  const audioUrl = settings['ambient.audio_url']?.trim() ?? '';
  const volume = Math.min(30, Math.max(1, Number(settings['ambient.volume'] ?? '10')));

  if (!enabled || !audioUrl) return null;

  return <AmbientSound audioUrl={audioUrl} defaultVolume={volume} />;
}
