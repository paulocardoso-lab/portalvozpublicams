import React from 'react';
import { Monogram } from './Monogram';

export function BrandLogo({
  size = 'md',
  className = '',
  src,
}: {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  src?: string;
}) {
  return <Monogram size={size} className={className} src={src} />;
}
