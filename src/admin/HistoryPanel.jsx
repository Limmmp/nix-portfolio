// src/admin/HistoryPanel.jsx — история изменений и откат к прошлым версиям
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { backupBefore, restoreBackup } from './lib';

export default function HistoryPanel() {
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const load = async () => {
    const { data } = await supabase
      .from('content_backups')
      .select('id, label, created_at')
      .order('created_at', { ascending: false });
    setItems(data || []);
    setLoaded(true);
  };

  useEffect(() => { load(); }, []);

  const restore = async (item) => {
    if (!window.confirm(
      `Откатить весь контент сайта к версии «${item.label}» от ` +
      `${new Date(item.created_at).toLocaleString('ru-RU')}?\n\n` +
      'Текущее состояние сохранится в истории — откат можно будет отменить.'
    )) return;

    setBusyId(item.id);
    try {
      // Сохраняем текущее состояние, чтобы откат тоже можно было отменить
      await backupBefore('Перед откатом');
      const { data, error } = await supabase
        .from('content_backups')
        .select('snapshot')
        .eq('id', item.id)
        .single();
      if (error || !data) throw error || new Error('snapshot not found');
      await restoreBackup(data.snapshot);
      await load();
      alert('Готово. Контент восстановлен — обнови вкладку сайта, чтобы увидеть изменения.');
    } catch (e) {
      console.error(e);
      alert('Не удалось откатить: ' + (e.message || e));
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (item) => {
    if (!window.confirm('Удалить эту точку из истории?')) return;
    await supabase.from('content_backups').delete().eq('id', item.id);
    load();
  };

  if (!loaded) return <p className="adm-loading">Загрузка…</p>;

  return (
    <div className="adm-panel">
      <h2 className="adm-panel__title">История изменений</h2>
      <p className="adm-hint">
        Перед каждым сохранением создаётся точка восстановления. Здесь можно
        откатить весь контент к любой прошлой версии. Хранятся последние 50 точек.
      </p>

      {items.length === 0 && (
        <p className="adm-hint">Пока нет ни одной точки — она появится после первого сохранения в любой секции.</p>
      )}

      {items.map((item) => (
        <div key={item.id} className="adm-backup">
          <div className="adm-backup__info">
            <span className="adm-backup__label">{item.label || 'Изменение'}</span>
            <span className="adm-backup__date">
              {new Date(item.created_at).toLocaleString('ru-RU', {
                day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
              })}
            </span>
          </div>
          <div className="adm-backup__actions">
            <button
              type="button"
              className="adm-btn adm-btn--small"
              disabled={busyId === item.id}
              onClick={() => restore(item)}
            >
              {busyId === item.id ? 'Откат…' : 'Откатить'}
            </button>
            <button
              type="button"
              className="adm-btn adm-btn--small adm-btn--danger"
              onClick={() => remove(item)}
            >
              Удалить
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
