import React from 'react';
import './footer.scss';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__content">
          <h4 className="footer__logo text-display">NIX</h4>
          <p className="footer__text text-small">
            © 2026 NIX. All rights reserved.
          </p>
          <a href="mailto:nixoffers@gmail.com" className="footer__email text-small">
            nixoffers@gmail.com
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;