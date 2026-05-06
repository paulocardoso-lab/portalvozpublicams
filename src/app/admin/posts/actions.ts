'use server'

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { ArticleStatus } from '@prisma/client';
import { uploadImage } from '@/lib/storage';

export async function saveArticle(formData: FormData) {
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
      // In a real app, we'd return an error to the UI here
    }
  }

  const baseData: any = {
    title,
    slug,
    eyebrow,
    lead,
    body: content,
    status,
    section: { connect: { id: sectionId } },
    updatedAt: new Date(),
  };

  if (heroImageUrl) {
    baseData.heroImage = heroImageUrl;
  }

  if (id) {
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
  await prisma.article.delete({ where: { id } });
  revalidatePath('/admin/posts');
  revalidatePath('/');
}
