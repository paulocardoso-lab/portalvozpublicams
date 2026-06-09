import type { Metadata } from 'next';
import { getSiteSettings } from '@/app/actions/settings';

export const metadata: Metadata = {
  title: 'Política de correções — Voz Pública MS',
  description: 'Como o Voz Pública MS identifica, corrige e comunica erros em suas publicações.',
};

export const dynamic = 'force-dynamic';

export default async function PoliticaDeCorrecoesPage() {
  const s = await getSiteSettings();
  const intro = (s['institucional.correcoes_intro'] as string | undefined)?.trim()
    || 'Errar é inevitável. Esconder o erro não é tolerável. Esta política define como o Voz Pública MS reconhece, corrige e comunica falhas em suas publicações.';

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <span className="text-[11px] font-bold uppercase tracking-widest text-vp-accent">Institucional</span>
      <h1 className="font-display text-[32px] sm:text-[42px] font-black leading-[1.05] tracking-tight mt-2 mb-6">
        Política de correções
      </h1>

      <div className="font-serif text-[16px] sm:text-[17px] leading-relaxed text-vp-text-2 space-y-5">
        <p>{intro}</p>

        <h2 className="font-display text-[22px] font-black text-vp-text mt-8 mb-3">Como identificamos erros</h2>
        <p>Erros podem ser identificados pela própria equipe durante a revisão pós-publicação, por leitores que nos contactam, por fontes ou personagens das reportagens, ou por parceiros que apontam inconsistências.</p>

        <h2 className="font-display text-[22px] font-black text-vp-text mt-8 mb-3">O que fazemos ao confirmar um erro</h2>
        <ul className="list-none space-y-3 mt-2">
          {[
            'Corrigimos o texto imediatamente, sem remover a versão original.',
            'Inserimos uma nota de correção visível no início ou final do texto, indicando o que estava errado, o que foi corrigido e a data da correção.',
            'Não deletamos nem substituímos textos silenciosamente para apagar o equívoco.',
            'Em casos de imprecisão grave ou dano à reputação de uma pessoa, entramos em contato direto com o afetado.',
          ].map((item, i) => (
            <li key={i} className="flex gap-3">
              <span className="text-vp-accent font-black mt-0.5">—</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <h2 className="font-display text-[22px] font-black text-vp-text mt-8 mb-3">Tipos de correção</h2>
        <div className="space-y-4">
          {[
            { color: 'border-vp-accent', label: 'Correção factual', desc: 'Um dado, nome, data ou número estava errado e foi corrigido. A nota especifica o erro e a correção.' },
            { color: 'border-vp-border', label: 'Atualização', desc: 'A informação estava correta quando publicada, mas os fatos mudaram. O texto é atualizado com nota explicando a evolução.' },
            { color: 'border-vp-border', label: 'Esclarecimento', desc: 'A informação estava correta, mas a redação causou ambiguidade. O texto é reescrito com nota explicativa.' },
            { color: 'border-yellow-400/60', label: 'Remoção de conteúdo', desc: 'Em casos excepcionais, conteúdo pode ser removido. Mantemos registro público da remoção e seu motivo.' },
          ].map(({ color, label, desc }) => (
            <div key={label} className={`border-l-2 ${color} pl-4`}>
              <p className="font-sans font-bold text-vp-text text-[14px]">{label}</p>
              <p className="mt-1">{desc}</p>
            </div>
          ))}
        </div>

        <h2 className="font-display text-[22px] font-black text-vp-text mt-8 mb-3">Como solicitar uma correção</h2>
        <p>Encontrou um erro? Envie-nos uma mensagem pelo formulário de contato descrevendo o problema, o texto em questão e, se possível, a fonte que comprova a correção. Analisamos todas as solicitações em até 48 horas úteis.</p>
      </div>

      <div className="mt-12 flex flex-col sm:flex-row gap-3">
        <a href="/contato" className="vp-btn vp-btn-primary text-[12px] font-bold px-6 py-3 text-center">
          Solicitar uma correção →
        </a>
        <a href="/principios-editoriais" className="vp-btn text-[12px] font-bold px-6 py-3 text-center">
          Princípios editoriais
        </a>
      </div>
    </main>
  );
}
