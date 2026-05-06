import React from 'react';
import { ArticleEditor } from '@/components/admin/ArticleEditor';
import prisma from '@/lib/prisma';
import { Role } from '@prisma/client';

export default async function NewPostPage() {
  const sections = await prisma.section.findMany({ orderBy: { name: 'asc' } });
  const users = await prisma.user.findMany({ 
    where: { role: { not: Role.READER } },
    orderBy: { name: 'asc' } 
  });

  return (
    <div className="max-w-[1200px]">
      <div className="mb-8">
        <h1 className="text-[28px] font-semibold mb-1">Nova Matéria</h1>
        <div className="text-vp-text-3 text-[14px]">Preencha os campos abaixo para criar uma nova história.</div>
      </div>

      <ArticleEditor sections={sections} users={users} />
    </div>
  );
}
