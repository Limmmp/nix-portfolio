// src/admin/PartnersEditor.jsx — бренды, аудитория, формы сотрудничества
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { replaceTable, saveSetting, loadSetting, moveItem, backupBefore } from './lib';
import { Field, Input, TextArea, RowTools, SaveButton } from './ui';

export default function PartnersEditor() {
  const [brands, setBrands] = useState([]);
  const [originalIds, setOriginalIds] = useState([]);
  const [audience, setAudience] = useState([]);
  const [formats, setFormats] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('brands').select('*').order('sort');
      const rows = (data || []).map((r) => ({
        _id: r.id, name: r.name, year: r.year, description: r.description,
        color_from: r.color_from || '', color_to: r.color_to || ''
      }));
      setBrands(rows);
      setOriginalIds(rows.map((r) => r._id));
      setAudience(await loadSetting('partners_audience', []));
      setFormats(await loadSetting('partners_formats', []));
      setLoaded(true);
    })();
  }, []);

  const update = (i, key, val) => {
    setBrands((prev) => prev.map((b, idx) => (idx === i ? { ...b, [key]: val } : b)));
  };

  const save = async () => {
    await backupBefore('Partners');
    await replaceTable('brands', brands, originalIds, (b) => ({
      name: b.name, year: b.year, description: b.description,
      color_from: b.color_from || null, color_to: b.color_to || null
    }));
    setOriginalIds(brands.filter((b) => b._id).map((b) => b._id));
    await saveSetting('partners_audience', audience);
    await saveSetting('partners_formats', formats.filter(Boolean));
  };

  if (!loaded) return <p className="adm-loading">Загрузка…</p>;

  return (
    <div className="adm-panel">
      <h2 className="adm-panel__title">Partners — бренды ({brands.length})</h2>
      <p className="adm-hint">
        Год: «2024» или «now» для действующих партнёрств. У брендов с «now» имя в ленте
        заливается градиентом в корпоративных цветах — задай два цвета ниже.
      </p>

      {brands.map((b, i) => {
        const isNow = String(b.year).trim().toLowerCase() === 'now';
        return (
          <div key={b._id || `new-${i}`} className="adm-card">
            <div className="adm-card__head">
              <span className="adm-card__num">{String(i + 1).padStart(2, '0')} · {b.name || 'Новый бренд'}</span>
              <RowTools
                onUp={() => setBrands((p) => moveItem(p, i, -1))}
                onDown={() => setBrands((p) => moveItem(p, i, 1))}
                onRemove={() => setBrands((p) => p.filter((_, idx) => idx !== i))}
              />
            </div>

            <div className="adm-list-row">
              <Input placeholder="Название (HAVAL)" value={b.name} onChange={(e) => update(i, 'name', e.target.value)} />
              <div className="adm-inline">
                <Input placeholder="Год" value={b.year} onChange={(e) => update(i, 'year', e.target.value)} style={{ width: 90 }} />
                <label className="adm-check">
                  <input
                    type="checkbox"
                    checked={isNow}
                    onChange={(e) => update(i, 'year', e.target.checked ? 'now' : new Date().getFullYear().toString())}
                  />
                  сейчас
                </label>
              </div>
            </div>

            {isNow && (
              <div className="adm-list-row">
                <Field label="Градиент: от">
                  <div className="adm-inline">
                    <input type="color" className="adm-color" value={b.color_from || '#ffffff'} onChange={(e) => update(i, 'color_from', e.target.value)} />
                    <Input value={b.color_from} placeholder="#FF0000" onChange={(e) => update(i, 'color_from', e.target.value)} style={{ width: 100 }} />
                  </div>
                </Field>
                <Field label="Градиент: до">
                  <div className="adm-inline">
                    <input type="color" className="adm-color" value={b.color_to || '#ffffff'} onChange={(e) => update(i, 'color_to', e.target.value)} />
                    <Input value={b.color_to} placeholder="#7000FF" onChange={(e) => update(i, 'color_to', e.target.value)} style={{ width: 100 }} />
                  </div>
                </Field>
              </div>
            )}

            <Field label="Описание кейса (в модалке)">
              <TextArea rows={2} value={b.description} onChange={(e) => update(i, 'description', e.target.value)} />
            </Field>
          </div>
        );
      })}

      <button
        type="button"
        className="adm-btn"
        onClick={() => setBrands((p) => [...p, { name: '', year: new Date().getFullYear().toString(), description: '', color_from: '', color_to: '' }])}
      >
        + Добавить бренд
      </button>

      <h3 className="adm-panel__subtitle">Целевая аудитория</h3>
      {audience.map((a, i) => (
        <div key={i} className="adm-list-row">
          <Input placeholder="Подпись (Тематика)" value={a.label} onChange={(e) => setAudience((p) => p.map((x, idx) => idx === i ? { ...x, label: e.target.value } : x))} />
          <Input placeholder="Значение (Киберспорт, игры)" value={a.value} onChange={(e) => setAudience((p) => p.map((x, idx) => idx === i ? { ...x, value: e.target.value } : x))} />
          <RowTools
            onUp={() => setAudience((p) => moveItem(p, i, -1))}
            onDown={() => setAudience((p) => moveItem(p, i, 1))}
            onRemove={() => setAudience((p) => p.filter((_, idx) => idx !== i))}
          />
        </div>
      ))}
      <button type="button" className="adm-btn adm-btn--small" onClick={() => setAudience((p) => [...p, { label: '', value: '' }])}>+ строка</button>

      <h3 className="adm-panel__subtitle">Формы сотрудничества</h3>
      {formats.map((f, i) => (
        <div key={i} className="adm-list-row">
          <Input value={f} onChange={(e) => setFormats((p) => p.map((x, idx) => idx === i ? e.target.value : x))} />
          <RowTools
            onUp={() => setFormats((p) => moveItem(p, i, -1))}
            onDown={() => setFormats((p) => moveItem(p, i, 1))}
            onRemove={() => setFormats((p) => p.filter((_, idx) => idx !== i))}
          />
        </div>
      ))}
      <button type="button" className="adm-btn adm-btn--small" onClick={() => setFormats((p) => [...p, ''])}>+ формат</button>

      <div className="adm-panel__footer">
        <SaveButton onSave={save} />
      </div>
    </div>
  );
}
