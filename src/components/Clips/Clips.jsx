import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './clips.scss';

gsap.registerPlugin(ScrollTrigger);

const Clips = () => {
  const containerRef = useRef(null);
  
  const clips = [
    { title: 'BEST MOMENTS 2025', views: '2.5M', duration: '10:24' },
    { title: 'INSANE PLAY', views: '1.8M', duration: '0:45' },
    { title: 'FUNNY FAILS', views: '3.1M', duration: '08:15' }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.clip-card',
        { opacity: 0, scale: 0.95, y: 50 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
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
    <section ref={containerRef} className="clips">
      <div className="container">
        <h3 className="clips__title text-large">HIGHLIGHTS</h3>
        <div className="clips__grid">
          {clips.map((clip, index) => (
            <div key={index} className="clip-card interactive">
              <div className="clip-card__thumbnail">
                <span className="clip-card__duration">{clip.duration}</span>
              </div>
              <div className="clip-card__info">
                <h4 className="clip-card__title">{clip.title}</h4>
                <span className="clip-card__views">{clip.views} views</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Clips;