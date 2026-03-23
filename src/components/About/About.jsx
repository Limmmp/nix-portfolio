// src/components/About/About.jsx
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { aboutData } from '../../data/content';
import './about.scss';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Text reveal animation
      gsap.fromTo(textRef.current,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 70%',
          }
        }
      );

      // Image reveal animation
      gsap.fromTo(imageRef.current,
        { opacity: 0, x: 50, scale: 0.95 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 70%',
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="about" id="about">
      <div className="container">
        <h3 className="about__title text-large">ABOUT</h3>
        
        <div className="about__content-wrapper">
          {/* Текст */}
          <div ref={textRef} className="about__text">
            <p className="about__description">{aboutData.description}</p>
            <div className="about__stats">
              {aboutData.stats.map((stat, index) => (
                <div key={index} className="stat-item interactive">
                  <span className="stat-item__value">{stat.value}</span>
                  <span className="stat-item__label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Фото */}
          <div ref={imageRef} className="about__image">
            <img src="/images/about.png" alt="NIX" className="about__image-photo" />
            <div className="about__image-overlay" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;