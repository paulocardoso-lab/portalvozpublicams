'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { AlertType } from '@prisma/client';

export async function getAlerts() {
  return prisma.alert.findMany({
    orderBy: { createdAt: 'desc' }
  });
}

export async function saveAlert(data: {
  id?: string;
  message: string;
  link?: string;
  type: AlertType;
  isActive: boolean;
}) {
  // Se for definido como ativo, desativa os outros
  if (data.isActive) {
    await prisma.alert.updateMany({
      where: { isActive: true },
      data: { isActive: false }
    });
  }

  let alert;
  if (data.id) {
    alert = await prisma.alert.update({
      where: { id: data.id },
      data: {
        message: data.message,
        link: data.link || null,
        type: data.type,
        isActive: data.isActive
      }
    });
  } else {
    alert = await prisma.alert.create({
      data: {
        message: data.message,
        link: data.link || null,
        type: data.type,
        isActive: data.isActive
      }
    });
  }

  revalidatePath('/');
  revalidatePath('/admin/alerts');
  return alert;
}

export async function toggleAlert(id: string, currentStatus: boolean) {
  // Se estamos ativando, precisamos desativar os outros primeiro
  if (!currentStatus) {
    await prisma.alert.updateMany({
      where: { isActive: true },
      data: { isActive: false }
    });
  }

  await prisma.alert.update({
    where: { id },
    data: { isActive: !currentStatus }
  });

  revalidatePath('/');
  revalidatePath('/admin/alerts');
}

export async function deleteAlert(id: string) {
  await prisma.alert.delete({ where: { id } });
  revalidatePath('/');
  revalidatePath('/admin/alerts');
}
