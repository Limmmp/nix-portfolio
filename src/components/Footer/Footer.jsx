// src/components/Footer/Footer.jsx
import React from 'react';
import './footer.scss';

const Footer = ({ onOpenContact }) => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__content">
          <h4 className="footer__logo text-display">NIX</h4>
          <p className="footer__text text-small">
            © 2026 Александр "NIX" Левин. All rights reserved.
          </p>
          <button 
            className="footer__contact interactive"
            onClick={onOpenContact}
          >
            СТАТЬ ПАРТНЁРОМ →
          </button>
          <a href="mailto:nixoffers@gmail.com" className="footer__email text-small">
            nixoffers@gmail.com
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;