import React from 'react';
import { AdminShell } from '@/components/admin/AdminShell';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-guard';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  const [pendingComments, draftArticles, reviewArticles] = await Promise.all([
    prisma.comment.count({ where: { status: 'PENDING' } }),
    prisma.article.count({ where: { status: 'DRAFT' } }),
    prisma.article.count({ where: { status: 'IN_REVIEW' } }),
  ]);

  return (
    <AdminShell
      pendingComments={pendingComments}
      draftArticles={draftArticles}
      reviewArticles={reviewArticles}
    >
      {children}
    </AdminShell>
  );
}
