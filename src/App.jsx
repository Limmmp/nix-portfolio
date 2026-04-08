// src/App.jsx
import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Cursor from './components/Cursor/Cursor';
import VideoIntro from './components/VideoIntro/VideoIntro';
import Hero from './components/Hero/Hero';
import About from './components/About/About';
import Platforms from './components/Platforms/Platforms';
import Partners from './components/Partners/Partners';
import Highlights from './components/Highlights/Highlights';
import ContactModal from './components/ContactModal/ContactModal';
import Footer from './components/Footer/Footer';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import './styles/global.scss';
import PlatformsPartners from './components/PlatformsPartners/PlatformsPartners';
gsap.registerPlugin(ScrollTrigger);

function App() {
  useSmoothScroll();
  
  const [introComplete, setIntroComplete] = useState(false);
  const [introSkipped, setIntroSkipped] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const appRef = useRef(null);

  const handleIntroComplete = () => {
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
        <About />
        <PlatformsPartners />
        <Platforms />
        <Partners />
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