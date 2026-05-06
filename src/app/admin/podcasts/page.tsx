import React from 'react';
import { getPodcastEpisodes } from '@/app/actions/podcast';
import { PodcastClient } from './PodcastClient';

export default async function AdminPodcastsPage() {
  const episodes = await getPodcastEpisodes();

  return (
    <div className="p-7 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-[28px] mb-2">Podcast "Voz Alta"</h1>
          <p className="font-serif text-vp-text-2 text-[14px]">
            Gerencie os episódios do podcast exibidos na página inicial e no feed de áudio.
          </p>
        </div>
      </div>

      <PodcastClient initialEpisodes={episodes} />
    </div>
  );
}
