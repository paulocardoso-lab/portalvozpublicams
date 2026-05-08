import React from 'react';
import { prisma } from '@/lib/prisma';
import { getSiteSettings } from '@/app/actions/settings';
import { AppearanceClient } from './AppearanceClient';

export default async function AdminAppearancePage() {
  const settings = await getSiteSettings();
  const seriesList = await prisma.series.findMany({
    orderBy: { id: 'desc' }
  });
  
  return (
    <div className="max-w-5xl p-7 mx-auto">
      <h1 className="font-display text-[28px] mb-2">Aparência & Configurações</h1>
      <p className="text-vp-text-2 text-[14px] mb-8 font-serif">
        Gerencie a série em destaque na Home e outras configurações globais.
      </p>

      <AppearanceClient initialSettings={settings} seriesList={seriesList} />
    </div>
  );
}
