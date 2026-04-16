import { useEffect, useRef } from 'react';

interface TrailPoint {
  x: number;
  y: number;
  life: number;
}

export default function MouseTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trail = useRef<TrailPoint[]>([]);
  const rafId = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isTouchDevice = 'ontouchstart' in window;
    if (isTouchDevice) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMouseMove = (e: MouseEvent) => {
      trail.current.push({ x: e.clientX, y: e.clientY, life: 1 });
      if (trail.current.length > 40) trail.current.shift();
    };
    window.addEventListener('mousemove', onMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const point of trail.current) {
        point.life -= 0.025;
        if (point.life <= 0) continue;

        const radius = point.life * 6;
        const alpha = point.life * 0.2;

        ctx.beginPath();
        ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 0, 0, ${alpha})`;
        ctx.shadowBlur = 12;
        ctx.shadowColor = `rgba(255, 0, 0, ${alpha * 2})`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      trail.current = trail.current.filter((p) => p.life > 0);
      rafId.current = requestAnimationFrame(animate);
    };
    rafId.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[60] pointer-events-none"
      aria-hidden="true"
    />
  );
}
