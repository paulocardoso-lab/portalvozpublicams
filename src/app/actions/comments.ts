'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const commentSchema = z.object({
  articleId: z.string(),
  body: z.string().min(3, 'Comentário muito curto').max(1000, 'Comentário muito longo'),
  guestName: z.string().min(2, 'Nome muito curto').optional(),
});

export async function submitComment(formData: FormData) {
  const session = await auth();
  
  const articleId = formData.get('articleId') as string;
  const body = formData.get('body') as string;
  const guestName = formData.get('guestName') as string;

  const validated = commentSchema.safeParse({ articleId, body, guestName });
  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  try {
    await prisma.comment.create({
      data: {
        articleId: articleId,
        body: body,
        userId: session?.user?.id || null,
        guestName: session?.user?.id ? null : (guestName || 'Anônimo'),
        status: 'PENDING', // Todos os comentários começam como pendentes para moderação
      },
    });

    revalidatePath(`/${articleId}`); // Limpar cache da página da matéria
    
    return { 
      success: true, 
      message: 'Comentário enviado! Ele aparecerá após ser aprovado por nossa equipe.' 
    };
  } catch (error) {
    console.error('Comment error:', error);
    return { error: 'Ocorreu um erro ao enviar seu comentário.' };
  }
}
