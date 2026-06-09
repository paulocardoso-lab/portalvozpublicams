import type { Metadata } from 'next';
import { getSiteSettings } from '@/app/actions/settings';

export const metadata: Metadata = {
  title: 'Princípios editoriais — Voz Pública MS',
  description: 'Os valores, critérios e compromissos que guiam o trabalho jornalístico do Voz Pública MS.',
};

export const dynamic = 'force-dynamic';

const PRINCIPIOS = [
  { n: 1, title: 'Independência editorial absoluta', body: 'Nenhum anunciante, financiador, partido político ou figura pública tem poder sobre nossas pautas, manchetes ou abordagens. A linha editorial é definida exclusivamente pela equipe jornalística, com base no interesse público.' },
  { n: 2, title: 'Precisão e verificação', body: 'Toda informação publicada passa por verificação de fontes independentes antes de ir ao ar. Não publicamos boatos, rumores ou versões não confirmadas como fato.' },
  { n: 3, title: 'Pluralidade de vozes', body: 'Buscamos ativamente ouvir todos os lados relevantes de uma história. Personagens afetados por reportagens investigativas têm direito de resposta garantido antes da publicação.' },
  { n: 4, title: 'Transparência sobre métodos', body: 'Explicamos como apuramos nossas reportagens, de onde vêm nossos dados e quais foram nossas tentativas de ouvir as partes.' },
  { n: 5, title: 'Responsabilidade sobre o impacto', body: 'Consideramos as consequências humanas das nossas publicações sem, com isso, deixar de publicar o que é de interesse público. A proteção de fontes é inegociável.' },
  { n: 6, title: 'Separação entre opinião e reportagem', body: 'Textos opinativos, colunas e análises são claramente identificados como tal e não se confundem com reportagem factual.' },
  { n: 7, title: 'Correção ativa de erros', body: 'Erros são corrigidos com nota visível no texto, identificando o que estava errado e o que foi corrigido. Não deletamos textos para esconder equívocos.' },
  { n: 8, title: 'Proteção de fontes', body: 'A identidade de fontes que nos procuram em condição de anonimato é protegida com todos os recursos técnicos e legais disponíveis.' },
];

export default async function PrincipiosEditoriaisPage() {
  const s = await getSiteSettings();
  const intro = (s['institucional.principios_intro'] as string | undefined)?.trim()
    || 'O jornalismo do Voz Pública MS é orientado por princípios que não negociamos, independentemente de quem esteja no poder ou de qual seja o custo comercial da publicação.';

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <span className="text-[11px] font-bold uppercase tracking-widest text-vp-accent">Institucional</span>
      <h1 className="font-display text-[32px] sm:text-[42px] font-black leading-[1.05] tracking-tight mt-2 mb-6">
        Princípios editoriais
      </h1>

      <div className="font-serif text-[16px] sm:text-[17px] leading-relaxed text-vp-text-2 space-y-5">
        <p>{intro}</p>
        {PRINCIPIOS.map(({ n, title, body }) => (
          <div key={n}>
            <h2 className="font-display text-[22px] font-black text-vp-text mt-8 mb-3">{n}. {title}</h2>
            <p>{body}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-col sm:flex-row gap-3">
        <a href="/politica-de-correcoes" className="vp-btn vp-btn-primary text-[12px] font-bold px-6 py-3 text-center">
          Política de correções →
        </a>
        <a href="/quem-somos" className="vp-btn text-[12px] font-bold px-6 py-3 text-center">
          Quem somos
        </a>
      </div>
    </main>
  );
}
