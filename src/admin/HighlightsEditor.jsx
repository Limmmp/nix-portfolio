// src/admin/HighlightsEditor.jsx — видео (ссылка или файл) + награды
import React, { useEffect, useState } from 'react';
import { supabase, uploadMedia } from '../lib/supabase';
import { replaceTable, moveItem, youtubeId, captureVideoFrame, backupBefore } from './lib';
import { Field, Input, TextArea, Select, RowTools, SaveButton, UploadButton, Thumb } from './ui';

export default function HighlightsEditor() {
  const [videos, setVideos] = useState([]);
  const [videoIds, setVideoIds] = useState([]);
  const [awards, setAwards] = useState([]);
  const [awardIds, setAwardIds] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [capturing, setCapturing] = useState(null);

  useEffect(() => {
    (async () => {
      const [v, a] = await Promise.all([
        supabase.from('highlight_videos').select('*').order('sort'),
        supabase.from('awards').select('*').order('sort')
      ]);
      const vRows = (v.data || []).map((r) => ({
        _id: r.id, title: r.title, views: r.views, platform: r.platform,
        video_url: r.video_url, thumb_url: r.thumb_url, featured: r.featured
      }));
      const aRows = (a.data || []).map((r) => ({
        _id: r.id, icon_url: r.icon_url, title: r.title, subtitle: r.subtitle,
        description: r.description, year: r.year
      }));
      setVideos(vRows);
      setVideoIds(vRows.map((r) => r._id));
      setAwards(aRows);
      setAwardIds(aRows.map((r) => r._id));
      setLoaded(true);
    })();
  }, []);

  const updateVideo = (i, key, val) => {
    setVideos((prev) => prev.map((v, idx) => (idx === i ? { ...v, [key]: val } : v)));
  };
  const updateAward = (i, key, val) => {
    setAwards((prev) => prev.map((a, idx) => (idx === i ? { ...a, [key]: val } : a)));
  };

  // Featured может быть только одно видео
  const setFeatured = (i) => {
    setVideos((prev) => prev.map((v, idx) => ({ ...v, featured: idx === i })));
  };

  // Авто-превью: YouTube — по id ролика, файл из Storage — кадр из видео
  const autoThumb = async (i) => {
    const v = videos[i];
    const yt = youtubeId(v.video_url);
    if (yt) {
      updateVideo(i, 'thumb_url', `https://i.ytimg.com/vi/${yt}/hqdefault.jpg`);
      return;
    }
    if (/\.(mp4|webm|mov|m4v)(\?|$)/i.test(v.video_url)) {
      setCapturing(i);
      try {
        const blob = await captureVideoFrame(v.video_url, 1);
        const file = new File([blob], 'thumb.jpg', { type: 'image/jpeg' });
        const url = await uploadMedia(file, 'thumbs');
        updateVideo(i, 'thumb_url', url);
      } catch (e) {
        console.error(e);
        alert('Не удалось снять кадр с видео — загрузите превью вручную.');
      } finally {
        setCapturing(null);
      }
      return;
    }
    alert('Авто-превью работает для YouTube-ссылок и загруженных видеофайлов. Для остальных загрузите картинку.');
  };

  const save = async () => {
    await backupBefore('Highlights');
    await replaceTable('highlight_videos', videos, videoIds, (v) => ({
      title: v.title, views: v.views, platform: v.platform,
      video_url: v.video_url, thumb_url: v.thumb_url, featured: !!v.featured
    }));
    setVideoIds(videos.filter((v) => v._id).map((v) => v._id));
    await replaceTable('awards', awards, awardIds, (a) => ({
      icon_url: a.icon_url, title: a.title, subtitle: a.subtitle,
      description: a.description, year: a.year
    }));
    setAwardIds(awards.filter((a) => a._id).map((a) => a._id));
  };

  if (!loaded) return <p className="adm-loading">Загрузка…</p>;

  return (
    <div className="adm-panel">
      <h2 className="adm-panel__title">Highlights — видео ({videos.length})</h2>
      <p className="adm-hint">
        Видео — либо ссылка (YouTube/Twitch/TikTok), либо файл, загруженный прямо сюда.
        Превью — своя картинка или кнопка «Авто»: для YouTube возьмётся обложка ролика,
        для загруженного файла — кадр из видео. «Главное» видео показывается крупно.
      </p>

      {videos.map((v, i) => (
        <div key={v._id || `new-${i}`} className="adm-card">
          <div className="adm-card__head">
            <label className="adm-check adm-check--featured">
              <input type="radio" name="featured-video" checked={!!v.featured} onChange={() => setFeatured(i)} />
              главное
            </label>
            <RowTools
              onUp={() => setVideos((p) => moveItem(p, i, -1))}
              onDown={() => setVideos((p) => moveItem(p, i, 1))}
              onRemove={() => setVideos((p) => p.filter((_, idx) => idx !== i))}
            />
          </div>

          <div className="adm-card__grid">
            <div>
              <Field label="Название">
                <Input value={v.title} onChange={(e) => updateVideo(i, 'title', e.target.value)} />
              </Field>
              <div className="adm-list-row adm-list-row--tight">
                <Field label="Просмотры (2.5M)">
                  <Input value={v.views} onChange={(e) => updateVideo(i, 'views', e.target.value)} style={{ width: 100 }} />
                </Field>
                <Field label="Платформа">
                  <Select value={v.platform} onChange={(e) => updateVideo(i, 'platform', e.target.value)}>
                    <option value="">—</option>
                    <option>Twitch</option>
                    <option>YouTube</option>
                    <option>TikTok</option>
                    <option>Telegram</option>
                  </Select>
                </Field>
              </div>
              <Field label="Ссылка на видео">
                <Input value={v.video_url} placeholder="https://youtube.com/watch?v=…" onChange={(e) => updateVideo(i, 'video_url', e.target.value)} />
              </Field>
              <div className="adm-inline">
                <UploadButton folder="videos" accept="video/*" onUploaded={(url) => updateVideo(i, 'video_url', url)}>
                  …или загрузить файл
                </UploadButton>
              </div>
            </div>

            <div>
              <Thumb src={v.thumb_url} />
              <div className="adm-inline">
                <UploadButton folder="thumbs" accept="image/*" onUploaded={(url) => updateVideo(i, 'thumb_url', url)}>
                  Превью
                </UploadButton>
                <button type="button" className="adm-btn" disabled={capturing === i} onClick={() => autoThumb(i)}>
                  {capturing === i ? 'Снимаю кадр…' : 'Авто'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        className="adm-btn"
        onClick={() => setVideos((p) => [...p, { title: '', views: '', platform: '', video_url: '', thumb_url: '', featured: p.length === 0 }])}
      >
        + Добавить видео
      </button>

      <h3 className="adm-panel__subtitle">Награды ({awards.length})</h3>
      {awards.map((a, i) => (
        <div key={a._id || `new-a-${i}`} className="adm-card">
          <div className="adm-card__head">
            <span className="adm-card__num">{a.title || 'Новая награда'}</span>
            <RowTools
              onUp={() => setAwards((p) => moveItem(p, i, -1))}
              onDown={() => setAwards((p) => moveItem(p, i, 1))}
              onRemove={() => setAwards((p) => p.filter((_, idx) => idx !== i))}
            />
          </div>
          <div className="adm-card__grid adm-card__grid--icon">
            <div>
              <Thumb src={a.icon_url} ratio="1/1" />
              <UploadButton folder="awards" accept="image/*" onUploaded={(url) => updateAward(i, 'icon_url', url)}>
                Иконка
              </UploadButton>
            </div>
            <div>
              <div className="adm-list-row adm-list-row--tight">
                <Input placeholder="Название (Forbes 30 under 30)" value={a.title} onChange={(e) => updateAward(i, 'title', e.target.value)} />
                <Input placeholder="Год" value={a.year} onChange={(e) => updateAward(i, 'year', e.target.value)} style={{ width: 80 }} />
              </div>
              <Input placeholder="Статус (Winner)" value={a.subtitle} onChange={(e) => updateAward(i, 'subtitle', e.target.value)} />
              <TextArea rows={2} placeholder="Описание" value={a.description} onChange={(e) => updateAward(i, 'description', e.target.value)} />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        className="adm-btn"
        onClick={() => setAwards((p) => [...p, { icon_url: '', title: '', subtitle: '', description: '', year: '' }])}
      >
        + Добавить награду
      </button>

      <div className="adm-panel__footer">
        <SaveButton onSave={save} />
      </div>
    </div>
  );
}
