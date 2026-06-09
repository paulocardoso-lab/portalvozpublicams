'use server';

import { requireAdmin } from '@/lib/auth-guard';
import { uploadAudio } from '@/lib/storage';

const MAX_SIZE_BYTES = 30 * 1024 * 1024; // 30 MB

export async function uploadAudioFile(
  formData: FormData,
  bucket: 'ambient' | 'podcasts' = 'podcasts'
): Promise<{ url?: string; error?: string }> {
  try {
    await requireAdmin();

    const file = formData.get('file');
    if (!(file instanceof File) || file.size === 0) {
      return { error: 'Nenhum arquivo enviado.' };
    }

    if (file.size > MAX_SIZE_BYTES) {
      return { error: 'Arquivo muito grande. Máximo: 30 MB.' };
    }

    const url = await uploadAudio(file, bucket);
    return { url };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { error: msg || 'Erro ao enviar áudio.' };
  }
}
