import React from "react";
import { getPublicCharges } from "@/app/actions/charges";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { MobileMasthead } from "@/components/layout/MobileMasthead";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { ChargeCard } from "@/components/charge/ChargeCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Arquivo de Charges",
  description: "Charges editoriais do Voz Publica MS — humor, critica e poder em Mato Grosso do Sul.",
};

export default async function ChargesPage() {
  const charges = await getPublicCharges();

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:flex flex-col min-h-screen bg-vp-bg w-full">
        <SiteHeader />

        <div className="border-b border-vp-border bg-vp-surface px-[28px] py-[40px]">
          <div className="max-w-[900px] mx-auto">
            <div className="eyebrow text-[10px] mb-3">Voz Publica MS</div>
            <h1 className="font-display text-[56px] font-black leading-[1.05] tracking-tight text-vp-text mb-3">
              Arquivo de Charges
            </h1>
            <p className="font-serif italic text-[18px] text-vp-text-2 max-w-[560px] leading-relaxed">
              Humor, critica e poder. O olhar do chargista sobre Mato Grosso do Sul.
            </p>
          </div>
        </div>

        <div className="px-[28px] py-[48px] max-w-[900px] mx-auto w-full">
          {charges.length === 0 ? (
            <div className="py-24 text-center text-vp-text-3 font-serif italic">
              Nenhuma charge publicada ainda.
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-6">
              {charges.map(charge => (
                <ChargeCard
                  key={charge.id}
                  id={charge.id}
                  imageUrl={charge.imageUrl}
                  caption={charge.caption}
                  credit={charge.credit}
                  publishedAt={charge.publishedAt}
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
          <h1 className="font-display text-[32px] font-black leading-tight">Arquivo de Charges</h1>
          <p className="font-serif italic text-[14px] text-vp-text-2 mt-2">
            Humor e critica sobre o poder em MS.
          </p>
        </div>

        <div className="px-4 py-6 grid grid-cols-1 gap-5 pb-24">
          {charges.length === 0 ? (
            <div className="py-16 text-center text-vp-text-3 font-serif italic">
              Nenhuma charge publicada ainda.
            </div>
          ) : (
            charges.map(charge => (
              <ChargeCard
                key={charge.id}
                id={charge.id}
                imageUrl={charge.imageUrl}
                caption={charge.caption}
                credit={charge.credit}
                publishedAt={charge.publishedAt}
              />
            ))
          )}
        </div>

        <MobileTabBar />
      </div>
    </>
  );
}
