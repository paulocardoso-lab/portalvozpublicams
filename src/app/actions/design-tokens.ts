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
  // Layout
  'layout.border-radius': string;
  'layout.container-max': string;
}

export const DEFAULT_TOKENS: DesignTokens = {
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
  'type.font-display': 'Playfair Display',
  'type.font-serif': 'Source Serif 4',
  'type.font-sans': 'Inter',
  'type.font-mono': 'JetBrains Mono',
  'type.size-base': '16',
  'type.line-height': '1.5',
  'layout.border-radius': '4',
  'layout.container-max': '1280',
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
