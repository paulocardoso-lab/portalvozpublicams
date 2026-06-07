import Image from 'next/image';

const SIZE_MAP = { sm: 32, md: 48, lg: 64, xl: 96 } as const;
const LOGO_ASPECT_RATIO = 1536 / 1024;

interface MonogramProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
  className?: string;
  src?: string;
}

export function Monogram({ size = 'md', className = '', src = '/logo.webp' }: MonogramProps) {
  const height = typeof size === 'number' ? size : SIZE_MAP[size];

  return (
    <Image
      src={src}
      alt="Voz Pública MS"
      height={height}
      width={Math.round(height * LOGO_ASPECT_RATIO)}
      className={className}
      style={{ height: `${height}px`, maxWidth: '100%', width: 'auto', objectFit: 'contain' }}
      priority
      unoptimized={src.startsWith('http')}
    />
  );
}
