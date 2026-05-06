import React from 'react';
import { ArticleEditor } from '@/components/admin/ArticleEditor';
import prisma from '@/lib/prisma';
import { Role } from '@prisma/client';
import { notFound } from 'next/navigation';

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const article = await prisma.article.findUnique({
    where: { id },
    include: { authors: true }
  });

  if (!article) notFound();

  const sections = await prisma.section.findMany({ orderBy: { name: 'asc' } });
  const users = await prisma.user.findMany({ 
    where: { role: { not: Role.READER } },
    orderBy: { name: 'asc' } 
  });

  return (
    <div className="max-w-[1200px]">
      <div className="mb-8">
        <h1 className="text-[28px] font-semibold mb-1">Editar Matéria</h1>
        <div className="text-vp-text-3 text-[14px]">Alterando: <span className="text-vp-text italic">{article.title}</span></div>
      </div>

      <ArticleEditor article={article} sections={sections} users={users} />
    </div>
  );
}
