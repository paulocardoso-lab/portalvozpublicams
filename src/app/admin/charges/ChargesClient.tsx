"use client";

import React, { useRef, useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { SafeImage } from "@/components/shared/SafeImage";
import {
  createCharge,
  deleteCharge,
  generateChargeFromArticle,
  searchArticlesForCharge,
  toggleChargeActive,
  updateCharge,
} from "@/app/actions/charges";
import type { Charge } from "@prisma/client";

// ── Upload / Create Modal ─────────────────────────────────────────────────────

function CreateChargeModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [aiState, setAiState] = useState<{
    loading: boolean;
    description: string | null;
    articleTitle: string | null;
  }>({ loading: false, description: null, articleTitle: null });
  const [articleSearch, setArticleSearch] = useState("");
  const [articleResults, setArticleResults] = useState<
    { id: string; title: string; slug: string }[]
  >([]);
  const [selectedArticle, setSelectedArticle] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [searchPending, startSearchTransition] = useTransition();

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setPreview(URL.createObjectURL(f));
  }

  function handleSearch(q: string) {
    setArticleSearch(q);
    if (q.length < 2) { setArticleResults([]); return; }
    startSearchTransition(async () => {
      const results = await searchArticlesForCharge(q);
      setArticleResults(results);
    });
  }

  function handleSelectArticle(art: { id: string; title: string }) {
    setSelectedArticle(art);
    setArticleSearch(art.title);
    setArticleResults([]);
  }

  async function handleGenerateAI() {
    if (!selectedArticle) return;
    setAiState({ loading: true, description: null, articleTitle: null });
    const result = await generateChargeFromArticle(selectedArticle.id);
    if (result.success) {
      setAiState({ loading: false, description: result.description ?? null, articleTitle: result.articleTitle ?? null });
    } else {
      setAiState({ loading: false, description: null, articleTitle: null });
      setError(result.error ?? "Erro ao gerar descricao.");
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    if (selectedArticle) fd.append("articleId", selectedArticle.id);
    startTransition(async () => {
      const result = await createCharge(fd);
      if (!result.success) { setError(result.error ?? "Erro ao salvar."); return; }
      if (preview) URL.revokeObjectURL(preview);
      router.refresh();
      onClose();
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto" onClick={onClose}>
      <div className="w-full max-w-2xl border border-vp-border bg-[#141413] shadow-2xl my-8" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-vp-border">
          <h2 className="font-display text-[20px] font-bold">Nova Charge</h2>
          <button onClick={onClose} className="text-vp-text-3 hover:text-vp-text">&#10005;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 grid gap-5">
          {/* Vincular materia */}
          <div className="grid gap-1.5">
            <span className="eyebrow text-[10px]">Vincular a uma materia (opcional)</span>
            <div className="relative">
              <input
                type="text"
                className="vp-input text-[13px] w-full"
                placeholder="Buscar materia pelo titulo..."
                value={articleSearch}
                onChange={e => handleSearch(e.target.value)}
              />
              {articleResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-10 bg-[#141413] border border-vp-border shadow-xl max-h-48 overflow-y-auto">
                  {articleResults.map(art => (
                    <button
                      key={art.id}
                      type="button"
                      onClick={() => handleSelectArticle(art)}
                      className="w-full text-left px-4 py-2.5 text-[13px] hover:bg-vp-surface border-b border-vp-border/50 last:border-0"
                    >
                      {art.title}
                    </button>
                  ))}
                </div>
              )}
              {searchPending && <span className="absolute right-3 top-2.5 text-vp-text-4 text-[11px]">Buscando...</span>}
            </div>
            {selectedArticle && (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[11px] text-vp-ok font-bold">&#10003; {selectedArticle.title}</span>
                <button type="button" onClick={() => { setSelectedArticle(null); setArticleSearch(""); }} className="text-[10px] text-vp-text-4 hover:text-vp-urgent">remover</button>
              </div>
            )}
          </div>

          {/* Botao IA */}
          {selectedArticle && (
            <div className="border border-vp-accent/30 bg-vp-accent/5 p-4 rounded-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="font-sans text-[11px] font-bold uppercase tracking-widest text-vp-accent">Gerar ideia com IA</span>
                <button
                  type="button"
                  onClick={handleGenerateAI}
                  disabled={aiState.loading}
                  className="vp-btn vp-btn-primary text-[11px] px-4 py-1.5 font-bold"
                >
                  {aiState.loading ? "Gerando..." : "Gerar descricao"}
                </button>
              </div>
              {aiState.description && (
                <div className="mt-3">
                  <p className="font-sans text-[10px] text-vp-text-4 uppercase tracking-widest mb-1">Descricao gerada:</p>
                  <div className="bg-vp-bg border border-vp-border p-3 font-serif text-[13px] text-vp-text-2 leading-relaxed whitespace-pre-wrap rounded-sm">
                    {aiState.description}
                  </div>
                  <p className="text-[10px] text-vp-text-4 mt-2 italic">Use como referencia para o chargista ou para gerar a imagem externamente.</p>
                </div>
              )}
            </div>
          )}

          {/* Upload imagem */}
          <div className="grid gap-1.5">
            <span className="eyebrow text-[10px]">Imagem da charge *</span>
            <input
              ref={fileRef}
              name="image"
              type="file"
              accept="image/*"
              required
              onChange={handleFile}
              className="vp-input text-[12px] pt-1.5 cursor-pointer"
            />
            {preview && (
              <div className="mt-2 border border-vp-border overflow-hidden max-h-64 flex items-center justify-center bg-vp-surface">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="preview" className="max-h-64 object-contain" />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <span className="eyebrow text-[10px]">Legenda</span>
              <input name="caption" className="vp-input text-[13px]" placeholder="Ex: A reforma que nao veio" />
            </div>
            <div className="grid gap-1.5">
              <span className="eyebrow text-[10px]">Credito / Chargista</span>
              <input name="credit" className="vp-input text-[13px]" placeholder="Ex: Charge: Latuff" />
            </div>
          </div>

          <div className="grid gap-1.5">
            <span className="eyebrow text-[10px]">Data de publicacao</span>
            <input
              name="publishedAt"
              type="datetime-local"
              className="vp-input text-[13px]"
              defaultValue={new Date().toISOString().slice(0, 16)}
            />
          </div>

          {error && <div className="border border-vp-urgent/40 bg-vp-urgent/10 text-vp-urgent px-3 py-2 text-[12px]">{error}</div>}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="vp-btn flex-1 py-2.5">Cancelar</button>
            <button type="submit" disabled={isPending} className="vp-btn vp-btn-primary flex-1 py-2.5 font-bold">
              {isPending ? "Salvando..." : "Publicar charge"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Charge Card Admin ─────────────────────────────────────────────────────────

function ChargeRow({ charge, onDeleted }: { charge: Charge; onDeleted: () => void }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isActive, setIsActive] = useState(charge.isActive);

  function handleToggle() {
    const next = !isActive;
    setIsActive(next);
    startTransition(async () => {
      await toggleChargeActive(charge.id, next);
      router.refresh();
    });
  }

  function handleDelete() {
    if (!confirm("Excluir esta charge permanentemente?")) return;
    startTransition(async () => {
      await deleteCharge(charge.id);
      onDeleted();
      router.refresh();
    });
  }

  const date = charge.publishedAt
    ? new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(charge.publishedAt))
    : "";

  return (
    <div className={`border border-vp-border bg-[#141413] flex gap-4 p-4 transition-opacity ${isActive ? "" : "opacity-50"}`}>
      <div className="w-[80px] h-[80px] shrink-0 border border-vp-border bg-vp-surface overflow-hidden flex items-center justify-center">
        <SafeImage src={charge.imageUrl} alt="" width={80} height={80} className="object-cover w-full h-full" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-sans text-[13px] font-bold text-vp-text truncate">{charge.caption || "Sem legenda"}</p>
            <p className="font-mono text-[11px] text-vp-text-4 mt-0.5">{charge.credit || "Sem credito"} &middot; {date}</p>
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
              className="text-[11px] font-black uppercase tracking-widest text-vp-urgent hover:underline disabled:opacity-50"
            >
              Excluir
            </button>
          </div>
        </div>
        {charge.articleId && (
          <p className="font-sans text-[10px] text-vp-accent mt-1 uppercase tracking-widest">Vinculada a materia</p>
        )}
      </div>
    </div>
  );
}

// ── Main Client ───────────────────────────────────────────────────────────────

export function ChargesClient({ initialCharges }: { initialCharges: Charge[] }) {
  const [charges, setCharges] = useState(initialCharges);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const active = charges.filter(c => c.isActive);
  const inactive = charges.filter(c => !c.isActive);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="font-serif italic text-[13px] text-vp-text-3">
          {active.length} ativa{active.length !== 1 ? "s" : ""} &middot; {charges.length} no arquivo
        </div>
        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="vp-btn vp-btn-primary text-[12px] font-bold uppercase tracking-widest py-2.5 px-8"
        >
          + Nova Charge
        </button>
      </div>

      {active.length > 0 && (
        <div>
          <h2 className="font-sans text-[10px] uppercase tracking-widest font-bold text-vp-ok mb-3">Ativas</h2>
          <div className="flex flex-col gap-3">
            {active.map(c => (
              <ChargeRow key={c.id} charge={c} onDeleted={() => setCharges(prev => prev.filter(x => x.id !== c.id))} />
            ))}
          </div>
        </div>
      )}

      {inactive.length > 0 && (
        <div>
          <h2 className="font-sans text-[10px] uppercase tracking-widest font-bold text-vp-text-4 mb-3">Arquivo</h2>
          <div className="flex flex-col gap-3">
            {inactive.map(c => (
              <ChargeRow key={c.id} charge={c} onDeleted={() => setCharges(prev => prev.filter(x => x.id !== c.id))} />
            ))}
          </div>
        </div>
      )}

      {charges.length === 0 && (
        <div className="py-20 text-center text-vp-text-3 font-serif italic border border-vp-border">
          Nenhuma charge publicada ainda.
        </div>
      )}

      {isCreateOpen && <CreateChargeModal onClose={() => setIsCreateOpen(false)} />}
    </div>
  );
}
