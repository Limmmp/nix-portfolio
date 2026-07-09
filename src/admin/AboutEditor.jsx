// src/admin/AboutEditor.jsx — слайды секции About (тексты, фото, порядок)
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { replaceTable, moveItem, backupBefore } from './lib';
import { Field, Input, TextArea, Select, RowTools, SaveButton, UploadButton, Thumb } from './ui';

export default function AboutEditor() {
  const [slides, setSlides] = useState([]);
  const [originalIds, setOriginalIds] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('about_slides').select('*').order('sort');
      const rows = (data || []).map((r) => ({
        _id: r.id, title: r.title, subtitle: r.subtitle,
        description: r.description, image_url: r.image_url, align: r.align
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
      image_url: r.image_url, align: r.align
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
            </div>
            <div>
              <Thumb src={s.image_url} ratio="4/3" />
              <UploadButton folder="about" accept="image/*" onUploaded={(url) => update(i, 'image_url', url)}>
                Заменить фото
              </UploadButton>
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        className="adm-btn"
        onClick={() => setSlides((p) => [...p, { title: '', subtitle: '', description: '', image_url: '', align: p.length % 2 ? 'right' : 'left' }])}
      >
        + Добавить слайд
      </button>

      <div className="adm-panel__footer">
        <SaveButton onSave={save} />
      </div>
    </div>
  );
}
