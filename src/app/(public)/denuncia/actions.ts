'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { rateLimitAction } from '@/lib/rate-limit';

const tipSchema = z.object({
  name: z.string().trim().max(120).optional(),
  email: z.string().trim().email('E-mail inválido').optional().or(z.literal('')),
  content: z.string().trim().min(10, 'Descreva a denúncia com um pouco mais de detalhe.').max(5000, 'O texto da denúncia está muito longo.'),
});

export async function submitTip(formData: FormData) {
  const limit = await rateLimitAction({ key: 'tip', limit: 3, windowMs: 60 * 60 * 1000 });
  if (limit.limited) {
    return { error: 'Muitas tentativas. Aguarde antes de enviar uma nova denúncia.' };
  }

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const content = formData.get('content') as string;
  
  // Nota: Implementar upload de arquivos para o Supabase Storage se necessário
  // Por enquanto, vamos focar no texto da denúncia.
  
  const validated = tipSchema.safeParse({ name, email, content });
  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  try {
    await prisma.tip.create({
      data: {
        name: validated.data.name || 'Anônimo',
        email: validated.data.email || null,
        content: validated.data.content,
        status: 'NEW',
      },
    });

    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Erro ao enviar denúncia:', error);
    return { error: 'Erro interno ao processar sua denúncia. Tente novamente mais tarde.' };
  }
}
