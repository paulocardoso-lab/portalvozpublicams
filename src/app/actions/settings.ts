'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth-guard';
import { expandSettingAliases, withSettingAliases } from '@/lib/settings-aliases';

export async function getSiteSettings() {
  try {
    const settings = await prisma.siteSetting.findMany();
    return withSettingAliases(
      Object.fromEntries(settings.map((setting) => [setting.key, setting.value])) as Record<string, string>
    );
  } catch (err) {
    console.error('getSiteSettings failed:', err);
    return {} as Record<string, string>;
  }
}

export async function saveSiteSetting(key: string, value: string) {
  await requireAdmin();

  await prisma.siteSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value }
  });
  revalidatePath('/');
}

export async function saveBatchSettings(settings: Record<string, string>) {
  await requireAdmin();

  for (const [key, value] of Object.entries(expandSettingAliases(settings))) {
    if (value !== undefined) {
      await prisma.siteSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value }
      });
    }
  }
  revalidatePath('/');
  revalidatePath('/admin/appearance');
  revalidatePath('/admin/settings');
}
