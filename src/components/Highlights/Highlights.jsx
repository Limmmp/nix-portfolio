// src/components/Highlights/Highlights.jsx
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './highlights.scss';

gsap.registerPlugin(ScrollTrigger);

const Highlights = () => {
  const containerRef = useRef(null);
  const videosRef = useRef([]);
  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Анимация появления заголовка
      gsap.fromTo('.highlights__header',
        { opacity: 0, y: 80 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Анимация видео карточек
      videosRef.current.forEach((video, index) => {
        if (!video) return;

        gsap.fromTo(video,
          { opacity: 0, y: 100, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            delay: index * 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: video,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });

      // Анимация достижений
      gsap.fromTo('.highlights__awards',
        { opacity: 0, x: 80 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.highlights__awards',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );

    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Видео хайлайты
  const highlights = [
    {
      id: 1,
      title: 'The International 2024 Moment',
      views: '2.5M',
      platform: 'Twitch',
      thumbnail: '/images/highlight-1.jpg',
      videoUrl: 'https://www.twitch.tv/videos/...',
      featured: true
    },
    {
      id: 2,
      title: 'Epic Comeback Game',
      views: '1.8M',
      platform: 'YouTube',
      thumbnail: '/images/highlight-2.jpg',
      videoUrl: 'https://www.youtube.com/watch?v=...'
    },
    {
      id: 3,
      title: 'Funny Rage Moment',
      views: '900K',
      platform: 'TikTok',
      thumbnail: '/images/highlight-3.jpg',
      videoUrl: 'https://www.tiktok.com/@nix/...'
    },
    {
      id: 4,
      title: 'Best Plays Compilation',
      views: '750K',
      platform: 'YouTube',
      thumbnail: '/images/highlight-4.jpg',
      videoUrl: 'https://www.youtube.com/watch?v=...'
    },
    {
      id: 5,
      title: 'Stream Highlights #47',
      views: '620K',
      platform: 'Twitch',
      thumbnail: '/images/highlight-5.jpg',
      videoUrl: 'https://www.twitch.tv/videos/...'
    },
    {
      id: 6,
      title: 'Insane Outplay',
      views: '580K',
      platform: 'TikTok',
      thumbnail: '/images/highlight-6.jpg',
      videoUrl: 'https://www.tiktok.com/@nix/...'
    }
  ];

  // Достижения и регалии
  const awards = [
    {
      id: 1,
      icon: '/images/icons/streamers.jpg',
      title: 'Streamers Awards 2025',
      subtitle: 'Best MOBA Streamer',
      description: 'Nominee in international category',
      year: '2025'
    },
    {
      id: 2,
      icon: '/images/icons/forbes.png',
      title: 'Forbes 30 under 30',
      subtitle: 'Winner',
      description: 'Media & Entertainment category',
      year: '2024'
    },
    {
      id: 3,
      icon: '/images/icons/aegis.png',
      title: 'The International',
      subtitle: 'Participant',
      description: 'Dota 2 World Championship',
      year: '2019'
    },
    {
      id: 4,
      icon: '/images/icons/twitch.png',
      title: '1M+ Subscribers',
      subtitle: 'Twitch Partner',
      description: 'Biggest Dota 2 streamer in CIS',
      year: '2024'
    }
  ];

  return (
    <section ref={containerRef} className="highlights" id="highlights">
      <div className="container">
        {/* Заголовок */}
        <div className="highlights__header">
          <div className="highlights__header-top">
            <h3 className="highlights__title">HIGHLIGHTS</h3>
            <span className="highlights__counter">
              01 — {String(highlights.length).padStart(2, '0')}
            </span>
          </div>
          <p className="highlights__subtitle">
            Топ моменты со стримов и лучшие клипы
          </p>
        </div>

        {/* Главное видео (featured) */}
        {highlights.filter(h => h.featured).map((highlight) => (
          <div
            key={highlight.id}
            className="highlights__featured"
            onMouseEnter={() => setActiveVideo(highlight.id)}
            onMouseLeave={() => setActiveVideo(null)}
          >
            <div className="highlights__featured-video">
              <img 
                src={highlight.thumbnail} 
                alt={highlight.title}
                className="highlights__featured-thumbnail"
              />
              <div className="highlights__featured-overlay">
                <div className="highlights__featured-play">
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="white">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <div className="highlights__featured-info">
                  <span className="highlights__featured-views">{highlight.views} views</span>
                  <h4 className="highlights__featured-title">{highlight.title}</h4>
                  <span className="highlights__featured-platform">{highlight.platform}</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Сетка видео */}
        <div className="highlights__grid">
          {highlights.filter(h => !h.featured).map((highlight, index) => (
            <div
              key={highlight.id}
              ref={(el) => (videosRef.current[index] = el)}
              className="highlights__video-card"
              onMouseEnter={() => setActiveVideo(highlight.id)}
              onMouseLeave={() => setActiveVideo(null)}
            >
              <div className="highlights__video-thumbnail">
                <img 
                  src={highlight.thumbnail} 
                  alt={highlight.title}
                  loading="lazy"
                />
                <div className="highlights__video-overlay">
                  <div className="highlights__video-play">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="highlights__video-info">
                <span className="highlights__video-views">{highlight.views}</span>
                <h4 className="highlights__video-title">{highlight.title}</h4>
                <span className="highlights__video-platform">{highlight.platform}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Достижения */}
        <div className="highlights__awards">
          <div className="highlights__awards-header">
            <h3 className="highlights__awards-title">RECOGNITION</h3>
            <p className="highlights__awards-subtitle">
              Награды и достижения
            </p>
          </div>
<div className="highlights__awards-grid">
  {awards.map((award) => (
    <div key={award.id} className="highlights__award-card">
      {/* ← ЗАМЕНИЛИ НА <img> */}
      <div className="highlights__award-icon">
        <img 
          src={award.icon} 
          alt={award.title}
          loading="lazy"
        />
      </div>
      <div className="highlights__award-content">
        <span className="highlights__award-year">{award.year}</span>
        <h4 className="highlights__award-title">{award.title}</h4>
        <span className="highlights__award-subtitle">{award.subtitle}</span>
        <p className="highlights__award-description">{award.description}</p>
      </div>
    </div>
  ))}
</div>
        </div>
      </div>
    </section>
  );
};

export default Highlights;