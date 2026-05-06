'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function saveAgendaEvent(formData: FormData) {
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

  revalidatePath('/admin/agenda');
  revalidatePath('/');
}

export async function deleteAgendaEvent(id: string) {
  await prisma.agendaEvent.delete({ where: { id } });
  revalidatePath('/admin/agenda');
  revalidatePath('/');
}
