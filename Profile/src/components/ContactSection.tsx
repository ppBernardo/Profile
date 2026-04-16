import { useRef, useLayoutEffect, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import DeathStar, { type DeathStarMotion } from './DeathStar';
import CanvasViewportSync from './CanvasViewportSync';

gsap.registerPlugin(ScrollTrigger);

const EASE_ENTRY = 'cubic-bezier(0.16, 1, 0.3, 1)';

/** Escala após entrada (100% presença). Final do pin = 68% disso — mantém peso visual à direita. */
const DS_HERO_SCALE = 1.12;
const DS_PIN_END_SCALE = DS_HERO_SCALE * 0.68;

const socialChannels = [
  {
    id: 'github',
    name: 'GITHUB',
    handle: '@ppBernardo',
    href: 'https://github.com/ppBernardo',
    ariaLabel: 'GitHub — perfil ppBernardo',
    Icon: IconGitHub,
  },
  {
    id: 'linkedin',
    name: 'LINKEDIN',
    handle: 'bernardo-pereira',
    href: 'https://www.linkedin.com/in/bernardo-pereira-b80a0924a/',
    ariaLabel: 'LinkedIn — Bernardo Pereira',
    Icon: IconLinkedIn,
  },
  {
    id: 'instagram',
    name: 'INSTAGRAM',
    handle: '@bernard0pereira',
    href: 'https://www.instagram.com/bernard0pereira?igsh=MWduNm9pdmdtbjBqNw==',
    ariaLabel: 'Instagram — bernard0pereira',
    Icon: IconInstagram,
  },
  {
    id: 'email',
    name: 'EMAIL',
    handle: 'bernardo0kneezm@gmail.com',
    href: 'mailto:bernardo0kneezm@gmail.com',
    ariaLabel: 'Enviar e-mail para Bernardo',
    Icon: IconMail,
  },
] as const;

function IconGitHub({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="20" height="20" aria-hidden fill="currentColor">
      <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.5 2.87 8.32 6.84 9.67.5.1.68-.22.68-.48 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.67.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.72 0 0 .84-.27 2.75 1.05A9.38 9.38 0 0 1 12 6.84c.85.004 1.71.12 2.51.35 1.91-1.32 2.75-1.05 2.75-1.05.55 1.42.2 2.46.1 2.72.64.721.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.59.69.48A10.01 10.01 0 0 0 22 12.26C22 6.58 17.52 2 12 2z" />
    </svg>
  );
}

function IconLinkedIn({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="20" height="20" aria-hidden fill="currentColor">
      <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.5 8h4V24h-4V8zm7.5 0h3.84v2.18h.05c.53-1 1.84-2.06 3.79-2.06 4.05 0 4.8 2.67 4.8 6.14V24h-4v-6.93c0-1.65-.03-3.77-2.3-3.77-2.3 0-2.65 1.8-2.65 3.65V24h-4V8z" />
    </svg>
  );
}

function IconInstagram({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="20" height="20" aria-hidden fill="currentColor">
      <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8C2 4.6 4.6 2 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 4.86 18.14 3 15.4 3H7.6m9.65 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10m0 2a3 3 0 1 0 .001 6.001A3 3 0 0 0 12 9z" />
    </svg>
  );
}

function IconMail({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="20" height="20" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M4 6h16v12H4z" />
      <path d="M4 8l8 6 8-6" />
    </svg>
  );
}

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const introPlayedRef = useRef(false);

  const dsMotionRef = useRef<DeathStarMotion>({
    x: 0,
    y: 0,
    z: -3.8,
    scale: 0.3,
    rotY: 0,
  });

  useEffect(() => {
    const section = sectionRef.current;
    const wrap = canvasWrapRef.current;
    if (!section || !wrap) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || introPlayedRef.current) return;
        introPlayedRef.current = true;

        const mqDesktop = window.matchMedia('(min-width: 1024px)');
        const mqTablet = window.matchMedia('(min-width: 768px)');

        if (mqDesktop.matches) {
          gsap.fromTo(wrap, { opacity: 0 }, { opacity: 1, duration: 1.6, ease: EASE_ENTRY });
        } else if (mqTablet.matches) {
          gsap.set(wrap, { opacity: 0.12 });
        } else {
          gsap.set(wrap, { opacity: 0.06 });
        }

        gsap.to(dsMotionRef.current, {
          scale: DS_HERO_SCALE,
          z: -1.35,
          duration: 1.6,
          ease: EASE_ENTRY,
        });
      },
      { threshold: 0.12 }
    );

    obs.observe(section);
    return () => obs.disconnect();
  }, []);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const ctx = gsap.context(() => {
      gsap.set(content, { opacity: 0, y: 40 });

      const mm = gsap.matchMedia();

      mm.add('(min-width: 1024px)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=130%',
            scrub: 1.2,
            pin: true,
            invalidateOnRefresh: true,
          },
        });

        tl.fromTo(
          dsMotionRef.current,
          { x: 0, y: 0, scale: DS_HERO_SCALE, z: -1.35, rotY: 0 },
          {
            x: 2.35,
            y: 0.38,
            scale: DS_PIN_END_SCALE,
            z: -2.45,
            rotY: Math.PI * 1.72,
            ease: 'none',
          },
          0
        );

        tl.fromTo(
          content,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, ease: 'none' },
          0
        );
      });

      mm.add('(max-width: 1023px)', () => {
        gsap.to(content, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 78%',
          },
        });
      });

      return () => mm.revert();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative min-h-screen overflow-hidden bg-[#060606] text-[#e8e8e8]"
    >
      <div
        className="pointer-events-none absolute inset-0 z-[5] opacity-[1]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 3px)',
        }}
        aria-hidden
      />

      <div
        ref={canvasWrapRef}
        className="absolute inset-0 z-10 min-h-0 min-w-0 pointer-events-none opacity-[0.06] md:opacity-[0.12] lg:opacity-0"
      >
        <Canvas
          className="h-full w-full touch-none"
          camera={{ position: [0, 0.15, 5.4], fov: 42 }}
          dpr={[1, 1.25]}
          gl={{
            antialias: true,
            alpha: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.05,
            outputColorSpace: THREE.SRGBColorSpace,
            powerPreference: 'high-performance',
          }}
          style={{ width: '100%', height: '100%', background: 'transparent' }}
          resize={{ debounce: 0, scroll: true, offsetSize: false }}
        >
          <CanvasViewportSync maxDpr={1.25} />
          <ambientLight intensity={0.22} color="#1a1f28" />
          <directionalLight
            castShadow={false}
            position={[7, 10, 5]}
            intensity={0.48}
            color="#f0f3f8"
          />
          <directionalLight
            position={[-10, 4, -6]}
            intensity={0.32}
            color="#6b7f9e"
          />
          <directionalLight
            position={[0, -6, 3]}
            intensity={0.14}
            color="#2a3344"
          />
          <pointLight
            position={[4, 1, 6]}
            intensity={0.35}
            distance={28}
            decay={2}
            color="#ff3b2a"
          />
          <Suspense fallback={null}>
            <DeathStar
              motionRef={dsMotionRef}
              smoothedScrollRotation
              rotationLerp={9}
              continuousSpin={0.06}
            />
          </Suspense>
        </Canvas>
      </div>

      <div className="relative z-20 mx-auto grid min-h-screen max-w-6xl grid-cols-1 px-4 py-12 sm:px-8 sm:py-16 lg:grid-cols-[55%_45%] lg:px-10 lg:py-20">
        <div
          ref={contentRef}
          className="flex flex-col justify-center md:max-lg:mx-auto md:max-lg:max-w-xl md:max-lg:text-center"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#666]">
            Setor de comunicações
          </p>

          <h2 className="mt-3 sm:mt-4 font-mono text-xl font-normal uppercase leading-tight tracking-[0.12em] text-[#e8e8e8] sm:text-2xl md:text-3xl">
            O lado sombrio está recrutando
          </h2>

          <div
            role="status"
            aria-live="polite"
            className="mt-5 inline-flex w-fit items-center gap-2 rounded border border-[#00ff4430] bg-transparent px-3 py-1 font-mono text-[11px] uppercase tracking-[0.15em] text-[#888]"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00ff44] opacity-40" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00ff44]" />
            </span>
            ● DISPONÍVEL PARA PROJETOS
          </div>

          <div className="my-8 h-px w-full max-w-md bg-[#1a1a1a]" aria-hidden />

          <p className="max-w-xl text-xs leading-relaxed text-[#888] sm:text-sm md:text-base">
            Estou disponível para novos projetos. Se você tem uma missão, eu tenho as habilidades para
            executá-la. Use os canais abaixo para estabelecer contato.
          </p>

          <div className="mt-10">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#666]">
              Canais de comunicação do Império
            </p>
            <ul className="mt-4 space-y-2 md:max-lg:mx-auto md:max-lg:max-w-md">
              {socialChannels.map(({ id, name, handle, href, ariaLabel, Icon }) => (
                <li key={id}>
                  <a
                    href={href}
                    {...(id === 'email'
                      ? {}
                      : { target: '_blank', rel: 'noopener noreferrer' })}
                    aria-label={ariaLabel}
                    className="group flex cursor-pointer items-center gap-2.5 rounded border border-[#1a1a1a] border-l-[3px] border-l-transparent bg-[#0a0a0a] px-2.5 py-2.5 transition-all duration-200 hover:translate-x-1.5 hover:border-l-[#ff2200] sm:gap-3 sm:px-3 sm:py-3 md:gap-4"
                  >
                    <Icon className="shrink-0 text-[#666] transition-colors group-hover:text-[#ff2200]" />
                    <div className="min-w-0 flex-1 font-mono">
                      <span className="block text-[11px] uppercase tracking-[0.14em] text-[#e8e8e8]">
                        {name}
                      </span>
                      <span className="block truncate text-xs text-[#666]">{handle}</span>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="relative hidden min-h-[280px] lg:block">
          <p className="absolute bottom-12 left-1/2 hidden max-w-[12rem] -translate-x-1/2 text-center font-mono text-[9px] uppercase leading-relaxed tracking-[0.2em] text-[#444] lg:block">
            Vigilância orbital ativa
          </p>
        </div>
      </div>
    </section>
  );
}
