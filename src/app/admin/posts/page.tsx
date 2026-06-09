import React from 'react';
import prisma from '@/lib/prisma';
import { PostsClient } from './PostsClient';

export const dynamic = 'force-dynamic';

export default async function AdminPostsPage() {
  const [articles, authors, sections] = await Promise.all([
    prisma.article.findMany({
      include: {
        authors: { select: { id: true, name: true, avatar: true } },
        section: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
    prisma.user.findMany({
      where: { status: 'ACTIVE', role: { not: 'READER' } },
      select: { id: true, name: true, avatar: true },
      orderBy: { name: 'asc' },
    }),
    prisma.section.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    }),
  ]);

  return (
    <PostsClient
      initialArticles={articles}
      authors={authors}
      sections={sections}
    />
  );
}
