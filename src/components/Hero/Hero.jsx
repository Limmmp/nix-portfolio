// src/components/Hero/Hero.jsx
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './hero.scss';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const bgRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Анимация появления контента
      gsap.fromTo([titleRef.current, subtitleRef.current],
        { opacity: 0, y: 100 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 60%',
          }
        }
      );

      // Параллакс эффект для фона
      gsap.to(bgRef.current, {
        y: 100,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Плавный скролл к якорям
  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    const target = document.querySelector(targetId);
    if (target) {
      const offsetTop = target.offsetTop;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section ref={containerRef} className="hero" id="hero">
      {/* Фоновое изображение */}
      <div ref={bgRef} className="hero__bg">
        <img src="/images/hero.png" alt="NIX" className="hero__bg-image" />
        <div className="hero__overlay" />
      </div>

      {/* Контент */}
      <div className="container hero__content">
        <h2 ref={titleRef} className="hero__title text-display">
          NIX
        </h2>
        <p ref={subtitleRef} className="hero__subtitle text-medium">
          STREAMER • CONTENT CREATOR • ENTERTAINER
        </p>
        
        <div className="hero__cta">
          <a 
            href="#links" 
            className="hero__btn hero__btn--primary interactive"
            onClick={(e) => handleSmoothScroll(e, '#links')}
          >
            VIEW CHANNELS
          </a>
          <a 
            href="#about" 
            className="hero__btn hero__btn--secondary interactive"
            onClick={(e) => handleSmoothScroll(e, '#about')}
          >
            LEARN MORE
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;