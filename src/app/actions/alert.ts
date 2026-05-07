'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth-guard';
import { AlertType } from '@prisma/client';

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
  await requireAdmin();
  
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

  await logAudit("ALERT_SAVED", data.message, "OK");
  revalidatePath('/');
  revalidatePath('/admin/alerts');
  return alert;
}

export async function toggleAlert(id: string, currentStatus: boolean) {
  await requireAdmin();
  
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

  await logAudit(`ALERT_TOGGLED → ${!currentStatus}`, `alert:${id}`, "OK");
  revalidatePath('/');
  revalidatePath('/admin/alerts');
}

export async function deleteAlert(id: string) {
  await requireAdmin();
  await prisma.alert.delete({ where: { id } });
  await logAudit("ALERT_DELETED", `alert:${id}`, "OK");
  revalidatePath('/');
  revalidatePath('/admin/alerts');
}
