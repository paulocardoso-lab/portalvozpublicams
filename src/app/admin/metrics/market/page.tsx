import React from 'react';
import type { MarketIndicator } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { deleteMarketIndicator, saveMarketIndicator } from './actions';
import { MarketSourceTester } from './MarketSourceTester';

export const dynamic = 'force-dynamic';

const defaults = [
  { key: 'usd', label: 'Dólar Comercial', value: '', unit: 'R$', displayOrder: 10, showInHeader: true, showInMobile: true, sourceType: 'SYSTEM' },
  { key: 'boi', label: 'Arroba do Boi', value: '', unit: 'R$/@', displayOrder: 20, showInHeader: true, showInMobile: true, sourceType: 'SYSTEM' },
  { key: 'soja', label: 'Saca da Soja', value: '', unit: 'R$/sc', displayOrder: 30, showInHeader: true, showInMobile: false, sourceType: 'SYSTEM' },
  { key: 'milho', label: 'Saca do Milho', value: '', unit: 'R$/sc', displayOrder: 40, showInHeader: true, showInMobile: false, sourceType: 'SYSTEM' },
];

type EditableIndicator = Partial<MarketIndicator> & {
  key: string;
  value: string;
};

function text(value: unknown) {
  return typeof value === 'string' ? value : '';
}

function IndicatorForm({ indicator, isNew = false }: { indicator: EditableIndicator; isNew?: boolean }) {
  const formId = `market-indicator-${indicator.key}`;
  const sourceType = indicator.sourceType || 'MANUAL';

  return (
    <form id={formId} action={saveMarketIndicator} className="bg-[#141413] border border-vp-border rounded-[4px] p-5 space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-[15px] font-bold text-vp-text">{indicator.label || 'Novo indicador'}</h3>
          <div className="text-[11px] text-vp-text-3 uppercase mt-0.5">Identificador: {indicator.key}</div>
        </div>
        {!isNew && (
          <div className="text-right">
            <div className="text-[11px] text-vp-text-3 uppercase mb-1">Última atualização</div>
            <div className="text-[12px] font-mono">
              {indicator.updatedAt ? new Date(indicator.updatedAt).toLocaleString('pt-BR') : 'Nunca'}
            </div>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-[120px_1fr_140px_120px_90px] gap-3">
        <div>
          <label className="block text-[11px] text-vp-text-3 uppercase font-bold mb-1.5">Chave</label>
          <input name="key" defaultValue={indicator.key} readOnly={!isNew} className="vp-input text-[13px] font-mono" required />
        </div>
        <div>
          <label className="block text-[11px] text-vp-text-3 uppercase font-bold mb-1.5">Nome exibido</label>
          <input name="label" defaultValue={indicator.label || ''} className="vp-input text-[13px]" required />
        </div>
        <div>
          <label className="block text-[11px] text-vp-text-3 uppercase font-bold mb-1.5">Valor</label>
          <input name="value" defaultValue={indicator.value} className="vp-input text-[13px] font-mono" required />
        </div>
        <div>
          <label className="block text-[11px] text-vp-text-3 uppercase font-bold mb-1.5">Unidade</label>
          <input name="unit" defaultValue={indicator.unit || ''} className="vp-input text-[13px]" />
        </div>
        <div>
          <label className="block text-[11px] text-vp-text-3 uppercase font-bold mb-1.5">Ordem</label>
          <input name="displayOrder" type="number" defaultValue={indicator.displayOrder ?? 100} className="vp-input text-[13px] font-mono" />
        </div>
      </div>

      <div className="flex flex-wrap gap-5 text-[12px] text-vp-text-2">
        <label className="inline-flex items-center gap-2">
          <input name="isActive" type="checkbox" defaultChecked={indicator.isActive ?? true} />
          Ativo
        </label>
        <label className="inline-flex items-center gap-2">
          <input name="showInHeader" type="checkbox" defaultChecked={indicator.showInHeader ?? false} />
          Exibir no cabeçalho
        </label>
        <label className="inline-flex items-center gap-2">
          <input name="showInMobile" type="checkbox" defaultChecked={indicator.showInMobile ?? false} />
          Exibir no mobile
        </label>
      </div>

      <div className="border-t border-vp-border pt-5">
        <div className="grid md:grid-cols-[160px_1fr_180px_120px] gap-3 mb-3">
          <div>
            <label className="block text-[11px] text-vp-text-3 uppercase font-bold mb-1.5">Fonte</label>
            <select name="sourceType" defaultValue={sourceType} className="vp-input text-[13px]">
              <option value="MANUAL">Manual</option>
              <option value="SYSTEM">Sistema</option>
              <option value="JSON_API">JSON API</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] text-vp-text-3 uppercase font-bold mb-1.5">URL da API</label>
            <input name="sourceUrl" defaultValue={indicator.sourceUrl || ''} className="vp-input text-[13px]" placeholder="https://api.exemplo.com/cotacao" />
          </div>
          <div>
            <label className="block text-[11px] text-vp-text-3 uppercase font-bold mb-1.5">Caminho JSON</label>
            <input name="sourcePath" defaultValue={indicator.sourcePath || ''} className="vp-input text-[13px] font-mono" placeholder="data[0].valor" />
          </div>
          <div>
            <label className="block text-[11px] text-vp-text-3 uppercase font-bold mb-1.5">Decimais</label>
            <input name="formatDecimals" type="number" min="0" max="6" defaultValue={indicator.formatDecimals ?? 2} className="vp-input text-[13px] font-mono" />
          </div>
        </div>

        <div className="grid md:grid-cols-[1fr_130px_130px_150px] gap-3">
          <div>
            <label className="block text-[11px] text-vp-text-3 uppercase font-bold mb-1.5">Headers JSON</label>
            <textarea
              name="sourceHeaders"
              defaultValue={text(indicator.sourceHeaders)}
              rows={3}
              className="vp-input text-[12px] font-mono"
              placeholder={'{"Authorization":"Bearer ${CLIMAPI_TOKEN}"}'}
            />
          </div>
          <div>
            <label className="block text-[11px] text-vp-text-3 uppercase font-bold mb-1.5">Prefixo</label>
            <input name="prefix" defaultValue={indicator.prefix || ''} className="vp-input text-[13px]" placeholder="R$ " />
          </div>
          <div>
            <label className="block text-[11px] text-vp-text-3 uppercase font-bold mb-1.5">Sufixo</label>
            <input name="suffix" defaultValue={indicator.suffix || ''} className="vp-input text-[13px]" placeholder=" °C" />
          </div>
          <div>
            <label className="block text-[11px] text-vp-text-3 uppercase font-bold mb-1.5">Intervalo min.</label>
            <input name="sourceRefreshMinutes" type="number" min="5" defaultValue={indicator.sourceRefreshMinutes ?? 60} className="vp-input text-[13px] font-mono" />
          </div>
        </div>
      </div>

      {(indicator.lastFetchStatus || indicator.lastFetchError) && (
        <div className="text-[11px] text-vp-text-3">
          Status da fonte: <span className="font-mono">{indicator.lastFetchStatus || 'sem status'}</span>
          {indicator.lastFetchError ? <span className="text-vp-urgent"> · {indicator.lastFetchError}</span> : null}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <MarketSourceTester formId={formId} />
        <div className="flex gap-2">
          {!isNew && (
            <button formAction={deleteMarketIndicator} className="vp-btn px-4 py-2 text-[11px] text-vp-urgent">
              Excluir
            </button>
          )}
          <button type="submit" className="vp-btn vp-btn-primary px-5 py-2 text-[11px]">
            Salvar indicador
          </button>
        </div>
      </div>
    </form>
  );
}

export default async function AdminMarketMetricsPage() {
  const storedIndicators = await prisma.marketIndicator.findMany({
    orderBy: [
      { displayOrder: 'asc' },
      { key: 'asc' },
    ],
  });

  const existingKeys = new Set(storedIndicators.map((item) => item.key));
  const missingDefaults = defaults.filter((item) => !existingKeys.has(item.key));
  const indicators: EditableIndicator[] = [...storedIndicators, ...missingDefaults].sort((a, b) => {
    const orderA = a.displayOrder ?? 100;
    const orderB = b.displayOrder ?? 100;
    return orderA - orderB || a.key.localeCompare(b.key);
  });

  return (
    <div className="max-w-[1100px]">
      <div className="mb-8">
        <h1 className="text-[26px] font-semibold mb-1">Indicadores do Cabeçalho</h1>
        <p className="text-vp-text-3 text-[13px]">
          Cadastre indicadores individualmente, escolha onde aparecem e conecte fontes JSON seguras para atualização automática.
        </p>
      </div>

      <div className="grid gap-5 mb-8">
        {indicators.map((indicator) => (
          <IndicatorForm key={indicator.key} indicator={indicator} />
        ))}
      </div>

      <div className="mb-8">
        <h2 className="text-[18px] font-semibold mb-3">Novo indicador</h2>
        <IndicatorForm
          isNew
          indicator={{
            key: 'novo_indicador',
            label: '',
            value: '',
            unit: '',
            displayOrder: 100,
            isActive: true,
            showInHeader: false,
            showInMobile: false,
            sourceType: 'MANUAL',
            sourceRefreshMinutes: 60,
            formatDecimals: 2,
          }}
        />
      </div>

      <div className="p-4 border border-vp-accent/20 bg-vp-accent/5 rounded-[4px]">
        <h4 className="text-[12px] font-bold text-vp-accent uppercase mb-2">Fontes externas</h4>
        <p className="text-[12px] text-vp-text-2 leading-relaxed">
          Para APIs com token, use headers em JSON e referencie variáveis de ambiente com a sintaxe <span className="font-mono">{'${NOME_DO_TOKEN}'}</span>.
          O sistema atualiza fontes JSON no cron de indicadores e mantém os valores antigos quando uma fonte falha.
        </p>
      </div>
    </div>
  );
}
