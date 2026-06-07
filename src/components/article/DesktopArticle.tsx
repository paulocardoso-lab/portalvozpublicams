import React from 'react';
import Link from 'next/link';
import type { Article, Section } from '@prisma/client';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { ImgPH } from '@/components/shared/ImgPH';
import { Eyebrow } from '@/components/shared/Eyebrow';
import { Headline } from '@/components/shared/Headline';
import { SafeImage } from '@/components/shared/SafeImage';
import { AdSlot } from '@/components/shared/AdSlot';
import { ArticleBodyWithAd } from '@/components/shared/ArticleBodyWithAd';
import { renderArticleBody } from '@/lib/article-renderer';
import { ShareBar } from '@/components/article/ShareBar';
import { getSiteSettings } from '@/app/actions/settings';
import { getActiveCharge } from '@/app/actions/charges';
import { ChargeCard } from '@/components/charge/ChargeCard';
import { getActiveVoices } from '@/app/actions/voices';
import { VoicesSidebarBlock } from '@/components/voices/VoiceCard';

type ArticleWithRelations = Article & {
  authors: { id: string; name: string; slug: string | null; avatar: string | null }[];
  section: Section;
};

type RelatedArticle = {
  id: string;
  title: string;
  slug: string;
  publishedAt: Date | string | null;
  readTimeMin: number | null;
};

export async function DesktopArticle({ article, related = [] }: { article: ArticleWithRelations; related?: RelatedArticle[] }) {
  if (!article) return null;

  const [s, activeCharge, activeVoices] = await Promise.all([
    getSiteSettings(),
    getActiveCharge().catch(() => null),
    getActiveVoices(3).catch(() => []),
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-vp-bg w-full">
      <SiteHeader />

      {/* Breadcrumb */}
      <nav className="px-[28px] py-[14px] border-b border-vp-border font-sans text-[11px] text-vp-text-3 tracking-[0.06em] uppercase">
        <Link href="/" className="hover:text-vp-accent transition-colors">Editorias</Link>
        <span className="mx-2 text-vp-text-4">/</span>
        <Link href={`/editoria/${article.section?.slug}`} className="text-vp-accent hover:underline">{article.section?.name || 'Geral'}</Link>
        {article.eyebrow && (
          <>
            <span className="mx-2 text-vp-text-4">/</span>
            <span className="text-vp-text-2">{article.eyebrow}</span>
          </>
        )}
      </nav>

      <article className="grid grid-cols-[200px_1fr_260px] gap-[36px] px-[48px] py-[36px] max-w-[1400px] mx-auto w-full">
        {/* Left — Sticky Share Actions */}
        <aside className="sticky top-[160px] self-start flex flex-col gap-4">
          <div className="font-sans text-[10px] uppercase tracking-widest text-vp-text-3 font-bold mb-1">Compartilhar</div>
          <ShareBar
            url={`https://www.vozpublicams.com.br/materia/${article.slug}`}
            title={article.title}
            orientation="vertical"
          />
          <div className="mt-4 p-3 border border-vp-border bg-vp-surface/50 text-[11px] font-sans text-vp-text-3 leading-[1.5]">
            {s['article.open_text'] || 'Esta reportagem é aberta e sem paywall. Se considera importante,'}{' '}
            <Link href="/apoiar" className="text-vp-accent font-bold hover:underline">contribua</Link>.
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="max-w-[680px]">
          <Eyebrow className="mb-3.5">
            {article.eyebrow || article.section?.name} · {article.readTimeMin || 8} min de leitura
          </Eyebrow>
          
          <Headline as="h1" size="article" className="mb-4.5 font-black tracking-tight">
            {article.title}
          </Headline>
          
          <p className="font-serif text-[20px] italic text-vp-text-2 leading-[1.45] mb-6">
            {article.lead}
          </p>

          <div className="flex items-center gap-[18px] py-4.5 border-y border-vp-border mb-7">
            <div className="relative w-[44px] h-[44px] rounded-full overflow-hidden bg-vp-surface">
              {article.authors?.[0]?.avatar ? (
                <SafeImage src={article.authors[0].avatar} alt="" fill className="object-cover" />
              ) : (
                <ImgPH label="" width={44} height={44} className="rounded-full" />
              )}
            </div>
            <div className="flex-1">
              <div className="font-sans text-[13px] text-vp-text font-bold">
                Por {article.authors?.map(a => a.name).join(' e ') || 'Redação'}
              </div>
              <div className="byline text-[11px] mt-0.5">
                {article.publishedAt ? new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(article.publishedAt)) : ''}
              </div>
            </div>
          </div>

          {article.heroImage ? (
            <div className="relative aspect-[16/9] w-full mb-3.5 overflow-hidden rounded-sm">
              <SafeImage src={article.heroImage} alt="" fill className="object-cover" priority />
            </div>
          ) : (
            <ImgPH label="foto destaque" height={460} className="mb-3.5" />
          )}
          
          <p className="font-serif italic text-[13px] text-vp-text-3 mb-7 border-l-2 border-vp-accent pl-3">
            {article.heroCaption || 'Foto: Voz Pública'}
          </p>

          <ArticleBodyWithAd
            html={renderArticleBody(article.body)}
            className="vp-article-content mb-12"
            adSlotId="in-article"
            insertAfterParagraph={4}
          />

        </div>

        {/* Right Sidebar */}
        <aside className="flex flex-col gap-6 self-start">
          <AdSlot id="sidebar-top" className="w-full" />
          
          {/* Charge do Dia */}
          {activeCharge && (
            <ChargeCard
              id={activeCharge.id}
              imageUrl={activeCharge.imageUrl}
              caption={activeCharge.caption}
              credit={activeCharge.credit}
              publishedAt={activeCharge.publishedAt}
            />
          )}

          {activeVoices.length > 0 && (
            <VoicesSidebarBlock voices={activeVoices.map(v => ({
              id: v.id,
              text: v.text,
              tag: v.tag,
              location: v.location,
              publishedAt: v.publishedAt,
            }))} />
          )}

          {related.length > 0 && (
            <div>
              <h3 className="font-sans text-[11px] uppercase tracking-[0.14em] font-bold text-vp-text mb-4">Leia também</h3>
              <div className="flex flex-col gap-4">
                {related.map((art, i) => (
                  <div key={art.id} className={`pb-4 ${i < related.length - 1 ? 'border-b border-vp-border' : ''}`}>
                    <Headline size="small" href={`/materia/${art.slug}`} className="leading-snug mb-1.5">
                      {art.title}
                    </Headline>
                    {art.readTimeMin && (
                      <div className="byline text-[10px]">{art.readTimeMin} min de leitura</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-vp-surface p-5 border border-vp-border">
            <div className="font-sans text-[10px] uppercase tracking-widest text-vp-accent font-bold mb-2">
              {s['article.support_title'] || 'Apoie esta reportagem'}
            </div>
            <p className="font-serif text-[12px] text-vp-text-2 leading-[1.5] mb-4">
              {s['article.support_body'] || '8 meses de apuração foram pagos por leitores. Seja um dos 4.812 apoiadores.'}
            </p>
            <Link href="/apoiar" className="vp-btn vp-btn-primary w-full py-2.5 font-bold uppercase tracking-widest text-[11px] text-center block">
              {s['article.support_cta'] || 'Contribuir'}
            </Link>
          </div>
        </aside>
      </article>

      <SiteFooter />
    </div>
  );
}
