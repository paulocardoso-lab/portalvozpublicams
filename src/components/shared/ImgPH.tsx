import React from 'react';

export function ImgPH({ label, ratio, height, width, style }: { label?: string, ratio?: string, height?: number | string, width?: number | string, style?: React.CSSProperties }) {
  const s = {
    width: width ?? '100%',
    height: height,
    aspectRatio: !height && ratio ? ratio : undefined,
    ...style,
  };
  return (
    <div className="vp-img-ph" style={s}>
      <span style={{ opacity: 0.7 }}>{label || 'FOTO'}</span>
    </div>
  );
}
