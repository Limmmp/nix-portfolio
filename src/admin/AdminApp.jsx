// src/admin/AdminApp.jsx — админка сайта: /admin
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import HeroEditor from './HeroEditor';
import AboutEditor from './AboutEditor';
import PlatformsEditor from './PlatformsEditor';
import PartnersEditor from './PartnersEditor';
import HighlightsEditor from './HighlightsEditor';
import LeadsPanel from './LeadsPanel';
import HistoryPanel from './HistoryPanel';
import SettingsPanel from './SettingsPanel';
import './admin.scss';

const TABS = [
  { id: 'hero', label: 'Hero', component: HeroEditor },
  { id: 'about', label: 'About', component: AboutEditor },
  { id: 'platforms', label: 'Platforms', component: PlatformsEditor },
  { id: 'partners', label: 'Partners', component: PartnersEditor },
  { id: 'highlights', label: 'Highlights', component: HighlightsEditor },
  { id: 'leads', label: 'Заявки', component: LeadsPanel },
  { id: 'history', label: 'История', component: HistoryPanel },
  { id: 'settings', label: 'Настройки', component: SettingsPanel }
];

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (err) setError('Неверный email или пароль');
  };

  return (
    <div className="adm-login">
      <form className="adm-login__box" onSubmit={submit}>
        <h1 className="adm-login__title">NIX / ADMIN</h1>
        <input
          className="adm-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
          required
        />
        <input
          className="adm-input"
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
        {error && <p className="adm-login__error">{error}</p>}
        <button type="submit" className="adm-save" disabled={busy}>
          {busy ? 'Вход…' : 'Войти'}
        </button>
      </form>
    </div>
  );
}

export default function AdminApp() {
  const [session, setSession] = useState(undefined); // undefined = ещё не знаем
  const [tab, setTab] = useState('hero');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  if (session === undefined) return null;
  if (!session) return <Login />;

  const Active = TABS.find((t) => t.id === tab)?.component || HeroEditor;

  return (
    <div className="adm">
      <aside className="adm-sidebar">
        <div className="adm-sidebar__logo">NIX / ADMIN</div>
        <nav className="adm-sidebar__nav">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`adm-sidebar__link ${tab === t.id ? 'is-active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>
        <div className="adm-sidebar__footer">
          <a href="/" target="_blank" rel="noreferrer" className="adm-sidebar__link">Открыть сайт ↗</a>
          <button type="button" className="adm-sidebar__link" onClick={() => supabase.auth.signOut()}>
            Выйти
          </button>
        </div>
      </aside>

      <main className="adm-main" key={tab}>
        <Active />
      </main>
    </div>
  );
}
