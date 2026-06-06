import Image from 'next/image';

const SIZE_MAP = { sm: 32, md: 48, lg: 64, xl: 96 } as const;

interface MonogramProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
  className?: string;
  src?: string;
}

export function Monogram({ size = 'md', className = '', src = '/logo.png' }: MonogramProps) {
  const height = typeof size === 'number' ? size : SIZE_MAP[size];

  return (
    <Image
      src={src}
      alt="Voz Pública MS"
      height={height}
      width={height * 6}
      className={className}
      style={{ height: `${height}px`, maxWidth: '100%', width: 'auto', objectFit: 'contain' }}
      priority
      unoptimized={src.startsWith('http')}
    />
  );
}
