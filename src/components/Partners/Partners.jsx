// src/components/Partners/Partners.jsx
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './partners.scss';

gsap.registerPlugin(ScrollTrigger);

const Partners = () => {
  const containerRef = useRef(null);

  const partners = [
    {
      name: 'BetBoom',
      logo: 'betboom',
      type: 'Основной партнёр',
      since: '2023',
      description: 'Букмекерская платформа. Стримы, турниры, интеграции.',
      url: 'https://betboom.ru'
    },
    {
      name: 'HellRaisers',
      logo: 'hellraisers',
      type: 'Организация',
      since: '2020-2022',
      description: 'Киберспортивная организация. Контент и коллаборации.',
      url: 'https://hellraisers.gg'
    },
    {
      name: 'Open Partnerships',
      logo: 'partnership',
      type: 'Вакантно',
      since: '2026',
      description: 'Возможности для новых партнёров и рекламодателей.',
      url: '#contact'
    }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.partner-card',
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 70%',
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="partners" id="partners">
      <div className="container">
        <h3 className="partners__title text-large">PARTNERS</h3>
        <p className="partners__subtitle">
          Сотрудничаем с ведущими брендами индустрии
        </p>
        
        <div className="partners__grid">
          {partners.map((partner, index) => (
            <a
              key={index}
              href={partner.url}
              target={partner.url !== '#contact' ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="partner-card interactive"
            >
              <div className="partner-card__header">
                <div className="partner-card__logo">
                  {partner.logo === 'betboom' && (
                    <span className="logo-text">BetBoom</span>
                  )}
                  {partner.logo === 'hellraisers' && (
                    <span className="logo-text">HR</span>
                  )}
                  {partner.logo === 'partnership' && (
                    <span className="logo-text">🤝</span>
                  )}
                </div>
                <span className="partner-card__since">{partner.since}</span>
              </div>
              
              <div className="partner-card__body">
                <span className="partner-card__type">{partner.type}</span>
                <h4 className="partner-card__name">{partner.name}</h4>
                <p className="partner-card__description">{partner.description}</p>
              </div>
              
              <div className="partner-card__footer">
                <span className="partner-card__link">
                  {partner.url === '#contact' ? 'Связаться' : 'Visit'} →
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;