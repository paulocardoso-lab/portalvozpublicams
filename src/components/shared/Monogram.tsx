import React from 'react';

interface MonogramProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
  className?: string;
}

/**
 * VP | MS Monogram — Componente central da identidade visual.
 * Proporções rigorosamente fiéis ao design original.
 */
export function Monogram({ size = 'md', className = '' }: MonogramProps) {
  const fs = typeof size === 'number' 
    ? size 
    : size === 'lg' ? 28 : size === 'sm' ? 14 : size === 'xl' ? 56 : 20;

  return (
    <div 
      className={`vp-monogram ${className}`} 
      style={{ fontSize: fs }}
    >
      <span 
        className="m-l" 
        style={{ 
          padding: `${fs * 0.25}px ${fs * 0.4}px ${fs * 0.22}px`, 
          fontSize: fs 
        }}
      >
        VP
      </span>
      <span 
        className="m-r" 
        style={{ 
          padding: `${fs * 0.35}px ${fs * 0.4}px ${fs * 0.2}px`, 
          fontSize: fs * 0.55 
        }}
      >
        MS
      </span>
    </div>
  );
}

