'use client';

import { useEffect, useRef } from 'react';
import { recordView } from '@/app/actions/analytics';

interface ViewLoggerProps {
  articleId: string;
}

export function ViewLogger({ articleId }: ViewLoggerProps) {
  const recorded = useRef(false);

  useEffect(() => {
    if (!recorded.current) {
      recorded.current = true;
      // Esperar um pouco para garantir que não é um crawler ou bounce imediato
      const timer = setTimeout(() => {
        recordView(articleId);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [articleId]);

  return null;
}
