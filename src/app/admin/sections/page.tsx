import React from 'react';
import { prisma } from '@/lib/prisma';
import SectionsClient from './SectionsClient';

export default async function AdminSectionsPage() {
  const sections = await prisma.section.findMany({
    orderBy: [
      { showInMenu: 'desc' },
      { menuOrder: 'asc' },
      { name: 'asc' }
    ]
  });

  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold">Gestão de Editorias</h1>
        <p className="text-gray-400">Gerencie as categorias e defina quais aparecem no menu principal.</p>
      </header>

      <SectionsClient initialSections={sections} />
    </div>
  );
}
