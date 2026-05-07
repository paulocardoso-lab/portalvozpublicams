import { requireAdmin } from '@/lib/auth-guard';

export async function saveArticle(formData: FormData) {
  await requireAdmin();
  
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
