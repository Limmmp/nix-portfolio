// src/components/Platforms/Platforms.jsx
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './platforms.scss';

gsap.registerPlugin(ScrollTrigger);

const Platforms = () => {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);
  const numbersRef = useRef([]);

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

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Анимация карточек (справа налево при скролле)
      cardsRef.current.forEach((card, index) => {
        if (!card) return;

        ScrollTrigger.create({
          trigger: card,
          start: 'top 85%',
          end: 'top 60%',
          onEnter: () => {
            gsap.fromTo(card,
              { opacity: 0, x: 100 },  // ← Справа (100px)
              {
                opacity: 1,
                x: 0,
                duration: 0.8,
                delay: index * 0.15,    // ← Stagger задержка
                ease: 'power3.out'
              }
            );

            // Запускаем Count Up для цифр в этой карточке
            setTimeout(() => {
              const numberEls = card.querySelectorAll('.platform-stat__value');
              const values = platformsData[index]?.stats || [];
              numberEls.forEach((el, i) => {
                if (values[i]) {
                  animateCountUp(el, values[i]);
                }
              });
            }, 300 + (index * 150));
          },
          once: true
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const platformsData = [
    {
      name: 'Twitch',
      icon: '📺',
      url: 'https://www.twitch.tv/nix',
      followers: '1.09M+',
      stats: ['1.09M+', '30K', '80K', '24.33M'],
      metrics: [
        { label: 'Followers', value: '1.09M+' },
        { label: 'Avg Viewers', value: '30K' },
        { label: 'Peak Viewers', value: '80K' },
        { label: 'Hours Watched 2024', value: '24.33M' }
      ],
      description: '#1 Dota 2 Streamer 2024. Самый просматриваемый стример в СНГ.',
      color: '#9146FF'
    },
    {
      name: 'YouTube',
      icon: '📹',
      url: 'https://www.youtube.com/@nix',
      followers: '500K+',
      stats: ['500K+', '10M', '+5K', '2M+'],
      metrics: [
        { label: 'Subscribers', value: '500K+' },
        { label: 'Views / Year', value: '10M' },
        { label: 'New Subs / Month', value: '+5K' },
        { label: 'Avg Views / Video', value: '2M+' }
      ],
      description: 'Highlights, клипы и эксклюзивный контент. Быстрорастущий канал.',
      color: '#FF0000'
    },
    {
      name: 'Telegram',
      icon: '✈️',
      url: 'https://t.me/nixtalk',
      followers: '50K+',
      stats: ['50K+', '40K', '15%', '5+'],
      metrics: [
        { label: 'Subscribers', value: '50K+' },
        { label: 'Post Reach', value: '40K' },
        { label: 'ERR', value: '15%' },
        { label: 'Posts / Week', value: '5+' }
      ],
      description: '@nixtalk — новости, анонсы стримов и личное общение с комьюнити.',
      color: '#0088CC'
    },
    {
      name: 'TikTok',
      icon: '🎵',
      url: 'https://www.tiktok.com/@nix',
      followers: '200K+',
      stats: ['200K+', '5M', '8%', '10+'],
      metrics: [
        { label: 'Followers', value: '200K+' },
        { label: 'Total Views', value: '5M' },
        { label: 'Avg Engagement', value: '8%' },
        { label: 'Videos / Month', value: '10+' }
      ],
      description: 'Вирусные клипы и моменты со стримов. Быстрорастущая аудитория.',
      color: '#00f2ea'
    }
  ];

  return (
    <section ref={containerRef} className="platforms" id="platforms">
      <div className="container">
        <div className="platforms__header">
          <h3 className="platforms__title text-large">PLATFORMS</h3>
          <p className="platforms__subtitle">
            Детальная статистика по всем каналам присутствия
          </p>
        </div>

        <div className="platforms__list">
          {platformsData.map((platform, index) => (
            <a
              key={index}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              ref={(el) => (cardsRef.current[index] = el)}
              className="platform-card interactive"
              style={{ '--platform-color': platform.color }}
            >
              <div className="platform-card__border" />
              
              <div className="platform-card__content">
                {/* Левая часть - лого и название */}
                <div className="platform-card__left">
                  <div className="platform-card__icon">
                    {platform.icon}
                  </div>
                  <div className="platform-card__info">
                    <h4 className="platform-card__name">{platform.name}</h4>
                    <p className="platform-card__description">{platform.description}</p>
                  </div>
                </div>

                {/* Правая часть - статистика */}
                <div className="platform-card__stats">
                  {platform.metrics.map((metric, i) => (
                    <div key={i} className="platform-stat">
                      <span className="platform-stat__value" ref={(el) => (numbersRef.current[index + '-' + i] = el)}>
                        {metric.value}
                      </span>
                      <span className="platform-stat__label">{metric.label}</span>
                    </div>
                  ))}
                </div>

                {/* Стрелка */}
                <div className="platform-card__arrow">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Platforms;