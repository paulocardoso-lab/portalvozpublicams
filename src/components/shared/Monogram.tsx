import React from 'react';

export function Monogram({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const height = size === 'lg' ? 40 : size === 'sm' ? 24 : 32;
  return (
    <img src="/logo.png" alt="Voz Pública MS" style={{ height: `${height}px`, width: 'auto', objectFit: 'contain' }} />
  );
}
