import { Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Mascot from './Mascot';
import VaderHelmet, { HELMET_URL } from './VaderHelmet';
import { prefersReducedMotion } from '../lib/scroll';

gsap.registerPlugin(ScrollTrigger);

const LINES = ['Todo aprendiz', 'tem um mestre.'];

/**
 * Interlúdio: o capacete de Darth Vader emerge da escuridão conforme o scroll,
 * acompanha o cursor e "respira" em luz vermelha. O aprendiz comenta de longe.
 */
export default function MasterSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });
  const [near, setNear] = useState(false);
  const [inView, setInView] = useState(false);
  const [say, setSay] = useState<string | null>(null);
  const spoke = useRef(false);

  // Só monta o WebGL (e baixa o modelo) quando a seção se aproxima; pausa o render fora da tela.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const nearObs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          useGLTF.preload(HELMET_URL);
          setNear(true);
          nearObs.disconnect();
        }
      },
      { rootMargin: '900px 0px' }
    );
    const viewObs = new IntersectionObserver(([entry]) => setInView(!!entry?.isIntersecting), {
      rootMargin: '120px 0px',
    });
    nearObs.observe(el);
    viewObs.observe(el);
    return () => {
      nearObs.disconnect();
      viewObs.disconnect();
    };
  }, []);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const text = textRef.current;
    if (!section || !text) return;
    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      const lines = text.querySelectorAll('[data-line]');
      const quote = text.querySelector('[data-quote]');
      const eyebrow = text.querySelector('[data-eyebrow]');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=150%',
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            progress.current = self.progress;
            if (self.progress > 0.62 && !spoke.current) {
              spoke.current = true;
              setSay('...meu mestre. não encara muito.');
              window.setTimeout(() => setSay(null), 3400);
            }
          },
        },
      });

      if (reduced) {
        progress.current = 1;
        gsap.set([eyebrow, lines, quote], { opacity: 1, y: 0, filter: 'blur(0px)' });
        return;
      }

      tl.fromTo(eyebrow, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.2 }, 0.18);
      tl.fromTo(
        lines,
        { opacity: 0, y: 40, filter: 'blur(12px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.35, stagger: 0.12, ease: 'power3.out' },
        0.28
      );
      tl.fromTo(
        quote,
        { opacity: 0, y: 24, filter: 'blur(8px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.3, ease: 'power3.out' },
        0.62
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const onPointerMove = (e: React.PointerEvent) => {
    pointer.current = {
      x: (e.clientX / window.innerWidth - 0.5) * 2,
      y: (e.clientY / window.innerHeight - 0.5) * 2,
    };
  };

  return (
    <section
      ref={sectionRef}
      id="mestre"
      className="relative h-screen overflow-hidden bg-sith-void"
      onPointerMove={onPointerMove}
      onPointerLeave={() => {
        pointer.current = { x: 0, y: 0 };
      }}
      aria-label="O mestre"
    >
      {/* Respiração: brasa que pulsa no chão */}
      <div
        className="breathe pointer-events-none absolute inset-x-0 bottom-0 h-[55vh]"
        style={{
          background:
            'radial-gradient(ellipse 60% 55% at 50% 100%, rgba(227,36,43,0.34) 0%, rgba(122,15,20,0.12) 45%, transparent 72%)',
        }}
        aria-hidden
      />

      {/* WebGL */}
      <div className="absolute inset-0 [&_canvas]:pointer-events-none">
        {near && (
          <Canvas
            camera={{ position: [0, 0.15, 5.2], fov: 38 }}
            dpr={[1, 1.5]}
            frameloop={inView ? 'always' : 'never'}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', toneMapping: 3 }}
            onCreated={({ gl }) => {
              gl.toneMappingExposure = 1.15;
            }}
            style={{ width: '100%', height: '100%', background: 'transparent' }}
          >
            <fog attach="fog" args={['#050405', 6, 13]} />
            <ambientLight intensity={0.2} color="#4a3e55" />
            <Suspense fallback={null}>
              <VaderHelmet progress={progress} pointer={pointer} />
            </Suspense>
          </Canvas>
        )}
      </div>

      {/* Vinheta */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 45%, transparent 40%, rgba(5,4,5,0.55) 75%, rgba(5,4,5,0.95) 100%)',
        }}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-sith-void to-transparent" aria-hidden />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-sith-void to-transparent" aria-hidden />

      {/* Texto */}
      <div ref={textRef} className="pointer-events-none absolute inset-0">
        <div className="absolute left-6 top-[13%] sm:left-10 md:left-[7vw] md:top-auto md:bottom-[16%] lg:left-[9vw]">
          <p data-eyebrow className="eyebrow">
            o mestre
          </p>
          <h2 className="mt-3 font-display text-[clamp(34px,8vw,44px)] font-light leading-[1] tracking-tight text-sith-ink md:text-[clamp(44px,4.6vw,76px)]">
            {LINES.map((l) => (
              <span key={l} data-line className="block">
                {l}
              </span>
            ))}
          </h2>
        </div>

        <p
          data-quote
          className="absolute bottom-[12%] right-6 max-w-[260px] text-right font-display text-xl font-light italic leading-snug text-sith-ink/85 sm:right-10 sm:max-w-sm sm:text-2xl md:bottom-[16%] md:right-[7vw] lg:right-[9vw]"
        >
          Ele não fala. Ele observa.
          <span className="mt-2 block font-mono text-[9px] not-italic uppercase tracking-[0.3em] text-sith-faint">
            mova o mouse. ele acompanha.
          </span>
        </p>
      </div>

      {/* Aprendiz observando de longe */}
      <div className="absolute bottom-[6%] left-8 z-10 md:left-1/2 md:bottom-[7%] md:-translate-x-1/2">
        <Mascot pose="idle" facing="right" scale={3.5} say={say} />
      </div>
    </section>
  );
}
