// src/components/VideoIntro/VideoIntro.jsx
import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import './video-intro.scss';

const VideoIntro = ({ onComplete }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [showSkip, setShowSkip] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [canPlay, setCanPlay] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);

  useEffect(() => {
    const video = videoRef.current;

    // Проверяем, готово ли видео к воспроизведению
    const handleCanPlay = () => {
      setCanPlay(true);
    };

    video.addEventListener('canplay', handleCanPlay);

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;

    // Запуск видео ПОСЛЕ клика пользователя
    if (userInteracted && canPlay && video) {
      const playVideo = async () => {
        try {
          await video.play();
          console.log('✅ Video started playing with sound');
        } catch (err) {
          console.error('❌ Video play error:', err);
        }
      };
      playVideo();
    }
  }, [userInteracted, canPlay]);

  // Обработка клика для запуска
  const handleEnter = async () => {
    setUserInteracted(true);
    
    // Анимация исчезновения overlay
    gsap.to('.enter-overlay', {
      opacity: 0,
      duration: 0.8,
      ease: 'power3.inOut',
      pointerEvents: 'none'
    });

    // Показываем кнопку Skip через 2 секунды
    setTimeout(() => {
      setShowSkip(true);
      gsap.fromTo('.skip-button', 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
      );
    }, 2000);
  };

  const handleSkip = () => {
    gsap.to(containerRef.current, {
      opacity: 0,
      y: -100,
      duration: 1,
      ease: 'power3.inOut',
      onComplete: () => onComplete?.()
    });
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVideoEnd = () => {
    onComplete?.();
  };

  return (
    <div ref={containerRef} className="video-intro video-container">
      <video
        ref={videoRef}
        className="video-intro__video"
        muted={isMuted}
        playsInline
        loop={false}
        preload="auto"
        onEnded={handleVideoEnd}
      >
        <source src="/video/intro.mp4" type="video/mp4" />
        <source src="/video/intro.webm" type="video/webm" />
      </video>

      <div className="video-intro__overlay">
        <h1 className="video-intro__title text-display">NIX</h1>
        <p className="video-intro__subtitle">STREAMER • CREATOR • PERFORMER</p>
      </div>

      {/* ✅ CLICK TO ENTER OVERLAY */}
      {!userInteracted && (
        <div className="enter-overlay interactive" onClick={handleEnter}>
          <div className="enter-overlay__content">
            <button className="enter-button">
              <span>ENTER</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
            <p className="enter-overlay__hint">Click to experience with sound</p>
          </div>
        </div>
      )}

      <button 
        className={`skip-button interactive ${showSkip ? 'visible' : ''}`}
        onClick={handleSkip}
      >
        SKIP INTRO
      </button>

      <button className="mute-button interactive" onClick={toggleMute}>
        {isMuted ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <line x1="23" y1="9" x2="17" y2="15"></line>
            <line x1="17" y1="9" x2="23" y2="15"></line>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          </svg>
        )}
      </button>

      <div className="scroll-indicator">
        <span>SCROLL TO EXPLORE</span>
        <div className="scroll-line" />
      </div>
    </div>
  );
};

export default VideoIntro;