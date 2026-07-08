// src/lib/scroll.js
// Единая точка управления скроллом: Lenis-инстанс + навигация по секциям,
// в том числе внутрь запиненных ScrollTrigger-секций.
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let lenis = null;

export const setLenis = (instance) => {
  lenis = instance;
};

export const scrollToPosition = (top) => {
  if (lenis) {
    lenis.scrollTo(top, { duration: 1.4 });
  } else {
    window.scrollTo({ top, behavior: 'smooth' });
  }
};

// Секции внутри пинов: скроллим к точке таймлайна, где контент уже виден.
// label — метка в таймлайне пина, fallback — доля прогресса, если метки нет.
const PIN_TARGETS = {
  about: { id: 'about-pin', fallback: 0 },
  platforms: { id: 'platforms-pin', label: 'platformsShown', fallback: 0.2 },
  partners: { id: 'platforms-pin', label: 'partnersShown', fallback: 0.85 },
};

export const scrollToSection = (name) => {
  const target = PIN_TARGETS[name];

  if (target) {
    const st = ScrollTrigger.getById(target.id);
    if (st) {
      let progress = target.fallback;
      const anim = st.animation;
      if (target.label && anim && anim.labels[target.label] != null) {
        progress = anim.labels[target.label] / anim.duration();
      }
      scrollToPosition(st.start + (st.end - st.start) * progress);
      return;
    }
  }

  const el = document.getElementById(name);
  if (el) {
    scrollToPosition(el.getBoundingClientRect().top + window.scrollY);
  }
};
