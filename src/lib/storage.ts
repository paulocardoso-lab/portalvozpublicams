"use server";
import { createClient } from '@supabase/supabase-js'
import sharp from 'sharp'

function getSupabaseConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) return null;

  return { supabaseUrl, supabaseKey };
}

function getStorageClient() {
  const config = getSupabaseConfig();

  if (!config) {
    throw new Error('Supabase Storage não configurado.');
  }

  return createClient(config.supabaseUrl, config.supabaseKey);
}

function getOptionalStorageClient() {
  const config = getSupabaseConfig();
  return config ? createClient(config.supabaseUrl, config.supabaseKey) : null;
}

export async function uploadImage(file: File, bucket: 'articles' | 'profiles' | 'ads' = 'articles') {
  const supabase = getStorageClient();

  const inputBuffer = Buffer.from(await file.arrayBuffer());
  const webpBuffer = await sharp(inputBuffer)
    .webp({ quality: 85 })
    .toBuffer();

  const fileName = `${crypto.randomUUID()}-${Date.now()}.webp`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(fileName, webpBuffer, { contentType: 'image/webp' });

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName);

  return publicUrl;
}

export async function downloadAndUploadImage(url: string, bucket: 'articles' | 'profiles' = 'articles') {
  try {
    const supabase = getOptionalStorageClient();
    if (!supabase) return url;

    const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);

    const arrayBuffer = await response.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    // Valida dimensões mínimas (200x200) e converte para WebP
    const metadata = await sharp(inputBuffer).metadata();
    if ((metadata.width ?? 0) < 200 || (metadata.height ?? 0) < 200) {
      return url; // imagem muito pequena, descarta
    }

    const webpBuffer = await sharp(inputBuffer).webp({ quality: 85 }).toBuffer();
    const fileName = `rss-${crypto.randomUUID()}.webp`;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(fileName, webpBuffer, { contentType: 'image/webp', upsert: true });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('Error downloading/uploading image:', error);
    return url;
  }
}
