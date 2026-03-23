// src/components/LinksGrid/LinksGrid.jsx
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { linksData } from '../../data/content';
import './links-grid.scss';

gsap.registerPlugin(ScrollTrigger);

const LinksGrid = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.link-card',
        { opacity: 0, y: 60, rotate: -2 },
        {
          opacity: 1,
          y: 0,
          rotate: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 75%',
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="links-grid" id="links">
      <div className="container">
        <h3 className="links-grid__title text-large">CONNECT</h3>
        <div className="links-grid__grid">
          {linksData.map((link, index) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="link-card interactive"
            >
              <div className="link-card__icon" dangerouslySetInnerHTML={{ __html: link.icon }} />
              <span className="link-card__name">{link.name}</span>
              <span className="link-card__arrow">→</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LinksGrid;