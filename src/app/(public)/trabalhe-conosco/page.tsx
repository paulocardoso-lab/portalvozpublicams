import type { Metadata } from 'next';
import { getSiteSettings } from '@/app/actions/settings';

export const metadata: Metadata = {
  title: 'Trabalhe conosco — Voz Pública MS',
  description: 'Faça parte da equipe do Voz Pública MS.',
};

export const dynamic = 'force-dynamic';

const VALUES = [
  { title: 'Rigor antes de velocidade', desc: 'Preferimos ser os segundos a publicar a verdade do que os primeiros a publicar um erro.' },
  { title: 'Autonomia editorial real', desc: 'Repórteres escolhem ângulos e fontes sem pressão comercial ou política.' },
  { title: 'Colaboração aberta', desc: 'Discutimos pautas coletivamente. Hierarquia existe, mas a melhor ideia vence independente de onde vem.' },
  { title: 'Transparência interna', desc: 'Compartilhamos métricas, decisões e erros com toda a equipe. Sem agenda oculta.' },
];

export default async function TrabalheConoscoPage() {
  const s = await getSiteSettings();
  const v = (key: string, fb: string) => (s[key] as string | undefined)?.trim() || fb;

  const emailRedacao = v('institucional.email_redacao', 'redacao@vozpublicams.com.br');

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <span className="text-[11px] font-bold uppercase tracking-widest text-vp-accent">Institucional</span>
      <h1 className="font-display text-[32px] sm:text-[42px] font-black leading-[1.05] tracking-tight mt-2 mb-6">
        Trabalhe conosco
      </h1>

      <div className="font-serif text-[16px] sm:text-[17px] leading-relaxed text-vp-text-2 space-y-5">
        <p>{v('institucional.trabalhe_intro', 'O Voz Pública MS é construído por pessoas que acreditam que jornalismo independente ainda é possível — e necessário.')}</p>

        <h2 className="font-display text-[22px] font-black text-vp-text mt-8 mb-4">Nossa cultura</h2>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 my-6">
        {VALUES.map((val) => (
          <div key={val.title} className="border border-vp-border p-4 bg-vp-surface/30">
            <p className="font-sans font-bold text-[13px] text-vp-text mb-1">{val.title}</p>
            <p className="font-serif text-[14px] text-vp-text-2 leading-relaxed">{val.desc}</p>
          </div>
        ))}
      </div>

      <div className="font-serif text-[16px] sm:text-[17px] leading-relaxed text-vp-text-2 space-y-5">
        <h2 className="font-display text-[22px] font-black text-vp-text mt-4 mb-3">O que buscamos</h2>
        <p>{v('institucional.trabalhe_perfil', 'Valorizamos mais a curiosidade, o comprometimento com a verdade e a capacidade de apuração do que diplomas ou experiência em grandes veículos.')}</p>

        <h2 className="font-display text-[22px] font-black text-vp-text mt-8 mb-3">Remuneração</h2>
        <p>{v('institucional.trabalhe_remuneracao', 'Trabalhamos com regime de colaboração (PJ) e, à medida que crescemos, expandimos a equipe fixa.')}</p>

        <h2 className="font-display text-[22px] font-black text-vp-text mt-8 mb-3">Como se candidatar</h2>
        <p>{v('institucional.trabalhe_candidatura', 'Envie um e-mail com o assunto "Quero fazer parte". Inclua uma apresentação curta e links para trabalhos publicados.')}</p>
        <p>
          <a href={`mailto:${emailRedacao}`} className="text-vp-accent font-bold hover:text-vp-accent-hover transition-colors font-sans">
            {emailRedacao} →
          </a>
        </p>
      </div>
    </main>
  );
}
