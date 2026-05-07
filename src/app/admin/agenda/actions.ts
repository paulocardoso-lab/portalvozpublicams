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

export async function saveAgendaEvent(formData: FormData) {
  await requireAdmin();
  const id = formData.get('id') as string;
  const time = formData.get('time') as string;
  const organ = formData.get('organ') as string;
  const description = formData.get('description') as string;
  const status = formData.get('status') as string;

  if (id) {
    await prisma.agendaEvent.update({
      where: { id },
      data: { time, organ, description, status }
    });
  } else {
    await prisma.agendaEvent.create({
      data: { time, organ, description, status }
    });
  }

  await logAudit("AGENDA_EVENT_SAVED", `${organ} - ${time}`, "OK");
  revalidatePath('/admin/agenda');
  revalidatePath('/');
}

export async function deleteAgendaEvent(id: string) {
  await requireAdmin();
  await prisma.agendaEvent.delete({ where: { id } });
  await logAudit("AGENDA_EVENT_DELETED", `agenda:${id}`, "OK");
  revalidatePath('/admin/agenda');
  revalidatePath('/');
}
