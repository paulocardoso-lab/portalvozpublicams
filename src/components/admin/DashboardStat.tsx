import React from 'react';

interface DashboardStatProps {
  label: string;
  value: string;
  delta?: string;
  sub?: string;
}

export function DashboardStat({ label, value, delta, sub }: DashboardStatProps) {
  const isUp = delta?.startsWith('+');
  
  return (
    <div className="vp-panel p-5 bg-[#141413] border border-vp-border hover:border-vp-accent/30 transition-all group">
      <div className="text-[10px] text-vp-text-4 font-black uppercase tracking-[0.15em] mb-4 group-hover:text-vp-accent transition-colors">
        {label}
      </div>
      <div className="font-display text-[32px] lg:text-[42px] leading-none font-black text-vp-text">
        {value}
      </div>
      <div className="mt-4 flex items-center gap-3 text-[12px]">
        {delta && (
          <span className={`font-black px-1.5 py-0.5 rounded-sm ${isUp ? 'text-vp-ok bg-vp-ok/10' : 'text-vp-urgent bg-vp-urgent/10'}`}>
            {delta}
          </span>
        )}
        <span className="text-vp-text-4 font-medium italic">{sub}</span>
      </div>
    </div>
  );
}
