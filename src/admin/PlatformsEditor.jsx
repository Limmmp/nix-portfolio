// src/admin/PlatformsEditor.jsx — платформы: метрики, состав, лого
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { replaceTable, moveItem, backupBefore } from './lib';
import { Field, Input, TextArea, Select, RowTools, SaveButton, UploadButton, Thumb } from './ui';

const KNOWN_SLUGS = [
  { value: 'twitch', label: 'Twitch (встроенное лого)' },
  { value: 'youtube', label: 'YouTube (встроенное лого)' },
  { value: 'telegram', label: 'Telegram (встроенное лого)' },
  { value: 'tiktok', label: 'TikTok (встроенное лого)' },
  { value: '', label: 'Другая платформа (загрузить лого)' }
];

const emptyMetric = () => ({ label: '', value: '' });

function MetricList({ items, onChange, min = 0 }) {
  const update = (i, key, val) => onChange(items.map((m, idx) => (idx === i ? { ...m, [key]: val } : m)));
  return (
    <div className="adm-metric-list">
      {items.map((m, i) => (
        <div key={i} className="adm-list-row adm-list-row--tight">
          <Input placeholder="Значение (35K)" value={m.value} onChange={(e) => update(i, 'value', e.target.value)} style={{ width: 110 }} />
          <Input placeholder="Подпись (Avg Viewers)" value={m.label} onChange={(e) => update(i, 'label', e.target.value)} />
          {items.length > min && (
            <button type="button" className="adm-icon-btn adm-icon-btn--danger" onClick={() => onChange(items.filter((_, idx) => idx !== i))}>✕</button>
          )}
        </div>
      ))}
      <button type="button" className="adm-btn adm-btn--small" onClick={() => onChange([...items, emptyMetric()])}>+ метрика</button>
    </div>
  );
}

export default function PlatformsEditor() {
  const [rows, setRows] = useState([]);
  const [originalIds, setOriginalIds] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('platforms').select('*').order('sort');
      const list = (data || []).map((r) => ({
        _id: r.id, slug: r.slug, name: r.name, url: r.url, color: r.color,
        logo_url: r.logo_url, description: r.description,
        featured: r.featured?.length ? r.featured : [emptyMetric(), emptyMetric()],
        metrics: r.metrics || []
      }));
      setRows(list);
      setOriginalIds(list.map((r) => r._id));
      setLoaded(true);
    })();
  }, []);

  const update = (i, key, val) => {
    setRows((prev) => prev.map((s, idx) => (idx === i ? { ...s, [key]: val } : s)));
  };

  const save = async () => {
    await backupBefore('Platforms');
    await replaceTable('platforms', rows, originalIds, (r) => ({
      slug: r.slug, name: r.name, url: r.url, color: r.color,
      logo_url: r.logo_url, description: r.description,
      featured: r.featured.filter((m) => m.value || m.label),
      metrics: r.metrics.filter((m) => m.value || m.label)
    }));
    setOriginalIds(rows.filter((r) => r._id).map((r) => r._id));
  };

  if (!loaded) return <p className="adm-loading">Загрузка…</p>;

  return (
    <div className="adm-panel">
      <h2 className="adm-panel__title">Platforms ({rows.length})</h2>
      <p className="adm-hint">«На строке» — две метрики, которые видны в списке. «В модалке» — полный список по клику.</p>

      {rows.map((p, i) => (
        <div key={p._id || `new-${i}`} className="adm-card">
          <div className="adm-card__head">
            <span className="adm-card__num">{String(i + 1).padStart(2, '0')} · {p.name || 'Новая платформа'}</span>
            <RowTools
              onUp={() => setRows((prev) => moveItem(prev, i, -1))}
              onDown={() => setRows((prev) => moveItem(prev, i, 1))}
              onRemove={() => setRows((prev) => prev.filter((_, idx) => idx !== i))}
            />
          </div>

          <div className="adm-card__grid">
            <div>
              <Field label="Название">
                <Input value={p.name} onChange={(e) => update(i, 'name', e.target.value)} />
              </Field>
              <Field label="Ссылка на канал">
                <Input value={p.url} onChange={(e) => update(i, 'url', e.target.value)} />
              </Field>
              <Field label="Лого">
                <Select value={p.slug} onChange={(e) => update(i, 'slug', e.target.value)}>
                  {KNOWN_SLUGS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </Select>
              </Field>
              {!p.slug && (
                <div className="adm-inline">
                  <Thumb src={p.logo_url} ratio="1/1" />
                  <UploadButton folder="platforms" accept="image/*" onUploaded={(url) => update(i, 'logo_url', url)}>
                    Лого (PNG/SVG)
                  </UploadButton>
                </div>
              )}
              <Field label="Фирменный цвет (для ховера)">
                <div className="adm-inline">
                  <input type="color" className="adm-color" value={p.color} onChange={(e) => update(i, 'color', e.target.value)} />
                  <Input value={p.color} onChange={(e) => update(i, 'color', e.target.value)} style={{ width: 110 }} />
                </div>
              </Field>
              <Field label="Описание (в модалке)">
                <TextArea rows={2} value={p.description} onChange={(e) => update(i, 'description', e.target.value)} />
              </Field>
            </div>

            <div>
              <Field label="Метрики на строке (две)">
                <MetricList items={p.featured} onChange={(v) => update(i, 'featured', v)} min={1} />
              </Field>
              <Field label="Метрики в модалке">
                <MetricList items={p.metrics} onChange={(v) => update(i, 'metrics', v)} />
              </Field>
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        className="adm-btn"
        onClick={() => setRows((p) => [...p, {
          slug: '', name: '', url: '', color: '#ffffff', logo_url: '', description: '',
          featured: [emptyMetric(), emptyMetric()], metrics: []
        }])}
      >
        + Добавить платформу
      </button>

      <div className="adm-panel__footer">
        <SaveButton onSave={save} />
      </div>
    </div>
  );
}
