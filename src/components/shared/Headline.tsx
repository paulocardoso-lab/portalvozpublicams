import React from 'react';
import Link from 'next/link';

interface HeadlineProps {
  children: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  href?: string;
  size?: 'hero' | 'article' | 'h2' | 'h3' | 'card' | 'small';
  className?: string;
  hoverAccent?: boolean;
}

/**
 * Headline — Componente de manchete com tipografia Display (Playfair).
 * Gerencia tamanhos absolutos e efeitos de hover conforme o design.
 */
export function Headline({ 
  children, 
  as: TagName = 'h2', 
  href, 
  size = 'h2', 
  className = '',
  hoverAccent = true 
}: HeadlineProps) {
  
  const sizes = {
    hero: "text-[46px] md:text-[72px] leading-[1.0] tracking-[-0.025em]",
    article: "text-[32px] md:text-[52px] leading-[1.05] tracking-[-0.02em]",
    h2: "text-[32px] leading-[1.15] tracking-[-0.015em]",
    h3: "text-[22px] md:text-[26px] leading-[1.2] tracking-[-0.01em]",
    card: "text-[18px] md:text-[20px] leading-[1.1] tracking-[-0.01em]",
    small: "text-[16px] leading-[1.1]"
  };

  const baseClasses = `font-display font-bold text-vp-text transition-colors duration-150 ${sizes[size]} ${hoverAccent ? 'hover:text-vp-accent' : ''} ${className}`;

  if (href) {
    return (
      <TagName className={baseClasses}>
        <Link href={href} className="no-underline text-inherit">
          {children}
        </Link>
      </TagName>
    );
  }

  return (
    <TagName className={baseClasses}>
      {children}
    </TagName>
  );
}
