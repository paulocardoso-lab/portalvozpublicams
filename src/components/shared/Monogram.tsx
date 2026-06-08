import Image from 'next/image';
import type { CSSProperties } from 'react';

const SIZE_MAP = { sm: 32, md: 48, lg: 64, xl: 96 } as const;
const LOGO_ASPECT_RATIO = 1536 / 1024;

interface MonogramProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
  className?: string;
  src?: string;
  cssHeight?: string;
  style?: CSSProperties;
}

export function Monogram({ size = 'md', className = '', src = '/api/brand/logo', cssHeight, style }: MonogramProps) {
  const height = typeof size === 'number' ? size : SIZE_MAP[size];

  return (
    <Image
      src={src}
      alt="Voz Pública MS"
      height={height}
      width={Math.round(height * LOGO_ASPECT_RATIO)}
      className={className}
      style={{ height: cssHeight ?? `${height}px`, maxHeight: '100%', maxWidth: '100%', width: 'auto', objectFit: 'contain', ...style }}
      priority
      unoptimized={src.startsWith('http') || src.startsWith('/api/')}
    />
  );
}
