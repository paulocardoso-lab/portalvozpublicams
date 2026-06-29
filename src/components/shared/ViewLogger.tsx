'use client';

import { useEffect, useRef } from 'react';
import { recordView } from '@/app/actions/analytics';

interface ViewLoggerProps {
  articleId: string;
}

const VISITOR_KEY = 'vp_visitor_id';

function getVisitorId() {
  try {
    const stored = localStorage.getItem(VISITOR_KEY);
    if (stored) return stored;

    const id = crypto.randomUUID();
    localStorage.setItem(VISITOR_KEY, id);
    return id;
  } catch {
    return undefined;
  }
}

export function ViewLogger({ articleId }: ViewLoggerProps) {
  const recorded = useRef(false);

  useEffect(() => {
    if (!recorded.current) {
      recorded.current = true;
      // Esperar um pouco para garantir que não é um crawler ou bounce imediato
      const timer = setTimeout(() => {
        recordView(articleId, getVisitorId());
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [articleId]);

  return null;
}
