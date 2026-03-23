import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { mediaData } from '../../data/content';
import './media-gallery.scss';

gsap.registerPlugin(ScrollTrigger);

const MediaGallery = ({ showGallery = true }) => {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(showGallery);

  useEffect(() => {
    if (!isVisible) return;

    const ctx = gsap.context(() => {
      gsap.fromTo('.media-item',
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 75%',
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <section ref={containerRef} className="media-gallery">
      <div className="container">
        <h3 className="media-gallery__title text-large">MEDIA</h3>
        <div className="media-gallery__grid">
          {mediaData.map((item, index) => (
            <div key={index} className="media-item">
              <img src={item.src} alt={item.alt} loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MediaGallery;