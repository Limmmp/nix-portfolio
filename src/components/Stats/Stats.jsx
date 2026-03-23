import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './stats.scss';

gsap.registerPlugin(ScrollTrigger);

const Stats = () => {
  const containerRef = useRef(null);
  const stats = [
    { value: '500K+', label: 'Subscribers', icon: '👥' },
    { value: '10M+', label: 'Total Views', icon: '👁️' },
    { value: '5+', label: 'Years Active', icon: '📅' },
    { value: '24/7', label: 'Content', icon: '⚡' }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.stat-item',
        { opacity: 0, y: 80, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          stagger: 0.15,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 75%',
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="stats">
      <div className="container">
        <div className="stats__grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item interactive">
              <span className="stat-item__icon">{stat.icon}</span>
              <span className="stat-item__value">{stat.value}</span>
              <span className="stat-item__label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;