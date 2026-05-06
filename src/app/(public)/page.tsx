import React from 'react';
import { MobileHome } from '@/components/home/MobileHome';
import { DesktopHome } from '@/components/home/DesktopHome';

import prisma from '@/lib/prisma';

export default async function Home() {
  // Buscar matérias recentes para a Home
  const articles = await prisma.article.findMany({
    where: { status: 'PUBLISHED' },
    include: { 
      authors: true,
      section: true,
    },
    orderBy: { publishedAt: 'desc' },
    take: 12
  });

  return (
    <>
      <div className="md:hidden">
        <MobileHome articles={articles} />
      </div>
      <div className="hidden md:block">
        <DesktopHome articles={articles} />
      </div>
    </>
  );
}
