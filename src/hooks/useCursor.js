import { useEffect, useState } from 'react';

export const useCursor = () => {
  const [cursorState, setCursorState] = useState('default');
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      
      if (target.closest('a') || target.closest('button')) {
        setCursorState('link');
      } else if (target.closest('.video-container')) {
        setCursorState('hidden');
      } else {
        setCursorState('default');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return { cursorState, position };
};