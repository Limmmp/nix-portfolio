// src/admin/HeroEditor.jsx — подзаголовок и метрики hero
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { replaceTable, saveSetting, loadSetting, moveItem, backupBefore } from './lib';
import { Field, Input, RowTools, SaveButton } from './ui';

export default function HeroEditor() {
  const [subtitle, setSubtitle] = useState('');
  const [stats, setStats] = useState([]);
  const [originalIds, setOriginalIds] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const hero = await loadSetting('hero', { subtitle: '' });
      setSubtitle(hero.subtitle || '');
      const { data } = await supabase.from('hero_stats').select('*').order('sort');
      const rows = (data || []).map((r) => ({ _id: r.id, value: r.value, label: r.label, sublabel: r.sublabel }));
      setStats(rows);
      setOriginalIds(rows.map((r) => r._id));
      setLoaded(true);
    })();
  }, []);

  const update = (i, key, val) => {
    setStats((prev) => prev.map((s, idx) => (idx === i ? { ...s, [key]: val } : s)));
  };

  const save = async () => {
    await backupBefore('Hero');
    await saveSetting('hero', { subtitle });
    await replaceTable('hero_stats', stats, originalIds, (r) => ({
      value: r.value, label: r.label, sublabel: r.sublabel
    }));
    setOriginalIds(stats.filter((r) => r._id).map((r) => r._id));
  };

  if (!loaded) return <p className="adm-loading">Загрузка…</p>;

  return (
    <div className="adm-panel">
      <h2 className="adm-panel__title">Hero</h2>

      <Field label="Подзаголовок (под именем NIX)">
        <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
      </Field>

      <h3 className="adm-panel__subtitle">Метрики ({stats.length})</h3>
      <p className="adm-hint">На сайте выводятся в ряд под кнопкой. Оптимально 3–4 штуки.</p>

      {stats.map((s, i) => (
        <div key={s._id || `new-${i}`} className="adm-list-row">
          <Input placeholder="Значение (1.5M+)" value={s.value} onChange={(e) => update(i, 'value', e.target.value)} style={{ width: 110 }} />
          <Input placeholder="Подпись (FOLLOWERS)" value={s.label} onChange={(e) => update(i, 'label', e.target.value)} />
          <Input placeholder="Уточнение (ALL PLATFORMS)" value={s.sublabel} onChange={(e) => update(i, 'sublabel', e.target.value)} />
          <RowTools
            onUp={() => setStats((p) => moveItem(p, i, -1))}
            onDown={() => setStats((p) => moveItem(p, i, 1))}
            onRemove={() => setStats((p) => p.filter((_, idx) => idx !== i))}
          />
        </div>
      ))}

      <button type="button" className="adm-btn" onClick={() => setStats((p) => [...p, { value: '', label: '', sublabel: '' }])}>
        + Добавить метрику
      </button>

      <div className="adm-panel__footer">
        <SaveButton onSave={save} />
      </div>
    </div>
  );
}
