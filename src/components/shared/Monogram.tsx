import Image from 'next/image';
import { getSiteSettings } from '@/app/actions/settings';

const SIZE_MAP = { sm: 32, md: 48, lg: 64, xl: 96 } as const;

interface MonogramProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
  className?: string;
}

export async function Monogram({ size = 'md', className = '' }: MonogramProps) {
  const height = typeof size === 'number' ? size : SIZE_MAP[size];

  let logoUrl = '/logo.png';
  try {
    const settings = await getSiteSettings();
    if (settings['BRAND_LOGO_URL']) logoUrl = settings['BRAND_LOGO_URL'];
  } catch {
    // fall back to static logo
  }

  return (
    <Image
      src={logoUrl}
      alt="Voz Pública MS"
      height={height}
      width={height * 6}
      className={className}
      style={{ height: `${height}px`, width: 'auto', objectFit: 'contain' }}
      priority
      unoptimized={logoUrl.startsWith('http')}
    />
  );
}
