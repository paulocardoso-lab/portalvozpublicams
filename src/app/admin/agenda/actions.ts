'use server';

import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-guard';
import { revalidatePath } from 'next/cache';

function dayRange(dateStr: string): { gte: Date; lt: Date } {
  const [y, m, d] = dateStr.split('-').map(Number);
  const start = new Date(y, m - 1, d, 0, 0, 0, 0);
  const end   = new Date(y, m - 1, d + 1, 0, 0, 0, 0);
  return { gte: start, lt: end };
}

export async function getEvents() {
  await requireAdmin();
  const today = new Date();
  const range = dayRange(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`);
  return prisma.agendaEvent.findMany({
    where: { date: range },
    orderBy: { time: 'asc' },
  });
}

export async function getEventsByDate(dateStr: string) {
  await requireAdmin();
  return prisma.agendaEvent.findMany({
    where: { date: dayRange(dateStr) },
    orderBy: { time: 'asc' },
  });
}

export async function createEvent(formData: FormData) {
  await requireAdmin();

  const dateStr = String(formData.get('date') || '');
  const [y, m, d] = dateStr ? dateStr.split('-').map(Number) : [0, 0, 0];
  const eventDate = dateStr
    ? new Date(y, m - 1, d, 12, 0, 0, 0)
    : new Date();

  await prisma.agendaEvent.create({
    data: {
      time:        String(formData.get('time')),
      organ:       String(formData.get('organ')),
      description: String(formData.get('description')),
      status:      'CONFIRMED',
      date:        eventDate,
    },
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
    data: { status: currentStatus === 'CONFIRMED' ? 'CANCELLED' : 'CONFIRMED' },
  });
  revalidatePath('/admin/agenda');
  revalidatePath('/');
}
