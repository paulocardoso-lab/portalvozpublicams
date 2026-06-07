"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Voice } from "@prisma/client";
import {
  createVoice,
  deleteVoice,
  generateVoicesFromPrompt,
  toggleVoiceActive,
  VOICE_TAGS,
} from "@/app/actions/voices";

const MAX_CHARS = 240;

// ── Composer ──────────────────────────────────────────────────────────────────

function VoiceComposer({ onCreated }: { onCreated: (v: Voice) => void }) {
  const [text, setText] = useState("");
  const [tag, setTag] = useState("Bastidores");
  const [location, setLocation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // IA
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiPending, startAiTransition] = useTransition();
  const [suggestions, setSuggestions] = useState<string[]>([]);

  function handleGenerate() {
    if (!aiPrompt.trim()) return;
    setSuggestions([]);
    startAiTransition(async () => {
      const result = await generateVoicesFromPrompt(aiPrompt);
      if (result.success && result.voices) setSuggestions(result.voices);
    });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await createVoice(fd);
      if (!result.success) { setError(result.error ?? "Erro."); return; }
      if (result.voice) onCreated(result.voice as Voice);
      setText("");
      setLocation("");
    });
  }

  const remaining = MAX_CHARS - text.length;

  return (
    <div className="border border-vp-border bg-[#141413] p-6 space-y-5">
      {/* Gerador IA */}
      <div className="border border-vp-accent/20 bg-vp-accent/5 p-4 space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-vp-accent rotate-45 shrink-0" />
          <span className="font-sans text-[10px] uppercase tracking-widest font-bold text-vp-accent">Gerar sugestoes com IA</span>
        </div>
        <div className="flex gap-2">
          <input
            className="vp-input flex-1 text-[13px]"
            placeholder="Digite um tema ou cole um trecho da materia..."
            value={aiPrompt}
            onChange={e => setAiPrompt(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleGenerate()}
          />
          <button
            type="button"
            onClick={handleGenerate}
            disabled={aiPending || !aiPrompt.trim()}
            className="vp-btn vp-btn-primary px-5 text-[11px] font-bold uppercase tracking-widest shrink-0"
          >
            {aiPending ? "Gerando..." : "Gerar"}
          </button>
        </div>
        {suggestions.length > 0 && (
          <div className="space-y-2">
            <p className="font-sans text-[10px] text-vp-text-4 uppercase tracking-widest">Clique para usar:</p>
            {suggestions.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setText(s.slice(0, MAX_CHARS))}
                className="w-full text-left p-3 border border-vp-border bg-vp-bg hover:border-vp-accent hover:bg-vp-accent/5 transition-all font-serif italic text-[13px] text-vp-text-2 leading-relaxed"
              >
                &ldquo;{s}&rdquo;
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Composer */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            name="text"
            rows={4}
            maxLength={320}
            required
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder={`"Um nome circula nos corredores. Ninguem confirma. Ninguem nega."`}
            className="vp-input w-full text-[15px] font-serif italic leading-relaxed resize-none pr-14"
          />
          <span className={`absolute bottom-3 right-3 font-mono text-[11px] ${remaining < 20 ? "text-vp-urgent" : "text-vp-text-4"}`}>
            {remaining}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="grid gap-1">
            <span className="eyebrow text-[10px]">Tag</span>
            <select name="tag" value={tag} onChange={e => setTag(e.target.value)} className="vp-input text-[13px]">
              {VOICE_TAGS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>
          <label className="grid gap-1">
            <span className="eyebrow text-[10px]">Localidade (opcional)</span>
            <input name="location" value={location} onChange={e => setLocation(e.target.value)} className="vp-input text-[13px]" placeholder="Ex: Campo Grande" />
          </label>
        </div>

        <input name="publishedAt" type="hidden" value={new Date().toISOString()} />

        {error && <div className="border border-vp-urgent/40 bg-vp-urgent/10 text-vp-urgent px-3 py-2 text-[12px]">{error}</div>}

        <button
          type="submit"
          disabled={isPending || !text.trim()}
          className="vp-btn vp-btn-primary w-full py-3 font-bold uppercase tracking-widest text-[12px]"
        >
          {isPending ? "Publicando..." : "Publicar Voz"}
        </button>
      </form>
    </div>
  );
}

// ── Voice Row ─────────────────────────────────────────────────────────────────

function VoiceRow({ voice, onDeleted }: { voice: Voice; onDeleted: () => void }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isActive, setIsActive] = useState(voice.isActive);

  function handleToggle() {
    const next = !isActive;
    setIsActive(next);
    startTransition(async () => {
      await toggleVoiceActive(voice.id, next);
      router.refresh();
    });
  }

  function handleDelete() {
    if (!confirm("Excluir esta voz permanentemente?")) return;
    startTransition(async () => {
      await deleteVoice(voice.id);
      onDeleted();
    });
  }

  const date = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(new Date(voice.publishedAt));

  return (
    <div className={`border border-vp-border p-4 bg-[#141413] transition-opacity ${isActive ? "" : "opacity-40"}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="font-serif italic text-[14px] text-vp-text leading-relaxed mb-2">
            &ldquo;{voice.text}&rdquo;
          </p>
          <div className="flex items-center gap-2 font-mono text-[10px] text-vp-text-4">
            <span className="border border-vp-accent/40 text-vp-accent px-1.5 py-0.5 uppercase tracking-widest text-[9px] font-bold">{voice.tag}</span>
            {voice.location && <span>{voice.location}</span>}
            <span>&middot; {date}</span>
            <span>&middot; {voice.text.length} chars</span>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleToggle}
            disabled={isPending}
            className={`text-[11px] font-black uppercase tracking-widest ${isActive ? "text-vp-ok hover:text-vp-urgent" : "text-vp-text-4 hover:text-vp-ok"}`}
          >
            {isPending ? "..." : isActive ? "Ativa" : "Inativa"}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="text-[11px] font-black uppercase tracking-widest text-vp-urgent hover:underline"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export function VozesClient({ initialVoices }: { initialVoices: Voice[] }) {
  const [voices, setVoices] = useState(initialVoices);
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");

  const filtered = voices.filter(v =>
    filter === "all" ? true : filter === "active" ? v.isActive : !v.isActive
  );

  return (
    <div className="space-y-6">
      <VoiceComposer onCreated={v => setVoices(prev => [v, ...prev])} />

      <div className="flex items-center justify-between">
        <div className="font-serif italic text-[13px] text-vp-text-3">
          {voices.filter(v => v.isActive).length} ativas &middot; {voices.length} total
        </div>
        <div className="flex gap-1">
          {(["all", "active", "inactive"] as const).map(f => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 border transition-colors ${filter === f ? "border-vp-accent text-vp-accent bg-vp-accent/10" : "border-vp-border text-vp-text-4 hover:border-vp-text-3"}`}
            >
              {f === "all" ? "Todas" : f === "active" ? "Ativas" : "Inativas"}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {filtered.map(v => (
          <VoiceRow
            key={v.id}
            voice={v}
            onDeleted={() => setVoices(prev => prev.filter(x => x.id !== v.id))}
          />
        ))}
        {filtered.length === 0 && (
          <div className="py-16 text-center font-serif italic text-vp-text-3 border border-vp-border">
            Nenhuma voz encontrada.
          </div>
        )}
      </div>
    </div>
  );
}
