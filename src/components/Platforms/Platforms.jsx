// src/components/Platforms/Platforms.jsx
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './platforms.scss';

gsap.registerPlugin(ScrollTrigger);

const Platforms = () => {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState(null);

  // Анимация Count Up для цифр
  const animateCountUp = (element, endValue, duration = 1.5) => {
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

  // Обработка клика по карточке
  const handleCardClick = (e, platform) => {
    e.preventDefault();
    setSelectedPlatform(platform);
    setModalOpen(true);
  };

  // Подтверждение перехода
  const handleConfirm = () => {
    if (selectedPlatform) {
      window.open(selectedPlatform.url, '_blank', 'noopener,noreferrer');
    }
    setModalOpen(false);
    setSelectedPlatform(null);
  };

useEffect(() => {
  const ctx = gsap.context(() => {
    const progressBar = document.querySelector('.scroll-progress');
    
    // Создаём timeline для pin-scroll анимации
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=3000',
        scrub: true,
        pin: true,
        anticipatePin: 1,
        markers: false
      }
    });

    // === ЭТАП 1: Заголовок (0-10% прогресса) ===
    tl.fromTo('.platforms__header',
      { opacity: 0, y: 100 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
      0 // Начало в 0
    );

    // === ЭТАП 2: Карточки (10-60% прогресса) ===
    cardsRef.current.forEach((card, index) => {
      if (!card) return;

      tl.fromTo(card,
        { opacity: 0, y: 150, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          ease: 'power3.out'
        },
        0.3 + (index * 0.2) // Позиция на таймлайне
      );

      // Count Up для цифр
      tl.call(() => {
        const numberEls = card.querySelectorAll('.platform-stat__value');
        const values = platformsData[index]?.stats || [];
        numberEls.forEach((el, i) => {
          if (values[i]) {
            animateCountUp(el, values[i]);
          }
        });
      }, null, 0.5 + (index * 0.2));
    });

    // === ЭТАП 3: Финальные эффекты (60-80% прогресса) ===
    tl.to('.platform-card', {
      boxShadow: '0 24px 60px rgba(0, 0, 0, 0.5)',
      duration: 0.5
    }, 1.5);

    // === ЭТАП 4: ПУСТАЯ ПАУЗА (80-100% прогресса) ===
    // Это занимает оставшееся время скролла чтобы прогресс не сбрасывался
    tl.to({}, { 
      duration: 1,
      onStart: () => {
        // Фиксируем прогресс на 100%
        if (progressBar) {
          progressBar.style.width = '100%';
        }
      }
    }, 1.8);

    // Обновляем прогресс-бар на КАЖДОМ кадре
    tl.eventCallback('onUpdate', () => {
      if (progressBar && tl.progress() < 0.98) {
        const progress = tl.progress() * 100;
        progressBar.style.width = `${progress}%`;
      }
    });

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
        { label: 'New Subscribers', value: '+17K' },
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
      description: '@nixtalk — новости, анонсы стримов и личное общение с комьюнити.',
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
        { label: 'Likes', value: '103K' },
        { label: 'Reposts', value: '25K' }
      ],
      description: 'Вирусные клипы и моменты со стримов. Быстрорастущая аудитория.',
      logo: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
          <path d="M12.53 2.05c0-1.04.85-1.89 1.89-1.89h2.83v3.78c-.57 0-1.12-.07-1.65-.2v8.26c0 3.89-3.16 7.05-7.05 7.05S1.5 15.99 1.5 12.1c0-3.89 3.16-7.05 7.05-7.05.39 0 .77.03 1.14.1v3.75c-.36-.12-.74-.19-1.14-.19-1.89 0-3.42 1.53-3.42 3.42s1.53 3.42 3.42 3.42 3.42-1.53 3.42-3.42V2.05h.56z"/>
        </svg>
      )
    }
  ];

  return (
    <section ref={containerRef} className="platforms" id="platforms">
      {/* Фоновый паттерн NIX */}
      <div className="platforms__bg-pattern">
        {Array.from({ length: 120 }).map((_, i) => (
          <span key={i} className="pattern-nix">NIX</span>
        ))}
      </div>

      {/* Затемнение фона */}
      <div className="platforms__bg-overlay"></div>

      <div className="container">
        {/* LIVE индикатор */}
        <div className="platforms__live-indicator">
          <span className="live-dot"></span>
          <span className="live-text">LIVE</span>
          <span className="live-viewers">37.1K viewers</span>
        </div>

        <div className="platforms__header">
          <h3 className="platforms__title">PLATFORMS</h3>
          <p className="platforms__subtitle">
            Детальная статистика по всем каналам присутствия
          </p>
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
                {/* Верх: Лого + Название */}
{/* Верх: Лого + Название (с анимацией) */}
<div className="platform-card__header">
  <div className="platform-card__logo">
    {platform.logo}
  </div>
  <h4 className="platform-card__name">{platform.name}</h4>
</div>

                {/* Середина: Статистика - ВАРИАНТ 1 (Сетка 2x2) */}
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

                {/* Низ: Описание */}
                <div className="platform-card__footer">
                  <p className="platform-card__description">{platform.description}</p>
                </div>

                {/* Стрелка */}
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

      {/* Модальное окно подтверждения */}
      {modalOpen && (
        <div className="platforms-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="platforms-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="platforms-modal__title">
              Перейти на {selectedPlatform?.name} Nix?
            </h3>
            <div className="platforms-modal__buttons">
              <button 
                className="platforms-modal__btn platforms-modal__btn--secondary"
                onClick={() => setModalOpen(false)}
              >
                ОТМЕНА
              </button>
              <button 
                className="platforms-modal__btn platforms-modal__btn--primary"
                onClick={handleConfirm}
              >
                ПЕРЕЙТИ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Индикатор прогресса скролла */}
      <div className="platforms__scroll-indicator">
        <div className="scroll-progress"></div>
      </div>
    </section>
  );
};

export default Platforms;