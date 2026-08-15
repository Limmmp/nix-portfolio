// src/admin/SettingsPanel.jsx — смена пароля и уведомления в Telegram
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Field, Input, SaveButton } from './ui';

export default function SettingsPanel() {
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [status, setStatus] = useState('');

  // Telegram
  const [tg, setTg] = useState({ bot_token: '', chat_id: '', enabled: false, recipients: [] });
  const [tgLoaded, setTgLoaded] = useState(false);
  const [tgStatus, setTgStatus] = useState('');
  const [found, setFound] = useState([]);

  useEffect(() => {
    supabase.from('integrations').select('value').eq('key', 'telegram').maybeSingle()
      .then(({ data }) => {
        const v = data?.value || {};
        setTg({
          bot_token: '', chat_id: '', enabled: false, ...v,
          // Старая одиночная настройка превращается в список
          recipients: v.recipients?.length
            ? v.recipients
            : (v.chat_id ? [{ chat_id: v.chat_id, name: 'Основной', enabled: true }] : [])
        });
        setTgLoaded(true);
      });
  }, []);

  const setRecipient = (i, patch) =>
    setTg((p) => ({ ...p, recipients: p.recipients.map((r, idx) => idx === i ? { ...r, ...patch } : r) }));

  const addRecipient = (chat_id = '', name = '') =>
    setTg((p) => ({ ...p, recipients: [...p.recipients, { chat_id, name, enabled: true }] }));

  const removeRecipient = (i) =>
    setTg((p) => ({ ...p, recipients: p.recipients.filter((_, idx) => idx !== i) }));

  // Кто уже писал боту — Telegram отдаёт таких в getUpdates.
  // Так не нужно просить каждого искать свой chat_id вручную.
  const discover = async () => {
    const token = tg.bot_token.trim();
    if (!token) { setTgStatus('Сначала укажите токен бота'); return; }
    setTgStatus('Ищу тех, кто написал боту…');
    try {
      const res = await fetch(`https://api.telegram.org/bot${token}/getUpdates`);
      const json = await res.json();
      if (!json.ok) { setTgStatus('Telegram ответил: ' + (json.description || 'ошибка')); return; }
      const seen = new Map();
      (json.result || []).forEach((u) => {
        const chat = u.message?.chat || u.my_chat_member?.chat || u.channel_post?.chat;
        if (!chat) return;
        const name = [chat.first_name, chat.last_name].filter(Boolean).join(' ')
          || chat.title || chat.username || String(chat.id);
        seen.set(String(chat.id), name);
      });
      const already = new Set(tg.recipients.map((r) => String(r.chat_id)));
      const list = [...seen.entries()]
        .filter(([id]) => !already.has(id))
        .map(([chat_id, name]) => ({ chat_id, name }));
      setFound(list);
      setTgStatus(list.length
        ? `Найдено новых: ${list.length}`
        : 'Новых не нашлось. Попросите человека написать боту /start и повторите.');
    } catch (e) {
      setTgStatus('Не удалось запросить Telegram: ' + e.message);
    }
  };

  const changePassword = async () => {
    if (password.length < 8) { setStatus('Пароль короче 8 символов'); return; }
    if (password !== password2) { setStatus('Пароли не совпадают'); return; }
    setStatus('Сохраняю…');
    const { error } = await supabase.auth.updateUser({ password });
    if (error) { setStatus('Ошибка: ' + error.message); return; }
    setPassword('');
    setPassword2('');
    setStatus('Пароль изменён ✓');
  };

  const saveTg = async () => {
    const recipients = tg.recipients
      .map((r) => ({ chat_id: String(r.chat_id).trim(), name: (r.name || '').trim(), enabled: !!r.enabled }))
      .filter((r) => r.chat_id);
    const { error } = await supabase.from('integrations').upsert({
      key: 'telegram',
      value: {
        bot_token: tg.bot_token.trim(),
        // Первый получатель дублируется в chat_id для обратной совместимости
        chat_id: recipients[0]?.chat_id || '',
        enabled: !!tg.enabled,
        recipients
      },
      updated_at: new Date().toISOString()
    });
    if (error) throw error;
  };

  const sendTest = async (target) => {
    setTgStatus('Отправляю…');
    // Сохраняем перед тестом, иначе проверим старые значения
    try { await saveTg(); } catch (e) { setTgStatus('Ошибка сохранения: ' + e.message); return; }
    const { data, error } = await supabase.rpc('tg_send_test', { target: target || null });
    if (error) { setTgStatus('Ошибка: ' + error.message); return; }
    setTgStatus(data?.ok
      ? `Отправлено получателям: ${data.sent_to} — проверьте бота ✓`
      : `Не отправлено: ${data?.reason || 'неизвестная причина'}`);
  };

  return (
    <div className="adm-panel">
      <h2 className="adm-panel__title">Настройки</h2>

      <h3 className="adm-panel__subtitle">Уведомления в Telegram</h3>
      <p className="adm-hint">
        Каждая заявка с сайта приходит в бота. Токен берётся у @BotFather,
        chat_id — у @userinfobot (нужно один раз написать боту /start,
        иначе Telegram не даст ему написать вам первым).
      </p>

      {!tgLoaded ? <p className="adm-loading">Загрузка…</p> : (
        <div style={{ maxWidth: 520 }}>
          <label className="adm-check" style={{ marginBottom: 12 }}>
            <input
              type="checkbox"
              checked={!!tg.enabled}
              onChange={(e) => setTg((p) => ({ ...p, enabled: e.target.checked }))}
            />
            Присылать заявки в Telegram
          </label>

          <Field label="Токен бота">
            <Input
              type="password"
              value={tg.bot_token}
              placeholder="123456:AA..."
              autoComplete="off"
              onChange={(e) => setTg((p) => ({ ...p, bot_token: e.target.value }))}
            />
          </Field>
          <h4 className="adm-panel__subtitle" style={{ fontSize: 14, marginTop: 20 }}>
            Кто получает заявки ({tg.recipients.length})
          </h4>
          <p className="adm-hint">
            Каждый в списке получает копию заявки. Человек должен сам написать
            боту <b>/start</b> — иначе Telegram не даст боту написать ему первым.
          </p>

          {tg.recipients.map((r, i) => (
            <div key={i} className="adm-list-row">
              <Input
                placeholder="Имя (для себя)"
                value={r.name || ''}
                onChange={(e) => setRecipient(i, { name: e.target.value })}
              />
              <Input
                placeholder="Chat ID"
                value={r.chat_id}
                style={{ width: 150 }}
                onChange={(e) => setRecipient(i, { chat_id: e.target.value })}
              />
              <label className="adm-check" title="Присылать этому получателю">
                <input
                  type="checkbox"
                  checked={r.enabled !== false}
                  onChange={(e) => setRecipient(i, { enabled: e.target.checked })}
                />
                вкл
              </label>
              <button
                type="button"
                className="adm-icon-btn"
                title="Отправить тест только ему"
                onClick={() => sendTest(r.chat_id)}
              >
                ✈
              </button>
              <button
                type="button"
                className="adm-icon-btn adm-icon-btn--danger"
                title="Удалить"
                onClick={() => removeRecipient(i)}
              >
                ✕
              </button>
            </div>
          ))}

          <div className="adm-inline">
            <button type="button" className="adm-btn adm-btn--small" onClick={() => addRecipient()}>
              + Добавить вручную
            </button>
            <button type="button" className="adm-btn adm-btn--small" onClick={discover}>
              Найти написавших боту
            </button>
          </div>

          {found.length > 0 && (
            <div className="adm-hint" style={{ marginBottom: 12 }}>
              Нажмите, чтобы добавить:{' '}
              {found.map((f) => (
                <button
                  key={f.chat_id}
                  type="button"
                  className="adm-btn adm-btn--small"
                  style={{ marginRight: 6 }}
                  onClick={() => {
                    addRecipient(f.chat_id, f.name);
                    setFound((p) => p.filter((x) => x.chat_id !== f.chat_id));
                  }}
                >
                  + {f.name}
                </button>
              ))}
            </div>
          )}

          <div className="adm-inline">
            <SaveButton onSave={saveTg} />
            <button type="button" className="adm-btn" onClick={() => sendTest()}>
              Тест всем
            </button>
          </div>
          {tgStatus && <p className="adm-hint" style={{ marginTop: 10 }}>{tgStatus}</p>}
        </div>
      )}

      <h3 className="adm-panel__subtitle">Сменить пароль</h3>
      <div style={{ maxWidth: 360 }}>
        <Field label="Новый пароль (мин. 8 символов)">
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
        </Field>
        <Field label="Ещё раз">
          <Input type="password" value={password2} onChange={(e) => setPassword2(e.target.value)} autoComplete="new-password" />
        </Field>
        <button type="button" className="adm-btn" onClick={changePassword}>Сменить пароль</button>
        {status && <p className="adm-hint" style={{ marginTop: 10 }}>{status}</p>}
      </div>
    </div>
  );
}
