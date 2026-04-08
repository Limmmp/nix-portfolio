// src/components/About/About.jsx
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './about.scss';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const containerRef = useRef(null);
  const wrapperRef = useRef(null);
  const sectionsRef = useRef([]);
  const progressRef = useRef(null);

useEffect(() => {
  const ctx = gsap.context(() => {
    const sections = sectionsRef.current;
    const totalSections = sections.length;

    // Горизонтальный скролл с пиннингом
    gsap.to(wrapperRef.current, {
      x: () => -(totalSections - 1) * window.innerWidth,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: () => `+=${(totalSections - 1) * window.innerWidth}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        markers: false,
        onUpdate: (self) => {
          // Обновляем прогресс бар
          const progress = Math.round(self.progress * 100);
          if (progressRef.current) {
            progressRef.current.style.width = `${progress}%`;
          }
          // Обновляем индикатор "01 — 05"
          const currentSlide = Math.min(
            Math.floor(self.progress * totalSections) + 1,
            totalSections
          );
          const indicator = document.querySelector('.about__slide-indicator');
          if (indicator) {
            indicator.textContent = `0${currentSlide} — 0${totalSections}`;
          }
          // Активная точка
          const dots = document.querySelectorAll('.about__dot');
          dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide - 1);
          });

          // ← АНИМАЦИЯ ТЕКСТА: показываем только активный слайд
          sections.forEach((section, idx) => {
            const content = section?.querySelector('.about__slide-content-inner');
            if (!content) return;

            // Проверяем, какой слайд сейчас активен
            const slideProgress = self.progress * (totalSections - 1);
            const isActive = idx === Math.round(slideProgress);

            if (isActive) {
              // Активный слайд — показываем текст
              gsap.to(content, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: 'power3.out'
              });
            } else {
              // Неактивный слайд — скрываем текст
              gsap.to(content, {
                opacity: 0.3,
                y: 20,
                duration: 0.5,
                ease: 'power3.out'
              });
            }
          });
        }
      }
    });

    // Начальное состояние — все тексты кроме первого скрыты
    sections.forEach((section, idx) => {
      const content = section?.querySelector('.about__slide-content-inner');
      if (content && idx > 0) {
        gsap.set(content, { opacity: 0.3, y: 20 });
      }
    });

  }, containerRef);

  return () => ctx.revert();
}, []);

  const slides = [
    {
      id: 'intro',
      title: 'NIX',
      subtitle: 'Alexander Levin',
      description: 'Профессиональный киберспортсмен, стример и контент-мейкер. Создаю контент, который вдохновляет.',
      image: null,
      align: 'center'
    },
    {
      id: 'pro-career',
      title: 'PRO CAREER',
      subtitle: 'Ex-pro Dota 2 player',
      description: 'HellRaisers | 2016-2021\nThe International participant\nMultiple tournament wins',
      image: '/images/about-pro.jpg',
      align: 'right'
    },
    {
      id: 'expertise',
      title: 'EXPERTISE',
      subtitle: 'MOBA Expert',
      description: 'Aggressive playstyle\nCarry position specialist\nStrategic analyst',
      image: '/images/about-expertise.jpg',
      align: 'left'
    },
    {
      id: 'now',
      title: 'NOW',
      subtitle: 'Streamer & Creator',
      description: 'Forbes 30 under 30\n1M+ community\nDaily content on Twitch & YouTube',
      image: '/images/about-now.jpg',
      align: 'right'
    },
  ];

  return (
    <section ref={containerRef} className="about" id="about">
      {/* Прогресс бар сверху */}
      <div className="about__progress-container">
        <div className="about__progress" ref={progressRef}></div>
        <span className="about__slide-indicator">01 — 04</span>
      </div>

      {/* Обёртка слайдов (двигается горизонтально) */}
      <div className="about__wrapper" ref={wrapperRef}>
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            ref={(el) => (sectionsRef.current[index] = el)}
            className={`about__slide about__slide--${slide.align}`}
          >
            {/* Фото (60-70% экрана) */}
            {slide.image && (
              <div className="about__slide-image">
                <img 
                  src={slide.image} 
                  alt={slide.subtitle}
                  loading="lazy"
                />
                <div className="about__slide-image-overlay"></div>
              </div>
            )}

            {/* Контент */}
            <div className="about__slide-content">
              <div className="about__slide-content-inner">
                <span className="about__slide-number">0{index + 1}</span>
                <h3 className="about__slide-title">{slide.title}</h3>
                <h4 className="about__slide-subtitle">{slide.subtitle}</h4>
                <p className="about__slide-description">
                  {slide.description.split('\n').map((line, i) => (
                    <span key={i}>{line}<br /></span>
                  ))}
                </p>

                {/* CTA кнопка для последнего слайда */}
                {slide.cta && (
                  <a 
                    href={slide.cta.target}
                    className="about__slide-cta"
                    onClick={(e) => {
                      e.preventDefault();
                      document.querySelector(slide.cta.target)?.scrollIntoView({
                        behavior: 'smooth'
                      });
                    }}
                  >
                    {slide.cta.text}
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Навигационные точки */}
      <div className="about__dots">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            className="about__dot"
            onClick={() => {
              const scrollWidth = window.innerWidth * (slides.length - 1);
              const targetProgress = index / (slides.length - 1);
              
              gsap.to(wrapperRef.current, {
                x: -targetProgress * scrollWidth,
                duration: 1,
                ease: 'power2.inOut'
              });
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default About;