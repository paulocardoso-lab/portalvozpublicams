'use server';

import { requireAdmin } from '@/lib/auth-guard';
import { uploadAudio } from '@/lib/storage';

const MAX_SIZE_BYTES = 30 * 1024 * 1024; // 30 MB

export async function uploadAudioFile(
  formData: FormData,
  bucket: 'ambient' | 'podcasts' = 'podcasts'
): Promise<string> {
  await requireAdmin();

  const file = formData.get('file');
  if (!(file instanceof File) || file.size === 0) {
    throw new Error('Nenhum arquivo enviado.');
  }

  if (file.size > MAX_SIZE_BYTES) {
    throw new Error('Arquivo muito grande. Máximo: 30 MB.');
  }

  return uploadAudio(file, bucket);
}
