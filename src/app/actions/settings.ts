'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getSiteSettings() {
  // try {
  //   const settings = await prisma.siteSetting.findMany();
  //   return settings.reduce((acc, curr) => {
  //     acc[curr.key] = curr.value;
  //     return acc;
  //   }, {} as Record<string, string>);
  // } catch (err) {
  //   console.error('getSiteSettings failed:', err);
  //   return {} as Record<string, string>;
  // }
  return {} as Record<string, string>;
}

export async function saveSiteSetting(key: string, value: string) {
  await prisma.siteSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value }
  });
  revalidatePath('/');
}

export async function saveBatchSettings(settings: Record<string, string>) {
  for (const [key, value] of Object.entries(settings)) {
    if (value !== undefined) {
      await prisma.siteSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value }
      });
    }
  }
  revalidatePath('/');
}
