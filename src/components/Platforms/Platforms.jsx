// src/components/Platforms/Platforms.jsx
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useContent } from '../../content/ContentContext';
import { getPlatformLogo } from '../../content/platformLogos';
import './platforms.scss';

gsap.registerPlugin(ScrollTrigger);

const TWITCH_CHANNEL = 'nix';

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
    duration,
    ease: 'power2.out',
    onUpdate: () => {
      let displayValue = obj.value;
      if (isMillion) displayValue = (displayValue / 1000000).toFixed(1).replace(/\.0$/, '') + 'M+';
      else if (isThousand) displayValue = Math.round(displayValue / 1000) + 'K+';
      else displayValue = Math.round(displayValue) + '+';
      element.textContent = displayValue;
    }
  });
};

const Platforms = () => {
  const { content } = useContent();
  // Лого: встроенный SVG по slug либо картинка, загруженная через админку
  const platformsData = content.platforms.map((p) => ({
    ...p,
    logo: getPlatformLogo(p.slug, p.logoUrl)
  }));

  const containerRef = useRef(null);
  const cardsRef = useRef([]);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [twitchData, setTwitchData] = useState({ isLive: false, viewers: 0, loading: true });

  useEffect(() => {
    const fetchTwitchViewers = async () => {
      try {
        const res = await fetch(`https://decapi.me/twitch/viewercount/${TWITCH_CHANNEL}`);
        const text = await res.text();
        const count = parseInt(text, 10);
        const isLive = !isNaN(count) && count > 0;

        setTwitchData({
          viewers: isNaN(count) ? 0 : count,
          isLive,
          loading: false
        });
      } catch (error) {
        console.error('Twitch fetch error:', error);
        setTwitchData(prev => ({ ...prev, isLive: false, viewers: 0, loading: false }));
      }
    };

    fetchTwitchViewers();
    const interval = setInterval(fetchTwitchViewers, 60000);
    return () => clearInterval(interval);
  }, []);

  // Анимации появления + count-up при входе в вьюпорт (играют один раз)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.platforms__header',
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

      cardsRef.current.forEach((card, index) => {
        if (!card) return;

        gsap.fromTo(card,
          { opacity: 0, y: 80 },
          {
            opacity: 1, y: 0, duration: 0.8, delay: index * 0.12, ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none none',
              onEnter: () => {
                setTimeout(() => {
                  const numberEls = card.querySelectorAll('.platform-stat__value');
                  const values = platformsData[index]?.featured || [];
                  numberEls.forEach((el, i) => {
                    if (values[i]) animateCountUp(el, values[i].value);
                  });
                }, index * 120 + 300);
              }
            }
          }
        );

        // Название въезжает слева чуть позже строки
        gsap.fromTo(card.querySelector('.platform-row__name'),
          { x: -40, opacity: 0 },
          {
            x: 0, opacity: 1, duration: 0.9, delay: index * 0.12 + 0.15, ease: 'power3.out',
            // Иначе инлайновый transform перебьёт CSS-ховер (translateX у названия)
            clearProps: 'transform',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none none'
            }
          }
        );

        // Цифры едут медленнее скролла — лёгкий параллакс, пока строка в вьюпорте
        gsap.fromTo(card.querySelectorAll('.platform-stat'),
          { y: 14 },
          {
            y: -14,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.6
            }
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleCardClick = (e, platform) => {
    e.preventDefault();
    setSelectedPlatform(platform);
  };

  const handleOpenChannel = () => {
    if (selectedPlatform) {
      window.open(selectedPlatform.url, '_blank', 'noopener,noreferrer');
    }
    setSelectedPlatform(null);
  };

  return (
    <section ref={containerRef} className="platforms" id="platforms">
      <div className="container">
        <div className="platforms__header section-head">
          <div className="section-head__main">
            <span className="section-head__index">CHANNELS</span>
            <h3 className="section-head__title">Platforms</h3>
          </div>
          <p className="section-head__sub">Ключевые цифры по каждому каналу — детали по клику</p>
        </div>
      </div>

      {/* Список шире контейнера: почти во весь экран */}
      <div className="platforms__list">
          {platformsData.map((platform, index) => (
            <a
              key={platform.id}
              href={platform.url}
              ref={(el) => (cardsRef.current[index] = el)}
              className="platform-row interactive"
              onClick={(e) => handleCardClick(e, platform)}
              style={{ '--platform-color': platform.color }}
            >
              <div className="platform-row__id">
                <span className="platform-row__num">{String(index + 1).padStart(2, '0')}</span>
                <div className="platform-row__logo">{platform.logo}</div>
                <h4 className="platform-row__name">{platform.name}</h4>
                {platform.slug === 'twitch' && twitchData.isLive && (
                  <span className="platform-row__live">
                    <span className="live-dot live-dot--active" />
                    {twitchData.viewers.toLocaleString('ru-RU')}
                  </span>
                )}
              </div>

              <div className="platform-row__stats">
                {platform.featured.map((metric, i) => (
                  <div key={i} className="platform-stat">
                    {/* Стартуем с нуля: финальное значение подставляет count-up при входе в вьюпорт */}
                    <span className="platform-stat__value">0</span>
                    <span className="platform-stat__label">{metric.label}</span>
                  </div>
                ))}
              </div>

              <div className="platform-row__more">
                <span>ALL STATS</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </a>
          ))}
      </div>

      {/* Детальная модалка платформы (все вьюпорты) */}
      {selectedPlatform && (
        <div className="platforms-detail-overlay" onClick={() => setSelectedPlatform(null)}>
          <div className="platforms-detail" onClick={(e) => e.stopPropagation()} style={{ '--accent': selectedPlatform.color }}>
            <div className="platforms-detail__logo">
              {selectedPlatform.logo}
            </div>
            <h3 className="platforms-detail__name">{selectedPlatform.name}</h3>
            <p className="platforms-detail__desc">{selectedPlatform.description}</p>

            <div className="platforms-detail__stats">
              {selectedPlatform.metrics.map((metric, i) => (
                <div key={i} className="platforms-detail__stat">
                  <span className="platforms-detail__stat-value">{metric.value}</span>
                  <span className="platforms-detail__stat-label">{metric.label}</span>
                </div>
              ))}
            </div>

            <div className="platforms-detail__actions">
              <button className="platforms-detail__btn platforms-detail__btn--close interactive" onClick={() => setSelectedPlatform(null)}>
                Закрыть
              </button>
              <button className="platforms-detail__btn platforms-detail__btn--open interactive" onClick={handleOpenChannel}>
                Перейти
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Platforms;
