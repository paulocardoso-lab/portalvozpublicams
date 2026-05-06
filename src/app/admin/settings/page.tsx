import React from 'react';

export default function AdminSettingsPage() {
  const tabs = ['Geral','Domínio & DNS','E-mails','Integrações (APIs)','Comentários — regras','Moderação automática','Privacidade & LGPD','Backup','Faturamento','Zona de perigo'];

  return (
    <div className="max-w-[1000px]">
      <h1 className="text-[22px] font-semibold mb-1">Configurações gerais</h1>
      <p className="text-vp-text-3 text-[13px] mb-5">Identidade do veículo, domínio, políticas, integrações e backup</p>

      <div className="grid md:grid-cols-[200px_1fr] gap-5 items-start">
        <nav className="grid gap-0.5 sticky top-[80px]">
          {tabs.map((n, i) => (
            <a key={n} className={`px-3 py-2 text-[12px] cursor-pointer border-l-2 ${i === 0 ? 'text-vp-text border-vp-accent bg-vp-surface-2' : 'text-vp-text-2 border-transparent bg-transparent hover:text-vp-text hover:bg-vp-surface'}`}>
              {n}
            </a>
          ))}
        </nav>

        <div className="grid gap-4">
          {/* Identidade */}
          <div className="bg-[#141413] border border-vp-border p-4.5 rounded-[4px]">
            <h3 className="text-[13px] font-semibold mb-3.5">Identidade do veículo</h3>
            <div className="grid gap-3 text-[12px]">
              <label>Nome<input className="vp-input mt-1 w-full" defaultValue="Voz Pública MS" /></label>
              <label>Razão social<input className="vp-input mt-1 w-full" defaultValue="Voz Pública Comunicação Ltda." /></label>
              <label>CNPJ<input className="vp-input mt-1 w-full font-mono" defaultValue="00.000.000/0001-00" /></label>
              <div className="grid grid-cols-2 gap-2.5">
                <label>E-mail redação<input className="vp-input mt-1 w-full" defaultValue="redacao@vozpublicams.com.br" /></label>
                <label>E-mail contato<input className="vp-input mt-1 w-full" defaultValue="contato@vozpublicams.com.br" /></label>
              </div>
              <label>Endereço<input className="vp-input mt-1 w-full" defaultValue="Rua 14 de Julho, 1.234 — Centro — Campo Grande/MS — CEP 79002-333" /></label>
            </div>
          </div>

          {/* Domínio */}
          <div className="bg-[#141413] border border-vp-border p-4.5 rounded-[4px]">
            <h3 className="text-[13px] font-semibold mb-3.5">Domínio & SSL</h3>
            <div className="flex justify-between items-center p-3 bg-vp-bg border border-vp-border font-mono text-[13px]">
              <span>vozpublicams.com.br</span>
              <span className="vp-tag bg-vp-ok text-[#1a1a19] border-transparent font-sans px-2">● SSL ATIVO · expira em 78d</span>
            </div>
            <div className="text-[11px] text-vp-text-3 mt-2.5">Certificado renovado automaticamente via Let&apos;s Encrypt. CDN: Cloudflare.</div>
          </div>

          {/* Integrações */}
          <div className="bg-[#141413] border border-vp-border p-4.5 rounded-[4px]">
            <h3 className="text-[13px] font-semibold mb-3.5">Integrações</h3>
            <div className="grid gap-[1px] bg-vp-border border border-vp-border">
              {[
                ['Google Analytics 4', 'G-XXXXXXX', 'conectado'],
                ['Google AdSense', 'ca-pub-…', 'conectado'],
                ['Mailchimp / Newsletter', 'api_…2f7a', 'conectado'],
                ['Stripe / Doações', 'sk_live_…', 'conectado'],
                ['Meta Business Suite', '—', 'conectar'],
                ['OpenAI (resumo + título sugerido)', 'sk-…', 'conectado'],
                ['Cloudflare Turnstile (antispam)', '0x4AAAA…', 'conectado'],
              ].map(([n, k, s], i) => (
                <div key={i} className="bg-vp-surface p-3 grid grid-cols-[1fr_1fr_auto] gap-2.5 items-center text-[12px]">
                  <span className="font-semibold">{String(n)}</span>
                  <span className="font-mono text-vp-text-3 truncate">{String(k)}</span>
                  <button className={`vp-btn text-[11px] py-1 px-2.5 ${s === 'conectado' ? 'text-vp-ok border-vp-ok hover:bg-vp-ok hover:text-[#1a1a19]' : 'text-vp-accent border-vp-accent hover:bg-vp-accent hover:text-white'}`}>
                    {s === 'conectado' ? '● conectado' : 'conectar →'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* LGPD */}
          <div className="bg-[#141413] border border-vp-border p-4.5 rounded-[4px]">
            <h3 className="text-[13px] font-semibold mb-3.5">Privacidade & LGPD</h3>
            {[
              ['Banner de consentimento de cookies', true],
              ['Permitir solicitação de exclusão de dados por leitores', true],
              ['Enviar relatório mensal de dados para DPO', true],
              ['Anonimizar IPs no analytics', true],
            ].map(([l, v], i) => (
              <label key={i} className={`flex justify-between items-center py-2.5 text-[13px] ${i < 3 ? 'border-b border-vp-border' : ''} cursor-pointer`}>
                <span>{String(l)}</span>
                <span className={`inline-block w-7 h-4 rounded-full relative transition-colors shrink-0 ${v ? 'bg-vp-accent' : 'bg-vp-border-2'}`}>
                  <span className={`absolute top-[2px] w-3 h-3 bg-white rounded-full transition-all ${v ? 'left-[14px]' : 'left-[2px]'}`} />
                </span>
              </label>
            ))}
          </div>

          {/* Zona de perigo */}
          <div className="bg-[#141413] border border-vp-urgent p-4.5 rounded-[4px] mb-8">
            <h3 className="text-[13px] font-semibold mb-1.5 text-vp-urgent">Zona de perigo</h3>
            <p className="text-[12px] text-vp-text-3 mb-3">Ações irreversíveis. Exigem senha do super admin.</p>
            <div className="flex flex-wrap gap-2">
              <button className="vp-btn text-[11px] text-vp-urgent border-vp-urgent hover:bg-vp-urgent hover:text-white">Exportar tudo</button>
              <button className="vp-btn text-[11px] text-vp-urgent border-vp-urgent hover:bg-vp-urgent hover:text-white">Transferir propriedade</button>
              <button className="vp-btn text-[11px] text-vp-urgent border-vp-urgent hover:bg-vp-urgent hover:text-white">Desativar site</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
