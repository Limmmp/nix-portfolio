// src/components/Footer/Footer.jsx
import React from 'react';
import { scrollToPosition } from '../../lib/scroll';
import './footer.scss';

const socials = [
  { name: 'Twitch', url: 'https://www.twitch.tv/nix' },
  { name: 'YouTube', url: 'https://www.youtube.com/@Nixtwitch' },
  { name: 'Telegram', url: 'https://t.me/nixtalk' },
  { name: 'TikTok', url: 'https://www.tiktok.com/@nix' },
];

const Footer = ({ onOpenContact }) => {
  return (
    <footer className="footer">
      <div className="container">
        {/* Гигантский CTA — главное действие последнего экрана */}
        <div className="footer__cta-block">
          <p className="footer__eyebrow">ЕСТЬ ПРОЕКТ?</p>
          <button className="footer__big-cta interactive" onClick={onOpenContact}>
            <span className="footer__big-cta-text">СТАТЬ ПАРТНЁРОМ</span>
            <span className="footer__big-cta-arrow" aria-hidden="true">→</span>
          </button>
          <a href="mailto:nixoffers@gmail.com" className="footer__email interactive">
            nixoffers@gmail.com
          </a>
        </div>

        <div className="footer__bottom">
          <span className="footer__logo">NIX</span>

          <nav className="footer__socials">
            {socials.map((s) => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="footer__social-link interactive"
              >
                {s.name}
              </a>
            ))}
          </nav>

          <button
            className="footer__top-btn interactive"
            onClick={() => scrollToPosition(0)}
          >
            НАВЕРХ ↑
          </button>
        </div>

        <p className="footer__copy">
          © 2026 Александр «NIX» Левин. All rights reserved.
          <span className="footer__credit">
            Сайт —{' '}
            <a
              href="https://t.me/Whoathatslimp"
              target="_blank"
              rel="noopener noreferrer"
              className="footer__credit-link interactive"
            >
              @Whoathatslimp
            </a>
          </span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
