import React from 'react';

export function Monogram({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const height = size === 'lg' ? 40 : size === 'sm' ? 24 : 32;
  const fontSize = size === 'lg' ? 24 : size === 'sm' ? 14 : 18;
  const barHeight = size === 'lg' ? 24 : size === 'sm' ? 14 : 18;

  return (
    <div 
      className="flex items-center gap-2 select-none" 
      style={{ height: `${height}px` }}
    >
      <span 
        className="font-display font-bold text-vp-text" 
        style={{ fontSize: `${fontSize}px`, lineHeight: 1 }}
      >
        VP
      </span>
      <div 
        className="w-[2px] bg-vp-accent" 
        style={{ height: `${barHeight}px` }} 
      />
      <span 
        className="font-sans font-semibold text-vp-text tracking-tight" 
        style={{ fontSize: `${fontSize * 0.85}px`, lineHeight: 1 }}
      >
        MS
      </span>
    </div>
  );
}
