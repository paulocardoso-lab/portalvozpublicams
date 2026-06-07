"use client";

import { useState, useEffect } from "react";

type PollOption = {
  id: string;
  label: string;
  votes: number;
  displayOrder: number;
};

type Poll = {
  id: string;
  question: string;
  totalVotes: number;
  showResults: boolean;
  expiresAt: string | null;
  maxVotes: number | null;
  options: PollOption[];
};

interface PollWidgetProps {
  poll: Poll;
  variant?: "sidebar" | "above_footer";
}

function isClosed(poll: Poll): boolean {
  if (poll.expiresAt && new Date(poll.expiresAt) < new Date()) return true;
  if (poll.maxVotes !== null && poll.totalVotes >= poll.maxVotes) return true;
  return false;
}

function cookieKey(pollId: string) {
  return `pvp_poll_${pollId}`;
}

function hasVotedCookie(pollId: string): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.split(";").some((c) => c.trim().startsWith(cookieKey(pollId) + "="));
}

export function PollWidget({ poll, variant = "sidebar" }: PollWidgetProps) {
  const [voted, setVoted] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [livePoll, setLivePoll] = useState<Poll>(poll);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const closed = isClosed(livePoll);
  const showBars = voted || closed || livePoll.showResults;

  useEffect(() => {
    if (hasVotedCookie(poll.id)) setVoted(true);
  }, [poll.id]);

  async function handleVote(optionId: string) {
    if (voted || loading || closed) return;
    setLoading(true);
    setError(null);
    setSelectedId(optionId);

    try {
      const res = await fetch(`/api/polls/${poll.id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionId }),
      });
      const data = await res.json();

      if (res.status === 409 || res.status === 429) {
        setVoted(true);
        return;
      }
      if (!res.ok) {
        setError("Não foi possível registrar seu voto. Tente novamente.");
        setSelectedId(null);
        return;
      }

      setLivePoll(data.poll);
      setVoted(true);
    } catch {
      setError("Erro de conexão. Tente novamente.");
      setSelectedId(null);
    } finally {
      setLoading(false);
    }
  }

  const total = livePoll.totalVotes || 1; // evita divisão por zero

  const isAboveFooter = variant === "above_footer";

  return (
    <div
      className={
        isAboveFooter
          ? "border border-vp-border bg-vp-surface w-full"
          : "border border-vp-border bg-vp-surface"
      }
    >
      {/* Cabeçalho */}
      <div className="px-4 py-2.5 border-b border-vp-border flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-vp-accent rotate-45 shrink-0" />
        <span className="font-sans text-[10px] uppercase tracking-[0.14em] font-bold text-vp-text">
          Enquete
        </span>
        {closed && (
          <span className="ml-auto font-mono text-[9px] text-vp-text-4 uppercase tracking-widest">
            Encerrada
          </span>
        )}
      </div>

      {/* Corpo */}
      <div className={isAboveFooter ? "p-6 max-w-2xl mx-auto" : "p-4"}>
        <p
          className={
            isAboveFooter
              ? "font-serif text-[17px] text-vp-text leading-snug mb-5"
              : "font-serif text-[14px] text-vp-text leading-snug mb-4"
          }
        >
          {livePoll.question}
        </p>

        <div className="flex flex-col gap-2">
          {livePoll.options.map((opt) => {
            const pct = showBars ? Math.round((opt.votes / total) * 100) : 0;
            const isSelected = selectedId === opt.id;
            const isWinner =
              showBars &&
              opt.votes === Math.max(...livePoll.options.map((o) => o.votes)) &&
              opt.votes > 0;

            return (
              <button
                key={opt.id}
                disabled={voted || loading || closed}
                onClick={() => handleVote(opt.id)}
                className={[
                  "relative w-full text-left overflow-hidden border transition-colors",
                  isAboveFooter ? "px-4 py-3" : "px-3 py-2.5",
                  voted || closed
                    ? "cursor-default border-vp-border"
                    : "border-vp-border hover:border-vp-accent/60 cursor-pointer",
                  isSelected && !showBars ? "border-vp-accent" : "",
                  isWinner ? "border-vp-accent/50" : "",
                ].join(" ")}
              >
                {/* Barra de progresso de fundo */}
                {showBars && (
                  <span
                    className={[
                      "absolute inset-y-0 left-0 transition-all duration-700",
                      isWinner ? "bg-vp-accent/20" : "bg-vp-accent/8",
                    ].join(" ")}
                    style={{ width: `${pct}%` }}
                  />
                )}

                <span className="relative flex items-center justify-between gap-2">
                  <span
                    className={[
                      "font-sans",
                      isAboveFooter ? "text-[13px]" : "text-[12px]",
                      isWinner ? "text-vp-text font-semibold" : "text-vp-text",
                    ].join(" ")}
                  >
                    {opt.label}
                  </span>
                  {showBars && (
                    <span
                      className={[
                        "font-mono text-[11px] shrink-0",
                        isWinner ? "text-vp-accent font-bold" : "text-vp-text-4",
                      ].join(" ")}
                    >
                      {pct}%
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>

        {/* Rodapé do widget */}
        <div className="mt-3 flex items-center justify-between">
          <span className="font-mono text-[10px] text-vp-text-4">
            {livePoll.totalVotes} {livePoll.totalVotes === 1 ? "voto" : "votos"}
          </span>
          {voted && !closed && (
            <span className="font-mono text-[10px] text-vp-accent uppercase tracking-widest">
              Voto registrado
            </span>
          )}
        </div>

        {error && (
          <p className="mt-2 font-sans text-[11px] text-red-500">{error}</p>
        )}
      </div>
    </div>
  );
}
