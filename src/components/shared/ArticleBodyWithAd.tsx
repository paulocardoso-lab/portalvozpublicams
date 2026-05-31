"use client";

import React, { useMemo } from 'react';
import { AdSlot } from '@/components/shared/AdSlot';

interface ArticleBodyWithAdProps {
  html: string;
  className?: string;
  adSlotId?: string;
  insertAfterParagraph?: number;
}

/**
 * Renders article HTML and injects an AdSlot after the Nth paragraph.
 * Splits on </p> boundaries so the ad never breaks mid-sentence.
 */
export function ArticleBodyWithAd({
  html,
  className = '',
  adSlotId = 'in-article',
  insertAfterParagraph = 3,
}: ArticleBodyWithAdProps) {
  const { before, after } = useMemo(() => {
    const parts = html.split('</p>');
    if (parts.length <= insertAfterParagraph) {
      return { before: html, after: '' };
    }
    const before = parts.slice(0, insertAfterParagraph).join('</p>') + '</p>';
    const after = parts.slice(insertAfterParagraph).join('</p>');
    return { before, after };
  }, [html, insertAfterParagraph]);

  return (
    <div className={className}>
      <div dangerouslySetInnerHTML={{ __html: before }} />
      {after && (
        <>
          <div className="my-8">
            <AdSlot id={adSlotId} className="w-full" />
          </div>
          <div dangerouslySetInnerHTML={{ __html: after }} />
        </>
      )}
      {!after && <div dangerouslySetInnerHTML={{ __html: before === html ? '' : '' }} />}
    </div>
  );
}
