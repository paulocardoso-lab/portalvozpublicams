import React from 'react';
import { Monogram } from './Monogram';

export function BrandLogo({
  size = 'md',
  className = '',
  src,
  cssHeight,
}: {
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
  className?: string;
  src?: string;
  cssHeight?: string;
}) {
  return <Monogram size={size} className={className} src={src} cssHeight={cssHeight} />;
}
