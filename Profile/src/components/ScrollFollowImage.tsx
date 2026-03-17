import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

type ScrollFollowImageProps = {
  src: string;
  alt: string;
  aboutSectionRef: React.RefObject<HTMLElement | null>;
  aboutSlotRef: React.RefObject<HTMLDivElement | null>;
  onLanded?: (landed: boolean) => void;
};

const HERO_WIDTH = 380;
const HERO_ASPECT = 4 / 5;
const HERO_HEIGHT = HERO_WIDTH / HERO_ASPECT;

export default function ScrollFollowImage({
  src,
  alt,
  aboutSectionRef,
  aboutSlotRef,
  onLanded,
}: ScrollFollowImageProps) {
  const slotRectRef = useRef<DOMRect | null>(null);
  const [mounted, setMounted] = useState(false);
  const [hasLanded, setHasLanded] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const compute = () => setIsDesktop(window.innerWidth >= 1024);
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, []);

  const measure = () => {
    if (aboutSlotRef.current) {
      slotRectRef.current = aboutSlotRef.current.getBoundingClientRect();
    }
  };

  useEffect(() => {
    measure();
    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    return () => {
      window.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
    };
  }, [aboutSlotRef]);

  const { scrollYProgress } = useScroll({
    target: aboutSectionRef,
    offset: ['start end', 'start start'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (v >= 0.98 && !hasLanded) {
      setHasLanded(true);
      onLanded?.(true);
    } else if (v < 0.9 && hasLanded) {
      setHasLanded(false);
      onLanded?.(false);
    }
  });

  const left = useTransform(scrollYProgress, (p) => {
    const rect = slotRectRef.current;
    if (!mounted || typeof window === 'undefined') return '50%';
    const heroLeft = window.innerWidth - Math.max(24, (window.innerWidth - 1152) / 2 + 24) - HERO_WIDTH;
    if (!rect) return `${heroLeft}px`;
    return `${heroLeft + (rect.left - heroLeft) * p}px`;
  });

  const top = useTransform(scrollYProgress, (p) => {
    const rect = slotRectRef.current;
    if (!mounted || typeof window === 'undefined') return '50%';
    const heroTop = window.innerHeight / 2 - HERO_HEIGHT / 2;
    if (!rect) return `${heroTop}px`;
    return `${heroTop + (rect.top - heroTop) * p}px`;
  });

  const width = useTransform(scrollYProgress, (p) => {
    const rect = slotRectRef.current;
    if (!rect) return HERO_WIDTH;
    return HERO_WIDTH + (rect.width - HERO_WIDTH) * p;
  });

  const height = useTransform(scrollYProgress, (p) => {
    const rect = slotRectRef.current;
    if (!rect) return HERO_HEIGHT;
    return HERO_HEIGHT + (rect.height - HERO_HEIGHT) * p;
  });

  const opacity = useTransform(scrollYProgress, [0.95, 1], [1, 0]);

  // Gira o card durante o scroll: 0 → 180° (mostra o verso) → 360° (volta a frente ao aterrissar)
  const rotateY = useTransform(scrollYProgress, [0, 0.5, 1], [0, 180, 360]);

  if (!isDesktop || hasLanded) return null;

  return (
    <motion.div
      className="fixed z-30 pointer-events-none will-change-transform"
      style={{ left, top, width, height, opacity, perspective: 1200 }}
    >
      <motion.div
        className="relative w-full h-full"
        style={{
          rotateY,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Frente: foto */}
        <div
          className="absolute inset-0 rounded-lg overflow-hidden border border-lando-border bg-lando-surface/40 shadow-xl"
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
        >
          <img src={src} alt={alt} className="w-full h-full object-cover object-top" />
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-lando-bg to-transparent">
            <span className="text-sm font-medium text-lando-lime">Full Stack Developer</span>
            <span className="ml-2 text-xs text-gray-500">Disponível</span>
          </div>
        </div>

        {/* Verso: conteúdo dev (rotateY(180deg) para ficar legível quando o card gira) */}
        <div
          className="absolute inset-0 rounded-lg overflow-hidden border border-lando-border bg-lando-surface shadow-xl flex flex-col items-center justify-center p-6 text-center"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          <span className="text-lando-lime font-display text-2xl sm:text-3xl tracking-wide">
            Full Stack
          </span>
          <span className="text-white/90 text-sm font-medium mt-1">Developer</span>
          <div className="mt-4 pt-4 border-t border-lando-border w-full">
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Stack</p>
            <p className="text-lando-lime/90 text-xs font-mono leading-relaxed">
              React · TypeScript · .NET
            </p>
            <p className="text-lando-lime/90 text-xs font-mono mt-1">
              Node.js · Angular · SQL
            </p>
          </div>
          <div className="mt-3 text-gray-600 text-[10px] font-mono">
            {'const code = "quality";'}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
