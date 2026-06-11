import type { Metadata } from 'next';
import { getSiteSettings } from '@/app/actions/settings';
import { isDonationsEnabled } from '@/lib/donation-config';

export const metadata: Metadata = {
  title: 'Quem somos — Voz Pública MS',
  description: 'Conheça a história, a missão e a equipe do Voz Pública MS.',
};

export const dynamic = 'force-dynamic';

export default async function QuemSomosPage() {
  const [s, donationsEnabled] = await Promise.all([
    getSiteSettings(),
    isDonationsEnabled(),
  ]);
  const v = (key: string, fb: string) => (s[key] as string | undefined)?.trim() || fb;

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <span className="text-[11px] font-bold uppercase tracking-widest text-vp-accent">Institucional</span>
      <h1 className="font-display text-[32px] sm:text-[42px] font-black leading-[1.05] tracking-tight mt-2 mb-6">
        Quem somos
      </h1>

      <div className="font-serif text-[16px] sm:text-[17px] leading-relaxed text-vp-text-2 space-y-5">
        <p>{v('institucional.quem_somos_intro', 'O Voz Pública MS nasceu com uma convicção simples e cada vez mais rara: jornalismo de qualidade só existe quando é livre.')}</p>

        <h2 className="font-display text-[22px] font-black text-vp-text mt-8 mb-3">Nossa missão</h2>
        <p>{v('institucional.quem_somos_missao', 'Investigar, apurar e publicar fatos que importam para os cidadãos sul-mato-grossenses.')}</p>

        <h2 className="font-display text-[22px] font-black text-vp-text mt-8 mb-3">Como nos sustentamos</h2>
        <p>{v('institucional.quem_somos_financ', 'O Voz Pública MS é financiado por seus leitores. Não temos acionistas nem grupos empresariais por trás.')}</p>

        <h2 className="font-display text-[22px] font-black text-vp-text mt-8 mb-3">Transparência radical</h2>
        <p>{v('institucional.quem_somos_transp', 'Publicamos nossa política editorial, nossos critérios de correção e nossas fontes de receita.')}</p>

        <h2 className="font-display text-[22px] font-black text-vp-text mt-8 mb-3">A equipe</h2>
        <p>{v('institucional.quem_somos_equipe', 'Somos jornalistas, editores e colaboradores que escolheram Mato Grosso do Sul como pauta permanente.')}</p>
      </div>

      <div className="mt-12 flex flex-col sm:flex-row gap-3">
        {donationsEnabled && (
          <a href="/apoiar" className="vp-btn vp-btn-primary text-[12px] font-bold px-6 py-3 text-center">
            Apoiar o Voz Pública →
          </a>
        )}
        <a href="/principios-editoriais" className="vp-btn text-[12px] font-bold px-6 py-3 text-center">
          Nossos princípios editoriais
        </a>
      </div>
    </main>
  );
}
