"use client";

import React, { useState, useTransition } from "react";
import type { Poll, PollOption, PollPlacement } from "@prisma/client";
import {
  createPoll,
  updatePoll,
  togglePoll,
  deletePoll,
  resetPollVotes,
} from "@/app/actions/polls";

type PollWithRelations = Poll & {
  options: PollOption[];
  _count: { votes: number };
};

const PLACEMENT_LABELS: Record<PollPlacement, string> = {
  SIDEBAR: "Sidebar",
  ABOVE_FOOTER: "Acima do rodapé",
  BOTH: "Ambos",
};

// ── Formulário ────────────────────────────────────────────────────────────────

function PollForm({
  initial,
  onSaved,
  onCancel,
}: {
  initial?: PollWithRelations;
  onSaved: (p: PollWithRelations) => void;
  onCancel: () => void;
}) {
  const [question, setQuestion] = useState(initial?.question ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [placement, setPlacement] = useState<PollPlacement>(
    initial?.placement ?? "SIDEBAR"
  );
  const [expiresAt, setExpiresAt] = useState(
    initial?.expiresAt
      ? new Date(initial.expiresAt).toISOString().slice(0, 16)
      : ""
  );
  const [maxVotes, setMaxVotes] = useState(
    initial?.maxVotes?.toString() ?? ""
  );
  const [showResults, setShowResults] = useState(initial?.showResults ?? false);
  const [options, setOptions] = useState<{ label: string }[]>(
    initial?.options.map((o) => ({ label: o.label })) ?? [
      { label: "" },
      { label: "" },
    ]
  );
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function addOption() {
    setOptions((prev) => [...prev, { label: "" }]);
  }

  function removeOption(i: number) {
    setOptions((prev) => prev.filter((_, idx) => idx !== i));
  }

  function updateOption(i: number, val: string) {
    setOptions((prev) => prev.map((o, idx) => (idx === i ? { label: val } : o)));
  }

  function autoSlug(q: string) {
    return q
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .slice(0, 60);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const filled = options.filter((o) => o.label.trim());
    if (filled.length < 2) {
      setError("Adicione pelo menos 2 opções.");
      return;
    }
    startTransition(async () => {
      const payload = {
        question: question.trim(),
        slug: slug.trim() || autoSlug(question),
        placement,
        expiresAt: expiresAt || null,
        maxVotes: maxVotes ? parseInt(maxVotes, 10) : null,
        showResults,
        options: filled.map((o, i) => ({ label: o.label.trim(), displayOrder: i })),
      };
      try {
        let result: PollWithRelations;
        if (initial) {
          result = (await updatePoll(initial.id, payload)) as PollWithRelations;
        } else {
          result = (await createPoll(payload)) as PollWithRelations;
        }
        onSaved({ ...result, options: payload.options.map((o, i) => ({ id: "", pollId: result.id, ...o, votes: 0, displayOrder: i })), _count: { votes: 0 } });
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Erro ao salvar.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="border border-vp-border bg-[#141413] p-6 space-y-5">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-1.5 h-1.5 bg-vp-accent rotate-45 shrink-0" />
        <span className="font-sans text-[10px] uppercase tracking-widest font-bold text-vp-accent">
          {initial ? "Editar enquete" : "Nova enquete"}
        </span>
      </div>

      {/* Pergunta */}
      <div>
        <label className="block font-sans text-[11px] text-vp-text-3 uppercase tracking-widest mb-1.5">
          Pergunta *
        </label>
        <textarea
          value={question}
          onChange={(e) => {
            setQuestion(e.target.value);
            if (!initial) setSlug(autoSlug(e.target.value));
          }}
          required
          rows={2}
          className="w-full bg-vp-bg border border-vp-border px-3 py-2 font-serif text-[15px] text-vp-text resize-none focus:outline-none focus:border-vp-accent"
          placeholder="Qual é a sua opinião sobre...?"
        />
      </div>

      {/* Slug */}
      <div>
        <label className="block font-sans text-[11px] text-vp-text-3 uppercase tracking-widest mb-1.5">
          Slug (URL)
        </label>
        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="w-full bg-vp-bg border border-vp-border px-3 py-2 font-mono text-[13px] text-vp-text focus:outline-none focus:border-vp-accent"
          placeholder="gerado-automaticamente"
        />
      </div>

      {/* Opções */}
      <div>
        <label className="block font-sans text-[11px] text-vp-text-3 uppercase tracking-widest mb-2">
          Opções *
        </label>
        <div className="space-y-2">
          {options.map((opt, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={opt.label}
                onChange={(e) => updateOption(i, e.target.value)}
                className="flex-1 bg-vp-bg border border-vp-border px-3 py-2 font-sans text-[13px] text-vp-text focus:outline-none focus:border-vp-accent"
                placeholder={`Opção ${i + 1}`}
              />
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOption(i)}
                  className="px-2 text-vp-text-4 hover:text-red-400 transition-colors font-mono text-[14px]"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
        {options.length < 6 && (
          <button
            type="button"
            onClick={addOption}
            className="mt-2 font-sans text-[11px] text-vp-accent hover:underline uppercase tracking-widest"
          >
            + Adicionar opção
          </button>
        )}
      </div>

      {/* Configurações */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-sans text-[11px] text-vp-text-3 uppercase tracking-widest mb-1.5">
            Posicionamento
          </label>
          <select
            value={placement}
            onChange={(e) => setPlacement(e.target.value as PollPlacement)}
            className="w-full bg-vp-bg border border-vp-border px-3 py-2 font-sans text-[13px] text-vp-text focus:outline-none focus:border-vp-accent"
          >
            <option value="SIDEBAR">Sidebar</option>
            <option value="ABOVE_FOOTER">Acima do rodapé</option>
            <option value="BOTH">Ambos</option>
          </select>
        </div>

        <div>
          <label className="block font-sans text-[11px] text-vp-text-3 uppercase tracking-widest mb-1.5">
            Expirar em
          </label>
          <input
            type="datetime-local"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            className="w-full bg-vp-bg border border-vp-border px-3 py-2 font-mono text-[13px] text-vp-text focus:outline-none focus:border-vp-accent"
          />
        </div>

        <div>
          <label className="block font-sans text-[11px] text-vp-text-3 uppercase tracking-widest mb-1.5">
            Máx. votos (opcional)
          </label>
          <input
            type="number"
            value={maxVotes}
            onChange={(e) => setMaxVotes(e.target.value)}
            min={1}
            className="w-full bg-vp-bg border border-vp-border px-3 py-2 font-mono text-[13px] text-vp-text focus:outline-none focus:border-vp-accent"
            placeholder="Ilimitado"
          />
        </div>

        <div className="flex items-end pb-2">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showResults}
              onChange={(e) => setShowResults(e.target.checked)}
              className="accent-vp-accent w-4 h-4"
            />
            <span className="font-sans text-[12px] text-vp-text">
              Mostrar resultados antes de votar
            </span>
          </label>
        </div>
      </div>

      {error && (
        <p className="font-sans text-[12px] text-red-400">{error}</p>
      )}

      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          disabled={isPending}
          className="vp-btn vp-btn-primary px-5 py-2 text-[12px] font-bold uppercase tracking-widest disabled:opacity-50"
        >
          {isPending ? "Salvando…" : initial ? "Salvar alterações" : "Criar enquete"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="vp-btn px-5 py-2 text-[12px] font-bold uppercase tracking-widest"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

// ── Card de enquete ───────────────────────────────────────────────────────────

function PollCard({
  poll,
  onEdit,
  onDeleted,
  onToggled,
  onReset,
}: {
  poll: PollWithRelations;
  onEdit: (p: PollWithRelations) => void;
  onDeleted: (id: string) => void;
  onToggled: (id: string, active: boolean) => void;
  onReset: (id: string) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const now = new Date();
  const expired = poll.expiresAt ? new Date(poll.expiresAt) < now : false;
  const full = poll.maxVotes !== null && poll.totalVotes >= poll.maxVotes;

  const statusLabel = !poll.isActive
    ? "Inativa"
    : expired
    ? "Expirada"
    : full
    ? "Encerrada (limite)"
    : "Ativa";

  const statusColor = !poll.isActive || expired || full
    ? "text-vp-text-4"
    : "text-green-400";

  const total = poll.totalVotes;
  const maxPct = Math.max(...poll.options.map((o) => o.votes), 1);

  return (
    <div className="border border-vp-border bg-vp-surface p-5 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="font-serif text-[15px] text-vp-text leading-snug mb-1">
            {poll.question}
          </p>
          <div className="flex flex-wrap gap-2 mt-1">
            <span className={`font-mono text-[10px] uppercase tracking-widest font-bold ${statusColor}`}>
              {statusLabel}
            </span>
            <span className="font-mono text-[10px] text-vp-text-4">
              · {PLACEMENT_LABELS[poll.placement]}
            </span>
            <span className="font-mono text-[10px] text-vp-text-4">
              · {total} {total === 1 ? "voto" : "votos"}
            </span>
            {poll.expiresAt && (
              <span className="font-mono text-[10px] text-vp-text-4">
                · Expira {new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(poll.expiresAt))}
              </span>
            )}
            {poll.maxVotes && (
              <span className="font-mono text-[10px] text-vp-text-4">
                · Máx {poll.maxVotes} votos
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Mini resultado */}
      <div className="space-y-1.5">
        {poll.options.map((opt) => {
          const pct = total > 0 ? Math.round((opt.votes / total) * 100) : 0;
          const isWinner = opt.votes === maxPct && opt.votes > 0;
          return (
            <div key={opt.id} className="flex items-center gap-2">
              <div className="flex-1 relative h-5 bg-vp-bg border border-vp-border overflow-hidden">
                <div
                  className={`absolute inset-y-0 left-0 ${isWinner ? "bg-vp-accent/25" : "bg-vp-accent/10"}`}
                  style={{ width: `${pct}%` }}
                />
                <span className="absolute inset-0 px-2 flex items-center font-sans text-[11px] text-vp-text">
                  {opt.label}
                </span>
              </div>
              <span className={`font-mono text-[11px] w-9 text-right shrink-0 ${isWinner ? "text-vp-accent font-bold" : "text-vp-text-4"}`}>
                {pct}%
              </span>
            </div>
          );
        })}
      </div>

      {/* Ações */}
      <div className="flex flex-wrap gap-3 pt-1 border-t border-vp-border">
        <button
          type="button"
          onClick={() => onEdit(poll)}
          className="font-sans text-[11px] text-vp-accent hover:underline uppercase tracking-widest"
        >
          Editar
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              await togglePoll(poll.id, !poll.isActive);
              onToggled(poll.id, !poll.isActive);
            })
          }
          className="font-sans text-[11px] text-vp-text-4 hover:text-vp-text uppercase tracking-widest disabled:opacity-40"
        >
          {poll.isActive ? "Desativar" : "Ativar"}
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            if (!confirm("Zerar todos os votos desta enquete?")) return;
            startTransition(async () => {
              await resetPollVotes(poll.id);
              onReset(poll.id);
            });
          }}
          className="font-sans text-[11px] text-vp-text-4 hover:text-yellow-400 uppercase tracking-widest disabled:opacity-40"
        >
          Zerar votos
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            if (!confirm("Excluir esta enquete permanentemente?")) return;
            startTransition(async () => {
              await deletePoll(poll.id);
              onDeleted(poll.id);
            });
          }}
          className="font-sans text-[11px] text-vp-text-4 hover:text-red-400 uppercase tracking-widest disabled:opacity-40 ml-auto"
        >
          Excluir
        </button>
      </div>
    </div>
  );
}

// ── Client principal ──────────────────────────────────────────────────────────

export function EnquetesClient({
  initialPolls,
}: {
  initialPolls: PollWithRelations[];
}) {
  const [polls, setPolls] = useState<PollWithRelations[]>(initialPolls);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<PollWithRelations | null>(null);

  function handleSaved(poll: PollWithRelations) {
    if (editing) {
      setPolls((prev) => prev.map((p) => (p.id === poll.id ? poll : p)));
    } else {
      setPolls((prev) => [poll, ...prev]);
    }
    setShowForm(false);
    setEditing(null);
  }

  function handleEdit(poll: PollWithRelations) {
    setEditing(poll);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCancel() {
    setShowForm(false);
    setEditing(null);
  }

  function handleDeleted(id: string) {
    setPolls((prev) => prev.filter((p) => p.id !== id));
  }

  function handleToggled(id: string, active: boolean) {
    setPolls((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: active } : p))
    );
  }

  function handleReset(id: string) {
    setPolls((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              totalVotes: 0,
              options: p.options.map((o) => ({ ...o, votes: 0 })),
              _count: { votes: 0 },
            }
          : p
      )
    );
  }

  return (
    <div className="space-y-6">
      {/* Botão nova enquete / formulário */}
      {showForm ? (
        <PollForm
          initial={editing ?? undefined}
          onSaved={handleSaved}
          onCancel={handleCancel}
        />
      ) : (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="vp-btn vp-btn-primary px-5 py-2.5 text-[12px] font-bold uppercase tracking-widest"
        >
          + Nova enquete
        </button>
      )}

      {/* Lista */}
      {polls.length === 0 ? (
        <p className="font-serif italic text-[14px] text-vp-text-3 py-10 text-center">
          Nenhuma enquete criada ainda.
        </p>
      ) : (
        <div className="space-y-4">
          {polls.map((poll) => (
            <PollCard
              key={poll.id}
              poll={poll}
              onEdit={handleEdit}
              onDeleted={handleDeleted}
              onToggled={handleToggled}
              onReset={handleReset}
            />
          ))}
        </div>
      )}
    </div>
  );
}
