import { useRef, useLayoutEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Calendar } from 'lucide-react';
import TIEFighter, { type TIEFighterMotion } from './TIEFighter';
import CanvasViewportSync from './CanvasViewportSync';

gsap.registerPlugin(ScrollTrigger);

const experiences = [
  {
    year: '2025',
    period: 'Abr 2025 – Atual',
    company: 'ALTEROSA MK',
    role: 'Full Stack Developer',
    location: 'Contagem, MG',
    duration: '9 meses',
    type: 'Tempo integral',
    description:
      'Desenvolvimento completo de aplicações web — APIs escaláveis em .NET, interfaces modernas com Angular 19+, workers para processamento assíncrono.',
    technologies: ['Angular 19+', '.NET', 'C#', 'APIs RESTful', 'Workers'],
  },
  {
    year: '2024',
    period: 'Mai 2024 – Abr 2025',
    company: 'Mais Distribuidora',
    role: 'Analista de Desenvolvimento',
    location: 'Belo Horizonte, MG',
    duration: '1 ano',
    type: 'Tempo integral',
    description:
      'Soluções corporativas integrando Oracle, redes Mikrotik e sistemas .NET. Interfaces React e APIs ASP.NET para integração entre sistemas.',
    technologies: ['React', 'C#', '.NET', 'Oracle', 'Mikrotik', 'ASP.NET'],
  },
  {
    year: '2022',
    period: 'Nov 2022 – Jan 2023',
    company: 'Mais Dados Digital',
    role: 'Full Stack Trainee',
    location: 'Belo Horizonte, MG',
    duration: '3 meses',
    type: 'Trainee',
    description:
      'Participação em projetos do início ao fim. Contato direto com metodologias de desenvolvimento, resolução de problemas e otimização.',
    technologies: ['SQL', 'Bitbucket', 'Full Stack'],
  },
];

export default function ExperienceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const titleBlockRef = useRef<HTMLDivElement>(null);
  const tieMotionRef = useRef<TIEFighterMotion>({
    x: 5.8,
    y: 0,
    z: -3,
    scale: 0.38,
    yaw: 0,
    roll: 0,
    pitch: 0,
  });

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const canvasWrap = canvasWrapRef.current;
    const overlay = overlayRef.current;
    const titleBlock = titleBlockRef.current;
    if (!section || !track || !canvasWrap || !overlay || !titleBlock) return;

    const ctx = gsap.context(() => {
      const horizontalScroll = track.scrollWidth - window.innerWidth;
      const tiePhase = window.innerHeight * 1.8;
      const totalPin = tiePhase + horizontalScroll;

      const tieRatio = tiePhase / totalPin;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 1.2,
          end: () => `+=${totalPin}`,
          invalidateOnRefresh: true,
        },
      });

      /* ── Fase 1: TIE Fighter voa da direita para a esquerda ── */
      // 4 keyframes GSAP encadeados = trajetória curva contínua sem saltos

      // KF1: entrada — entra no viewport pela direita, começa a crescer
      const kf1 = tieRatio * 0.28;
      tl.to(
        tieMotionRef.current,
        {
          x: 2.4,
          y: 0.3,
          z: -1.2,
          scale: 0.6,
          yaw: -Math.PI * 0.12,
          roll: -0.04,
          pitch: 0.015,
          duration: kf1,
          ease: 'power2.in',
        },
        0
      );

      // KF2: meio — cruza o centro, mais perto da câmera, arco no topo
      const kf2 = tieRatio * 0.34;
      tl.to(
        tieMotionRef.current,
        {
          x: -1.2,
          y: 0.5,
          z: 1.4,
          scale: 1.05,
          yaw: -Math.PI * 0.3,
          roll: -0.11,
          pitch: 0.03,
          duration: kf2,
          ease: 'power1.inOut',
        },
        kf1
      );

      // KF3: saída — acelera para a esquerda, ainda aproximando
      const kf3 = tieRatio * 0.22;
      tl.to(
        tieMotionRef.current,
        {
          x: -4.2,
          y: 0.2,
          z: 2.2,
          scale: 1.32,
          yaw: -Math.PI * 0.42,
          roll: -0.16,
          pitch: 0.015,
          duration: kf3,
          ease: 'power1.in',
        },
        kf1 + kf2
      );

      // KF4: exit — sai da tela pela esquerda sem parar
      const kf4 = tieRatio * 0.16;
      tl.to(
        tieMotionRef.current,
        {
          x: -7.8,
          y: 0.0,
          z: 2.8,
          scale: 1.52,
          yaw: -Math.PI / 2,
          roll: -0.18,
          pitch: 0.005,
          duration: kf4,
          ease: 'power2.in',
        },
        kf1 + kf2 + kf3
      );

      // Canvas 3D visível durante a fase TIE, fade out depois
      tl.fromTo(
        canvasWrap,
        { opacity: 1 },
        { opacity: 0, duration: tieRatio * 0.2, ease: 'power2.in' },
        tieRatio * 0.85
      );

      // Overlay pulsa no centro da travessia
      tl.fromTo(
        overlay,
        { opacity: 0 },
        { opacity: 0.5, duration: tieRatio * 0.35, ease: 'power2.in' },
        tieRatio * 0.1
      );
      tl.to(
        overlay,
        { opacity: 0, duration: tieRatio * 0.35, ease: 'power2.out' },
        tieRatio * 0.55
      );

      /* ── Fase 2: Timeline revela ── */

      tl.fromTo(
        titleBlock,
        { opacity: 0, y: 60, scale: 0.92 },
        { opacity: 1, y: 0, scale: 1, duration: tieRatio * 0.3, ease: 'power3.out' },
        tieRatio * 0.65
      );

      tl.fromTo(
        track,
        { opacity: 0, x: 80 },
        { opacity: 1, x: 0, duration: tieRatio * 0.3, ease: 'power2.out' },
        tieRatio * 0.7
      );

      const cards = track.querySelectorAll('.exp-card');
      tl.fromTo(
        cards,
        { opacity: 0, y: 50, rotateY: -8 },
        {
          opacity: 1,
          y: 0,
          rotateY: 0,
          duration: tieRatio * 0.25,
          stagger: 0.03,
          ease: 'power2.out',
        },
        tieRatio * 0.78
      );

      /* ── Fase 3: Scroll horizontal ── */
      tl.to(
        track,
        { x: -horizontalScroll, duration: 1 - tieRatio, ease: 'none' },
        tieRatio
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="relative touch-pan-y overflow-hidden bg-black"
    >
      {/* ── Canvas 3D fullscreen — TIE Fighter voa pelo espaço ── */}
      <div
        ref={canvasWrapRef}
        className="absolute inset-0 z-30 min-h-0 min-w-0 pointer-events-none [&_canvas]:pointer-events-none"
      >
        <Canvas
          className="h-full w-full pointer-events-none"
          camera={{ position: [0, 0, 6], fov: 55 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          shadows
          style={{ width: '100%', height: '100%', background: 'transparent' }}
          resize={{ debounce: 0, scroll: true, offsetSize: false }}
        >
          <CanvasViewportSync maxDpr={1.5} />
          <ambientLight intensity={0.25} />
          <fog attach="fog" args={['#000000', 14, 24]} />
          <Suspense fallback={null}>
            <TIEFighter motionRef={tieMotionRef} />
          </Suspense>
        </Canvas>
      </div>

      {/* Overlay cinematográfico */}
      <div
        ref={overlayRef}
        className="absolute inset-0 z-20 pointer-events-none bg-black"
        style={{ opacity: 0 }}
      />

      {/* ── Conteúdo da timeline — touch vertical passa através do canvas (pointer-events none no WebGL) */}
      <div className="relative z-10 flex h-screen touch-pan-y items-center">
        <div
          ref={trackRef}
          className="pointer-events-auto flex items-center gap-4 sm:gap-8 px-4 sm:px-8"
          style={{ paddingLeft: '4vw', opacity: 0 }}
        >
          <div
            ref={titleBlockRef}
            className="flex-shrink-0 w-[82vw] sm:w-[45vw] md:w-[35vw] flex flex-col justify-center pr-4 sm:pr-8"
            style={{ opacity: 0 }}
          >
            <p className="font-mono text-vader-red text-[10px] sm:text-xs tracking-[0.3em] uppercase mb-3 sm:mb-4">
              {'// EXPERIÊNCIA'}
            </p>
            <h2 className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-8xl text-white tracking-wider leading-none">
              CARREIRA
            </h2>
            <p className="font-display text-xl sm:text-3xl md:text-4xl lg:text-5xl text-white/20 tracking-wider mt-1 sm:mt-2">
              &amp; TIMELINE
            </p>
            <div className="mt-4 sm:mt-8 h-px bg-gradient-to-r from-vader-red via-vader-red/30 to-transparent" />
            <p className="text-gray-600 text-xs sm:text-sm mt-3 sm:mt-4 max-w-xs">
              Cada experiência forjou novas habilidades. Scroll para explorar a
              jornada.
            </p>
          </div>

          {experiences.map((exp) => (
            <article
              key={exp.company}
              className="exp-card flex-shrink-0 w-[80vw] sm:w-[380px] md:w-[420px] min-h-[400px] sm:min-h-[480px] rounded-lg border border-vader-border
                         bg-gradient-to-b from-vader-surface/60 to-black/60 p-5 sm:p-7
                         hover:border-vader-red/40 hover:saber-glow-strong
                         transition-all duration-500 flex flex-col relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-vader-red/0 to-transparent group-hover:via-vader-red/60 transition-all duration-700" />

              <div className="flex items-baseline justify-between mb-3 sm:mb-4">
                <span className="font-display text-3xl sm:text-4xl text-vader-red text-glow-red">
                  {exp.year}
                </span>
                <span className="text-[9px] sm:text-[10px] text-gray-600 uppercase tracking-wider font-mono">
                  {exp.type}
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-white mb-1 tracking-wide">
                {exp.company}
              </h3>
              <p className="text-vader-red text-xs sm:text-sm font-medium mb-2 sm:mb-3">
                {exp.role}
              </p>

              <div className="flex items-center gap-3 sm:gap-4 text-gray-600 text-[11px] sm:text-xs mb-3 sm:mb-4">
                <span className="flex items-center gap-1">
                  <MapPin size={12} />
                  {exp.location}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  {exp.duration}
                </span>
              </div>

              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed flex-grow">
                {exp.description}
              </p>

              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-vader-border">
                <div className="flex flex-wrap gap-1.5">
                  {exp.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded text-[10px] border border-vader-border text-gray-500
                                 group-hover:border-vader-red/20 group-hover:text-vader-red/60
                                 transition-all duration-500 font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-vader-red/0 via-vader-red/0 to-vader-red/0 group-hover:from-vader-red/40 group-hover:via-vader-red/60 group-hover:to-vader-red/40 transition-all duration-700" />
            </article>
          ))}

          <div className="flex-shrink-0 w-[200px] flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full border border-vader-red/30 flex items-center justify-center mb-4">
              <span className="font-display text-lg text-vader-red">+</span>
            </div>
            <p className="text-gray-600 text-xs uppercase tracking-wider font-mono">
              Em evolução
            </p>
          </div>
        </div>
      </div>

      <svg
        className="absolute top-1/2 left-0 w-full h-px pointer-events-none z-0"
        preserveAspectRatio="none"
      >
        <line
          x1="0" y1="0" x2="100%" y2="0"
          stroke="rgba(255,0,0,0.1)"
          strokeWidth="1"
          strokeDasharray="8 8"
        />
      </svg>
    </section>
  );
}
