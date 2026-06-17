'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth-guard';

async function logAudit(action: string, target: string, status: string) {
  const session = await auth();
  await prisma.auditLog.create({
    data: {
      userId: session?.user?.id ?? null,
      action,
      target,
      status,
      ip: null,
    },
  });
}

function normalizeSlug(value: FormDataEntryValue | null) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

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
  await requireAdmin();
  await prisma.section.update({ where: { id }, data });
  await logAudit(`SECTION_MENU_UPDATED → ${data.showInMenu}`, `section:${id}`, "OK");
  revalidatePath('/');
  revalidatePath('/admin/sections');
}

export async function updateSection(id: string, formData: FormData) {
  await requireAdmin();

  const name = String(formData.get('name')).trim();
  const slug = normalizeSlug(formData.get('slug'));
  const description = String(formData.get('description') ?? '').trim();
  const showInMenu = formData.get('showInMenu') === 'on';
  const menuOrder = parseInt(String(formData.get('menuOrder') ?? '0'), 10);

  if (!name || !slug) {
    throw new Error('Nome e slug são obrigatórios.');
  }

  try {
    await prisma.section.update({
      where: { id },
      data: {
        name,
        slug,
        description: description || null,
        showInMenu,
        menuOrder: Number.isFinite(menuOrder) ? menuOrder : 0,
      },
    });
    await logAudit("SECTION_UPDATED", `section:${id}`, "OK");
    revalidatePath('/admin/sections');
    revalidatePath('/');
  } catch (error) {
    if (typeof error === 'object' && error && 'code' in error && error.code === 'P2002') {
      throw new Error('Já existe uma editoria com este slug.');
    }

    console.error('updateSection failed:', error);
    throw new Error('Não foi possível atualizar a editoria.');
  }
}

export async function createSection(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get('name')).trim();
  const explicitSlug = normalizeSlug(formData.get('slug'));
  const slug = explicitSlug || normalizeSlug(formData.get('name'));
  const description = String(formData.get('description') ?? '').trim();
  const showInMenu = formData.get('showInMenu') === 'on';
  const menuOrder = parseInt(String(formData.get('menuOrder') ?? '0'));

  if (!name || !slug) {
    throw new Error('Nome e slug são obrigatórios.');
  }

  try {
    await prisma.section.create({
      data: { name, slug, description: description || null, showInMenu, menuOrder },
    });
    await logAudit("SECTION_CREATED", name, "OK");
    revalidatePath('/admin/sections');
    revalidatePath('/');
  } catch (error) {
    if (typeof error === 'object' && error && 'code' in error && error.code === 'P2002') {
      throw new Error('Já existe uma editoria com este slug.');
    }
    throw error;
  }
}

export async function deleteSection(id: string) {
  await requireAdmin();
  // Only delete if no articles are linked
  const count = await prisma.article.count({ where: { sectionId: id } });
  if (count > 0) throw new Error(`Esta editoria tem ${count} matéria(s) vinculada(s). Remova-as primeiro.`);
  
  await prisma.section.delete({ where: { id } });
  await logAudit("SECTION_DELETED", `section:${id}`, "OK");
  revalidatePath('/admin/sections');
  revalidatePath('/');
}
