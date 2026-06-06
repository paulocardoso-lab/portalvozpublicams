'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { requireAdmin, requireSuperAdmin } from '@/lib/auth-guard';

export async function updateMarketIndicator(formData: FormData) {
  await requireAdmin();

  const key = formData.get('key') as string;
  const value = formData.get('value') as string;
  const unit = formData.get('unit') as string;

  await prisma.marketIndicator.upsert({
    where: { key },
    update: { value, unit },
    create: { key, value, unit }
  });

  revalidatePath('/admin/metrics/market');
  revalidatePath('/');
}

function textOrNull(value: FormDataEntryValue | null) {
  const text = String(value ?? '').trim();
  return text.length > 0 ? text : null;
}

function numberOrDefault(value: FormDataEntryValue | null, fallback: number) {
  const numeric = Number(String(value ?? '').trim());
  return Number.isFinite(numeric) ? numeric : fallback;
}

function normalizeKey(rawKey: string) {
  const key = rawKey.trim().toLowerCase().replace(/[^a-z0-9_]+/g, '_').replace(/^_+|_+$/g, '');
  if (!key) throw new Error('Indicador precisa de um identificador.');
  return key.slice(0, 80);
}

export async function saveMarketIndicator(formData: FormData) {
  await requireAdmin();

  const key = normalizeKey(String(formData.get('key') ?? ''));
  const label = textOrNull(formData.get('label')) ?? key.toUpperCase();
  const value = String(formData.get('value') ?? '').trim();
  const sourceType = String(formData.get('sourceType') ?? 'MANUAL');

  if (!value) throw new Error('Indicador precisa de um valor.');
  if (!['MANUAL', 'SYSTEM', 'JSON_API'].includes(sourceType)) {
    throw new Error('Tipo de fonte inválido.');
  }

  await prisma.marketIndicator.upsert({
    where: { key },
    update: {
      label,
      value,
      unit: textOrNull(formData.get('unit')),
      displayOrder: numberOrDefault(formData.get('displayOrder'), 100),
      isActive: formData.get('isActive') === 'on',
      showInHeader: formData.get('showInHeader') === 'on',
      showInMobile: formData.get('showInMobile') === 'on',
      sourceType,
      sourceUrl: textOrNull(formData.get('sourceUrl')),
      sourcePath: textOrNull(formData.get('sourcePath')),
      sourceHeaders: textOrNull(formData.get('sourceHeaders')),
      sourceRefreshMinutes: Math.max(5, numberOrDefault(formData.get('sourceRefreshMinutes'), 60)),
      formatDecimals: Math.max(0, Math.min(6, numberOrDefault(formData.get('formatDecimals'), 2))),
      prefix: textOrNull(formData.get('prefix')),
      suffix: textOrNull(formData.get('suffix')),
    },
    create: {
      key,
      label,
      value,
      unit: textOrNull(formData.get('unit')),
      displayOrder: numberOrDefault(formData.get('displayOrder'), 100),
      isActive: formData.get('isActive') === 'on',
      showInHeader: formData.get('showInHeader') === 'on',
      showInMobile: formData.get('showInMobile') === 'on',
      sourceType,
      sourceUrl: textOrNull(formData.get('sourceUrl')),
      sourcePath: textOrNull(formData.get('sourcePath')),
      sourceHeaders: textOrNull(formData.get('sourceHeaders')),
      sourceRefreshMinutes: Math.max(5, numberOrDefault(formData.get('sourceRefreshMinutes'), 60)),
      formatDecimals: Math.max(0, Math.min(6, numberOrDefault(formData.get('formatDecimals'), 2))),
      prefix: textOrNull(formData.get('prefix')),
      suffix: textOrNull(formData.get('suffix')),
    },
  });

  revalidatePath('/admin/metrics/market');
  revalidatePath('/');
}

export async function deleteMarketIndicator(formData: FormData) {
  await requireSuperAdmin();

  const key = normalizeKey(String(formData.get('key') ?? ''));
  await prisma.marketIndicator.delete({ where: { key } });

  revalidatePath('/admin/metrics/market');
  revalidatePath('/');
}
