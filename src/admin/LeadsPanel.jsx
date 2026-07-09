// src/admin/LeadsPanel.jsx — входящие заявки с формы сайта
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const TYPE_LABELS = {
  partnership: 'Партнёрство',
  sponsorship: 'Спонсорство',
  integration: 'Интеграция',
  tournament: 'Турнир / Ивент',
  other: 'Другое'
};

export default function LeadsPanel() {
  const [leads, setLeads] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const load = async () => {
    const { data } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
    setLeads(data || []);
    setLoaded(true);
  };

  useEffect(() => { load(); }, []);

  const toggleRead = async (lead) => {
    await supabase.from('leads').update({ is_read: !lead.is_read }).eq('id', lead.id);
    load();
  };

  const remove = async (lead) => {
    if (!window.confirm(`Удалить заявку от «${lead.name}»?`)) return;
    await supabase.from('leads').delete().eq('id', lead.id);
    load();
  };

  if (!loaded) return <p className="adm-loading">Загрузка…</p>;

  return (
    <div className="adm-panel">
      <h2 className="adm-panel__title">
        Заявки ({leads.length}{leads.some((l) => !l.is_read) ? `, новых: ${leads.filter((l) => !l.is_read).length}` : ''})
      </h2>

      {leads.length === 0 && <p className="adm-hint">Пока пусто. Заявки с формы «PARTNERSHIP» будут появляться здесь.</p>}

      {leads.map((lead) => (
        <div key={lead.id} className={`adm-lead ${lead.is_read ? '' : 'adm-lead--new'}`}>
          <div className="adm-lead__head">
            <div>
              <strong>{lead.name}</strong> · {lead.company}
              {!lead.is_read && <span className="adm-lead__badge">новая</span>}
            </div>
            <span className="adm-lead__date">
              {new Date(lead.created_at).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <div className="adm-lead__meta">
            <a href={`mailto:${lead.email}`}>{lead.email}</a> · {TYPE_LABELS[lead.type] || lead.type}
          </div>
          <p className="adm-lead__message">{lead.message}</p>
          <div className="adm-lead__actions">
            <button type="button" className="adm-btn adm-btn--small" onClick={() => toggleRead(lead)}>
              {lead.is_read ? 'Пометить как новую' : 'Прочитано'}
            </button>
            <button type="button" className="adm-btn adm-btn--small adm-btn--danger" onClick={() => remove(lead)}>
              Удалить
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
