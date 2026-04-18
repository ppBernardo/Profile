import { useRef, useLayoutEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import profilePhoto from '../../imgs/1736527234906-CjD05mEZ-removebg-preview.png';
import Lightsaber3D from './Lightsaber3D';
import SaberLoading from './SaberLoading';
import CanvasViewportSync from './CanvasViewportSync';

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const saberScrollRef = useRef(0);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // ── Master pinned timeline ──
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=200%',
          pin: true,
          scrub: 1.2,
          onUpdate: (self) => {
            saberScrollRef.current = self.progress;
          },
        },
      });

      // Phase 0 — red horizontal accent line draws across
      tl.fromTo(
        '.about-accent-line',
        { scaleX: 0 },
        { scaleX: 1, duration: 2, ease: 'power2.inOut' }
      );

      // Phase 1 — label slides in
      tl.fromTo(
        '.about-label',
        { x: -60, opacity: 0, filter: 'blur(4px)' },
        { x: 0, opacity: 1, filter: 'blur(0px)', duration: 1.5, ease: 'power3.out' },
        0.3
      );

      // Phase 2 — title words cascade in with 3D rotation
      tl.fromTo(
        '.about-title-word',
        { y: 120, opacity: 0, rotateX: -60, filter: 'blur(8px)' },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          filter: 'blur(0px)',
          stagger: 0.4,
          duration: 2.5,
          ease: 'power4.out',
        },
        0.8
      );

      // Phase 3 — photo curtain reveal with clip-path
      tl.fromTo(
        '.about-photo-reveal',
        { clipPath: 'inset(0 100% 0 0)' },
        { clipPath: 'inset(0 0% 0 0)', duration: 3, ease: 'power3.inOut' },
        3
      );

      // Phase 3b — saber canvas enters from left with rotation
      tl.fromTo(
        '.about-saber-wrap',
        { x: -80, opacity: 0, rotate: -15 },
        { x: 0, opacity: 1, rotate: 0, duration: 2.5, ease: 'power3.out' },
        3.5
      );

      // Phase 3c — photo HUD flickers in
      tl.fromTo(
        '.about-photo-hud',
        { opacity: 0 },
        { opacity: 1, duration: 1, ease: 'steps(5)' },
        5.5
      );

      // Phase 4 — text blocks fade up with blur
      tl.fromTo(
        '.about-text-block',
        { y: 50, opacity: 0, filter: 'blur(6px)' },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          stagger: 0.6,
          duration: 2,
          ease: 'power3.out',
        },
        4
      );

      // Phase 5 — info cards slide in from right with glow flash
      tl.fromTo(
        '.about-info-card',
        { x: 60, opacity: 0, scale: 0.95 },
        {
          x: 0,
          opacity: 1,
          scale: 1,
          stagger: 0.5,
          duration: 1.8,
          ease: 'power3.out',
        },
        5.5
      );

      // Phase 5b — card glow flash on enter
      tl.fromTo(
        '.about-info-card',
        { boxShadow: '0 0 0px rgba(255,0,0,0)' },
        {
          boxShadow: '0 0 20px rgba(255,0,0,0.15)',
          stagger: 0.5,
          duration: 0.6,
          ease: 'power2.in',
          yoyo: true,
          repeat: 1,
        },
        5.5
      );

      // Phase 6 — quote slides in
      tl.fromTo(
        '.about-quote',
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.5, ease: 'power3.out' },
        7
      );

      // Phase 7 — tags explode in from center
      tl.fromTo(
        '.about-tag',
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          stagger: { each: 0.12, from: 'center' },
          duration: 1,
          ease: 'back.out(2.5)',
        },
        7.5
      );

      // Phase 8 — vertical accent line on left draws down (decorative)
      tl.fromTo(
        '.about-vert-line',
        { scaleY: 0 },
        { scaleY: 1, duration: 6, ease: 'none' },
        2
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative min-h-screen touch-pan-y overflow-hidden bg-black"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-vader-surface/20 to-black" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              'radial-gradient(rgba(255,0,0,0.4) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Vertical red accent line — left side */}
      <div
        className="about-vert-line absolute left-6 sm:left-10 top-20 bottom-20 w-px origin-top"
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(255,0,0,0.3) 20%, rgba(255,0,0,0.3) 80%, transparent)',
          transform: 'scaleY(0)',
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 py-16 sm:py-24 md:py-32">
        {/* Label */}
        <p
          className="about-label font-mono text-vader-red text-xs tracking-[0.3em] uppercase mb-6"
          style={{ opacity: 0 }}
        >
          {'// SOBRE'}
        </p>

        {/* Title */}
        <div className="about-title-area mb-4 sm:mb-6" style={{ perspective: '800px' }}>
          <h2 className="font-display text-3xl sm:text-5xl md:text-7xl lg:text-8xl text-white tracking-wider leading-[0.9]">
            <span className="about-title-word inline-block" style={{ opacity: 0 }}>
              BERNARDO
            </span>
            <br />
            <span
              className="about-title-word inline-block text-vader-red text-glow-red"
              style={{ opacity: 0 }}
            >
              PEREIRA
            </span>{' '}
            <span
              className="about-title-word inline-block text-white/30"
              style={{ opacity: 0 }}
            >
              PINTO
            </span>
          </h2>
        </div>

        {/* Horizontal accent line */}
        <div
          className="about-accent-line h-px mb-8 sm:mb-16 origin-left"
          style={{
            background: 'linear-gradient(90deg, #ff0000, rgba(255,0,0,0.3) 50%, transparent)',
            transform: 'scaleX(0)',
          }}
        />

        {/* Main grid: Visual + Content */}
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-start">
          {/* Left — Photo + 3D Lightsaber */}
          <div className="about-visual relative">
            <div className="relative flex items-stretch gap-0">
              {/* 3D Lightsaber Canvas */}
              <div
                className="about-saber-wrap relative w-12 sm:w-16 md:w-20 flex-shrink-0 -mr-3 sm:-mr-4 z-20"
                style={{ opacity: 0 }}
              >
                <div className="pointer-events-none h-full min-h-[320px] min-w-0 w-full [&_canvas]:pointer-events-none sm:min-h-[400px] md:min-h-[480px]">
                  <Canvas
                    className="h-full w-full min-h-[inherit] pointer-events-none"
                    camera={{ position: [0, 0, 3], fov: 45 }}
                    dpr={[1, 1.5]}
                    gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
                    style={{ width: '100%', height: '100%', background: 'transparent' }}
                    resize={{ debounce: 0, scroll: true, offsetSize: false }}
                  >
                    <CanvasViewportSync maxDpr={1.5} />
                    <ambientLight intensity={0.05} />
                    <Suspense fallback={<SaberLoading />}>
                      <Lightsaber3D
                        targetHeight={1.8}
                        scrollProgress={saberScrollRef}
                      />
                    </Suspense>
                  </Canvas>
                </div>
              </div>

              {/* Photo */}
              <div className="relative flex-1 max-w-[280px] sm:max-w-[340px]">
                <div
                  className="about-photo-reveal relative aspect-[3/4] rounded-lg overflow-hidden border border-vader-border/50 group"
                  style={{
                    clipPath: 'inset(0 100% 0 0)',
                    boxShadow:
                      '-30px 0 60px rgba(255,0,0,0.08), 0 0 40px rgba(255,0,0,0.04)',
                  }}
                >
                  {/* Red ambient from saber side */}
                  <div
                    className="absolute inset-0 z-10 pointer-events-none"
                    style={{
                      background:
                        'linear-gradient(100deg, rgba(255,0,0,0.15) 0%, rgba(255,0,0,0.04) 25%, transparent 50%)',
                    }}
                  />

                  <img
                    src={profilePhoto}
                    alt="Bernardo Pereira"
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                  />

                  {/* Bottom gradient */}
                  <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black via-black/60 to-transparent z-10" />

                  {/* HUD overlay */}
                  <div
                    className="about-photo-hud absolute bottom-4 left-4 right-4 z-20 flex items-end justify-between"
                    style={{ opacity: 0 }}
                  >
                    <div>
                      <p className="font-display text-sm text-white tracking-wider">
                        B. PEREIRA
                      </p>
                      <p className="font-mono text-[9px] text-vader-red/70 tracking-wider mt-0.5">
                        FULL STACK DEV
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-vader-red animate-pulse-red" />
                      <span className="font-mono text-[9px] text-vader-red/60">
                        ONLINE
                      </span>
                    </div>
                  </div>
                </div>

                {/* Reflection glow */}
                <div
                  className="absolute -bottom-3 left-4 right-4 h-6 opacity-50"
                  style={{
                    background:
                      'radial-gradient(ellipse at center, rgba(255,0,0,0.2) 0%, transparent 70%)',
                    filter: 'blur(6px)',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Right — Content */}
          <div className="about-content-area">
            <div className="space-y-5 mb-10">
              <p
                className="about-text-block text-gray-300 text-base sm:text-lg leading-relaxed"
                style={{ opacity: 0 }}
              >
                Sou um desenvolvedor apaixonado por criar soluções{' '}
                <span className="text-vader-red font-semibold">
                  inovadoras
                </span>{' '}
                e impactantes. Com experiência em desenvolvimento web full stack,
                busco constantemente aprender novas tecnologias e aprimorar
                minhas habilidades.
              </p>
              <p
                className="about-text-block text-gray-400 text-base sm:text-lg leading-relaxed"
                style={{ opacity: 0 }}
              >
                Minha jornada na programação começou há{' '}
                <span className="text-white font-semibold">4 anos</span>,
                trabalhando em projetos desafiadores que me permitiram
                desenvolver uma visão ampla do processo de desenvolvimento de
                software.
              </p>
            </div>

            {/* Info cards */}
            <div className="about-info-cards space-y-3 mb-10">
              <div
                className="about-info-card flex items-center gap-4 p-4 rounded-lg border border-vader-border bg-vader-surface/30 hover:border-vader-red/30 transition-all duration-300 group"
                style={{ opacity: 0 }}
              >
                <div className="w-10 h-10 rounded-lg bg-vader-red/10 border border-vader-red/20 flex items-center justify-center flex-shrink-0 group-hover:bg-vader-red/20 transition-colors">
                  <span className="font-display text-vader-red text-sm">
                    PUC
                  </span>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">
                    Bacharel em Sistema de Informação
                  </p>
                  <p className="text-vader-red/70 text-xs font-mono">2023</p>
                </div>
              </div>

              <div
                className="about-info-card flex items-center gap-4 p-4 rounded-lg border border-vader-border bg-vader-surface/30 hover:border-vader-red/30 transition-all duration-300 group"
                style={{ opacity: 0 }}
              >
                <div className="w-10 h-10 rounded-lg bg-vader-red/10 border border-vader-red/20 flex items-center justify-center flex-shrink-0 group-hover:bg-vader-red/20 transition-colors">
                  <span className="font-display text-vader-red text-sm">
                    {'</>'}
                  </span>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">
                    Produtos Digitais
                  </p>
                  <p className="text-gray-500 text-xs font-mono">
                    Frontend &amp; Backend
                  </p>
                </div>
              </div>

              <div
                className="about-info-card flex items-center gap-4 p-4 rounded-lg border border-vader-border bg-vader-surface/30 hover:border-vader-red/30 transition-all duration-300 group"
                style={{ opacity: 0 }}
              >
                <div className="w-10 h-10 rounded-lg bg-vader-red/10 border border-vader-red/20 flex items-center justify-center flex-shrink-0 group-hover:bg-vader-red/20 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-vader-red animate-pulse-red" />
                </div>
                <div>
                  <p className="text-vader-red font-semibold text-sm">
                    Disponível para projetos
                  </p>
                  <p className="text-gray-600 text-xs font-mono">
                    status: active
                  </p>
                </div>
              </div>
            </div>

            {/* Quote */}
            <div
              className="about-quote mb-8 pl-4 border-l-2 border-vader-red/30"
              style={{ opacity: 0 }}
            >
              <p className="text-gray-500 text-sm italic leading-relaxed">
                &ldquo;O poder do código está em quem o controla.&rdquo;
              </p>
            </div>

            {/* Tags */}
            <div className="about-tags flex flex-wrap gap-2">
              {[
                'React',
                'Angular',
                'TypeScript',
                '.NET',
                'Node.js',
                'SQL',
                'Full Stack',
                '4+ Anos',
              ].map((tag) => (
                <span
                  key={tag}
                  className="about-tag px-3 py-1.5 rounded border border-vader-border text-gray-500 text-xs
                             hover:border-vader-red/40 hover:text-vader-red hover:saber-glow
                             transition-all duration-300 cursor-default font-mono"
                  style={{ opacity: 0 }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
