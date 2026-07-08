// src/components/Header/Header.jsx
import React from 'react';
import { scrollToPosition, scrollToSection } from '../../lib/scroll';
import './header.scss';

const NAV_ITEMS = [
  { id: 'about', label: 'ABOUT' },
  { id: 'platforms', label: 'PLATFORMS' },
  { id: 'partners', label: 'PARTNERS' },
  { id: 'highlights', label: 'HIGHLIGHTS' },
];

const Header = ({ visible, onOpenContact }) => {
  return (
    <header className={`site-header ${visible ? 'site-header--visible' : ''}`}>
      <button
        className="site-header__logo interactive"
        onClick={() => scrollToPosition(0)}
        aria-label="Наверх"
      >
        NIX
      </button>

      <nav className="site-header__nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className="site-header__link interactive"
            onClick={() => scrollToSection(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <button className="site-header__cta interactive" onClick={onOpenContact}>
        PARTNERSHIP
      </button>
    </header>
  );
};

export default Header;
