"use client";

import React, { useState } from "react";

type Point = { date: string; views: number };

const W = 800;
const H = 120;
const PAD = { top: 8, right: 8, bottom: 24, left: 44 };

function toPath(points: { x: number; y: number }[]) {
  if (points.length === 0) return "";
  return points
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");
}

export default function ViewsSparkline({ daily }: { daily: Point[] }) {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; point: Point } | null>(null);

  // daily comes desc from server; reverse for left→right
  const sorted = [...daily].reverse();
  if (sorted.length === 0) return null;

  const maxViews = Math.max(...sorted.map((d) => d.views), 1);
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  const pts = sorted.map((d, i) => ({
    x: PAD.left + (i / Math.max(sorted.length - 1, 1)) * chartW,
    y: PAD.top + chartH - (d.views / maxViews) * chartH,
    data: d,
  }));

  const linePath = toPath(pts);
  const areaPath =
    linePath +
    ` L${pts[pts.length - 1].x.toFixed(1)},${(PAD.top + chartH).toFixed(1)}` +
    ` L${pts[0].x.toFixed(1)},${(PAD.top + chartH).toFixed(1)} Z`;

  // Y-axis labels
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((t) => ({
    value: Math.round(maxViews * t),
    y: PAD.top + chartH - t * chartH,
  }));

  // X-axis: show ~5 evenly spaced labels
  const xStep = Math.max(1, Math.floor(sorted.length / 5));
  const xTicks = sorted
    .map((d, i) => ({ d, i }))
    .filter(({ i }) => i % xStep === 0 || i === sorted.length - 1);

  function fmtDate(iso: string) {
    const d = new Date(iso);
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
  }

  function fmtFull(iso: string) {
    return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
  }

  return (
    <div className="relative w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ minWidth: 320, height: H }}
        onMouseLeave={() => setTooltip(null)}
      >
        <defs>
          <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-vp-accent, #e8a020)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--color-vp-accent, #e8a020)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Y gridlines */}
        {yTicks.map(({ value, y }) => (
          <g key={value}>
            <line x1={PAD.left} x2={W - PAD.right} y1={y} y2={y} stroke="#ffffff14" strokeWidth={1} />
            <text x={PAD.left - 6} y={y + 4} textAnchor="end" fill="#888" fontSize={9}>
              {value > 999 ? `${(value / 1000).toFixed(1)}k` : value}
            </text>
          </g>
        ))}

        {/* Area fill */}
        <path d={areaPath} fill="url(#sparkGrad)" />

        {/* Line */}
        <path d={linePath} fill="none" stroke="var(--color-vp-accent, #e8a020)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

        {/* X-axis labels */}
        {xTicks.map(({ d, i }) => (
          <text key={i} x={pts[i].x} y={H - 4} textAnchor="middle" fill="#888" fontSize={9}>
            {fmtDate(d.date)}
          </text>
        ))}

        {/* Hover targets */}
        {pts.map(({ x, y, data }, i) => (
          <rect
            key={i}
            x={i === 0 ? x : pts[i - 1].x + (x - pts[i - 1].x) / 2}
            y={PAD.top}
            width={
              i === 0
                ? (pts[1]?.x ?? x + 10) / 2 - x / 2
                : i === pts.length - 1
                ? x - (pts[i - 1].x + x) / 2
                : ((pts[i + 1]?.x ?? x) - (pts[i - 1]?.x ?? x)) / 2
            }
            height={chartH}
            fill="transparent"
            onMouseEnter={(e) => {
              const rect = (e.target as SVGElement).closest("svg")!.getBoundingClientRect();
              setTooltip({ x, y, point: data });
            }}
          />
        ))}

        {/* Dot on hover */}
        {tooltip && (
          <circle
            cx={pts.find((p) => p.data.date === tooltip.point.date)?.x ?? 0}
            cy={pts.find((p) => p.data.date === tooltip.point.date)?.y ?? 0}
            r={4}
            fill="var(--color-vp-accent, #e8a020)"
            stroke="#141413"
            strokeWidth={2}
          />
        )}
      </svg>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="pointer-events-none absolute z-10 bg-[#1e1e1c] border border-vp-border rounded px-3 py-2 text-[12px] shadow-lg"
          style={{
            left: `${(tooltip.x / W) * 100}%`,
            top: `${tooltip.y}px`,
            transform: "translate(-50%, -110%)",
          }}
        >
          <div className="font-semibold text-vp-text">{fmtFull(tooltip.point.date)}</div>
          <div className="text-vp-accent font-mono font-bold">{tooltip.point.views.toLocaleString("pt-BR")} views</div>
        </div>
      )}
    </div>
  );
}
