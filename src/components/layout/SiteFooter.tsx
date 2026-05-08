import { prisma } from '@/lib/prisma';
import { getSiteSettings } from '@/app/actions/settings';
import Link from 'next/link';
import { BrandLogo } from '@/components/shared/BrandLogo';

export async function SiteFooter() {
  let settings: Record<string, string> = {};
  let dbSections: any[] = [];

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
    <footer className="hidden md:block border-t-2 border-vp-text bg-vp-bg px-7 pt-8 pb-6 font-sans text-[12px] text-vp-text-3">
      <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] gap-7 mb-7">
        <div>
          <BrandLogo size="lg" className="mb-3" />
          <p className="leading-[1.6] text-vp-text-2 font-serif text-[14px]">
            {settings['SITE_DESCRIPTION'] || 'Jornalismo investigativo, plural e sem donos. Cobrimos Mato Grosso do Sul com rigor e independência.'}
          </p>
          <div className="mt-3.5 flex gap-2">
            <Link href="/apoiar" className="no-underline">
              <button className="vp-btn vp-btn-primary text-[11px]">Faça uma doação</button>
            </Link>
            <Link href="/newsletter" className="no-underline">
              <button className="vp-btn text-[11px]">Assine a newsletter</button>
            </Link>
          </div>
        </div>
        
        <div>
          <h4 className="text-[11px] uppercase tracking-[0.1em] text-vp-text mb-2.5">Editorias</h4>
          <ul className="list-none p-0 m-0 grid gap-1.5">
            {dbSections.map(s => (
              <li key={s.id}>
                <Link href={`/editoria/${s.slug}`} className="cursor-pointer hover:text-vp-accent hover:underline no-underline">
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h4 className="text-[11px] uppercase tracking-[0.1em] text-vp-text mb-2.5">Institucional</h4>
          <ul className="list-none p-0 m-0 grid gap-1.5">
            {['Quem somos','Princípios editoriais','Política de correções','Contato','Anuncie','Trabalhe conosco'].map(x => (
              <li key={x}><a className="cursor-pointer hover:text-vp-accent hover:underline">{x}</a></li>
            ))}
          </ul>
        </div>
        
        <div>
          <h4 className="text-[11px] uppercase tracking-[0.1em] text-vp-text mb-2.5">Envie sua denúncia</h4>
          <p className="leading-[1.5] mb-2.5">Canal criptografado para whistleblowers. Protegemos suas fontes.</p>
          <a className="text-vp-accent font-semibold cursor-pointer hover:underline">
            {settings['CONTACT_EMAIL'] || 'denuncia@vozpublicams.com.br'} →
          </a>
        </div>
      </div>
      
      <div className="border-t border-vp-border pt-4 flex justify-between text-[11px]">
        <div className="flex flex-col gap-1">
          <span>© 2026 Voz Pública MS. Todos os direitos reservados.</span>
        </div>
        <span className="font-mono">vozpublicams.com.br</span>
      </div>
    </footer>
  );
}
