'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getMenuSections() {
  return prisma.section.findMany({
    where: { showInMenu: true },
    orderBy: { menuOrder: 'asc' }
  });
}

export async function getAllSections() {
  return prisma.section.findMany({
    orderBy: { name: 'asc' }
  });
}

export async function updateSectionMenu(id: string, data: { showInMenu: boolean, menuOrder: number }) {
  await prisma.section.update({
    where: { id },
    data
  });
  revalidatePath('/');
}
