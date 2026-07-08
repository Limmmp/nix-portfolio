// src/components/VideoIntro/VideoIntro.jsx
import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import './video-intro.scss';

const VideoIntro = ({ onComplete }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  // Автоплей без клика: браузеры разрешают autoplay только со звуком muted
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;

    const tryPlay = () => {
      video.play().catch(() => {
        // Если даже muted-автоплей запрещён — просто ждём взаимодействия,
        // пользователь всё равно может нажать SKIP
      });
    };

    if (video.readyState >= 3) {
      tryPlay();
    } else {
      video.addEventListener('canplay', tryPlay, { once: true });
    }

    return () => {
      video.removeEventListener('canplay', tryPlay);
    };
  }, []);

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
        muted
        autoPlay
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

      <button
        className="skip-button interactive visible"
        onClick={handleSkip}
      >
        SKIP INTRO
      </button>

      <button
        className="mute-button interactive"
        onClick={toggleMute}
        aria-label={isMuted ? 'Включить звук' : 'Выключить звук'}
      >
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
        <span className="mute-button__hint">{isMuted ? 'SOUND ON' : 'SOUND OFF'}</span>
      </button>

      <div className="scroll-indicator">
        <span>SCROLL TO EXPLORE</span>
        <div className="scroll-line" />
      </div>
    </div>
  );
};

export default VideoIntro;
