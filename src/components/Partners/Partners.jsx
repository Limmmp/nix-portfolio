// src/components/Partners/Partners.jsx
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useContent } from '../../content/ContentContext';
import './partners.scss';

gsap.registerPlugin(ScrollTrigger);

// Актуальные партнёрства (year = 'now') подсвечиваются градиентом
// в корпоративных цветах бренда
const isNow = (brand) => String(brand.year).trim().toLowerCase() === 'now';

const brandNameStyle = (brand) => {
  if (!isNow(brand) || !brand.colorFrom) return undefined;
  const to = brand.colorTo || brand.colorFrom;
  return { backgroundImage: `linear-gradient(120deg, ${brand.colorFrom} 0%, ${to} 100%)` };
};

const Partners = ({ onOpenContact }) => {
  const { content } = useContent();
  const brandsData = content.brands;
  const targetAudience = content.partnersAudience;
  const formats = content.partnersFormats;

  const containerRef = useRef(null);
  const [selectedBrand, setSelectedBrand] = useState(null);

  // Анимации появления при входе в вьюпорт (играют один раз)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.partners__header',
        { opacity: 0, y: 60 },
        {
          opacity: 1, y: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none'
          }
        }
      );

      gsap.fromTo('.partners__marquee',
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 0.9, stagger: 0.2, ease: 'power3.out',
          scrollTrigger: {
            trigger: '.partners__marquee-container',
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );

      gsap.fromTo('.partners__details > *',
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: {
            trigger: '.partners__details',
            start: 'top 88%',
            toggleActions: 'play none none none'
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="partners" id="partners">
      <div className="container">
        <div className="partners__header section-head section-head--light">
          <div className="section-head__main">
            <span className="section-head__index">COLLABS</span>
            <h3 className="section-head__title">Partners</h3>
          </div>
          <p className="section-head__sub">Бренды, которые мне доверяют — клик по имени откроет кейс</p>
        </div>
      </div>

      {/* Бегущие строки брендов: клик по имени открывает карточку кейса */}
      <div className="partners__marquee-container">
        {[
          brandsData.slice(0, Math.ceil(brandsData.length / 2)),
          brandsData.slice(Math.ceil(brandsData.length / 2))
        ].filter((row) => row.length > 0).map((row, rowIndex) => (
          <div
            key={rowIndex}
            className={`partners__marquee partners__marquee--${rowIndex === 0 ? 'left' : 'right'}`}
          >
            <div className="partners__marquee-track">
              {/* Дублируем ряд для бесшовного цикла */}
              {[...row, ...row].map((brand, i) => (
                <button
                  key={`${brand.id}-${i}`}
                  className="partners__marquee-item interactive"
                  onClick={() => setSelectedBrand(brand)}
                  tabIndex={i >= row.length ? -1 : 0}
                  aria-hidden={i >= row.length}
                >
                  <span
                    className={`partners__marquee-name ${isNow(brand) && brand.colorFrom ? 'partners__marquee-name--now' : ''}`}
                    style={brandNameStyle(brand)}
                  >
                    {brand.name}
                  </span>
                  <span className="partners__marquee-year">
                    {isNow(brand) ? 'NOW' : brand.year}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="container">
        <div className="partners__details">
          {/* Аудитория: три факта в один ряд */}
          <div className="partners__details-block">
            <h4 className="partners__details-title">Целевая аудитория</h4>
            <div className="partners__facts">
              {targetAudience.map((item, i) => (
                <div key={i} className="partners__fact">
                  <span className="partners__fact-label">{item.label}</span>
                  <span className="partners__fact-value">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Форматы: нумерованная строка в две-три линии */}
          <div className="partners__details-block">
            <h4 className="partners__details-title">Формы сотрудничества</h4>
            <div className="partners__formats">
              {formats.map((format, i) => (
                <div key={i} className="partners__format">
                  <span className="partners__format-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="partners__format-name">{format}</span>
                </div>
              ))}
            </div>
          </div>

          <button className="partners__cta-btn-wide interactive" onClick={onOpenContact}>
            PARTNERSHIP
          </button>
        </div>
      </div>

      {/* Модалка кейса бренда */}
      {selectedBrand && (
        <div className="partners-modal-overlay" onClick={() => setSelectedBrand(null)}>
          <div className="partners-modal" onClick={(e) => e.stopPropagation()}>
            <div className="partners-modal__header">
              <h3 className="partners-modal__title">{selectedBrand.name}</h3>
            </div>
            <div className="partners-modal__content">
              <div className="partners-modal__year">
                <span className="partners-modal__label">Год сотрудничества:</span>
                <span className="partners-modal__value">
                  {isNow(selectedBrand) ? 'Сейчас' : selectedBrand.year}
                </span>
              </div>
              <div className="partners-modal__description">
                <p>{selectedBrand.description}</p>
              </div>
            </div>
            <div className="partners-modal__footer">
              <button className="partners-modal__btn interactive" onClick={() => setSelectedBrand(null)}>Закрыть</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Partners;
