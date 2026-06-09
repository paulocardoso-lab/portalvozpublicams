'use server';

import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-guard';
import { revalidatePath } from 'next/cache';

export async function updatePostMeta(
  articleId: string,
  data: { sectionId?: string; authorId?: string }
): Promise<{ error?: string }> {
  try {
    await requireAdmin();

    if (data.sectionId) {
      await prisma.article.update({
        where: { id: articleId },
        data: { sectionId: data.sectionId },
      });
    }

    if (data.authorId) {
      await prisma.article.update({
        where: { id: articleId },
        data: { authors: { set: [{ id: data.authorId }] } },
      });
    }

    revalidatePath('/admin/posts');
    return {};
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Erro ao atualizar.' };
  }
}

export async function incrementArticleView(id: string) {
  try {
    await prisma.article.update({
      where: { id },
      data: { views: { increment: 1 } }
    });
  } catch (error) {
    console.error('Erro ao incrementar visualização:', error);
  }
}
