'use client';

import React, { useState } from 'react';

interface ShareBarProps {
  url: string;
  title: string;
  orientation?: 'vertical' | 'horizontal';
  className?: string;
}

export function ShareBar({ url, title, orientation = 'vertical', className = '' }: ShareBarProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  function openPopup(href: string) {
    window.open(href, '_blank', 'width=600,height=500,noopener,noreferrer');
  }

  function handleWhatsApp() {
    openPopup(`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`);
  }

  function handleFacebook() {
    openPopup(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`);
  }

  function handleTwitter() {
    openPopup(`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`);
  }

  function handleLinkedIn() {
    openPopup(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`);
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const ta = document.createElement('textarea');
      ta.value = url;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function handlePrint() {
    window.print();
  }

  const isVertical = orientation === 'vertical';
  const wrapper = isVertical ? `flex flex-col gap-0 ${className}` : `flex flex-row gap-4 flex-wrap ${className}`;
  const btnClass = isVertical
    ? 'font-sans text-[12px] text-vp-text-2 border-l border-vp-border pl-3 text-left hover:text-vp-accent hover:border-vp-accent transition-all py-1'
    : 'font-sans text-[12px] text-vp-text-2 hover:text-vp-accent transition-colors';

  return (
    <div className={wrapper}>
      <button type="button" className={btnClass} onClick={handleWhatsApp}>WhatsApp</button>
      <button type="button" className={btnClass} onClick={handleFacebook}>Facebook</button>
      <button type="button" className={btnClass} onClick={handleTwitter}>X / Twitter</button>
      <button type="button" className={btnClass} onClick={handleLinkedIn}>LinkedIn</button>
      <button type="button" className={btnClass} onClick={handleCopy}>
        {copied ? '✓ Link copiado!' : 'Copiar link'}
      </button>
      <button type="button" className={btnClass} onClick={handlePrint}>Imprimir</button>
    </div>
  );
}
