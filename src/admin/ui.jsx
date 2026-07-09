// src/admin/ui.jsx — мелкие строительные блоки форм админки
import React, { useRef, useState } from 'react';
import { uploadMedia } from '../lib/supabase';

export function Field({ label, children }) {
  return (
    <label className="adm-field">
      <span className="adm-field__label">{label}</span>
      {children}
    </label>
  );
}

export function Input(props) {
  return <input className="adm-input" {...props} />;
}

export function TextArea(props) {
  return <textarea className="adm-input adm-input--area" rows={4} {...props} />;
}

export function Select(props) {
  return <select className="adm-input" {...props} />;
}

// Кнопки порядка/удаления для строки списка
export function RowTools({ onUp, onDown, onRemove }) {
  return (
    <div className="adm-row-tools">
      <button type="button" className="adm-icon-btn" onClick={onUp} title="Выше">↑</button>
      <button type="button" className="adm-icon-btn" onClick={onDown} title="Ниже">↓</button>
      <button type="button" className="adm-icon-btn adm-icon-btn--danger" onClick={onRemove} title="Удалить">✕</button>
    </div>
  );
}

// Кнопка «Сохранить» со статусом
export function SaveButton({ onSave, children = 'Сохранить' }) {
  const [state, setState] = useState('idle'); // idle | saving | done | error
  const handle = async () => {
    setState('saving');
    try {
      await onSave();
      setState('done');
      setTimeout(() => setState('idle'), 2000);
    } catch (e) {
      console.error(e);
      setState('error');
      setTimeout(() => setState('idle'), 3500);
    }
  };
  return (
    <button type="button" className={`adm-save adm-save--${state}`} onClick={handle} disabled={state === 'saving'}>
      {state === 'saving' ? 'Сохраняю…' : state === 'done' ? 'Сохранено ✓' : state === 'error' ? 'Ошибка — ещё раз' : children}
    </button>
  );
}

// Загрузка файла в Storage с превью; onUploaded(url)
export function UploadButton({ folder, accept, onUploaded, children = 'Загрузить' }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [progressNote, setProgressNote] = useState('');

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setBusy(true);
    setProgressNote(file.size > 8 * 1024 * 1024 ? 'Файл большой, может занять минуту…' : '');
    try {
      const url = await uploadMedia(file, folder);
      onUploaded(url, file);
    } catch (err) {
      console.error(err);
      alert('Не удалось загрузить файл: ' + (err.message || err));
    } finally {
      setBusy(false);
      setProgressNote('');
    }
  };

  return (
    <span className="adm-upload">
      <button type="button" className="adm-btn" disabled={busy} onClick={() => inputRef.current?.click()}>
        {busy ? 'Загрузка…' : children}
      </button>
      {progressNote && <span className="adm-upload__note">{progressNote}</span>}
      <input ref={inputRef} type="file" accept={accept} style={{ display: 'none' }} onChange={handleFile} />
    </span>
  );
}

export function Thumb({ src, ratio = '16/9' }) {
  if (!src) return <div className="adm-thumb adm-thumb--empty" style={{ aspectRatio: ratio }}>нет</div>;
  return (
    <div className="adm-thumb" style={{ aspectRatio: ratio }}>
      <img src={src} alt="" />
    </div>
  );
}
