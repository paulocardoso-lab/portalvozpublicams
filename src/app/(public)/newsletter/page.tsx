import React from 'react';
import Link from 'next/link';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { Monogram } from '@/components/shared/Monogram';
import { Eyebrow } from '@/components/shared/Eyebrow';
import { Headline } from '@/components/shared/Headline';
import { NewsletterForm } from '@/components/newsletter/NewsletterForm';
import { prisma } from '@/lib/prisma';

export default async function NewsletterPage() {
  const subscriberCount = await prisma.newsletterSubscriber.count().catch(() => 0);
  return (
    <div className="flex flex-col min-h-screen bg-vp-bg w-full">
      <div className="hidden lg:block">
        <SiteHeader />
      </div>

      <div className="lg:hidden flex items-center px-2 py-1 border-b border-vp-border gap-1">
        <Link href="/" aria-label="Fechar" className="text-vp-text text-[24px] leading-none min-w-11 min-h-11 flex items-center justify-center hover:text-vp-accent transition-colors no-underline">×</Link>
        <div className="flex-1 text-center">
          <Monogram size="sm" cssHeight="var(--vp-compact-logo-size)" />
        </div>
        <div className="min-w-11" />
      </div>

      <main className="flex-1 flex flex-col items-center">
        <div className="max-w-175 w-full lg:my-12 lg:border lg:border-vp-border lg:bg-vp-bg">
          {/* 1. Hero */}
          <div className="px-4 sm:px-5 py-6 sm:py-8 lg:p-12 border-b border-vp-border bg-vp-surface">
            <Eyebrow className="text-[10px]">Newsletter · Sábados, 7h</Eyebrow>
            <Headline as="h1" size="hero" hoverAccent={false} className="text-[38px]! lg:text-[56px]! leading-[1.05]! my-4 font-black">
              A Semana<br/>em <span className="text-vp-accent italic">MS</span>.
            </Headline>
            <p className="font-serif text-[16px] sm:text-[18px] text-vp-text-2 leading-[1.45] italic lg:max-w-125">
              O resumo do que importou em Mato Grosso do Sul, toda semana direto na sua caixa de entrada.
            </p>
          </div>

          {/* 2. Stats */}
          <div className="grid grid-cols-2 border-b border-vp-border bg-vp-bg">
            {[
              [subscriberCount.toLocaleString('pt-BR'), 'assinantes'],
              ['Gratuita', 'sempre'],
            ].map(([n, l], i) => (
              <div key={i} className={`py-6 px-2 text-center ${i < 1 ? 'border-r border-vp-border' : ''}`}>
                <div className="font-display text-[24px] lg:text-[28px] text-vp-accent font-black">{n}</div>
                <div className="text-[10px] text-vp-text-3 uppercase tracking-widest mt-1 font-bold">{l}</div>
              </div>
            ))}
          </div>

          {/* 3. Form Component (Client Side) */}
          <NewsletterForm />

          {/* 4. What you get */}
          <div className="px-5 py-10 lg:px-12">
            <Eyebrow variant="muted" className="mb-8 block">O que vai chegar no seu e-mail</Eyebrow>
            <div className="grid gap-8">
              {[
                ['1','A pauta da semana','Os 3 fatos que moveram MS, sem a urgência da timeline.'],
                ['2','Bastidores','Como uma reportagem foi feita — fontes, dúvidas, recortes que sobraram.'],
                ['3','O número','Um dado de MS que você ainda não viu, com contexto.'],
                ['4','Recomendação','Um livro, podcast ou doc que conversa com o estado.'],
              ].map(([n,t,d]) => (
                <div key={n} className="grid grid-cols-[40px_1fr] gap-4">
                  <span className="font-display text-[32px] text-vp-accent leading-none font-black">{n}</span>
                  <div>
                    <h3 className="font-display text-[20px] font-bold mb-1.5">{t}</h3>
                    <p className="font-serif text-[15px] text-vp-text-2 leading-relaxed">{d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Last edition preview */}
          <div className="px-5 py-8 lg:p-12 bg-vp-surface border-t border-vp-border">
            <Eyebrow className="mb-4 text-[10px]">Edição Anterior · 19 de Abril</Eyebrow>
            <h3 className="font-display text-[24px] lg:text-[32px] leading-tight! mb-4 font-black">
              &quot;O Pantanal não acabou em 2024. Continua acabando em 2026.&quot;
            </h3>
            <p className="font-serif italic text-[16px] text-vp-text-2 leading-relaxed mb-6">
              Quando a fumaça saiu da capa dos jornais, quem ficou foi o fogo, os sedimentos e a incerteza jurídica sobre o bioma…
            </p>
            <a className="font-sans text-[13px] text-vp-accent font-black uppercase tracking-widest cursor-pointer hover:text-vp-accent-hover transition-colors border-b border-vp-accent pb-0.5">
              Ler edição completa no arquivo →
            </a>
          </div>
        </div>

        <div className="px-4 py-6 sm:p-8 text-center text-[11px] sm:text-[12px] text-vp-text-4 border-t border-vp-border w-full bg-vp-bg">
          <div className="max-w-175 mx-auto flex justify-center gap-4 sm:gap-6 font-bold uppercase tracking-widest">
            <span>Arquivo</span>
            <span className="text-vp-border">|</span>
            <span className="text-vp-accent">Política MS</span>
            <span className="text-vp-border">|</span>
            <span className="text-vp-accent">Pantanal Diário</span>
          </div>
        </div>
      </main>

      <div className="hidden lg:block">
        <SiteFooter />
      </div>
    </div>
  );
}

