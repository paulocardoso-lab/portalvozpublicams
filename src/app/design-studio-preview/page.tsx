import React from 'react';
import { Home as HomeContent } from '@/components/home/Home';

export const dynamic = 'force-dynamic';

export default async function DesignStudioPreviewPage() {
  return <HomeContent />;
}
