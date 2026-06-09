'use client';

import { useState, useTransition } from 'react';
import { saveBatchSettings } from '@/app/actions/settings';

type Tab = 'quem-somos' | 'principios' | 'correcoes' | 'contato' | 'anuncie' | 'trabalhe';

interface Props {
  // Contatos
  emailContato: string;
  emailPublicidade: string;
  emailRedacao: string;
  emailDenuncia: string;
  // Quem somos
  quemSomosIntro: string;
  quemSomosMissao: string;
  quemSomosFinanciamento: string;
  quemSomosTransparencia: string;
  quemSomosEquipe: string;
  // Princípios
  principiosIntro: string;
  // Política de correções
  correcoesIntro: string;
  // Anuncie
  anuncieIntro: string;
  anuncieCompromisso: string;
  // Trabalhe conosco
  trabalheIntro: string;
  trabalhePerfil: string;
  trabalheRemuneracao: string;
  trabalheCandidatura: string;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-vp-surface border border-vp-border p-5 flex flex-col gap-4">
      <h3 className="text-[12px] font-bold uppercase tracking-wider text-vp-text-3">{title}</h3>
      {children}
    </section>
  );
}

function Field({
  label, hint, value, onChange, rows = 4,
}: {
  label: string; hint?: string; value: string; onChange: (v: string) => void; rows?: number;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-bold uppercase tracking-wider text-vp-text-3">{label}</span>
      <textarea
        rows={rows}
        className="vp-input text-[13px] leading-relaxed resize-y"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      {hint && <span className="text-[10px] text-vp-text-4">{hint}</span>}
    </label>
  );
}

function InputField({
  label, hint, value, onChange, type = 'text',
}: {
  label: string; hint?: string; value: string; onChange: (v: string) => void; type?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-bold uppercase tracking-wider text-vp-text-3">{label}</span>
      <input
        type={type}
        className="vp-input text-[13px]"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      {hint && <span className="text-[10px] text-vp-text-4">{hint}</span>}
    </label>
  );
}

const TABS: { id: Tab; label: string }[] = [
  { id: 'contato',     label: 'E-mails & contato' },
  { id: 'quem-somos',  label: 'Quem somos' },
  { id: 'principios',  label: 'Princípios editoriais' },
  { id: 'correcoes',   label: 'Política de correções' },
  { id: 'anuncie',     label: 'Anuncie' },
  { id: 'trabalhe',    label: 'Trabalhe conosco' },
];

export function InstitucionalClient(props: Props) {
  const [tab, setTab] = useState<Tab>('contato');
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Contatos
  const [emailContato, setEmailContato] = useState(props.emailContato);
  const [emailPublicidade, setEmailPublicidade] = useState(props.emailPublicidade);
  const [emailRedacao, setEmailRedacao] = useState(props.emailRedacao);
  const [emailDenuncia, setEmailDenuncia] = useState(props.emailDenuncia);

  // Quem somos
  const [quemSomosIntro, setQuemSomosIntro] = useState(props.quemSomosIntro);
  const [quemSomosMissao, setQuemSomosMissao] = useState(props.quemSomosMissao);
  const [quemSomosFinanciamento, setQuemSomosFinanciamento] = useState(props.quemSomosFinanciamento);
  const [quemSomosTransparencia, setQuemSomosTransparencia] = useState(props.quemSomosTransparencia);
  const [quemSomosEquipe, setQuemSomosEquipe] = useState(props.quemSomosEquipe);

  // Princípios
  const [principiosIntro, setPrincipiosIntro] = useState(props.principiosIntro);

  // Correções
  const [correcoesIntro, setCorrecoesIntro] = useState(props.correcoesIntro);

  // Anuncie
  const [anuncieIntro, setAnuncieIntro] = useState(props.anuncieIntro);
  const [anuncieCompromisso, setAnuncieCompromisso] = useState(props.anuncieCompromisso);

  // Trabalhe
  const [trabalheIntro, setTrabalheIntro] = useState(props.trabalheIntro);
  const [trabalhePerfil, setTrabalhePerfil] = useState(props.trabalhePerfil);
  const [trabalheRemuneracao, setTrabalheRemuneracao] = useState(props.trabalheRemuneracao);
  const [trabalheCandidatura, setTrabalheCandidatura] = useState(props.trabalheCandidatura);

  const handleSave = () => {
    startTransition(async () => {
      await saveBatchSettings({
        'institucional.email_contato':        emailContato.trim(),
        'institucional.email_publicidade':    emailPublicidade.trim(),
        'institucional.email_redacao':        emailRedacao.trim(),
        'institucional.email_denuncia':       emailDenuncia.trim(),
        'institucional.quem_somos_intro':     quemSomosIntro.trim(),
        'institucional.quem_somos_missao':    quemSomosMissao.trim(),
        'institucional.quem_somos_financ':    quemSomosFinanciamento.trim(),
        'institucional.quem_somos_transp':    quemSomosTransparencia.trim(),
        'institucional.quem_somos_equipe':    quemSomosEquipe.trim(),
        'institucional.principios_intro':     principiosIntro.trim(),
        'institucional.correcoes_intro':      correcoesIntro.trim(),
        'institucional.anuncie_intro':        anuncieIntro.trim(),
        'institucional.anuncie_compromisso':  anuncieCompromisso.trim(),
        'institucional.trabalhe_intro':       trabalheIntro.trim(),
        'institucional.trabalhe_perfil':      trabalhePerfil.trim(),
        'institucional.trabalhe_remuneracao': trabalheRemuneracao.trim(),
        'institucional.trabalhe_candidatura': trabalheCandidatura.trim(),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    });
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Tabs */}
      <div className="flex flex-wrap gap-1 border-b border-vp-border pb-3">
        {TABS.map(t => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-colors rounded-sm ${
              tab === t.id
                ? 'bg-vp-accent text-white'
                : 'text-vp-text-3 hover:text-vp-text hover:bg-vp-surface'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab: E-mails & contato */}
      {tab === 'contato' && (
        <Section title="E-mails institucionais">
          <p className="text-[12px] text-vp-text-3 -mt-2">
            Esses endereços aparecem nas páginas públicas e no formulário de contato.
          </p>
          <InputField
            label="E-mail geral de contato"
            hint="Destino das mensagens enviadas pelo formulário /contato"
            value={emailContato}
            onChange={setEmailContato}
            type="email"
          />
          <InputField
            label="E-mail de publicidade"
            hint="Exibido na página /anuncie"
            value={emailPublicidade}
            onChange={setEmailPublicidade}
            type="email"
          />
          <InputField
            label="E-mail da redação"
            hint="Exibido na página /trabalhe-conosco"
            value={emailRedacao}
            onChange={setEmailRedacao}
            type="email"
          />
          <InputField
            label="E-mail de denúncias"
            hint="Exibido no footer e na página /denuncia"
            value={emailDenuncia}
            onChange={setEmailDenuncia}
            type="email"
          />
        </Section>
      )}

      {/* Tab: Quem somos */}
      {tab === 'quem-somos' && (
        <Section title="Quem somos — conteúdo da página">
          <Field label="Parágrafo de introdução" value={quemSomosIntro} onChange={setQuemSomosIntro} rows={4} />
          <Field label="Nossa missão" value={quemSomosMissao} onChange={setQuemSomosMissao} rows={4} />
          <Field label="Como nos sustentamos" value={quemSomosFinanciamento} onChange={setQuemSomosFinanciamento} rows={5} />
          <Field label="Transparência radical" value={quemSomosTransparencia} onChange={setQuemSomosTransparencia} rows={4} />
          <Field label="A equipe" value={quemSomosEquipe} onChange={setQuemSomosEquipe} rows={4} />
        </Section>
      )}

      {/* Tab: Princípios */}
      {tab === 'principios' && (
        <Section title="Princípios editoriais — conteúdo da página">
          <p className="text-[12px] text-vp-text-3 -mt-2">
            O parágrafo de introdução. Os 8 princípios com título e texto são editados diretamente no código — contate o desenvolvedor para alterá-los.
          </p>
          <Field label="Parágrafo de introdução" value={principiosIntro} onChange={setPrincipiosIntro} rows={4} />
        </Section>
      )}

      {/* Tab: Correções */}
      {tab === 'correcoes' && (
        <Section title="Política de correções — conteúdo da página">
          <p className="text-[12px] text-vp-text-3 -mt-2">
            O parágrafo de introdução. Os tipos de correção são estruturados — contate o desenvolvedor para alterá-los.
          </p>
          <Field label="Parágrafo de introdução" value={correcoesIntro} onChange={setCorrecoesIntro} rows={4} />
        </Section>
      )}

      {/* Tab: Anuncie */}
      {tab === 'anuncie' && (
        <Section title="Anuncie — conteúdo da página">
          <Field label="Parágrafo de introdução" value={anuncieIntro} onChange={setAnuncieIntro} rows={5} />
          <Field label="Compromisso com o leitor" value={anuncieCompromisso} onChange={setAnuncieCompromisso} rows={4} hint="Texto sobre o que o portal não aceita como anunciante." />
        </Section>
      )}

      {/* Tab: Trabalhe conosco */}
      {tab === 'trabalhe' && (
        <Section title="Trabalhe conosco — conteúdo da página">
          <Field label="Parágrafo de introdução" value={trabalheIntro} onChange={setTrabalheIntro} rows={4} />
          <Field label="O que buscamos" value={trabalhePerfil} onChange={setTrabalhePerfil} rows={4} />
          <Field label="Sobre remuneração" value={trabalheRemuneracao} onChange={setTrabalheRemuneracao} rows={4} />
          <Field label="Como se candidatar" value={trabalheCandidatura} onChange={setTrabalheCandidatura} rows={4} />
        </Section>
      )}

      {/* Salvar */}
      <div className="flex justify-end gap-3 pt-1">
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="vp-btn vp-btn-primary px-8 py-2.5 text-[13px] font-semibold"
        >
          {isPending ? 'Salvando...' : saved ? '✓ Configurações salvas' : 'Salvar configurações'}
        </button>
      </div>
    </div>
  );
}
