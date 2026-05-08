import React from 'react';

interface TagProps {
  children: React.ReactNode;
  variant?: 'live' | 'breaking' | 'update' | 'opinion';
  className?: string;
}

/**
 * Tag — Selos de status para matérias (Ao Vivo, Urgente, etc).
 * Implementa animação de pulso para o modo 'live'.
 */
export function Tag({ children, variant = 'breaking', className = '' }: TagProps) {
  const baseClasses = "font-sans text-[10px] font-bold uppercase tracking-[0.14em] px-[7px] py-[3px] rounded-[2px] inline-block";
  
  const variants = {
    live: "bg-vp-live text-white animate-[vp-pulse_2s_infinite]",
    breaking: "bg-vp-accent text-[#1a1a19]",
    update: "border border-vp-accent text-vp-accent",
    opinion: "border border-vp-text-3 text-vp-text-2"
  };

  return (
    <span className={`${baseClasses} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
