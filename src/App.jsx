// src/App.jsx
import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Cursor from './components/Cursor/Cursor';
import VideoIntro from './components/VideoIntro/VideoIntro';
import Hero from './components/Hero/Hero';
import Stats from './components/Stats/Stats';
import LinksGrid from './components/LinksGrid/LinksGrid';
import About from './components/About/About';
import Gear from './components/Gear/Gear';
import Clips from './components/Clips/Clips';
import MediaGallery from './components/MediaGallery/MediaGallery';
import Footer from './components/Footer/Footer';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { siteConfig } from './data/content';
import './styles/global.scss';

gsap.registerPlugin(ScrollTrigger);

function App() {
  useSmoothScroll();
  
  const [introComplete, setIntroComplete] = useState(false);
  const [introSkipped, setIntroSkipped] = useState(false);
  const appRef = useRef(null);

  const handleIntroComplete = () => {
    console.log('Intro complete!');
    setIntroComplete(true);
    setIntroSkipped(true);
  };

  // Scroll-triggered skip с ГЭПОМ
  useEffect(() => {
    if (introSkipped) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: appRef.current,
        start: 'top top',
        // 📏 Увеличили end с 0.3 до 0.5 высоты экрана = ~300-400px гэп
        end: '+=' + window.innerHeight * 2.5,
        onEnter: () => {
          if (!introSkipped) {
            // 🕐 Добавляем небольшую задержку перед скипом (200мс)
            setTimeout(() => {
              handleIntroComplete();
            }, 400);
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
      
      {!introComplete && (
        <VideoIntro onComplete={handleIntroComplete} />
      )}
      
      <main className={`main-content ${introComplete ? 'visible' : ''}`}>
        <Hero />
        <Stats />
        <LinksGrid />
        <About />
        {siteConfig.showGear && <Gear />}
        {siteConfig.showClips && <Clips />}
        {siteConfig.showMediaGallery && <MediaGallery />}
        <Footer />
      </main>
    </div>
  );
}

export default App;