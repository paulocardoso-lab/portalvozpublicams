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
        className="m-l" 
        style={{ 
          padding: `${fs * 0.25}px ${fs * 0.4}px ${fs * 0.22}px`, 
          fontSize: `${fs}px` 
        }}
      >
        VP
      </span>
      <span 
        className="m-r" 
        style={{ 
          padding: `${fs * 0.35}px ${fs * 0.4}px ${fs * 0.2}px`, 
          fontSize: `${fs * 0.55}px` 
        }}
      >
        MS
      </span>
    </div>
  );
}
