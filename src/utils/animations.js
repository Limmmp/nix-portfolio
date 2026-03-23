import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Общие анимации для переиспользования
export const fadeInUp = (element, delay = 0) => {
  return gsap.fromTo(element,
    { opacity: 0, y: 60 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      delay,
      ease: 'power3.out'
    }
  );
};

export const textReveal = (element) => {
  return gsap.fromTo(element,
    { opacity: 0 },
    {
      opacity: 1,
      duration: 1.5,
      ease: 'power2.out'
    }
  );
};

export const parallaxImage = (element, speed = 0.5) => {
  return gsap.to(element, {
    y: -100 * speed,
    scrollTrigger: {
      trigger: element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    }
  });
};