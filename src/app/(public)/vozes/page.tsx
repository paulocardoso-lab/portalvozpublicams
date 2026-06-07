import React from "react";
import { getPublicVoices } from "@/app/actions/voices";
import { VOICE_TAGS } from "@/lib/voice-tags";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { MobileMasthead } from "@/components/layout/MobileMasthead";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { VoiceCard } from "@/components/voices/VoiceCard";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vozes",
  description: "Fragmentos enigmaticos de bastidores. O que se sussurra nos corredores do poder em Mato Grosso do Sul.",
};

export default async function VozesPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const { tag } = await searchParams;
  const voices = await getPublicVoices(tag, 60);

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:flex flex-col min-h-screen bg-vp-bg w-full">
        <SiteHeader />

        <div className="border-b border-vp-border bg-vp-surface px-[28px] py-[40px]">
          <div className="max-w-[760px] mx-auto">
            <div className="eyebrow text-[10px] mb-3">Voz Publica MS</div>
            <h1 className="font-display text-[64px] font-black leading-[1] tracking-tight text-vp-text mb-4">
              Vozes.
            </h1>
            <p className="font-serif italic text-[18px] text-vp-text-2 max-w-[520px] leading-relaxed">
              O que se sussurra nos corredores do poder. Fragmentos, rumores qualificados, observacoes de bastidores. Sem autoria. Sem explicacao.
            </p>
          </div>
        </div>

        {/* Tag filter */}
        <div className="border-b border-vp-border px-[28px] py-3 flex items-center gap-2 overflow-x-auto">
          <Link
            href="/vozes"
            className={`font-sans text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 border transition-colors shrink-0 ${!tag ? "border-vp-accent text-vp-accent bg-vp-accent/10" : "border-vp-border text-vp-text-4 hover:border-vp-text-3"}`}
          >
            Todas
          </Link>
          {VOICE_TAGS.map(t => (
            <Link
              key={t}
              href={`/vozes?tag=${encodeURIComponent(t)}`}
              className={`font-sans text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 border transition-colors shrink-0 ${tag === t ? "border-vp-accent text-vp-accent bg-vp-accent/10" : "border-vp-border text-vp-text-4 hover:border-vp-text-3"}`}
            >
              {t}
            </Link>
          ))}
        </div>

        <div className="px-[28px] py-[40px] max-w-[760px] mx-auto w-full">
          {voices.length === 0 ? (
            <div className="py-24 text-center text-vp-text-3 font-serif italic">
              Nenhuma voz publicada ainda.
            </div>
          ) : (
            <div className="flex flex-col">
              {voices.map(v => (
                <VoiceCard
                  key={v.id}
                  id={v.id}
                  text={v.text}
                  tag={v.tag}
                  location={v.location}
                  publishedAt={v.publishedAt}
                  variant="feed"
                />
              ))}
            </div>
          )}
        </div>

        <div className="mt-auto">
          <SiteFooter />
        </div>
      </div>

      {/* Mobile */}
      <div className="lg:hidden flex flex-col min-h-screen bg-vp-bg w-full">
        <MobileMasthead />

        <div className="px-4 py-8 bg-vp-surface border-b border-vp-border">
          <div className="eyebrow text-[10px] mb-2">Voz Publica MS</div>
          <h1 className="font-display text-[40px] font-black leading-none mb-3">Vozes.</h1>
          <p className="font-serif italic text-[14px] text-vp-text-2 leading-relaxed">
            Fragmentos enigmaticos de bastidores do poder em MS.
          </p>
        </div>

        {/* Tag filter mobile */}
        <div className="border-b border-vp-border px-4 py-3 flex items-center gap-2 overflow-x-auto">
          <Link
            href="/vozes"
            className={`font-sans text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 border transition-colors shrink-0 ${!tag ? "border-vp-accent text-vp-accent" : "border-vp-border text-vp-text-4"}`}
          >
            Todas
          </Link>
          {VOICE_TAGS.map(t => (
            <Link
              key={t}
              href={`/vozes?tag=${encodeURIComponent(t)}`}
              className={`font-sans text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 border transition-colors shrink-0 ${tag === t ? "border-vp-accent text-vp-accent" : "border-vp-border text-vp-text-4"}`}
            >
              {t}
            </Link>
          ))}
        </div>

        <div className="px-4 flex flex-col pb-24">
          {voices.length === 0 ? (
            <div className="py-16 text-center text-vp-text-3 font-serif italic">
              Nenhuma voz publicada ainda.
            </div>
          ) : (
            voices.map(v => (
              <VoiceCard
                key={v.id}
                id={v.id}
                text={v.text}
                tag={v.tag}
                location={v.location}
                publishedAt={v.publishedAt}
                variant="feed"
              />
            ))
          )}
        </div>

        <MobileTabBar />
      </div>
    </>
  );
}
