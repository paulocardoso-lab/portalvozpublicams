'use server';

import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-guard';
import { revalidatePath } from 'next/cache';

export async function getEvents() {
  await requireAdmin();
  return prisma.agendaEvent.findMany({
    orderBy: { time: 'asc' }
  });
}

export async function createEvent(formData: FormData) {
  await requireAdmin();
  
  await prisma.agendaEvent.create({
    data: {
      time: String(formData.get('time')),
      organ: String(formData.get('organ')),
      description: String(formData.get('description')),
      status: 'CONFIRMED'
    }
  });

  revalidatePath('/admin/agenda');
  revalidatePath('/');
}

export async function deleteEvent(id: string) {
  await requireAdmin();
  await prisma.agendaEvent.delete({ where: { id } });
  revalidatePath('/admin/agenda');
  revalidatePath('/');
}

export async function toggleEventStatus(id: string, currentStatus: string) {
  await requireAdmin();
  await prisma.agendaEvent.update({
    where: { id },
    data: { status: currentStatus === 'CONFIRMED' ? 'CANCELLED' : 'CONFIRMED' }
  });
  revalidatePath('/admin/agenda');
  revalidatePath('/');
}
