// src/components/Platforms/Platforms.jsx
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
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

const platformsData = [
  {
    id: 'twitch', name: 'Twitch', url: `https://www.twitch.tv/${TWITCH_CHANNEL}`, color: '#9146FF',
    // Две ключевые метрики на карточке, остальное — в модалке
    featured: [
      { label: 'Followers', value: '1.09M' },
      { label: 'Avg Viewers', value: '35K' }
    ],
    metrics: [
      { label: 'Avg Viewers', value: '35K' }, { label: 'Peak Viewers', value: '400K' },
      { label: 'Unique Viewers', value: '5.98M' }, { label: 'Total Views', value: '100M+' }
    ],
    description: '#1 Dota 2 Streamer 2024. Самый просматриваемый стример в СНГ.',
    logo: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
        <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
      </svg>
    )
  },
  {
    id: 'youtube', name: 'YouTube', url: 'https://www.youtube.com/@Nixtwitch', color: '#FF0000',
    featured: [
      { label: 'Total Views', value: '60M' },
      { label: 'Followers', value: '250K' }
    ],
    metrics: [
      { label: 'Total Views', value: '60M+' }, { label: 'Watch Hours', value: '8.5M' },
      { label: 'New Subs in month', value: '20K+' }, { label: 'Followers', value: '250K+' }
    ],
    description: 'Highlights, клипы и эксклюзивный контент. Быстрорастущий канал.',
    logo: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    )
  },
  {
    id: 'telegram', name: 'Telegram', url: 'https://t.me/nixtalk', color: '#0088CC',
    featured: [
      { label: 'Subscribers', value: '220K' },
      { label: 'Views / Post', value: '70K' }
    ],
    metrics: [
      { label: 'Subscribers', value: '220K+' }, { label: 'Views / Post', value: '70K+' },
      { label: 'Shares / Post', value: '200+' }, { label: 'Reactions / Post', value: '900+' }
    ],
    description: '@nixtalk — новости, анонсы стримов и общение с комьюнити.',
    logo: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    )
  },
  {
    id: 'tiktok', name: 'TikTok', url: 'https://www.tiktok.com/@nix', color: '#00f2ea',
    featured: [
      { label: 'Pub Views', value: '2M' },
      { label: 'Likes on post', value: '100K' }
    ],
    metrics: [
      { label: 'Pub Views', value: '2M+' }, { label: 'Profile Views', value: '20K+' },
      { label: 'Likes on post', value: '100K+' }, { label: 'Reposts', value: '25K' }
    ],
    description: 'Клипы и моменты со стримов. Быстрорастущая аудитория.',
    logo: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
        <path d="M12.53 2.05c0-1.04.85-1.89 1.89-1.89h2.83v3.78c-.57 0-1.12-.07-1.65-.2v8.26c0 3.89-3.16 7.05-7.05 7.05S1.5 15.99 1.5 12.1c0-3.89 3.16-7.05 7.05-7.05.39 0 .77.03 1.14.1v3.75c-.36-.12-.74-.19-1.14-.19-1.89 0-3.42 1.53-3.42 3.42s1.53 3.42 3.42 3.42 3.42-1.53 3.42-3.42V2.05h.56z" />
      </svg>
    )
  }
];

const Platforms = () => {
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
      <div className="platforms__bg-pattern">
        {Array.from({ length: 126 }).map((_, i) => (
          <span key={i} className="pattern-nix">NIX</span>
        ))}
      </div>
      <div className="platforms__bg-overlay" />

      <div className="container platforms__container">
        <div className="platforms__header">
          <a
            href={`https://twitch.tv/${TWITCH_CHANNEL}`}
            target="_blank"
            rel="noopener noreferrer"
            className="platforms__live-badge interactive"
          >
            <span className={`live-dot ${twitchData.isLive ? 'live-dot--active' : ''}`} />
            <span className="live-text">
              {twitchData.loading ? '...' : twitchData.isLive ? 'LIVE' : 'OFFLINE'}
            </span>
            {twitchData.isLive && (
              <span className="live-viewers">
                {twitchData.viewers.toLocaleString('ru-RU')} viewers
              </span>
            )}
          </a>
          <h3 className="platforms__title">PLATFORMS</h3>
          <p className="platforms__subtitle">Ключевые цифры по каждому каналу — детали по клику</p>
        </div>

        <div className="platforms__grid">
          {platformsData.map((platform, index) => (
            <a
              key={platform.id}
              href={platform.url}
              ref={(el) => (cardsRef.current[index] = el)}
              className="platform-card interactive"
              onClick={(e) => handleCardClick(e, platform)}
              style={{ '--platform-color': platform.color }}
            >
              <div className="platform-card__top">
                <div className="platform-card__logo">{platform.logo}</div>
                <h4 className="platform-card__name">{platform.name}</h4>
              </div>

              <div className="platform-card__stats">
                {platform.featured.map((metric, i) => (
                  <div key={i} className="platform-stat">
                    <span className="platform-stat__value">{metric.value}</span>
                    <span className="platform-stat__label">{metric.label}</span>
                  </div>
                ))}
              </div>

              <div className="platform-card__more">
                <span>ALL STATS</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </a>
          ))}
        </div>
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
