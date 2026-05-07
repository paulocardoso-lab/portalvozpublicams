import React from "react";
import prisma from "@/lib/prisma";
import { createPodcastEpisode, togglePodcastActive, deletePodcastEpisode } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminPodcastsPage() {
  const episodes = await prisma.podcastEpisode.findMany({
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="max-w-[900px]">
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold mb-1">Podcasts</h1>
        <p className="text-vp-text-3 text-[13px]">{episodes.length} episódios · {episodes.filter((e) => e.isActive).length} ativos</p>
      </div>

      {/* Add form */}
      <div className="bg-[#141413] border border-vp-border p-5 rounded mb-6">
        <h3 className="text-[13px] font-semibold mb-4 uppercase tracking-wider text-vp-text-3">Novo Episódio</h3>
        <form action={createPodcastEpisode} className="grid gap-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <label className="grid gap-1">
              <span className="text-[11px] text-vp-text-3 uppercase font-semibold">Título *</span>
              <input name="title" className="vp-input text-[13px]" placeholder="Episódio 01 — Política Hídrica" required />
            </label>
            <label className="grid gap-1">
              <span className="text-[11px] text-vp-text-3 uppercase font-semibold">Duração</span>
              <input name="duration" className="vp-input text-[13px]" placeholder="42 min" />
            </label>
          </div>
          <label className="grid gap-1">
            <span className="text-[11px] text-vp-text-3 uppercase font-semibold">URL do Embed (Spotify / Anchor)</span>
            <input name="embedUrl" className="vp-input text-[13px] font-mono" placeholder="https://open.spotify.com/embed/episode/..." />
          </label>
          <label className="grid gap-1">
            <span className="text-[11px] text-vp-text-3 uppercase font-semibold">Descrição</span>
            <textarea name="description" className="vp-input text-[13px] h-16 resize-none" placeholder="Sobre este episódio..." />
          </label>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input name="isActive" type="checkbox" defaultChecked className="accent-vp-accent" />
              <span>Ativo (exibir na home)</span>
            </label>
            <button type="submit" className="vp-btn vp-btn-primary px-6 py-2 text-[13px]">Adicionar episódio</button>
          </div>
        </form>
      </div>

      {/* Episodes list */}
      <div className="bg-[#141413] border border-vp-border rounded overflow-hidden divide-y divide-vp-border">
        {episodes.length === 0 ? (
          <div className="px-5 py-10 text-center text-vp-text-3 italic">Nenhum episódio cadastrado.</div>
        ) : (
          episodes.map((ep) => (
            <div key={ep.id} className={`p-4 flex gap-4 items-start ${!ep.isActive ? "opacity-60" : ""}`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${ep.isActive ? "bg-vp-ok" : "bg-vp-text-4"}`} />
                  <div className="font-semibold text-[14px] truncate">{ep.title}</div>
                  {ep.duration && <span className="text-[11px] text-vp-text-3 font-mono shrink-0">{ep.duration}</span>}
                </div>
                {ep.description && <p className="text-[12px] text-vp-text-3 truncate">{ep.description}</p>}
                {ep.embedUrl && <div className="text-[11px] text-vp-accent font-mono truncate mt-1">{ep.embedUrl}</div>}
              </div>
              <div className="flex gap-1.5 shrink-0">
                <form action={togglePodcastActive.bind(null, ep.id, !ep.isActive)}>
                  <button type="submit" className={`vp-btn text-[11px] py-1 px-2.5 ${ep.isActive ? "" : "text-vp-ok border-vp-ok hover:bg-vp-ok/10"}`}>
                    {ep.isActive ? "Desativar" : "Ativar"}
                  </button>
                </form>
                <form action={deletePodcastEpisode.bind(null, ep.id)}>
                  <button type="submit" className="vp-btn text-[11px] py-1 px-2.5 text-vp-urgent border-vp-urgent hover:bg-vp-urgent/10">Excluir</button>
                </form>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
