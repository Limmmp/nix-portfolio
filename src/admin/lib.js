// src/admin/lib.js — общие операции админки
import { supabase } from '../lib/supabase';

// Полная синхронизация таблицы со списком строк из редактора:
// удаляет строки, убранные в UI, апсертит остальные с порядком sort = индекс.
// rows: [{ _id?, ...поля }], originalIds: id строк на момент загрузки,
// toRow(row) -> объект колонок таблицы (без id/sort).
export async function replaceTable(table, rows, originalIds, toRow) {
  const keptIds = rows.filter((r) => r._id).map((r) => r._id);
  const toDelete = originalIds.filter((id) => !keptIds.includes(id));

  if (toDelete.length) {
    const { error } = await supabase.from(table).delete().in('id', toDelete);
    if (error) throw error;
  }

  // Все объекты bulk-upsert должны иметь одинаковый набор ключей, иначе
  // PostgREST падает с «All object keys must match». Поэтому новым строкам
  // сразу выдаём id клиентом (upsert их вставит) — ключи становятся общими.
  const payload = rows.map((r, i) => ({
    ...toRow(r),
    id: r._id || crypto.randomUUID(),
    sort: i
  }));

  if (payload.length) {
    const { error } = await supabase.from(table).upsert(payload);
    if (error) throw error;
  }
}

// === ИСТОРИЯ ИЗМЕНЕНИЙ (снимки контента для отката) ===
const CONTENT_TABLES = [
  'hero_stats', 'about_slides', 'platforms', 'brands', 'highlight_videos', 'awards'
];

// Полный снимок всего контента сайта
export async function snapshotAll() {
  const settings = await supabase.from('site_settings').select('*');
  const tables = {};
  for (const t of CONTENT_TABLES) {
    const { data } = await supabase.from(t).select('*').order('sort');
    tables[t] = data || [];
  }
  return { settings: settings.data || [], tables };
}

// Снимок ДО изменения — вызывается в начале save() каждого редактора.
// Ошибки бэкапа не должны мешать сохранению, поэтому глушим их.
export async function backupBefore(label) {
  try {
    const snapshot = await snapshotAll();
    await supabase.from('content_backups').insert({ label, snapshot });
    // Держим только последние 50 снимков
    const { data: old } = await supabase
      .from('content_backups')
      .select('id')
      .order('created_at', { ascending: false })
      .range(50, 999);
    if (old && old.length) {
      await supabase.from('content_backups').delete().in('id', old.map((o) => o.id));
    }
  } catch (e) {
    console.error('backup failed', e);
  }
}

// Восстановление состояния из снимка (перезаписывает контент целиком)
export async function restoreBackup(snapshot) {
  for (const s of snapshot.settings) {
    await supabase.from('site_settings').upsert({
      key: s.key, value: s.value, updated_at: new Date().toISOString()
    });
  }
  for (const t of CONTENT_TABLES) {
    // Удаляем все строки (фильтр по несуществующему id = «все»)
    await supabase.from(t).delete().neq('id', '00000000-0000-0000-0000-000000000000');
    const rows = snapshot.tables?.[t] || [];
    if (rows.length) {
      const { error } = await supabase.from(t).insert(rows);
      if (error) throw error;
    }
  }
}

export async function saveSetting(key, value) {
  const { error } = await supabase
    .from('site_settings')
    .upsert({ key, value, updated_at: new Date().toISOString() });
  if (error) throw error;
}

export async function loadSetting(key, fallback) {
  const { data, error } = await supabase.from('site_settings').select('value').eq('key', key).maybeSingle();
  if (error || !data) return fallback;
  return data.value;
}

// Перестановка элемента списка вверх/вниз
export function moveItem(list, index, dir) {
  const next = [...list];
  const target = index + dir;
  if (target < 0 || target >= next.length) return list;
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

// id YouTube-ролика для авто-превью
export function youtubeId(url) {
  const m = String(url || '').match(/(?:youtube\.com\/(?:watch\?.*v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/);
  return m ? m[1] : null;
}

// Кадр из видеофайла → Blob (превью для загруженных роликов)
export function captureVideoFrame(videoUrl, atSeconds = 1) {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.muted = true;
    video.src = videoUrl;
    video.addEventListener('error', () => reject(new Error('video load error')));
    video.addEventListener('loadedmetadata', () => {
      video.currentTime = Math.min(atSeconds, Math.max(0, video.duration - 0.1));
    });
    video.addEventListener('seeked', () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('canvas capture failed'));
      }, 'image/jpeg', 0.85);
    });
  });
}
