// src/admin/SettingsPanel.jsx — смена пароля
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Field, Input } from './ui';

export default function SettingsPanel() {
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [status, setStatus] = useState('');

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

  return (
    <div className="adm-panel">
      <h2 className="adm-panel__title">Настройки</h2>

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
