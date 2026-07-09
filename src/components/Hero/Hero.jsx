// src/components/Hero/Hero.jsx
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrollToSection } from '../../lib/scroll';
import { useContent } from '../../content/ContentContext';
import './hero.scss';

gsap.registerPlugin(ScrollTrigger);

const Hero = ({ onOpenContact, isActive }) => {
  const { content } = useContent();
  const HERO_STATS = content.heroStats;
  const heroSubtitle = content.hero.subtitle;
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const bgRef = useRef(null);
  const statsRef = useRef([]);
  const buttonsRef = useRef(null);
  const contentGroupRef = useRef(null);
  
  const [hasAnimated, setHasAnimated] = useState(false);

// Анимация Count Up для цифр
const animateCountUp = (element, endValue, duration = 1.5) => {
  const obj = { value: 0 };
  const isMillion = endValue.includes('M');
  const isThousand = endValue.includes('K');
  
  let numericValue = parseFloat(endValue.replace(/[^0-9.]/g, ''));
  if (isMillion) numericValue *= 1000000;
  if (isThousand) numericValue *= 1000;

  gsap.to(obj, {
    value: numericValue,
    duration: duration,
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

// Запуск анимаций Hero
const runHeroAnimations = () => {
  if (hasAnimated) return;

  if (!contentGroupRef.current || !statsRef.current.length || statsRef.current.some(el => !el)) {
    setTimeout(runHeroAnimations, 100);
    return;
  }

  setHasAnimated(true);

  const tl = gsap.timeline({ delay: 1 });

  // Контент группы (заголовок + подзаголовок + кнопки)
  tl.fromTo(contentGroupRef.current?.children,
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out'
    }
  );

  // Статистика (появляется после контента)
  tl.fromTo(statsRef.current,
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power3.out',
      onComplete: () => {
        statsRef.current.forEach((stat, index) => {
          const valueEl = stat?.querySelector('.hero-stat__value-live');
          if (valueEl && HERO_STATS[index]) {
            animateCountUp(valueEl, HERO_STATS[index].value);
          }
        });
      }
    },
    '-=0.3'
  );

  // Параллакс эффект для фона
  gsap.to(bgRef.current, {
    y: 80,
    scrollTrigger: {
      trigger: containerRef.current,
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });
};

// ← useEffect зависит от isActive
useEffect(() => {
  if (isActive && !hasAnimated) {
    const timer = setTimeout(runHeroAnimations, 100);
    return () => clearTimeout(timer);
  }
}, [isActive, hasAnimated]);

  // Анимация перехода Hero → About (тонкий эффект как на icomat)
useEffect(() => {
  if (!isActive) return;

  const ctx = gsap.context(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        markers: false
      }
    });

    // Тонкий эффект "отъезжания" для контента (без сильного blur)
    tl.to('.hero__content-inner', {
      scale: 0.92,           // ← Меньше масштабирование
      y: -50,                // ← Сдвиг вниз
      opacity: 0.4,          // ← Просто прозрачность (без blur)
      duration: 1,
      ease: 'power2.inOut'
    }, 0);

    // Фон немного увеличивается (параллакс)
    tl.to('.hero__bg-image', {
      scale: 1.05,           // ← Меньше масштабирование
      opacity: 0.6,
      duration: 1,
      ease: 'power2.inOut'
    }, 0);

    // Статистика тоже немного отъезжает
    tl.to('.hero__stats-row', {
      scale: 0.95,
      opacity: 0.3,
      y: -30,
      duration: 1,
      ease: 'power2.inOut'
    }, 0);

  }, containerRef);

  return () => ctx.revert();
}, [isActive]);

  return (
    <section ref={containerRef} className="hero" id="hero">
      {/* Фоновое изображение */}
      <div ref={bgRef} className="hero__bg">
        <img src="/images/hero.png" alt="NIX" className="hero__bg-image" />
        <div className="hero__overlay" />
      </div>

      {/* Контент по центру */}
      <div className="container hero__content">
        {/* ← ОБЁРТКА ДЛЯ 3D ЭФФЕКТА */}
        <div ref={contentGroupRef} className="hero__content-inner">
          <h2 ref={titleRef} className="hero__title text-display">
            NIX<span className="hero__title-dot" aria-hidden="true" />
          </h2>
          <p ref={subtitleRef} className="hero__subtitle text-medium">
            {heroSubtitle}
          </p>
          
          {/* Одно главное действие + два текстовых перехода */}
          <div ref={buttonsRef} className="hero__cta">
            <button
              className="hero__btn hero__btn--primary interactive"
              onClick={() => onOpenContact()}
            >
              PARTNERSHIP
            </button>

            <div className="hero__links">
              <button
                className="hero__link interactive"
                onClick={() => scrollToSection('platforms')}
              >
                CHANNELS &amp; STATS <span className="hero__link-arrow">→</span>
              </button>
              <button
                className="hero__link interactive"
                onClick={() => scrollToSection('about')}
              >
                ABOUT ME <span className="hero__link-arrow">→</span>
              </button>
            </div>
          </div>
        </div>

        {/* Статистика внизу: плоская editorial-полоса */}
        <div className="hero__stats-row">
          {HERO_STATS.map((stat, index) => (
            <div
              key={index}
              ref={(el) => (statsRef.current[index] = el)}
              className="hero-stat"
            >
              {/* Призрак с финальным значением резервирует ширину — контейнер не дрожит во время count-up */}
              <span className="hero-stat__value">
                <span className="hero-stat__value-live">0</span>
                <span className="hero-stat__value-ghost" aria-hidden="true">{stat.value}</span>
              </span>
              <span className="hero-stat__label">{stat.label}</span>
              <span className="hero-stat__sublabel">{stat.sublabel}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;