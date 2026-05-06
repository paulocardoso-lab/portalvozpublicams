'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getPodcastEpisodes() {
  return prisma.podcastEpisode.findMany({
    orderBy: { publishedAt: 'desc' }
  });
}

export async function getActivePodcastEpisode() {
  return prisma.podcastEpisode.findFirst({
    where: { isActive: true },
    orderBy: { publishedAt: 'desc' }
  });
}

export async function savePodcastEpisode(data: {
  id?: string;
  title: string;
  description?: string;
  embedUrl?: string;
  audioUrl?: string;
  coverImage?: string;
  duration?: string;
  isActive: boolean;
  publishedAt?: Date;
}) {
  let episode;
  if (data.id) {
    episode = await prisma.podcastEpisode.update({
      where: { id: data.id },
      data: { ...data }
    });
  } else {
    episode = await prisma.podcastEpisode.create({
      data: { ...data }
    });
  }

  revalidatePath('/');
  revalidatePath('/admin/podcasts');
  return episode;
}

export async function togglePodcastEpisode(id: string, currentStatus: boolean) {
  await prisma.podcastEpisode.update({
    where: { id },
    data: { isActive: !currentStatus }
  });
  revalidatePath('/');
  revalidatePath('/admin/podcasts');
}

export async function deletePodcastEpisode(id: string) {
  await prisma.podcastEpisode.delete({ where: { id } });
  revalidatePath('/');
  revalidatePath('/admin/podcasts');
}
