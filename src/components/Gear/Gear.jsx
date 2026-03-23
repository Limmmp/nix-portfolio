import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './gear.scss';

gsap.registerPlugin(ScrollTrigger);

const Gear = () => {
  const containerRef = useRef(null);
  
  const gearItems = [
    { category: 'PC', items: ['RTX 4090', 'Intel i9-14900K', '64GB RAM'] },
    { category: 'Peripherals', items: ['Logitech G Pro X', 'Zowie EC2', 'Artisan Zero'] },
    { category: 'Stream', items: ['Sony A7S III', 'Elgato 4K60', 'Shure SM7B'] }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.gear-category',
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.2,
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
    <section ref={containerRef} className="gear">
      <div className="container">
        <h3 className="gear__title text-large">GEAR</h3>
        <div className="gear__grid">
          {gearItems.map((category, index) => (
            <div key={index} className="gear-category interactive">
              <h4 className="gear-category__name">{category.category}</h4>
              <ul className="gear-category__list">
                {category.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gear;