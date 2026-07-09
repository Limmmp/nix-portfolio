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
import Platforms from './components/Platforms/Platforms';
import Partners from './components/Partners/Partners';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { ContentProvider, useContent } from './content/ContentContext';
import { supabase } from './lib/supabase';
import './styles/global.scss';
gsap.registerPlugin(ScrollTrigger);

// Собственный счётчик визитов для админки — один раз за загрузку страницы.
// Флаг на window защищает от двойного вызова в React StrictMode (dev).
const logVisit = () => {
  if (window.__nixVisitLogged) return;
  window.__nixVisitLogged = true;
  supabase
    .from('visits')
    .insert({ path: window.location.pathname, referrer: document.referrer || '' })
    .then(() => {}, () => {}); // ошибки счётчика не должны влиять на сайт
};

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
  return (
    <ContentProvider>
      <Site />
    </ContentProvider>
  );
}

function Site() {
  useSmoothScroll();

  // Секции рендерим только когда контент загружен (или отвалился в fallback):
  // GSAP-пины замеряют высоту при маунте и не должны видеть полупустой DOM
  const { ready } = useContent();

  const [introComplete, setIntroComplete] = useState(shouldSkipIntro);
  const [introSkipped, setIntroSkipped] = useState(introComplete);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const appRef = useRef(null);

  // Засчитываем визит при первом показе сайта
  useEffect(() => { logVisit(); }, []);

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
      <div className="grain" aria-hidden="true" />

      <Header visible={introComplete} onOpenContact={() => setIsContactOpen(true)} />

      {!introComplete && (
        <VideoIntro onComplete={handleIntroComplete} />
      )}

      <main className={`main-content ${introComplete && ready ? 'visible' : ''}`}>
        {ready && (
          <>
            <Hero onOpenContact={() => setIsContactOpen(true)} isActive={introComplete} />
            <About />
            <Platforms />
            <Partners onOpenContact={() => setIsContactOpen(true)} />
            <Highlights />
            <Footer onOpenContact={() => setIsContactOpen(true)} />
          </>
        )}
      </main>

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </div>
  );
}

export default App;
