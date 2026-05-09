import React from 'react';

export function Monogram({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg' | 'xl' | number, className?: string }) {
  // Map sizes to height in pixels as defined in the first version
  let height = 32;
  if (typeof size === 'number') {
    height = size;
  } else {
    switch (size) {
      case 'sm': height = 24; break;
      case 'md': height = 32; break;
      case 'lg': height = 40; break;
      case 'xl': height = 56; break;
    }
  }

  return (
    <img 
      src="/logo.png" 
      alt="Voz Pública MS" 
      className={className}
      style={{ height: `${height}px`, width: 'auto', objectFit: 'contain' }} 
    />
  );
}
