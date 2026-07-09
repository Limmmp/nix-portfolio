// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js';

// Publishable-ключ безопасен для фронтенда: доступ ограничен RLS-политиками.
// env-переменные позволяют переопределить на другой проект при деплое.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://fctfvlzqtxyaoqjoiaak.supabase.co';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_d9Ds4O0VPqq0WV7FB_1C6w_FCqMycFk';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const MEDIA_BUCKET = 'media';

// Загрузка файла в публичный бакет; возвращает публичный URL
export async function uploadMedia(file, folder) {
  const ext = file.name.split('.').pop().toLowerCase();
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
    cacheControl: '31536000',
    upsert: false
  });
  if (error) throw error;
  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
