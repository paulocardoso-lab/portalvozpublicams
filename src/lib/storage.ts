import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

export async function uploadImage(file: File, bucket: 'articles' | 'profiles' | 'ads' = 'articles') {
  const fileExt = file.name.split('.').pop()
  const fileName = `${crypto.randomUUID()}-${Date.now()}.${fileExt}`
  const filePath = fileName

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file)

  if (error) {
    throw error
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath)

  return publicUrl
}

export async function downloadAndUploadImage(url: string, bucket: 'articles' | 'profiles' = 'articles') {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
    
    const blob = await response.blob();
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const ext = contentType.split('/').pop() || 'jpg';
    const fileName = `rss-${crypto.randomUUID()}.${ext}`;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(fileName, blob, {
        contentType,
        upsert: true
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('Error downloading/uploading image:', error);
    return url; // Fallback para a URL original se falhar
  }
}
