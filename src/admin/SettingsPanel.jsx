// src/admin/SettingsPanel.jsx — смена пароля и уведомления в Telegram
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Field, Input, SaveButton } from './ui';

export default function SettingsPanel() {
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [status, setStatus] = useState('');

  // Telegram
  const [tg, setTg] = useState({ bot_token: '', chat_id: '', enabled: false });
  const [tgLoaded, setTgLoaded] = useState(false);
  const [tgStatus, setTgStatus] = useState('');

  useEffect(() => {
    supabase.from('integrations').select('value').eq('key', 'telegram').maybeSingle()
      .then(({ data }) => {
        if (data?.value) setTg({ bot_token: '', chat_id: '', enabled: false, ...data.value });
        setTgLoaded(true);
      });
  }, []);

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
    const { error } = await supabase.from('integrations').upsert({
      key: 'telegram',
      value: {
        bot_token: tg.bot_token.trim(),
        chat_id: String(tg.chat_id).trim(),
        enabled: !!tg.enabled
      },
      updated_at: new Date().toISOString()
    });
    if (error) throw error;
  };

  const sendTest = async () => {
    setTgStatus('Отправляю…');
    // Сохраняем перед тестом, иначе проверим старые значения
    try { await saveTg(); } catch (e) { setTgStatus('Ошибка сохранения: ' + e.message); return; }
    const { data, error } = await supabase.rpc('tg_send_test');
    if (error) { setTgStatus('Ошибка: ' + error.message); return; }
    setTgStatus(data?.ok ? 'Отправлено — проверьте бота ✓' : `Не отправлено: ${data?.reason || 'неизвестная причина'}`);
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
          <Field label="Chat ID (куда слать)">
            <Input
              value={tg.chat_id}
              placeholder="806185213"
              onChange={(e) => setTg((p) => ({ ...p, chat_id: e.target.value }))}
            />
          </Field>

          <div className="adm-inline">
            <SaveButton onSave={saveTg} />
            <button type="button" className="adm-btn" onClick={sendTest}>Отправить тест</button>
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
