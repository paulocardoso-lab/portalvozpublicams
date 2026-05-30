'use server';

import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-guard';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const rssFeedSchema = z.object({
  name: z.string().trim().min(2, 'Informe o nome da fonte RSS.'),
  url: z.string().trim().url('Informe uma URL válida para o feed RSS.'),
  targetSectionId: z.string().trim().min(1, 'Selecione uma editoria alvo.'),
  autoPublish: z.boolean(),
});

function isPrismaUniqueError(error: unknown) {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002';
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Erro interno no servidor';
}

export async function createRSSFeed(data: {
  name: string;
  url: string;
  targetSectionId: string;
  autoPublish: boolean;
}) {
  await requireAdmin();

  const parsed = rssFeedSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Dados inválidos.' };
  }

  try {
    await prisma.rSSFeed.create({
      data: {
        name: parsed.data.name,
        url: parsed.data.url,
        targetSectionId: parsed.data.targetSectionId,
        autoPublish: parsed.data.autoPublish,
      }
    });

    revalidatePath('/admin/rss');
    return { success: true };
  } catch (error) {
    console.error('Detailed RSS Error:', error);
    if (isPrismaUniqueError(error)) {
      return { success: false, error: 'Esta URL de feed já está cadastrada.' };
    }
    return { success: false, error: `Erro ao salvar: ${errorMessage(error)}` };
  }
}

export async function updateRSSFeed(id: string, data: {
  name: string;
  url: string;
  targetSectionId: string;
  autoPublish: boolean;
}) {
  await requireAdmin();

  const parsed = rssFeedSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Dados inválidos.' };
  }

  try {
    await prisma.rSSFeed.update({
      where: { id },
      data: {
        name: parsed.data.name,
        url: parsed.data.url,
        targetSectionId: parsed.data.targetSectionId,
        autoPublish: parsed.data.autoPublish,
      }
    });

    revalidatePath('/admin/rss');
    return { success: true };
  } catch {
    return { success: false, error: 'Falha ao atualizar fonte RSS.' };
  }
}

export async function toggleRSSFeed(id: string, isActive: boolean) {
  await requireAdmin();
  
  await prisma.rSSFeed.update({
    where: { id },
    data: { isActive }
  });

  revalidatePath('/admin/rss');
  return { success: true };
}

export async function deleteRSSFeed(id: string) {
  await requireAdmin();
  
  await prisma.rSSFeed.delete({
    where: { id }
  });

  revalidatePath('/admin/rss');
  return { success: true };
}

export async function runRSSSync(id: string) {
  await requireAdmin();
  
  try {
    const { syncFeed } = await import('@/lib/rss-engine');
    const summary = await syncFeed(id);
    revalidatePath('/admin/rss');
    return { success: true, summary };
  } catch (error) {
    console.error('runRSSSync failed:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Falha na sincronização manual.' };
  }
}
