"use client";

import React, { useState } from "react";
import { SafeImage } from "@/components/shared/SafeImage";
import Link from "next/link";

interface ChargeCardProps {
  id: string;
  imageUrl: string;
  caption: string | null;
  credit: string | null;
  publishedAt: Date | string | null;
}

function ChargeLightbox({ imageUrl, caption, credit, onClose }: {
  imageUrl: string;
  caption: string | null;
  credit: string | null;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div className="relative max-w-3xl w-full" onClick={e => e.stopPropagation()}>
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-10 right-0 text-white/70 hover:text-white font-bold text-[13px] uppercase tracking-widest"
        >
          &#10005; Fechar
        </button>
        <div className="border border-white/10 overflow-hidden bg-[#0a0a09]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt={caption || "Charge"} className="w-full object-contain max-h-[75vh]" />
          {(caption || credit) && (
            <div className="px-5 py-3 border-t border-white/10 flex items-start justify-between gap-4">
              {caption && (
                <p className="font-serif italic text-[14px] text-white/80 leading-snug">&ldquo;{caption}&rdquo;</p>
              )}
              {credit && (
                <span className="font-sans text-[11px] text-white/40 font-bold uppercase tracking-widest shrink-0">{credit}</span>
              )}
            </div>
          )}
        </div>
        <div className="mt-3 text-center">
          <Link
            href="/charges"
            className="font-sans text-[11px] text-white/40 hover:text-white/70 uppercase tracking-widest transition-colors"
            onClick={onClose}
          >
            Ver arquivo de charges &#8594;
          </Link>
        </div>
      </div>
    </div>
  );
}

export function ChargeCard({ id: _id, imageUrl, caption, credit, publishedAt }: ChargeCardProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const date = publishedAt
    ? new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(new Date(publishedAt))
    : "";

  return (
    <>
      <div className="border border-vp-border bg-vp-surface">
        {/* Header */}
        <div className="px-4 py-2.5 border-b border-vp-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-vp-accent rotate-45 shrink-0" />
            <span className="font-sans text-[10px] uppercase tracking-[0.14em] font-bold text-vp-text">
              Charge do Dia
            </span>
          </div>
          <span className="font-mono text-[10px] text-vp-text-4">{date}</span>
        </div>

        {/* Imagem clicavel */}
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="block w-full relative overflow-hidden group cursor-zoom-in"
          title="Ampliar charge"
        >
          <div className="relative w-full aspect-[4/3]">
            <SafeImage
              src={imageUrl}
              alt={caption || "Charge do Dia"}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </div>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 text-white font-sans text-[10px] uppercase tracking-widest px-3 py-1.5 font-bold">
              Ampliar
            </span>
          </div>
        </button>

        {/* Rodape */}
        {(caption || credit) && (
          <div className="px-4 py-3 flex items-start justify-between gap-3 border-t border-vp-border">
            {caption && (
              <p className="font-serif italic text-[12px] text-vp-text-2 leading-snug flex-1">
                &ldquo;{caption}&rdquo;
              </p>
            )}
            {credit && (
              <span className="font-sans text-[10px] text-vp-text-4 font-bold uppercase tracking-widest shrink-0 pt-0.5">
                {credit}
              </span>
            )}
          </div>
        )}

        <div className="px-4 pb-3">
          <Link
            href="/charges"
            className="font-sans text-[10px] text-vp-text-4 hover:text-vp-accent transition-colors uppercase tracking-widest"
          >
            Arquivo de charges &#8594;
          </Link>
        </div>
      </div>

      {lightboxOpen && (
        <ChargeLightbox
          imageUrl={imageUrl}
          caption={caption}
          credit={credit}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
}
