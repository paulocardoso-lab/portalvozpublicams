import Image from 'next/image';

const SIZE_MAP = { sm: 32, md: 48, lg: 64, xl: 96 } as const;

export function Monogram({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg' | 'xl' | number, className?: string }) {
  const height = typeof size === 'number' ? size : SIZE_MAP[size];

  return (
    <Image
      src="/logo.png"
      alt="Voz Pública MS"
      height={height}
      width={height * 6}
      className={className}
      style={{ height: `${height}px`, width: 'auto', objectFit: 'contain' }}
      priority
    />
  );
}
