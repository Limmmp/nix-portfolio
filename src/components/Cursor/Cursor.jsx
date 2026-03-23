// src/components/Cursor/Cursor.jsx
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './cursor.scss';

const Cursor = () => {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);
  const isVideoIntro = useRef(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;

    if (!cursor || !follower) return;

    // Начальная позиция
    gsap.set([cursor, follower], { xPercent: -50, yPercent: -50 });

    const moveCursor = (e) => {
      // Основная точка
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.08,
        ease: 'power2.out'
      });

      // Следующий элемент (lag эффект)
      gsap.to(follower, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.3,
        ease: 'power2.out'
      });
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      const videoContainer = document.querySelector('.video-container');

      // Проверяем, не наводим ли на видео-интро
      if (videoContainer && videoContainer.contains(target)) {
        isVideoIntro.current = true;
        // Не скрываем курсор, даём работать с кнопками!
        gsap.to([cursor, follower], { opacity: 1, duration: 0.3 });
      } else {
        isVideoIntro.current = false;
      }

      if (target.closest('a') || target.closest('button') || target.closest('.interactive')) {
        gsap.to(follower, { scale: 2.5, borderColor: '#fff', duration: 0.3 });
        gsap.to(cursor, { scale: 0, duration: 0.3 });
      } else {
        gsap.to(follower, { scale: 1, borderColor: '#fff', duration: 0.3 });
        gsap.to(cursor, { scale: 1, opacity: 1, duration: 0.3 });
      }
    };

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="cursor-dot" />
      <div ref={followerRef} className="cursor-follower" />
    </>
  );
};

export default Cursor;