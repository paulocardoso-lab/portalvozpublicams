'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth-guard';

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
