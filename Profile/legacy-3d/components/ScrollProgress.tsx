import { useEffect, useRef } from 'react';

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollTop / docHeight, 1);

      if (barRef.current) {
        barRef.current.style.transform = `scaleY(${progress})`;
      }
      if (glowRef.current) {
        glowRef.current.style.top = `${progress * 100}%`;
        glowRef.current.style.opacity = progress > 0.01 ? '1' : '0';
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed right-0 top-0 bottom-0 w-[3px] z-50 pointer-events-none">
      <div
        ref={barRef}
        className="absolute top-0 left-0 right-0 h-full origin-top"
        style={{
          transform: 'scaleY(0)',
          background:
            'linear-gradient(to bottom, rgba(255,0,0,0.1), rgba(255,0,0,0.6), #ff0000)',
        }}
      />
      <div
        ref={glowRef}
        className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full opacity-0 transition-opacity duration-200"
        style={{
          background: '#ff0000',
          boxShadow:
            '0 0 8px rgba(255,0,0,0.8), 0 0 20px rgba(255,0,0,0.4), 0 0 40px rgba(255,0,0,0.2)',
        }}
      />
    </div>
  );
}
