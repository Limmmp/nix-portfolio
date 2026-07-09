// src/components/NotFound/NotFound.jsx — страница 404 в стиле сайта
import React from 'react';
import './not-found.scss';

export default function NotFound() {
  return (
    <div className="notfound">
      <div className="grain" aria-hidden="true" />
      <div className="notfound__inner">
        <span className="notfound__eyebrow">ERROR</span>
        <h1 className="notfound__code">
          404<span className="notfound__dot" aria-hidden="true" />
        </h1>
        <p className="notfound__text">Страница не найдена</p>
        <a href="/" className="notfound__btn">НА ГЛАВНУЮ →</a>
      </div>
    </div>
  );
}
