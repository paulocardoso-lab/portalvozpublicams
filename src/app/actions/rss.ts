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
  requiresReview: z.boolean().default(true),
  syncIntervalHours: z.number().int().min(1).max(168).default(6),
  maxItemsPerSync: z.number().int().min(1).max(50).default(10),
  keywordFilter: z.array(z.string()).default([]),
  blacklistKeywords: z.array(z.string()).default([]),
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
  requiresReview?: boolean;
  syncIntervalHours?: number;
  maxItemsPerSync?: number;
  keywordFilter?: string[];
  blacklistKeywords?: string[];
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
        requiresReview: parsed.data.requiresReview,
        syncIntervalHours: parsed.data.syncIntervalHours,
        maxItemsPerSync: parsed.data.maxItemsPerSync,
        keywordFilter: parsed.data.keywordFilter,
        blacklistKeywords: parsed.data.blacklistKeywords,
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
  requiresReview?: boolean;
  syncIntervalHours?: number;
  maxItemsPerSync?: number;
  keywordFilter?: string[];
  blacklistKeywords?: string[];
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
        requiresReview: parsed.data.requiresReview,
        syncIntervalHours: parsed.data.syncIntervalHours,
        maxItemsPerSync: parsed.data.maxItemsPerSync,
        keywordFilter: parsed.data.keywordFilter,
        blacklistKeywords: parsed.data.blacklistKeywords,
        isActive: true,
        consecutiveFailures: 0,
        disabledAt: null,
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
    data: {
      isActive,
      // Ao reativar manualmente, reseta contador de falhas
      ...(isActive ? { consecutiveFailures: 0, disabledAt: null } : {}),
    }
  });

  revalidatePath('/admin/rss');
  return { success: true };
}

export async function deleteRSSFeed(id: string) {
  await requireAdmin();

  await prisma.rSSFeed.delete({ where: { id } });
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

export async function previewRSSFeed(url: string) {
  await requireAdmin();

  try {
    const { previewFeed } = await import('@/lib/rss-engine');
    const items = await previewFeed(url);
    return { success: true, items };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Não foi possível ler o feed.' };
  }
}

export async function getFeedHealthStats(feedId: string) {
  await requireAdmin();

  const logs = await prisma.rSSLog.findMany({
    where: { feedId, articleId: null }, // apenas logs de rodada, não por artigo
    orderBy: { createdAt: 'desc' },
    take: 20,
    select: {
      status: true,
      itemsTotal: true,
      itemsCreated: true,
      itemsSkipped: true,
      itemsFailed: true,
      durationMs: true,
      message: true,
      createdAt: true,
    },
  });

  const total = logs.length;
  const successes = logs.filter((l) => l.status === 'SUCCESS' || l.status === 'PARTIAL').length;
  const successRate = total > 0 ? Math.round((successes / total) * 100) : null;
  const lastError = logs.find((l) => l.status === 'FAILED')?.message ?? null;
  const avgDuration = total > 0
    ? Math.round(logs.reduce((sum, l) => sum + l.durationMs, 0) / total)
    : 0;

  return { successRate, lastError, avgDuration, recentLogs: logs.slice(0, 5) };
}
