import React from 'react';
import { getAlerts } from '@/app/actions/alert';
import { AlertsClient } from './AlertsClient';

export default async function AlertsPage() {
  const alerts = await getAlerts();

  return (
    <div className="p-7 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-[28px] mb-2">Faixa Ao Vivo & Alertas</h1>
          <p className="font-serif text-vp-text-2 text-[14px]">
            Gerencie a faixa de avisos urgentes no topo da página inicial. Apenas um alerta pode estar ativo por vez.
          </p>
        </div>
      </div>

      <AlertsClient initialAlerts={alerts} />
    </div>
  );
}
