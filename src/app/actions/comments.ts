'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { rateLimitAction } from '@/lib/rate-limit';
import { isSpam, censorProfanity } from '@/lib/admin/moderation';

const commentSchema = z.object({
  articleId: z.string(),
  body: z.string().min(3, 'Comentário muito curto').max(1000, 'Comentário muito longo'),
  guestName: z.string().min(2, 'Nome muito curto').optional(),
});

export async function submitComment(formData: FormData) {
  const limit = await rateLimitAction({ key: 'comment', limit: 5, windowMs: 10 * 60 * 1000 });
  if (limit.limited) {
    return { error: 'Muitas tentativas. Aguarde alguns minutos antes de comentar novamente.' };
  }

  const session = await auth();

  const articleId = formData.get('articleId') as string;
  const body = formData.get('body') as string;
  const guestName = formData.get('guestName') as string;

  const validated = commentSchema.safeParse({ articleId, body, guestName });
  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  // Verificar se a matéria existe e aceita comentários
  const article = await prisma.article.findUnique({
    where: { id: articleId },
    select: { slug: true, allowComments: true },
  });

  if (!article) return { error: 'Matéria não encontrada.' };
  if (!article.allowComments) return { error: 'Esta matéria não aceita comentários.' };

  // Filtro de spam automático
  const spamCheck = isSpam(body);
  if (spamCheck.spam) {
    // Cria como SPAM silenciosamente — não expõe o motivo ao usuário
    try {
      await prisma.comment.create({
        data: {
          articleId,
          body,
          userId: session?.user?.id ?? null,
          guestName: session?.user?.id ? null : (guestName || 'Anônimo'),
          status: 'SPAM',
          flagReason: spamCheck.reason,
          flags: 1,
        },
      });
    } catch { /* silencioso */ }
    // Retorna sucesso falso para não encorajar bots
    return { success: true, message: 'Comentário enviado! Ele aparecerá após ser aprovado por nossa equipe.' };
  }

  // Censura de palavrões antes de salvar
  const cleanBody = censorProfanity(body);

  try {
    await prisma.comment.create({
      data: {
        articleId,
        body: cleanBody,
        userId: session?.user?.id ?? null,
        guestName: session?.user?.id ? null : (guestName || 'Anônimo'),
        status: 'PENDING',
      },
    });

    revalidatePath(`/materia/${article.slug}`);

    return {
      success: true,
      message: 'Comentário enviado! Ele aparecerá após ser aprovado por nossa equipe.',
    };
  } catch (error) {
    console.error('Comment error:', error);
    return { error: 'Ocorreu um erro ao enviar seu comentário.' };
  }
}
