'use server';

import { prisma } from '@/lib/prisma';

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
