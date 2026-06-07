import { prisma } from '@/lib/prisma';
import { getSiteSettings } from '@/app/actions/settings';
import Link from 'next/link';
import { Monogram } from '@/components/shared/Monogram';
import { PollAboveFooter } from '@/components/poll/PollAboveFooter';
import type { Section } from '@prisma/client';

/**
 * SiteFooter — Rodapé principal do portal.
 * Rigorosamente fiel ao design clássico editorial.
 */
export async function SiteFooter() {
  let settings: Record<string, string> = {};
  let dbSections: Section[] = [];

  try {
    const [siteSettings, sections] = await Promise.all([
      getSiteSettings().catch(() => ({})),
      prisma.section.findMany({
        where: { showInMenu: true },
        orderBy: { menuOrder: 'asc' },
        take: 8
      }).catch(() => [])
    ]);
    settings = siteSettings;
    dbSections = sections;
  } catch (error) {
    console.error('Footer data fetch error:', error);
  }

  return (
    <>
    <PollAboveFooter />
    <footer className="border-t-2 border-vp-text bg-vp-surface-2 font-sans text-[11px] sm:text-[12px] text-vp-text-3 px-4 sm:px-7 pt-6 sm:pt-8 pb-4 sm:pb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] gap-6 sm:gap-7 mb-6 sm:mb-7">
        <div>
          <Monogram size="md" cssHeight="var(--vp-footer-logo-size)" className="mb-3" src={settings['BRAND_LOGO_URL'] || '/logo.webp'} />
          <p className="leading-[1.6] text-vp-text-2 font-serif text-[14px] mt-3">
            {settings['footer.description'] || settings['SITE_DESCRIPTION'] || 'Jornalismo investigativo, plural e sem donos. Cobrimos Mato Grosso do Sul com rigor e independência desde 2024.'}
          </p>
          <div className="mt-3.5 flex flex-col sm:flex-row gap-2">
            <Link href="/apoiar" className="no-underline flex-1 sm:flex-none">
              <button className="vp-btn vp-btn-primary text-[11px] font-bold w-full sm:w-auto min-h-11">Faça uma doação</button>
            </Link>
            <Link href="/newsletter" className="no-underline flex-1 sm:flex-none">
              <button className="vp-btn text-[11px] font-bold w-full sm:w-auto min-h-11">Assine a newsletter</button>
            </Link>
          </div>
        </div>
        
        <div>
          <h4 className="text-[11px] font-bold uppercase tracking-[0.1em] text-vp-text mb-2.5">Editorias</h4>
          <ul className="list-none p-0 m-0 grid gap-1.5">
            {dbSections.map(s => (
              <li key={s.id}>
                <Link href={`/editoria/${s.slug}`} className="hover:text-vp-accent transition-colors">
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h4 className="text-[11px] font-bold uppercase tracking-[0.1em] text-vp-text mb-2.5">Institucional</h4>
          <ul className="list-none p-0 m-0 grid gap-1.5">
            {['Quem somos','Princípios editoriais','Política de correções','Contato','Anuncie','Trabalhe conosco'].map(x => (
              <li key={x}><a className="hover:text-vp-accent transition-colors cursor-pointer">{x}</a></li>
            ))}
          </ul>
        </div>
        
        <div>
          <h4 className="text-[11px] font-bold uppercase tracking-[0.1em] text-vp-text mb-2.5">Envie sua denúncia</h4>
          <p className="leading-[1.5] mb-2.5">
            {settings['footer.denounce_desc'] || 'Canal criptografado para whistleblowers. Protegemos suas fontes.'}
          </p>
          <a className="text-vp-accent font-bold hover:text-vp-accent-hover transition-colors cursor-pointer">
            {settings['footer.denounce_email'] || settings['CONTACT_EMAIL'] || 'denuncia@vozpublicams.com.br'} →
          </a>
        </div>
      </div>

      <div className="border-t border-vp-border flex flex-col sm:flex-row justify-between gap-1 text-[10px] sm:text-[11px] pt-4">
        <span>{settings['footer.copyright'] || '© 2026 Voz Pública MS · Campo Grande, MS · CNPJ 00.000.000/0001-00'}</span>
        <span className="font-mono text-vp-text-4 uppercase">vozpublicams.com.br</span>
      </div>
    </footer>
    </>
  );
}
