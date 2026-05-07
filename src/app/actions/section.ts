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

export async function updateSectionMenu(id: string, data: { showInMenu: boolean; menuOrder: number }) {
  await prisma.section.update({ where: { id }, data });
  revalidatePath('/');
  revalidatePath('/admin/sections');
}

export async function createSection(formData: FormData) {
  const name = String(formData.get('name')).trim();
  const slug = String(formData.get('slug')).trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
  const description = String(formData.get('description') ?? '').trim();
  const showInMenu = formData.get('showInMenu') === 'on';
  const menuOrder = parseInt(String(formData.get('menuOrder') ?? '0'));

  if (!name || !slug) return;

  await prisma.section.create({
    data: { name, slug, description: description || null, showInMenu, menuOrder },
  });
  revalidatePath('/admin/sections');
  revalidatePath('/');
}

export async function deleteSection(id: string) {
  // Only delete if no articles are linked
  const count = await prisma.article.count({ where: { sectionId: id } });
  if (count > 0) throw new Error(`Esta editoria tem ${count} matéria(s) vinculada(s). Remova-as primeiro.`);
  await prisma.section.delete({ where: { id } });
  revalidatePath('/admin/sections');
  revalidatePath('/');
}

