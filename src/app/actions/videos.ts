'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth-guard';
import { resolveVideoEmbed } from '@/lib/video-embed';

export async function getFeaturedVideos() {
  await requireAdmin();
  return prisma.featuredVideo.findMany({
    orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
  });
}

export async function getActiveFeaturedVideo() {
  return prisma.featuredVideo.findFirst({
    where: { isActive: true },
    orderBy: [{ displayOrder: 'asc' }, { publishedAt: 'desc' }],
  });
}

export async function createFeaturedVideo(data: {
  title: string;
  url: string;
  description?: string;
  displayOrder?: number;
  publishedAt?: string;
}) {
  await requireAdmin(['SUPER_ADMIN', 'EDITOR_CHIEF', 'SECTION_EDITOR']);

  const { platform, embedUrl, thumbnailUrl } = resolveVideoEmbed(data.url.trim());

  const video = await prisma.featuredVideo.create({
    data: {
      title: data.title.trim(),
      url: data.url.trim(),
      embedUrl,
      platform,
      thumbnailUrl,
      description: data.description?.trim() || null,
      displayOrder: data.displayOrder ?? 0,
      publishedAt: data.publishedAt ? new Date(data.publishedAt) : new Date(),
    },
  });

  revalidatePath('/');
  revalidatePath('/admin/videos');
  return { success: true, video };
}

export async function updateFeaturedVideo(id: string, data: {
  title?: string;
  url?: string;
  description?: string;
  displayOrder?: number;
  isActive?: boolean;
  publishedAt?: string;
}) {
  await requireAdmin(['SUPER_ADMIN', 'EDITOR_CHIEF', 'SECTION_EDITOR']);

  // Se a URL mudou, re-resolve o embed
  let embedFields = {};
  if (data.url) {
    const { platform, embedUrl, thumbnailUrl } = resolveVideoEmbed(data.url.trim());
    embedFields = { url: data.url.trim(), platform, embedUrl, thumbnailUrl };
  }

  await prisma.featuredVideo.update({
    where: { id },
    data: {
      ...(data.title && { title: data.title.trim() }),
      ...(data.description !== undefined && { description: data.description?.trim() || null }),
      ...(data.displayOrder !== undefined && { displayOrder: data.displayOrder }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
      ...(data.publishedAt && { publishedAt: new Date(data.publishedAt) }),
      ...embedFields,
    },
  });

  revalidatePath('/');
  revalidatePath('/admin/videos');
  return { success: true };
}

export async function deleteFeaturedVideo(id: string) {
  await requireAdmin(['SUPER_ADMIN', 'EDITOR_CHIEF']);
  await prisma.featuredVideo.delete({ where: { id } });
  revalidatePath('/');
  revalidatePath('/admin/videos');
  return { success: true };
}

export async function toggleFeaturedVideo(id: string, isActive: boolean) {
  await requireAdmin(['SUPER_ADMIN', 'EDITOR_CHIEF', 'SECTION_EDITOR']);
  await prisma.featuredVideo.update({ where: { id }, data: { isActive } });
  revalidatePath('/');
  revalidatePath('/admin/videos');
  return { success: true };
}
