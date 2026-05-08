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
      <span className="m-l">VP</span>
      <span className="m-r">MS</span>
    </div>
  );
}
