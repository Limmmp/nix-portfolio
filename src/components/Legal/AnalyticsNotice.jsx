// src/components/Legal/AnalyticsNotice.jsx
// Уведомление об аналитике. Сайт не ставит трекинговых cookie и не хранит
// IP, поэтому баннер информационный, а не блокирующий: закрывается и
// больше не появляется.
import React, { useEffect, useState } from 'react';
import './analytics-notice.scss';

const KEY = 'nix_analytics_notice_seen';

export default function AnalyticsNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = localStorage.getItem(KEY) === '1';
    } catch {
      // приватный режим — просто не показываем повторно в рамках сессии
    }
    if (!seen) {
      // Не мешаем первому впечатлению: показываем чуть позже
      const t = setTimeout(() => setVisible(true), 2500);
      return () => clearTimeout(t);
    }
  }, []);

  const dismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(KEY, '1');
    } catch {
      // ignore
    }
  };

  if (!visible) return null;

  return (
    <div className="analytics-notice" role="note">
      <p className="analytics-notice__text">
        Мы собираем обезличенную статистику посещений, чтобы улучшать сайт.
        Трекинговые cookie не используются. Подробнее —{' '}
        <a href="/privacy" target="_blank" rel="noopener noreferrer" className="interactive">
          в политике конфиденциальности
        </a>.
      </p>
      <button type="button" className="analytics-notice__btn interactive" onClick={dismiss}>
        Понятно
      </button>
    </div>
  );
}
