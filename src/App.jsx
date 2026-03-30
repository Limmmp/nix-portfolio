// src/App.jsx
import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Cursor from './components/Cursor/Cursor';
import VideoIntro from './components/VideoIntro/VideoIntro';
import Hero from './components/Hero/Hero';
import Platforms from './components/Platforms/Platforms';
import Stats from './components/Stats/Stats';
import Partners from './components/Partners/Partners';
import LinksGrid from './components/LinksGrid/LinksGrid';
import About from './components/About/About';
import ContactModal from './components/ContactModal/ContactModal';
import Footer from './components/Footer/Footer';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { siteConfig } from './data/content';
import './styles/global.scss';

gsap.registerPlugin(ScrollTrigger);

function App() {
  useSmoothScroll();
  
  const [introComplete, setIntroComplete] = useState(false);
  const [introSkipped, setIntroSkipped] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const appRef = useRef(null);

  const handleIntroComplete = () => {
    console.log('Intro complete!');
    setIntroComplete(true);
    setIntroSkipped(true);
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
      
      {!introComplete && (
        <VideoIntro onComplete={handleIntroComplete} />
      )}
      
      <main className={`main-content ${introComplete ? 'visible' : ''}`}>
        <Hero onOpenContact={() => setIsContactOpen(true)} isActive={introComplete} />
        <Platforms />
        <Partners />
        <About />
        {siteConfig.showMediaGallery && <MediaGallery />}
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