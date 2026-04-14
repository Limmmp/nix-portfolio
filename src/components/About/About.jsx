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
      x: () => `-=${(totalSections - 1) * 100}vw`, // ← VW
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: () => `+=${(totalSections - 1) * 700}vh`, // ← VH
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
          
          // Обновляем индикатор "01 — 04"
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
          
          // Анимация текста
          sections.forEach((section, idx) => {
            const content = section?.querySelector('.about__slide-content-inner');
            if (!content) return;
            
            const slideProgress = self.progress * (totalSections - 1);
            const isActive = idx === Math.round(slideProgress);
            
            if (isActive) {
              gsap.to(content, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: 'power3.out'
              });
            } else {
              gsap.to(content, {
                opacity: 0.3,
                y: '2vh', // ← VH вместо px
                duration: 0.5,
                ease: 'power3.out'
              });
            }
          });
        }
      }
    });
    
    // Начальное состояние
    sections.forEach((section, idx) => {
      const content = section?.querySelector('.about__slide-content-inner');
      if (content && idx > 0) {
        gsap.set(content, { opacity: 0.3, y: '2vh' }); // ← VH
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
      description: 'Профессиональный киберспортсмен,\nстример и контент-мейкер.\n"Создаю контент, который вдохновляет."',
      image: '/images/about/about-main.jpg',
      align: 'left'
    },
    {
      id: 'pro-career',
      title: 'PRO CAREER',
      subtitle: 'Ex-pro Dota 2 player',
      description: 'HellRaisers | 2016-2021\nУчастник The International\nПризер и победитель множества турниров',
      image: '/images/about/about-pro.jpg',
      align: 'right'
    },
    {
      id: 'expertise',
      title: 'EXPERT',
      subtitle: 'In MOBA games',
      description: 'Агрессивный playstyle\nЗнаток carry позиции\nХороший стратег',
      image: '/images/about/about-expertise.jpg',
      align: 'left'
    },
    {
      id: 'now',
      title: 'NOW',
      subtitle: 'Streamer & Creator',
      description: 'Forbes 30 да 30\n1M+ community\nЕжедневный контент на Twtich & Youtube',
      image: '/images/about/about-now.jpg',
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
              <div className="about__slide-image">
                <img 
                  src={slide.image} 
                  alt={slide.subtitle}
                  loading="lazy"
                />
                <div className="about__slide-image-overlay"></div>
              </div>

            {/* Контент */}
            <div className="about__slide-content">
              <div className="about__slide-content-inner">
                <h3 className="about__slide-title">{slide.title}</h3>
                <h4 className="about__slide-subtitle">{slide.subtitle}</h4>
                <p className="about__slide-description">
                  {slide.description.split('\n').map((line, i) => (
                    <span key={i}>{line}<br /></span>
                  ))}
                </p>
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
        const targetProgress = index / (slides.length - 1);
        
        gsap.to(wrapperRef.current, {
          x: `-=${targetProgress * 100}vw`, // ← VW
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