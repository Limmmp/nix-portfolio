// src/admin/AboutEditor.jsx — слайды секции About (тексты, фото, порядок)
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { replaceTable, moveItem, backupBefore } from './lib';
import { Field, Input, TextArea, Select, RowTools, SaveButton, UploadButton, Thumb } from './ui';

// Ползунок масштаба: 1 = размер по умолчанию
function ScaleField({ label, value, min, max, onChange }) {
  const v = Number(value ?? 1);
  return (
    <Field label={`${label} — ${Math.round(v * 100)}%`}>
      <div className="adm-inline">
        <input
          type="range"
          className="adm-range"
          min={min}
          max={max}
          step="0.05"
          value={v}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        <button type="button" className="adm-btn adm-btn--small" onClick={() => onChange(1)}>
          Сброс
        </button>
      </div>
    </Field>
  );
}

export default function AboutEditor() {
  const [slides, setSlides] = useState([]);
  const [originalIds, setOriginalIds] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('about_slides').select('*').order('sort');
      const rows = (data || []).map((r) => ({
        _id: r.id, title: r.title, subtitle: r.subtitle,
        description: r.description, image_url: r.image_url, align: r.align,
        text_scale: Number(r.text_scale ?? 1), photo_scale: Number(r.photo_scale ?? 1)
      }));
      setSlides(rows);
      setOriginalIds(rows.map((r) => r._id));
      setLoaded(true);
    })();
  }, []);

  const update = (i, key, val) => {
    setSlides((prev) => prev.map((s, idx) => (idx === i ? { ...s, [key]: val } : s)));
  };

  const save = async () => {
    await backupBefore('About');
    await replaceTable('about_slides', slides, originalIds, (r) => ({
      title: r.title, subtitle: r.subtitle, description: r.description,
      image_url: r.image_url, align: r.align,
      text_scale: r.text_scale ?? 1, photo_scale: r.photo_scale ?? 1
    }));
    setOriginalIds(slides.filter((r) => r._id).map((r) => r._id));
  };

  if (!loaded) return <p className="adm-loading">Загрузка…</p>;

  return (
    <div className="adm-panel">
      <h2 className="adm-panel__title">About — слайды ({slides.length})</h2>
      <p className="adm-hint">Горизонтальный пин-скролл на сайте. Каждый слайд: фото + заголовок + строки текста (перенос строки = новая строка на сайте).</p>

      {slides.map((s, i) => (
        <div key={s._id || `new-${i}`} className="adm-card">
          <div className="adm-card__head">
            <span className="adm-card__num">{String(i + 1).padStart(2, '0')}</span>
            <RowTools
              onUp={() => setSlides((p) => moveItem(p, i, -1))}
              onDown={() => setSlides((p) => moveItem(p, i, 1))}
              onRemove={() => setSlides((p) => p.filter((_, idx) => idx !== i))}
            />
          </div>

          <div className="adm-card__grid">
            <div>
              <Field label="Заголовок">
                <Input value={s.title} onChange={(e) => update(i, 'title', e.target.value)} />
              </Field>
              <Field label="Подзаголовок">
                <Input value={s.subtitle} onChange={(e) => update(i, 'subtitle', e.target.value)} />
              </Field>
              <Field label="Текст (каждая строка — отдельной строкой)">
                <TextArea value={s.description} onChange={(e) => update(i, 'description', e.target.value)} />
              </Field>
              <Field label="Текст сбоку">
                <Select value={s.align} onChange={(e) => update(i, 'align', e.target.value)}>
                  <option value="left">Слева</option>
                  <option value="right">Справа</option>
                </Select>
              </Field>
              <ScaleField
                label="Размер текста"
                value={s.text_scale}
                min={0.85}
                max={1.3}
                onChange={(v) => update(i, 'text_scale', v)}
              />
            </div>
            <div>
              <Thumb src={s.image_url} ratio="4/3" />
              <UploadButton folder="about" accept="image/*" onUploaded={(url) => update(i, 'image_url', url)}>
                Заменить фото
              </UploadButton>
              <ScaleField
                label="Размер фото"
                value={s.photo_scale}
                min={0.7}
                max={1.15}
                onChange={(v) => update(i, 'photo_scale', v)}
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        className="adm-btn"
        onClick={() => setSlides((p) => [...p, {
          title: '', subtitle: '', description: '', image_url: '',
          align: p.length % 2 ? 'right' : 'left', text_scale: 1, photo_scale: 1
        }])}
      >
        + Добавить слайд
      </button>

      <div className="adm-panel__footer">
        <SaveButton onSave={save} />
      </div>
    </div>
  );
}
