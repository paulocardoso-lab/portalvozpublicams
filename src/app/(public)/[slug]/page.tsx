import React from 'react';
import { MobileArticle } from '@/components/article/MobileArticle';
import { DesktopArticle } from '@/components/article/DesktopArticle';

export default function ArticlePage() {
  return (
    <>
      <div className="md:hidden">
        <MobileArticle />
      </div>
      <div className="hidden md:block">
        <DesktopArticle />
      </div>
    </>
  );
}
