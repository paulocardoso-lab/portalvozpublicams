'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth-guard';

export interface DesignTokens {
  // Colors
  'color.bg': string;
  'color.surface': string;
  'color.surface-2': string;
  'color.surface-3': string;
  'color.border': string;
  'color.border-2': string;
  'color.text': string;
  'color.text-2': string;
  'color.text-3': string;
  'color.text-4': string;
  'color.accent': string;
  'color.accent-hover': string;
  'color.urgent': string;
  // Typography
  'type.font-display': string;
  'type.font-serif': string;
  'type.font-sans': string;
  'type.font-mono': string;
  'type.size-base': string;
  'type.line-height': string;
  // Layout / spacing
  'layout.border-radius': string;
  'layout.container-max': string;
  'layout.spacing-unit': string;
  'layout.header-height': string;
  'layout.sidebar-width': string;
  'layout.content-gap': string;
  // Components — buttons
  'comp.btn-radius': string;
  'comp.btn-font-size': string;
  'comp.btn-font-weight': string;
  'comp.btn-padding-x': string;
  'comp.btn-padding-y': string;
  // Components — cards
  'comp.card-radius': string;
  'comp.card-border-width': string;
  'comp.card-image-ratio': string;
  'comp.card-gap': string;
  // Components — header
  'comp.header-logo-size': string;
  'comp.header-nav-font-size': string;
  'comp.header-nav-font-weight': string;
  // Components — article body
  'comp.article-max-width': string;
  'comp.article-font-size': string;
  'comp.article-text-align': string;
  'comp.article-paragraph-gap': string;
}

export const DEFAULT_TOKENS: DesignTokens = {
  // Colors
  'color.bg': '#1a1a19',
  'color.surface': '#262624',
  'color.surface-2': '#2f2f2d',
  'color.surface-3': '#3a3a37',
  'color.border': '#3a3a37',
  'color.border-2': '#4a4a46',
  'color.text': '#faf9f5',
  'color.text-2': '#d1cfc4',
  'color.text-3': '#8a887f',
  'color.text-4': '#5a5852',
  'color.accent': '#d97757',
  'color.accent-hover': '#c96442',
  'color.urgent': '#e85d4a',
  // Typography
  'type.font-display': 'Playfair Display',
  'type.font-serif': 'Source Serif 4',
  'type.font-sans': 'Inter',
  'type.font-mono': 'JetBrains Mono',
  'type.size-base': '16',
  'type.line-height': '1.5',
  // Layout / spacing
  'layout.border-radius': '4',
  'layout.container-max': '1280',
  'layout.spacing-unit': '4',
  'layout.header-height': '56',
  'layout.sidebar-width': '280',
  'layout.content-gap': '32',
  // Components — buttons
  'comp.btn-radius': '2',
  'comp.btn-font-size': '13',
  'comp.btn-font-weight': '600',
  'comp.btn-padding-x': '14',
  'comp.btn-padding-y': '8',
  // Components — cards
  'comp.card-radius': '2',
  'comp.card-border-width': '1',
  'comp.card-image-ratio': '56',
  'comp.card-gap': '16',
  // Components — header
  'comp.header-logo-size': '48',
  'comp.header-nav-font-size': '12',
  'comp.header-nav-font-weight': '700',
  // Components — article body
  'comp.article-max-width': '720',
  'comp.article-font-size': '18',
  'comp.article-text-align': 'left',
  'comp.article-paragraph-gap': '24',
};

const DB_PREFIX = 'DESIGN_TOKEN_';

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

// ── Histórico / Snapshots ─────────────────────────────────────────────────────

export interface DesignSnapshot {
  id: string;
  label: string;
  tokens: DesignTokens;
  createdAt: string;
}

export async function createSnapshot(label: string, tokens: DesignTokens): Promise<void> {
  await requireAdmin();

  await prisma.siteSetting.upsert({
    where: { key: `DESIGN_SNAPSHOT_${Date.now()}` },
    update: {},
    create: {
      key: `DESIGN_SNAPSHOT_${Date.now()}`,
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

// ── Agendamento ───────────────────────────────────────────────────────────────

export interface ScheduledTheme {
  id: string;
  label: string;
  tokens: DesignTokens;
  scheduledFor: string; // ISO string
  createdAt: string;
}

const SCHED_PREFIX = 'DESIGN_SCHEDULED_';

export async function scheduleTheme(label: string, tokens: DesignTokens, scheduledFor: Date): Promise<void> {
  await requireAdmin();

  const key = `${SCHED_PREFIX}${scheduledFor.getTime()}`;
  await prisma.siteSetting.upsert({
    where: { key },
    update: { value: JSON.stringify({ label, tokens, scheduledFor: scheduledFor.toISOString(), createdAt: new Date().toISOString() }) },
    create: { key, value: JSON.stringify({ label, tokens, scheduledFor: scheduledFor.toISOString(), createdAt: new Date().toISOString() }) },
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
      // Apply the theme
      for (const [key, value] of Object.entries(data.tokens)) {
        const dbKey = `${DB_PREFIX}${key}`;
        await prisma.siteSetting.upsert({
          where: { key: dbKey },
          update: { value: String(value) },
          create: { key: dbKey, value: String(value) },
        });
      }
      // Snapshot for history
      await prisma.siteSetting.create({
        data: {
          key: `DESIGN_SNAPSHOT_${Date.now()}_sched`,
          value: JSON.stringify({ label: `Agendado: ${data.label}`, tokens: data.tokens, createdAt: now.toISOString() }),
        },
      });
      // Remove the scheduled entry
      await prisma.siteSetting.delete({ where: { key: row.key } });
      applied++;
    }
  }

  if (applied > 0) {
    revalidatePath('/', 'layout');
  }

  return applied;
}
