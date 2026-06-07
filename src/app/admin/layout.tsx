import React from 'react';
import { AdminShell } from '@/components/admin/AdminShell';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-guard';
import { getSiteSettings } from '@/app/actions/settings';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  const [pendingComments, draftArticles, reviewArticles, settings] = await Promise.all([
    prisma.comment.count({ where: { status: 'PENDING' } }),
    prisma.article.count({ where: { status: 'DRAFT' } }),
    prisma.article.count({ where: { status: 'IN_REVIEW' } }),
    getSiteSettings(),
  ]);

  return (
    <AdminShell
      pendingComments={pendingComments}
      draftArticles={draftArticles}
      reviewArticles={reviewArticles}
      logoUrl={settings['BRAND_LOGO_URL'] || '/logo.webp'}
    >
      {children}
    </AdminShell>
  );
}
