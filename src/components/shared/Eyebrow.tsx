import React from 'react';

interface EyebrowProps {
  children: React.ReactNode;
  variant?: 'accent' | 'muted';
  className?: string;
}

/**
 * Eyebrow — Pequeno rótulo de categoria/editoria acima de manchetes.
 * Rigorosamente fiel aos tokens de tipografia (Inter 600, 11px, Uppercase, 0.14em).
 */
export function Eyebrow({ children, variant = 'accent', className = '' }: EyebrowProps) {
  const colorClass = variant === 'muted' ? 'text-vp-text-3' : 'text-vp-accent';
  
  return (
    <span className={`font-sans text-[11px] font-semibold uppercase tracking-[0.14em] ${colorClass} ${className}`}>
      {children}
    </span>
  );
}
