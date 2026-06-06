'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth-guard';
import { DEFAULT_TOKENS, type DesignTokens, type DesignSnapshot, type ScheduledTheme } from '@/lib/design-tokens-types';

export type { DesignTokens, DesignSnapshot, ScheduledTheme };
export { DEFAULT_TOKENS };

const DB_PREFIX = 'DESIGN_TOKEN_';
const SCHED_PREFIX = 'DESIGN_SCHEDULED_';

export async function getDesignTokens(): Promise<DesignTokens> {
  try {
    const rows = await prisma.siteSetting.findMany({
      where: { key: { startsWith: DB_PREFIX } }
    });
    const saved = Object.fromEntries(
      rows.map(r => [r.key.slice(DB_PREFIX.length), r.value])
    );
    return { ...DEFAULT_TOKENS, ...saved } as DesignTokens;
  } catch {
    return { ...DEFAULT_TOKENS };
  }
}

export async function saveDesignTokens(tokens: Partial<DesignTokens>) {
  await requireAdmin();

  for (const [key, value] of Object.entries(tokens)) {
    const dbKey = `${DB_PREFIX}${key}`;
    await prisma.siteSetting.upsert({
      where: { key: dbKey },
      update: { value: String(value) },
      create: { key: dbKey, value: String(value) },
    });
  }

  revalidatePath('/', 'layout');
  revalidatePath('/admin/design-studio');
}

export async function resetDesignTokens() {
  await requireAdmin();

  const keys = Object.keys(DEFAULT_TOKENS).map(k => `${DB_PREFIX}${k}`);
  await prisma.siteSetting.deleteMany({ where: { key: { in: keys } } });

  revalidatePath('/', 'layout');
  revalidatePath('/admin/design-studio');
}

export async function createSnapshot(label: string, tokens: DesignTokens): Promise<void> {
  await requireAdmin();

  const key = `DESIGN_SNAPSHOT_${Date.now()}`;
  await prisma.siteSetting.upsert({
    where: { key },
    update: {},
    create: {
      key,
      value: JSON.stringify({ label, tokens, createdAt: new Date().toISOString() }),
    },
  });
}

export async function listSnapshots(): Promise<DesignSnapshot[]> {
  try {
    const rows = await prisma.siteSetting.findMany({
      where: { key: { startsWith: 'DESIGN_SNAPSHOT_' } },
      orderBy: { key: 'desc' },
      take: 20,
    });
    return rows.map(r => {
      const data = JSON.parse(r.value) as { label: string; tokens: DesignTokens; createdAt: string };
      return { id: r.key, label: data.label, tokens: data.tokens, createdAt: data.createdAt };
    });
  } catch {
    return [];
  }
}

export async function deleteSnapshot(id: string): Promise<void> {
  await requireAdmin();
  await prisma.siteSetting.delete({ where: { key: id } });
}

export async function saveDesignTokensWithSnapshot(tokens: Partial<DesignTokens>, snapshotLabel: string) {
  await requireAdmin();

  const current = await getDesignTokens();
  await createSnapshot(snapshotLabel, current);
  await saveDesignTokens(tokens);
}

export async function scheduleTheme(label: string, tokens: DesignTokens, scheduledFor: Date): Promise<void> {
  await requireAdmin();

  const key = `${SCHED_PREFIX}${scheduledFor.getTime()}`;
  const value = JSON.stringify({ label, tokens, scheduledFor: scheduledFor.toISOString(), createdAt: new Date().toISOString() });
  await prisma.siteSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
}

export async function listScheduledThemes(): Promise<ScheduledTheme[]> {
  try {
    const rows = await prisma.siteSetting.findMany({
      where: { key: { startsWith: SCHED_PREFIX } },
      orderBy: { key: 'asc' },
    });
    return rows.map(r => {
      const data = JSON.parse(r.value) as Omit<ScheduledTheme, 'id'>;
      return { id: r.key, ...data };
    });
  } catch {
    return [];
  }
}

export async function cancelScheduledTheme(id: string): Promise<void> {
  await requireAdmin();
  await prisma.siteSetting.delete({ where: { key: id } });
}

export async function applyDueScheduledThemes(): Promise<number> {
  const now = new Date();
  const rows = await prisma.siteSetting.findMany({
    where: { key: { startsWith: SCHED_PREFIX } },
  });

  let applied = 0;
  for (const row of rows) {
    const data = JSON.parse(row.value) as Omit<ScheduledTheme, 'id'>;
    if (new Date(data.scheduledFor) <= now) {
      for (const [key, value] of Object.entries(data.tokens)) {
        const dbKey = `${DB_PREFIX}${key}`;
        await prisma.siteSetting.upsert({
          where: { key: dbKey },
          update: { value: String(value) },
          create: { key: dbKey, value: String(value) },
        });
      }
      await prisma.siteSetting.create({
        data: {
          key: `DESIGN_SNAPSHOT_${Date.now()}_sched`,
          value: JSON.stringify({ label: `Agendado: ${data.label}`, tokens: data.tokens, createdAt: now.toISOString() }),
        },
      });
      await prisma.siteSetting.delete({ where: { key: row.key } });
      applied++;
    }
  }

  if (applied > 0) {
    revalidatePath('/', 'layout');
  }

  return applied;
}
