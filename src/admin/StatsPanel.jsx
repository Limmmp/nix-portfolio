// src/admin/StatsPanel.jsx — дашборд посещаемости и заявок
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const WEEKDAYS = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];

export default function StatsPanel() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    supabase.rpc('visit_stats').then(({ data, error }) => {
      if (error) { setError(true); return; }
      setStats(data);
    });
  }, []);

  if (error) return <div className="adm-panel"><h2 className="adm-panel__title">Статистика</h2><p className="adm-hint">Не удалось загрузить статистику.</p></div>;
  if (!stats) return <p className="adm-loading">Загрузка…</p>;

  const daily = stats.daily || [];
  const maxCount = Math.max(1, ...daily.map((d) => d.count));

  const cards = [
    { label: 'Визитов сегодня', value: stats.today },
    { label: 'За 7 дней', value: stats.last7 },
    { label: 'За 30 дней', value: stats.last30 },
    { label: 'Всего визитов', value: stats.total },
    { label: 'Заявок всего', value: stats.leads_total },
    { label: 'Новых заявок', value: stats.leads_new, accent: stats.leads_new > 0 }
  ];

  return (
    <div className="adm-panel">
      <h2 className="adm-panel__title">Статистика</h2>
      <p className="adm-hint">
        Собственный счётчик посещений сайта. Детальная аналитика (гео, устройства,
        источники) — в дашборде Vercel → вкладка Analytics.
      </p>

      <div className="adm-stat-grid">
        {cards.map((c) => (
          <div key={c.label} className={`adm-stat-card ${c.accent ? 'adm-stat-card--accent' : ''}`}>
            <span className="adm-stat-card__value">{c.value ?? 0}</span>
            <span className="adm-stat-card__label">{c.label}</span>
          </div>
        ))}
      </div>

      <h3 className="adm-panel__subtitle">Посещения за 14 дней</h3>
      <div className="adm-chart">
        {daily.map((d) => {
          const date = new Date(d.day);
          const h = Math.round((d.count / maxCount) * 100);
          return (
            <div key={d.day} className="adm-chart__col" title={`${d.day}: ${d.count}`}>
              <span className="adm-chart__count">{d.count || ''}</span>
              <div className="adm-chart__bar" style={{ height: `${Math.max(h, 2)}%` }} />
              <span className="adm-chart__label">{WEEKDAYS[date.getDay()]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
