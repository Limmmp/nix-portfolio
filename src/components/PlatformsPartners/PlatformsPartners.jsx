// src/components/PlatformsPartners/PlatformsPartners.jsx
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ContactModal from '../ContactModal/ContactModal';
import './platformsPartners.scss';

gsap.registerPlugin(ScrollTrigger);

const PlatformsPartners = () => {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);
  const brandsRef = useRef([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [isContactOpen, setIsContactOpen] = useState(false);

  const animateCountUp = (element, endValue, duration = 1.2) => {
    const obj = { value: 0 };
    const isMillion = endValue.includes('M');
    const isThousand = endValue.includes('K');
    
    let numericValue = parseFloat(endValue.replace(/[^0-9.]/g, ''));
    if (isMillion) numericValue *= 1000000;
    if (isThousand) numericValue *= 1000;

    element.textContent = '0';

    gsap.to(obj, {
      value: numericValue,
      duration: duration,
      ease: 'power2.out',
      onUpdate: () => {
        let displayValue = obj.value;
        if (isMillion) displayValue = (displayValue / 1000000).toFixed(1) + 'M+';
        else if (isThousand) displayValue = Math.round(displayValue / 1000) + 'K+';
        else displayValue = Math.round(displayValue) + '+';
        element.textContent = displayValue;
      }
    });
  };

  const handleCardClick = (e, platform) => {
    e.preventDefault();
    setSelectedPlatform(platform);
    setSelectedBrand(null);
    setModalOpen(true);
  };

  const handlePlatformConfirm = () => {
    if (selectedPlatform) {
      window.open(selectedPlatform.url, '_blank', 'noopener,noreferrer');
    }
    setModalOpen(false);
    setSelectedPlatform(null);
  };

  const handleBrandClick = (brand) => {
    setSelectedBrand(brand);
    setSelectedPlatform(null);
    setModalOpen(true);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=5500vh',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          markers: false,
          onUpdate: (self) => {
            const progress = self.progress * 100;
            const progressBar = document.querySelector('.scroll-progress');
            if (progressBar && progress < 98) {
              progressBar.style.width = `${progress}%`;
            }
          }
        }
      });

      // PLATFORMS - Появление
      tl.fromTo('.platforms__header',
        { opacity: 0, y: 100 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
        0
      );

      cardsRef.current.forEach((card, index) => {
        if (!card) return;
        tl.fromTo(card,
          { opacity: 0, y: 150, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' },
          index * 0.1
        );
        tl.call(() => {
          setTimeout(() => {
            const numberEls = card.querySelectorAll('.platform-stat__value');
            const values = platformsData[index]?.stats || [];
            numberEls.forEach((el, i) => {
              if (values[i]) animateCountUp(el, values[i]);
            });
          }, 200);
        }, null, index * 0.1 + 0.5);
      });

      tl.to('.platform-card', {
        boxShadow: '0 2.5vh 6vh rgba(0, 0, 0, 0.5)',
        duration: 0.5
      }, '+=0.3');

      tl.to({}, { duration: 1 }, '+=1');

      // ПЕРЕХОД - Исчезновение Platforms + ОТКЛЮЧЕНИЕ КЛИКОВ
      tl.to('.platform-card', {
        opacity: 0,
        scale: 0.92,
        duration: 1.4,
        ease: 'power2.inOut'
      });

      // ← ОТКЛЮЧАЕМ КЛИКИ НА PLATFORMS
      tl.set('.platforms-section', {
        pointerEvents: 'none'
      }, '<');

      tl.to('.platforms__header', {
        opacity: 0,
        y: -40,
        duration: 1.4,
        ease: 'power2.inOut'
      }, '<');

      tl.to('.platforms__live-indicator', {
        opacity: 0,
        duration: 1,
        ease: 'power2.inOut'
      }, '<');

      tl.to('.pattern-nix', {
        opacity: 0,
        duration: 1.8,
        ease: 'power2.inOut'
      }, '<0.2');

      tl.to('.platforms-partners__bg-overlay', {
        opacity: 0,
        duration: 1.8,
        ease: 'power2.inOut'
      }, '<');

      tl.to('.platforms-partners__bg', {
        backgroundColor: '#b7b7b7',
        duration: 1.8,
        ease: 'power2.inOut'
      }, '<');

      tl.to('.platforms-partners__gradient', {
        opacity: 1,
        duration: 1.8,
        ease: 'power2.inOut'
      }, '<');

      // ПОКАЗЫВАЕМ PARTNERS + ВКЛЮЧАЕМ КЛИКИ
      tl.to('.partners-section', {
        opacity: 1,
        visibility: 'visible',
        duration: 1.4,
        ease: 'power2.inOut'
      });

      // ← ВКЛЮЧАЕМ КЛИКИ НА PARTNERS
      tl.set('.partners-section', {
        pointerEvents: 'auto'
      }, '<');

      // PARTNERS - Появление
      tl.fromTo('.partners__title',
        { opacity: 0, x: -100 },
        { opacity: 1, x: 0, duration: 1, ease: 'power3.out' }
      );

      brandsRef.current.forEach((brand, index) => {
        if (!brand) return;
        tl.fromTo(brand,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
          index * 0.05
        );
      }, '-=0.5');

      tl.fromTo('.partners__info-block',
        { opacity: 0, x: 80 },
        { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' },
        '-=0.3'
      );
      tl.to({}, { duration: 1.5 }, '+=1'); // ← ГЭП В КОНЦЕ

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const platformsData = [
    {
      id: 'twitch',
      name: 'Twitch',
      url: 'https://www.twitch.tv/nix',
      color: '#9146FF',
      gradient: 'linear-gradient(180deg, rgba(145,70,255,0.15) 0%, rgba(0,0,0,0) 100%)',
      stats: ['37.1K', '269K', '5.98M', '115M'],
      metrics: [
        { label: 'Avg Viewers', value: '37.1K' },
        { label: 'Peak Viewers', value: '269K' },
        { label: 'Unique Viewers', value: '5.98M' },
        { label: 'Total Views', value: '115M' }
      ],
      description: '#1 Dota 2 Streamer 2024. Самый просматриваемый стример в СНГ.',
      logo: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
          <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
        </svg>
      )
    },
    {
      id: 'youtube',
      name: 'YouTube',
      url: 'https://www.youtube.com/@Nixtwitch',
      color: '#FF0000',
      gradient: 'linear-gradient(180deg, rgba(255,0,0,0.15) 0%, rgba(0,0,0,0) 100%)',
      stats: ['61.8M', '8.5M', '+17K', ''],
      metrics: [
        { label: 'Total Views', value: '61.8M' },
        { label: 'Watch Hours', value: '8.5M' },
        { label: 'New Subs', value: '+17K' },
        { label: '', value: '' }
      ],
      description: 'Highlights, клипы и эксклюзивный контент. Быстрорастущий канал.',
      logo: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      )
    },
    {
      id: 'telegram',
      name: 'Telegram',
      url: 'https://t.me/nixtalk',
      color: '#0088CC',
      gradient: 'linear-gradient(180deg, rgba(0,136,204,0.15) 0%, rgba(0,0,0,0) 100%)',
      stats: ['221.9K', '76.9K', '178', '840'],
      metrics: [
        { label: 'Subscribers', value: '221.9K' },
        { label: 'Views / Post', value: '76.9K' },
        { label: 'Shares / Post', value: '178' },
        { label: 'Reactions / Post', value: '840' }
      ],
      description: '@nixtalk — новости, анонсы стримов и общение с комьюнити.',
      logo: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
      )
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      url: 'https://www.tiktok.com/@nix',
      color: '#00f2ea',
      gradient: 'linear-gradient(180deg, rgba(0,242,234,0.15) 0%, rgba(0,0,0,0) 100%)',
      stats: ['1.8M', '23K', '103K', '25K'],
      metrics: [
        { label: 'Pub Views', value: '1.8M' },
        { label: 'Profile Views', value: '23K' },
        { label: 'Likes on post', value: '103K' },
        { label: 'Reposts', value: '25K' }
      ],
      description: 'Клипы и моменты со стримов. Быстрорастущая аудитория.',
      logo: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
          <path d="M12.53 2.05c0-1.04.85-1.89 1.89-1.89h2.83v3.78c-.57 0-1.12-.07-1.65-.2v8.26c0 3.89-3.16 7.05-7.05 7.05S1.5 15.99 1.5 12.1c0-3.89 3.16-7.05 7.05-7.05.39 0 .77.03 1.14.1v3.75c-.36-.12-.74-.19-1.14-.19-1.89 0-3.42 1.53-3.42 3.42s1.53 3.42 3.42 3.42 3.42-1.53 3.42-3.42V2.05h.56z"/>
        </svg>
      )
    }
  ];

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
    <section ref={containerRef} className="platforms-partners" id="platforms-partners">
      <div className="platforms-partners__bg"></div>
      <div className="platforms-partners__bg-pattern">
        {Array.from({ length: 120 }).map((_, i) => (
          <span key={i} className="pattern-nix">NIX</span>
        ))}
      </div>
      <div className="platforms-partners__bg-overlay"></div>
      <div className="platforms-partners__gradient"></div>
      
      <div className="container">
        <div className="platforms-section" id="platforms">
          <div className="platforms__live-indicator">
            <span className="live-dot"></span>
            <span className="live-text">LIVE</span>
            <span className="live-viewers">37.1K viewers</span>
          </div>

          <div className="platforms__header">
            <h3 className="platforms__title">PLATFORMS</h3>
            <p className="platforms__subtitle">Детальная статистика по всем каналам</p>
          </div>

          <div className="platforms__grid">
            {platformsData.map((platform, index) => (
              <a
                key={index}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                ref={(el) => (cardsRef.current[index] = el)}
                className="platform-card interactive"
                onClick={(e) => handleCardClick(e, platform)}
                style={{ 
                  '--platform-color': platform.color,
                  '--platform-gradient': platform.gradient
                }}
              >
                <div className="platform-card__border" />
                <div className="platform-card__gradient" />
                
                <div className="platform-card__content">
                  <div className="platform-card__header">
                    <div className="platform-card__logo">{platform.logo}</div>
                    <h4 className="platform-card__name">{platform.name}</h4>
                  </div>

                  <div className="platform-card__stats platform-card__stats--grid">
                    {platform.metrics.map((metric, i) => (
                      <div key={i} className="platform-stat">
                        {metric.value ? (
                          <>
                            <span className="platform-stat__value">{metric.value}</span>
                            <span className="platform-stat__label">{metric.label}</span>
                          </>
                        ) : (
                          <span className="platform-stat__empty"></span>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="platform-card__footer">
                    <p className="platform-card__description">{platform.description}</p>
                  </div>

                  <div className="platform-card__arrow">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 5v14M5 12l7 7 7-7"/>
                    </svg>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="partners-section" id="partners">
          <div className="partners__title-wrapper">
            <h3 className="partners__title">PARTNERS</h3>
          </div>

          <div className="partners__content">
            <div className="partners__brands">
              <div className="partners__brands-column partners__brands-column--up">
                {column1.map((brand, i) => (
                  <span
                    key={`c1-${i}`}
                    ref={(el) => (brandsRef.current[i] = el)}
                    className="partners__brand-item interactive"
                    onClick={() => handleBrandClick(brand)}
                  >
                    {brand.name}
                  </span>
                ))}
              </div>
              <div className="partners__brands-column partners__brands-column--down">
                {column2.map((brand, i) => (
                  <span
                    key={`c2-${i}`}
                    ref={(el) => (brandsRef.current[i + 5] = el)}
                    className="partners__brand-item interactive"
                    onClick={() => handleBrandClick(brand)}
                  >
                    {brand.name}
                  </span>
                ))}
              </div>
              <div className="partners__brands-column partners__brands-column--up">
                {column3.map((brand, i) => (
                  <span
                    key={`c3-${i}`}
                    ref={(el) => (brandsRef.current[i + 10] = el)}
                    className="partners__brand-item interactive"
                    onClick={() => handleBrandClick(brand)}
                  >
                    {brand.name}
                  </span>
                ))}
              </div>
                {/* ← ДОБАВЬ СТРЕЛКУ "CLICK TO EXPLORE" */}
  <div className="partners__explore-arrow">
    <span>CLICK TO EXPLORE</span>
  </div>
            </div>

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

              <button className="partners__cta-btn" onClick={() => setIsContactOpen(true)}>
                PARTNERSHIP
              </button>
            </div>
          </div>
        </div>
      </div>

      {modalOpen && selectedPlatform && (
        <div className="platforms-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="platforms-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="platforms-modal__title">Перейти на {selectedPlatform?.name} Nix?</h3>
            <div className="platforms-modal__buttons">
              <button className="platforms-modal__btn platforms-modal__btn--secondary" onClick={() => setModalOpen(false)}>ОТМЕНА</button>
              <button className="platforms-modal__btn platforms-modal__btn--primary" onClick={handlePlatformConfirm}>ПЕРЕЙТИ</button>
            </div>
          </div>
        </div>
      )}

      {modalOpen && selectedBrand && !selectedPlatform && (
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
              <button className="partners-modal__btn" onClick={() => setModalOpen(false)}>Закрыть</button>
            </div>
          </div>
        </div>
      )}

      <div className="platforms__scroll-indicator">
        <div className="scroll-progress"></div>
      </div>

      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </section>
  );
};

export default PlatformsPartners;