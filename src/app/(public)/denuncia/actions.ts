'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function submitTip(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const content = formData.get('content') as string;
  
  // Nota: Implementar upload de arquivos para o Supabase Storage se necessário
  // Por enquanto, vamos focar no texto da denúncia.
  
  if (!content) {
    return { error: 'O conteúdo da denúncia é obrigatório.' };
  }

  try {
    await prisma.tip.create({
      data: {
        name: name || 'Anônimo',
        email: email || null,
        content,
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
