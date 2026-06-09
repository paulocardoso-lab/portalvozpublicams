import type { Metadata } from 'next';
import { getSiteSettings } from '@/app/actions/settings';

export const metadata: Metadata = {
  title: 'Anuncie — Voz Pública MS',
  description: 'Alcance o público mais engajado de Mato Grosso do Sul anunciando no Voz Pública MS.',
};

export const dynamic = 'force-dynamic';

const FORMATS = [
  { format: 'Banner fixo (topo)', size: '970×90 px', placement: 'Todas as páginas', notes: 'Alta visibilidade' },
  { format: 'Banner lateral', size: '300×250 px', placement: 'Matérias individuais', notes: 'Fixo durante a leitura' },
  { format: 'Banner entre conteúdo', size: '728×90 px', placement: 'Feed de matérias', notes: 'Nativo ao scroll' },
  { format: 'Patrocínio de editoria', size: '—', placement: 'Editoria específica', notes: 'Associação temática' },
  { format: 'Newsletter', size: 'Texto + imagem', placement: 'E-mail semanal', notes: 'Lista segmentada' },
];

export default async function AnunciePage() {
  const s = await getSiteSettings();
  const v = (key: string, fb: string) => (s[key] as string | undefined)?.trim() || fb;

  const emailPublicidade = v('institucional.email_publicidade', 'publicidade@vozpublicams.com.br');

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <span className="text-[11px] font-bold uppercase tracking-widest text-vp-accent">Institucional</span>
      <h1 className="font-display text-[32px] sm:text-[42px] font-black leading-[1.05] tracking-tight mt-2 mb-6">
        Anuncie no Voz Pública MS
      </h1>

      <div className="font-serif text-[16px] sm:text-[17px] leading-relaxed text-vp-text-2 space-y-5">
        <p>{v('institucional.anuncie_intro', 'O Voz Pública MS reúne o público mais engajado e crítico de Mato Grosso do Sul.')}</p>

        <h2 className="font-display text-[22px] font-black text-vp-text mt-8 mb-4">Formatos disponíveis</h2>
      </div>

      <div className="overflow-x-auto mt-2 mb-8">
        <table className="w-full text-[13px] font-sans border-collapse">
          <thead>
            <tr className="border-b border-vp-border text-[11px] uppercase tracking-wider text-vp-text-3">
              <th className="text-left py-2 pr-4 font-bold">Formato</th>
              <th className="text-left py-2 pr-4 font-bold">Tamanho</th>
              <th className="text-left py-2 pr-4 font-bold">Posicionamento</th>
              <th className="text-left py-2 font-bold">Obs.</th>
            </tr>
          </thead>
          <tbody>
            {FORMATS.map((row, i) => (
              <tr key={i} className="border-b border-vp-border/50 hover:bg-vp-surface/30 transition-colors">
                <td className="py-3 pr-4 font-bold text-vp-text">{row.format}</td>
                <td className="py-3 pr-4 font-mono text-vp-text-3">{row.size}</td>
                <td className="py-3 pr-4 text-vp-text-2">{row.placement}</td>
                <td className="py-3 text-vp-text-3">{row.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="font-serif text-[16px] sm:text-[17px] leading-relaxed text-vp-text-2 space-y-5">
        <h2 className="font-display text-[22px] font-black text-vp-text mt-4 mb-3">Nosso compromisso com o leitor</h2>
        <p>{v('institucional.anuncie_compromisso', 'Todo conteúdo patrocinado é identificado claramente como publicidade. Não aceitamos anunciantes de partidos políticos ou de empresas que conflitem com nossa linha editorial.')}</p>

        <h2 className="font-display text-[22px] font-black text-vp-text mt-8 mb-3">Fale conosco</h2>
        <p>Para receber o mídia kit completo com métricas, formatos e tabela de preços atualizada, entre em contato pelo e-mail abaixo. Retornamos em até 2 dias úteis.</p>
        <p>
          <a href={`mailto:${emailPublicidade}`} className="text-vp-accent font-bold hover:text-vp-accent-hover transition-colors font-sans">
            {emailPublicidade} →
          </a>
        </p>
      </div>
    </main>
  );
}
