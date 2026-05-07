"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from 'next/navigation';
import { ArticleStatus } from '@prisma/client';
import { uploadImage } from '@/lib/storage';
import { requireAdmin } from '@/lib/auth-guard';

export async function saveArticle(formData: FormData) {
  const admin = await requireAdmin();
  
  const id = formData.get('id') as string;
  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;
  const eyebrow = formData.get('eyebrow') as string;
  const lead = formData.get('lead') as string;
  const content = formData.get('content') as string;
  const sectionId = formData.get('sectionId') as string;
  const status = formData.get('status') as ArticleStatus;
  const authorIds = formData.getAll('authorIds') as string[];
  
  // Handle Hero Image Upload
  const heroImageFile = formData.get('heroImageFile') as File;
  let heroImageUrl: string | undefined;

  if (heroImageFile && heroImageFile.size > 0) {
    try {
      heroImageUrl = await uploadImage(heroImageFile, 'articles');
    } catch (error) {
      console.error('Error uploading hero image:', error);
    }
  }

  const baseData = {
    title,
    slug,
    eyebrow,
    lead,
    body: content as any, // body is Json in Prisma
    status,
    section: { connect: { id: sectionId } },
    updatedAt: new Date(),
    heroImage: heroImageUrl || undefined,
  };

  if (heroImageUrl) {
    baseData.heroImage = heroImageUrl;
  }

  if (id) {
    // 1. Create a version of the CURRENT state before updating
    const currentArticle = await prisma.article.findUnique({ where: { id } });
    if (currentArticle) {
      await prisma.articleVersion.create({
        data: {
          articleId: id,
          body: currentArticle.body as any,
          authorId: admin.id,
        },
      });
    }

    // 2. Update the article
    await prisma.article.update({
      where: { id },
      data: {
        ...baseData,
        authors: {
          set: authorIds.map(aid => ({ id: aid }))
        }
      },
    });
  } else {
    await prisma.article.create({
      data: {
        ...baseData,
        authors: {
          connect: authorIds.map(aid => ({ id: aid }))
        },
        publishedAt: status === 'PUBLISHED' ? new Date() : null,
      },
    });
  }

  revalidatePath('/admin/posts');
  revalidatePath('/');
  revalidatePath(`/${slug}`);
  
  redirect('/admin/posts');
}

export async function deleteArticle(id: string) {
  await requireAdmin();
  await prisma.article.delete({ where: { id } });
  revalidatePath('/admin/posts');
  revalidatePath('/');
}

export async function restoreVersion(versionId: string) {
  await requireAdmin();
  const version = await prisma.articleVersion.findUnique({
    where: { id: versionId },
    include: { article: true }
  });

  if (!version) throw new Error("Version not found");

  await prisma.article.update({
    where: { id: version.articleId },
    data: {
      body: version.body as any,
      updatedAt: new Date(),
    }
  });

  revalidatePath(`/admin/posts/edit/${version.articleId}`);
  revalidatePath(`/${version.article.slug}`);
}
