import React from 'react';
import { Monogram } from './Monogram';

export function BrandLogo({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg' | 'xl', className?: string }) {
  return <Monogram size={size} className={className} />;
}
