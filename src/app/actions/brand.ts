'use server';

import { requireAdmin } from '@/lib/auth-guard';
import { uploadBrandAsset } from '@/lib/storage';
import { saveSiteSetting } from '@/app/actions/settings';
import { revalidatePath } from 'next/cache';

const ACCEPTED_MIME = new Set([
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/gif',
  'image/svg+xml',
]);

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export async function uploadBrand(formData: FormData, type: 'logo' | 'favicon') {
  await requireAdmin();

  const file = formData.get('file');
  if (!(file instanceof File) || file.size === 0) {
    throw new Error('Nenhum arquivo enviado.');
  }

  if (!ACCEPTED_MIME.has(file.type)) {
    throw new Error(
      `Formato não suportado: ${file.type}. Use PNG, JPG, WebP, GIF ou SVG.`
    );
  }

  if (file.size > MAX_SIZE_BYTES) {
    throw new Error('Arquivo muito grande. Máximo: 5 MB.');
  }

  const publicUrl = await uploadBrandAsset(file, type);

  const settingKey = type === 'logo' ? 'BRAND_LOGO_URL' : 'BRAND_FAVICON_URL';
  await saveSiteSetting(settingKey, publicUrl);

  revalidatePath('/', 'layout');
  revalidatePath('/admin/appearance');

  return publicUrl;
}
