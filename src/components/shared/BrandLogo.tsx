export function BrandLogo({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg' | 'xl', className?: string }) {
  const fontSizes = {
    sm: 14,
    md: 20,
    lg: 28,
    xl: 36
  };
  
  const fs = fontSizes[size];

  return (
    <div className={`vp-monogram ${className}`} style={{ fontSize: `${fs}px` }}>
      <span 
        className="m-l font-display font-black" 
        style={{ 
          padding: `${fs * 0.22}px ${fs * 0.45}px ${fs * 0.2}px`, 
          fontSize: `${fs}px`,
          lineHeight: 1
        }}
      >
        VP
      </span>
      <span 
        className="m-r font-sans font-black" 
        style={{ 
          padding: `${fs * 0.38}px ${fs * 0.45}px ${fs * 0.18}px`, 
          fontSize: `${fs * 0.58}px`,
          lineHeight: 1
        }}
      >
        MS
      </span>
    </div>
  );
}
