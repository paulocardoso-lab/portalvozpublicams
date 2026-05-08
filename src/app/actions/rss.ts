'use server';

import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-guard';
import { revalidatePath } from 'next/cache';
import { syncFeed } from '@/lib/rss-engine';

export async function createRSSFeed(data: {
  name: string;
  url: string;
  targetSectionId: string;
  autoPublish: boolean;
}) {
  await requireAdmin();

  try {
    const feed = await prisma.rSSFeed.create({
      data: {
        name: data.name,
        url: data.url,
        targetSectionId: data.targetSectionId,
        autoPublish: data.autoPublish,
      }
    });

    revalidatePath('/admin/rss');
    return { success: true, feed };
  } catch (error) {
    console.error('Error creating RSS feed:', error);
    return { error: 'Falha ao criar fonte RSS. Verifique se a URL já existe.' };
  }
}

export async function updateRSSFeed(id: string, data: {
  name: string;
  url: string;
  targetSectionId: string;
  autoPublish: boolean;
}) {
  await requireAdmin();

  try {
    await prisma.rSSFeed.update({
      where: { id },
      data: {
        name: data.name,
        url: data.url,
        targetSectionId: data.targetSectionId,
        autoPublish: data.autoPublish,
      }
    });

    revalidatePath('/admin/rss');
    return { success: true };
  } catch (error) {
    return { error: 'Falha ao atualizar fonte RSS.' };
  }
}

export async function toggleRSSFeed(id: string, isActive: boolean) {
  await requireAdmin();
  
  await prisma.rSSFeed.update({
    where: { id },
    data: { isActive }
  });

  revalidatePath('/admin/rss');
}

export async function deleteRSSFeed(id: string) {
  await requireAdmin();
  
  await prisma.rSSFeed.delete({
    where: { id }
  });

  revalidatePath('/admin/rss');
}

export async function runRSSSync(id: string) {
  await requireAdmin();
  
  try {
    await syncFeed(id);
    revalidatePath('/admin/rss');
    return { success: true };
  } catch (error) {
    return { error: 'Falha na sincronização manual.' };
  }
}
