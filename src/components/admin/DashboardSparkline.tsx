"use client";

import React from 'react';

interface DashboardSparklineProps {
  points: number[];
  color?: string;
  height?: number;
}

export function DashboardSparkline({ points, color = '#d97757', height = 120 }: DashboardSparklineProps) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const w = 400;
  const step = w / (points.length - 1);
  
  const norm = (v: number) => {
    const range = max - min || 1;
    return height - ((v - min) / range) * (height - 12) - 6;
  };

  const path = points.map((p, i) => 
    `${i === 0 ? 'M' : 'L'} ${i * step} ${norm(p)}`
  ).join(' ');

  return (
    <div className="w-full relative group">
      <svg 
        viewBox={`0 0 ${w} ${height}`} 
        className="w-full h-full block overflow-visible drop-shadow-[0_0_15px_rgba(217,119,87,0.15)]" 
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="sparkGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Area fill */}
        <path 
          d={`${path} L ${w} ${height} L 0 ${height} Z`} 
          fill="url(#sparkGradient)" 
          className="transition-all duration-700"
        />
        
        {/* Line */}
        <path 
          d={path} 
          fill="none" 
          stroke={color} 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="transition-all duration-500"
        />

        {/* Current point dot */}
        <circle 
          cx={w} 
          cy={norm(points[points.length-1])} 
          r="4" 
          fill={color} 
          className="animate-pulse" 
        />
      </svg>
    </div>
  );
}
