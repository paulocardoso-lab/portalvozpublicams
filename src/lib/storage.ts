import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

export async function uploadImage(file: File, bucket: 'articles' | 'profiles' = 'articles') {
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
