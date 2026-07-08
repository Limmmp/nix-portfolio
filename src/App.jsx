// src/App.jsx
import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Cursor from './components/Cursor/Cursor';
import Header from './components/Header/Header';
import VideoIntro from './components/VideoIntro/VideoIntro';
import Hero from './components/Hero/Hero';
import About from './components/About/About';
import Highlights from './components/Highlights/Highlights';
import ContactModal from './components/ContactModal/ContactModal';
import Footer from './components/Footer/Footer';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import './styles/global.scss';
import PlatformsPartners from './components/PlatformsPartners/PlatformsPartners';
gsap.registerPlugin(ScrollTrigger);

const INTRO_SEEN_KEY = 'nix_intro_seen';

// Интро пропускаем на мобильных (тяжёлое видео) и для повторных посетителей
const shouldSkipIntro = () => {
  if (typeof window === 'undefined') return false;
  const isMobile = window.matchMedia('(max-width: 767px)').matches;
  let seen = false;
  try {
    seen = localStorage.getItem(INTRO_SEEN_KEY) === '1';
  } catch {
    // localStorage может быть недоступен (private mode) — просто показываем интро
  }
  return isMobile || seen;
};

function App() {
  useSmoothScroll();

  const [introComplete, setIntroComplete] = useState(shouldSkipIntro);
  const [introSkipped, setIntroSkipped] = useState(introComplete);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const appRef = useRef(null);

  const handleIntroComplete = () => {
    setIntroComplete(true);
    setIntroSkipped(true);
    try {
      localStorage.setItem(INTRO_SEEN_KEY, '1');
    } catch {
      // ignore
    }
  };

  // Scroll-triggered skip
  useEffect(() => {
    if (introSkipped) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: appRef.current,
        start: 'top top',
        end: '+=' + window.innerHeight * 0.5,
        onEnter: () => {
          if (!introSkipped) {
            setTimeout(() => {
              handleIntroComplete();
            }, 200);
          }
        },
        once: true
      });
    }, appRef);

    return () => ctx.revert();
  }, [introSkipped]);

  return (
    <div ref={appRef} className="app">
      <Cursor />

      <Header visible={introComplete} onOpenContact={() => setIsContactOpen(true)} />

      {!introComplete && (
        <VideoIntro onComplete={handleIntroComplete} />
      )}

      <main className={`main-content ${introComplete ? 'visible' : ''}`}>
        <Hero onOpenContact={() => setIsContactOpen(true)} isActive={introComplete} />
        <About />
        <PlatformsPartners />
        <Highlights />
        <Footer onOpenContact={() => setIsContactOpen(true)} />
      </main>

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </div>
  );
}

export default App;
