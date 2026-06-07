import React from "react";
import Link from "next/link";

interface VoiceCardProps {
  id: string;
  text: string;
  tag: string;
  location: string | null;
  publishedAt: Date | string;
  variant?: "sidebar" | "feed" | "home";
}

export function VoiceCard({ id, text, tag, location, publishedAt, variant = "feed" }: VoiceCardProps) {
  const date = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(new Date(publishedAt));

  if (variant === "sidebar") {
    return (
      <div className="border-l-2 border-vp-accent pl-4 py-1">
        <p className="font-serif italic text-[13px] text-vp-text leading-relaxed mb-2">
          &ldquo;{text}&rdquo;
        </p>
        <div className="flex items-center gap-2 font-mono text-[10px] text-vp-text-4">
          <span className="text-vp-accent font-bold uppercase tracking-widest text-[9px]">{tag}</span>
          {location && <><span>&middot;</span><span>{location}</span></>}
        </div>
      </div>
    );
  }

  if (variant === "home") {
    return (
      <div className="border border-vp-border bg-vp-surface p-4 flex flex-col gap-3 group hover:border-vp-accent/40 transition-colors">
        <div className="flex items-center justify-between">
          <span className="font-sans text-[9px] uppercase tracking-[0.16em] font-bold text-vp-accent border border-vp-accent/30 px-1.5 py-0.5">
            {tag}
          </span>
          <span className="font-mono text-[10px] text-vp-text-4">{date}</span>
        </div>
        <p className="font-serif italic text-[14px] text-vp-text leading-relaxed flex-1">
          &ldquo;{text}&rdquo;
        </p>
        {location && (
          <div className="font-mono text-[10px] text-vp-text-4 uppercase tracking-widest border-t border-vp-border pt-2">
            &#8212; {location}
          </div>
        )}
      </div>
    );
  }

  // feed variant
  return (
    <article className="border-b border-vp-border py-6 group">
      <div className="flex items-start gap-4">
        <div className="w-[3px] bg-vp-accent self-stretch shrink-0 mt-1 rounded-full" />
        <div className="flex-1 min-w-0">
          <p className="font-serif italic text-[17px] md:text-[19px] text-vp-text leading-relaxed mb-3">
            &ldquo;{text}&rdquo;
          </p>
          <div className="flex items-center gap-3 font-mono text-[11px] text-vp-text-4">
            <span className="border border-vp-accent/40 text-vp-accent px-2 py-0.5 uppercase tracking-widest text-[9px] font-bold">
              {tag}
            </span>
            {location && (
              <>
                <span className="text-vp-text-4">&#8212;</span>
                <span>{location}</span>
              </>
            )}
            <span>&middot;</span>
            <span>{date}</span>
          </div>
        </div>
      </div>
    </article>
  );
}

export function VoicesSidebarBlock({ voices }: { voices: VoiceCardProps[] }) {
  if (!voices.length) return null;
  return (
    <div className="border border-vp-border bg-vp-surface">
      <div className="px-4 py-2.5 border-b border-vp-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-vp-accent rotate-45 shrink-0" />
          <span className="font-sans text-[10px] uppercase tracking-[0.14em] font-bold text-vp-text">Vozes</span>
        </div>
        <Link href="/vozes" className="font-sans text-[10px] text-vp-text-4 hover:text-vp-accent transition-colors uppercase tracking-widest">
          Ver todas &#8594;
        </Link>
      </div>
      <div className="p-4 flex flex-col gap-5">
        {voices.map((v, i) => (
          <React.Fragment key={v.id}>
            {i > 0 && <div className="border-t border-vp-border" />}
            <VoiceCard {...v} variant="sidebar" />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
