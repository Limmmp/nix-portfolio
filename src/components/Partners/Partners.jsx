// src/components/Partners/Partners.jsx
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ContactModal from '../ContactModal/ContactModal';
import './partners.scss';

gsap.registerPlugin(ScrollTrigger);

const Partners = () => {
  const containerRef = useRef(null);
  const brandsRef = useRef([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [isContactOpen, setIsContactOpen] = useState(false);

  // Анимация появления при скролле
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          end: 'bottom 80%',
          scrub: 1,
          markers: false
        }
      });

      // Заголовок
      tl.fromTo('.partners__title',
        { opacity: 0, x: -100 },
        { opacity: 1, x: 0, duration: 1, ease: 'power3.out' }
      );

      // Бренды
      brandsRef.current.forEach((brand, index) => {
        if (!brand) return;
        tl.fromTo(brand,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power3.out'
          },
          index * 0.05
        );
      });

      // Инфо блоки
      tl.fromTo('.partners__info-block',
        { opacity: 0, x: 80 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power3.out'
        },
        '-=0.5'
      );

    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Обработка клика по бренду
  const handleBrandClick = (brand) => {
    setSelectedBrand(brand);
    setModalOpen(true);
  };

  const brandsData = [
    { id: 1, name: 'HAVAL', year: '2024', description: 'Нативная интеграция автомобиля во время стрима. Тест-драйв, обзор функций, промокод для зрителей.' },
    { id: 2, name: 'Yandex', year: '2024', description: 'Брендирование канала в стиле Yandex Plus. Интеграция в оверлеи и чат-бот.' },
    { id: 3, name: 'Kitfort', year: '2023', description: 'Серия видео с использованием техники. Приготовление еды во время стрима.' },
    { id: 4, name: 'MTS', year: '2024', description: 'Долгосрочное партнёрство. Спонсорство турниров, эксклюзивные тарифы.' },
    { id: 5, name: 'Yota', year: '2024', description: 'Посты в Telegram и VK о безлимитном интернете для геймеров.' },
    { id: 6, name: 'Nuw Store', year: '2024', description: 'Использование образа в рекламной кампании магазина электроники.' },
    { id: 7, name: 'Точка Банк', year: '2023', description: 'Обзор бизнес-карты для стримеров. Интеграция в контент о монетизации.' },
    { id: 8, name: 'Самокат', year: '2024', description: 'Стримы с доставкой еды. Промокоды для зрителей, спонсорские челленджи.' },
    { id: 9, name: 'Majestic', year: '2024', description: 'Амбассадорство сервера в GTA 5 RP. Эксклюзивный контент, турниры.' },
    { id: 10, name: 'Genshin', year: '2024', description: 'Стримы по новому обновлению. Ранний доступ, промокоды для зрителей.' },
    { id: 11, name: 'MLBB', year: '2023', description: 'Организация турнира по Mobile Legends. Призовой фонд, трансляция.' }
  ];

  const column1 = [brandsData[0], brandsData[1], brandsData[2], brandsData[3], brandsData[4]];
  const column2 = [brandsData[5], brandsData[6], brandsData[7], brandsData[8], brandsData[9]];
  const column3 = [brandsData[10], brandsData[0], brandsData[1], brandsData[2], brandsData[3]];

  const targetAudience = [
    { label: 'ЦА', value: 'Киберспорт, игры' },
    { label: 'Аудитория', value: 'Мужчины 18-34' },
    { label: 'Регионы', value: 'RU / CIS / EU' }
  ];

  const formats = [
    'Нативные интеграции',
    'Брендирование канала',
    'Авторские интеграции',
    'Посты в соцсетях',
    'Права на медиа',
    'Амбассадорство'
  ];

  return (
    <section ref={containerRef} className="partners" id="partners">
      <div className="container">
        {/* Заголовок (повёрнутый на 90°) */}
        <div className="partners__title-wrapper">
          <h3 className="partners__title">PARTNERS</h3>
        </div>

        <div className="partners__content">
          {/* Левая часть: 3 вертикальные строки брендов */}
          <div className="partners__brands">
            <div className="partners__brands-column partners__brands-column--up">
              {column1.map((brand, i) => (
                <span
                  key={i}
                  ref={(el) => (brandsRef.current[i] = el)}
                  className="partners__brand-item"
                  onClick={() => handleBrandClick(brand)}
                >
                  {brand.name}
                </span>
              ))}
            </div>
            <div className="partners__brands-column partners__brands-column--down">
              {column2.map((brand, i) => (
                <span
                  key={i}
                  ref={(el) => (brandsRef.current[i + 5] = el)}
                  className="partners__brand-item"
                  onClick={() => handleBrandClick(brand)}
                >
                  {brand.name}
                </span>
              ))}
            </div>
            <div className="partners__brands-column partners__brands-column--up">
              {column3.map((brand, i) => (
                <span
                  key={i}
                  ref={(el) => (brandsRef.current[i + 10] = el)}
                  className="partners__brand-item"
                  onClick={() => handleBrandClick(brand)}
                >
                  {brand.name}
                </span>
              ))}
            </div>
          </div>

          {/* Правая часть: Инфо + Кнопка */}
          <div className="partners__info">
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

            <button 
              className="partners__cta-btn"
              onClick={() => setIsContactOpen(true)}
            >
              PARTNERSHIP
            </button>
          </div>
        </div>
      </div>

      {/* Модальное окно */}
      {modalOpen && selectedBrand && (
        <div className="partners-modal-overlay" onClick={() => setModalOpen(false)}>
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
              <button 
                className="partners-modal__btn"
                onClick={() => setModalOpen(false)}
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}

      <ContactModal 
        isOpen={isContactOpen} 
        onClose={() => setIsContactOpen(false)} 
      />
    </section>
  );
};

export default Partners;