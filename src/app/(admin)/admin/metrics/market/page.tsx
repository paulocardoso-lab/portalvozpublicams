import React from 'react';
import { prisma } from '@/lib/prisma';
import { updateMarketIndicator } from './actions';

export const dynamic = 'force-dynamic';

export default async function AdminMarketMetricsPage() {
  const indicators = await prisma.marketIndicator.findMany();
  
  const dataMap = indicators.reduce((acc, curr) => {
    acc[curr.key] = curr;
    return acc;
  }, {} as Record<string, any>);

  const keys = [
    { id: 'usd', label: 'Dólar Comercial', defaultUnit: 'R$' },
    { id: 'boi', label: 'Arroba do Boi (CEPEA)', defaultUnit: 'R$/@' },
    { id: 'soja', label: 'Saca da Soja (60kg)', defaultUnit: 'R$/sc' },
  ];

  return (
    <div className="max-w-[800px]">
      <div className="mb-8">
        <h1 className="text-[26px] font-semibold mb-1">Indicadores de Mercado</h1>
        <p className="text-vp-text-3 text-[13px]">
          Valores exibidos no ticker do cabeçalho. O sistema atualiza Boi e Soja automaticamente às 18h, mas você pode sobrescrever aqui.
        </p>
      </div>

      <div className="grid gap-6">
        {keys.map((k) => {
          const item = dataMap[k.id];
          return (
            <div key={k.id} className="bg-[#141413] border border-vp-border p-6 rounded-[4px]">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-[15px] font-bold text-vp-text">{k.label}</h3>
                  <div className="text-[11px] text-vp-text-3 uppercase mt-0.5">Identificador: {k.id}</div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-vp-text-3 uppercase mb-1">Última atualização</div>
                  <div className="text-[12px] font-mono">
                    {item?.updatedAt ? new Date(item.updatedAt).toLocaleString('pt-BR') : 'Nunca'}
                  </div>
                </div>
              </div>

              <form action={updateMarketIndicator} className="grid grid-cols-[1fr_120px_auto] gap-4 items-end">
                <input type="hidden" name="key" value={k.id} />
                <div>
                  <label className="block text-[11px] text-vp-text-3 uppercase font-bold mb-1.5">Valor Atual</label>
                  <input 
                    name="value" 
                    defaultValue={item?.value || ''} 
                    placeholder="Ex: 352,40"
                    className="vp-input text-[18px] font-mono py-2"
                    required 
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-vp-text-3 uppercase font-bold mb-1.5">Unidade</label>
                  <input 
                    name="unit" 
                    defaultValue={item?.unit || k.defaultUnit} 
                    className="vp-input text-[13px]"
                    required 
                  />
                </div>
                <button type="submit" className="vp-btn vp-btn-primary px-6 py-2.5">
                  Atualizar
                </button>
              </form>
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-4 border border-vp-accent/20 bg-vp-accent/5 rounded-[4px]">
        <h4 className="text-[12px] font-bold text-vp-accent uppercase mb-2">Nota sobre Automação</h4>
        <p className="text-[12px] text-vp-text-2 leading-relaxed">
          Os dados de <strong>Boi</strong> e <strong>Soja</strong> são coletados do site Notícias Agrícolas via Cron Job no Vercel. 
          O <strong>Dólar</strong> é atualizado a cada hora via AwesomeAPI. 
          Alterações manuais nesta página serão mantidas até que a próxima rotina automática de atualização seja executada.
        </p>
      </div>
    </div>
  );
}
