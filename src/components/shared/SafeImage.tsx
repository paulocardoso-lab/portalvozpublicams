import React from 'react';
import Image, { type ImageLoader, type ImageProps } from 'next/image';

interface SafeImageProps extends ImageProps {
  fallbackLabel?: string;
}

const AUTHORIZED_HOSTS = [
  'supabase.co',
  'globo.com',
  'site.com.br',
  'googleusercontent.com',
  'com.br'
];

const passthroughLoader: ImageLoader = ({ src }) => src;

export function SafeImage({ src, alt, ...props }: SafeImageProps) {
  if (!src) return null;

  // Se for uma string (URL)
  if (typeof src === 'string') {
    const isAuthorized = AUTHORIZED_HOSTS.some(host => src.includes(host));
    
    // URLs fora da allowlist passam sem otimização para evitar erro de remotePatterns.
    if (!isAuthorized && src.startsWith('http')) {
      return (
        <Image
          src={src}
          alt={alt}
          {...props}
          unoptimized
          loader={passthroughLoader}
        />
      );
    }
  }

  return <Image src={src} alt={alt} {...props} />;
}
