'use client';

import React from 'react';

type TestState = {
  status: 'idle' | 'loading' | 'success' | 'error';
  message: string;
};

export function MarketSourceTester({ formId }: { formId: string }) {
  const [state, setState] = React.useState<TestState>({ status: 'idle', message: '' });

  async function testSource() {
    const form = document.getElementById(formId);
    if (!(form instanceof HTMLFormElement)) return;

    const data = new FormData(form);
    setState({ status: 'loading', message: 'Testando fonte...' });

    const response = await fetch('/api/admin/market-indicators/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sourceUrl: data.get('sourceUrl'),
        sourcePath: data.get('sourcePath'),
        sourceHeaders: data.get('sourceHeaders'),
        formatDecimals: Number(data.get('formatDecimals') || 2),
        prefix: data.get('prefix'),
        suffix: data.get('suffix'),
      }),
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      setState({ status: 'error', message: result.error || 'Falha ao testar a fonte.' });
      return;
    }

    setState({ status: 'success', message: `Valor retornado: ${result.value}` });
  }

  return (
    <div className="flex items-center gap-3">
      <button type="button" onClick={testSource} className="vp-btn px-4 py-2 text-[11px]" disabled={state.status === 'loading'}>
        Testar fonte
      </button>
      {state.message && (
        <span className={`text-[11px] ${state.status === 'error' ? 'text-vp-urgent' : 'text-vp-text-3'}`}>
          {state.message}
        </span>
      )}
    </div>
  );
}
