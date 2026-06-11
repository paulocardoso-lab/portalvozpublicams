import { requireAdmin } from '@/lib/auth-guard';
import { getFeaturedVideos } from '@/app/actions/videos';
import { VideosClient } from './VideosClient';

export const dynamic = 'force-dynamic';

export default async function VideosPage() {
  await requireAdmin(['SUPER_ADMIN', 'EDITOR_CHIEF', 'SECTION_EDITOR']);
  const videos = await getFeaturedVideos();

  return (
    <div className="p-7 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-[32px] font-black leading-tight text-vp-text">Vídeos em Destaque.</h1>
        <p className="font-serif italic text-[15px] text-vp-text-3 mt-1">
          Gerencie vídeos da sidebar — YouTube, Vimeo, GIF animado ou qualquer embed.
        </p>
      </div>
      <VideosClient initialVideos={videos} />
    </div>
  );
}
