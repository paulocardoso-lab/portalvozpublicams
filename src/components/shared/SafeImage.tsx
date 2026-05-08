import React from 'react';
import Image, { ImageProps } from 'next/image';

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

export function SafeImage({ src, alt, ...props }: SafeImageProps) {
  if (!src) return null;

  // Se for uma string (URL)
  if (typeof src === 'string') {
    const isAuthorized = AUTHORIZED_HOSTS.some(host => src.includes(host));
    
    // Se não for autorizado ou for uma URL relativa, usamos a tag img normal para evitar erro 500
    if (!isAuthorized && src.startsWith('http')) {
      return (
        <img 
          src={src} 
          alt={alt as string} 
          {...(props as any)} 
          style={{ objectFit: 'cover', width: '100%', height: '100%', ...props.style }} 
        />
      );
    }
  }

  return <Image src={src} alt={alt} {...props} />;
}
