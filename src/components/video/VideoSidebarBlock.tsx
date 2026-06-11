import { getActiveFeaturedVideo } from '@/app/actions/videos';
import { VideoCard } from './VideoCard';

export async function VideoSidebarBlock() {
  const video = await getActiveFeaturedVideo().catch(() => null);
  if (!video) return null;

  return (
    <VideoCard
      title={video.title}
      embedUrl={video.embedUrl}
      platform={video.platform as 'youtube' | 'vimeo' | 'gif' | 'other'}
      thumbnailUrl={video.thumbnailUrl}
      description={video.description}
      publishedAt={video.publishedAt}
    />
  );
}
