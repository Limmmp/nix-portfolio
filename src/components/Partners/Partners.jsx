// src/components/Partners/Partners.jsx
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './partners.scss';

gsap.registerPlugin(ScrollTrigger);

const brandsData = [
  { id: 1, name: 'HAVAL', year: '2024', description: 'Нативная интеграция автомобиля во время стрима. Тест-драйв, обзор функций.' },
  { id: 2, name: 'YANDEX', year: '2024', description: 'Брендирование канала в стиле Yandex Plus. Интеграция в оверлеи.' },
  { id: 3, name: 'KITFORT', year: '2023', description: 'Серия видео с использованием техники. Приготовление еды во время стрима.' },
  { id: 4, name: 'MTS', year: '2024', description: 'Долгосрочное партнёрство. Спонсорство турниров, эксклюзивные тарифы.' },
  { id: 5, name: 'YOTA', year: '2024', description: 'Посты в Telegram и VK о безлимитном интернете для геймеров.' },
  { id: 6, name: 'NUW STORE', year: '2024', description: 'Использование образа в рекламной кампании магазина электроники.' },
  { id: 7, name: 'ТОЧКА БАНК', year: '2023', description: 'Обзор бизнес-карты для стримеров. Интеграция в контент о монетизации.' },
  { id: 8, name: 'САМОКАТ', year: '2024', description: 'Стримы с доставкой еды. Промокоды для зрителей, спонсорские челленджи.' },
  { id: 9, name: 'MAJESTIC', year: '2024', description: 'Амбассадорство сервера в GTA 5 RP. Эксклюзивный контент, турниры.' },
  { id: 10, name: 'GENSHIN', year: '2024', description: 'Стримы по новому обновлению. Ранний доступ, промокоды для зрителей.' },
  { id: 11, name: 'MLBB', year: '2023', description: 'Организация турнира по Mobile Legends. Призовой фонд, трансляция.' },
  { id: 12, name: 'PLAYEROK', year: '2026', description: 'Партнерство с игровым маркетплейсом. Промокод на пополнение Steam без комиссии.' },
  { id: 13, name: 'BETBOOM', year: '2024', description: 'Спонсорство турниров и эксклюзивные бонусы для зрителей.' }
];

const targetAudience = [
  { label: 'Тематика', value: 'Киберспорт, игры' },
  { label: 'Аудитория', value: 'Мужчины 18-34' },
  { label: 'Регионы', value: 'RU / CIS / EU' }
];

const formats = [
  'Нативные интеграции', 'Брендирование канала', 'Авторские интеграции',
  'Посты в соцсетях', 'Права на медиа', 'Амбассадорство'
];

const Partners = ({ onOpenContact }) => {
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

      gsap.fromTo('.partners__info-block',
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: {
            trigger: '.partners__info-row',
            start: 'top 88%',
            toggleActions: 'play none none none'
          }
        }
      );

      gsap.fromTo('.partners__cta-btn-wide',
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
          scrollTrigger: {
            trigger: '.partners__cta-btn-wide',
            start: 'top 92%',
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
        <div className="partners__header">
          <h3 className="partners__title">PARTNERS</h3>
          <p className="partners__subtitle">Бренды, которые мне доверяют</p>
        </div>
      </div>

      {/* Бегущие строки брендов: клик по имени открывает карточку кейса */}
      <div className="partners__marquee-container">
        {[brandsData.slice(0, 7), brandsData.slice(7)].map((row, rowIndex) => (
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
                  <span className="partners__marquee-name">{brand.name}</span>
                  <span className="partners__marquee-year">{brand.year}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="container">
        <div className="partners__info-row">
          <div className="partners__info-block">
            <h4 className="partners__info-title">Целевая аудитория</h4>
            <div className="partners__info-list">
              {targetAudience.map((item, i) => (
                <div key={i} className="partners__info-item">
                  <span className="partners__info-label">{item.label}</span>
                  <span className="partners__info-value">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="partners__info-block">
            <h4 className="partners__info-title">Формы сотрудничества</h4>
            <div className="partners__formats-list">
              {formats.map((format, i) => (
                <div key={i} className="partners__format-item">
                  <span className="partners__format-title">{format}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button className="partners__cta-btn-wide interactive" onClick={onOpenContact}>
          PARTNERSHIP
        </button>
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
                <span className="partners-modal__value">{selectedBrand.year}</span>
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
