import React from 'react';

export function BrandLogo({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg' | 'xl', className?: string }) {
  const heights = {
    sm: '18px',
    md: '24px',
    lg: '32px',
    xl: '40px'
  };

  const fontSizesVoz = {
    sm: '16px',
    md: '22px',
    lg: '28px',
    xl: '36px'
  };

  const fontSizesPublica = {
    sm: '10px',
    md: '13px',
    lg: '17px',
    xl: '22px'
  };

  const gap = {
    sm: '6px',
    md: '8px',
    lg: '10px',
    xl: '12px'
  };

  return (
    <div className={`flex items-center select-none ${className}`} style={{ gap: gap[size], height: heights[size] }}>
      <span 
        className="font-display font-bold text-vp-text uppercase leading-none"
        style={{ fontSize: fontSizesVoz[size] }}
      >
        VOZ
      </span>
      <div 
        className="w-[1.5px] bg-vp-accent self-stretch"
        style={{ opacity: 0.9 }}
      />
      <span 
        className="font-sans font-medium text-vp-text uppercase leading-none tracking-[0.12em] whitespace-nowrap"
        style={{ fontSize: fontSizesPublica[size], marginTop: '2px' }}
      >
        PÚBLICA MS
      </span>
    </div>
  );
}
