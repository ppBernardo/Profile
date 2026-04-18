import { useRef, useLayoutEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import DarthHelmet from './DarthHelmet';
import ParticleField from './ParticleField';
import CanvasViewportSync from './CanvasViewportSync';

gsap.registerPlugin(ScrollTrigger);

interface Props {
  scrollProgress: React.MutableRefObject<number>;
}

function LoadingFallback() {
  return (
    <mesh>
      <octahedronGeometry args={[0.4, 0]} />
      <meshBasicMaterial color="#ff0000" wireframe transparent opacity={0.4} />
    </mesh>
  );
}

export default function HeroSection({ scrollProgress }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 });

      tl.from('.hero-subtitle', {
        opacity: 0,
        y: 30,
        filter: 'blur(8px)',
        duration: 1,
        ease: 'power3.out',
      })
        .from(
          '.hero-title-line',
          {
            opacity: 0,
            y: 60,
            filter: 'blur(12px)',
            duration: 1.2,
            stagger: 0.15,
            ease: 'power3.out',
          },
          '-=0.6'
        )
        .from(
          '.hero-tagline',
          {
            opacity: 0,
            y: 20,
            filter: 'blur(6px)',
            duration: 0.8,
            ease: 'power3.out',
          },
          '-=0.4'
        )
        .from(
          '.hero-stat',
          {
            opacity: 0,
            y: 20,
            scale: 0.9,
            stagger: 0.1,
            duration: 0.6,
            ease: 'back.out(1.7)',
          },
          '-=0.2'
        )
        .from(
          '.hero-scroll-hint',
          {
            opacity: 0,
            y: -10,
            duration: 0.6,
          },
          '-=0.1'
        );

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=100%',
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          scrollProgress.current = self.progress;
        },
      });

      gsap.to('.hero-content', {
        opacity: 0,
        y: -80,
        filter: 'blur(10px)',
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=70%',
          scrub: true,
        },
      });

      gsap.to(canvasWrapRef.current, {
        opacity: 0.3,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: '+=60%',
          end: '+=40%',
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [scrollProgress]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative h-screen touch-pan-y overflow-hidden bg-black"
    >
      <div
        ref={canvasWrapRef}
        className="absolute inset-0 min-h-0 min-w-0 pointer-events-none [&_canvas]:pointer-events-none"
      >
        <Canvas
          className="h-full w-full pointer-events-none"
          camera={{ position: [0, 0.3, 5], fov: 45 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true, toneMapping: 3, powerPreference: 'high-performance' }}
          style={{ width: '100%', height: '100%', background: '#000' }}
          resize={{ debounce: 0, scroll: true, offsetSize: false }}
          onCreated={({ gl }) => {
            gl.toneMappingExposure = 1.22;
          }}
        >
          <CanvasViewportSync maxDpr={1.5} />
          <fog attach="fog" args={['#000000', 10, 24]} />
          <ambientLight intensity={0.36} />
          <hemisphereLight color="#b6c7e6" groundColor="#121212" intensity={0.34} />
          <directionalLight
            position={[4, 5, 5]}
            intensity={1.35}
            color="#ffffff"
          />
          <directionalLight
            position={[-3, 3, -3]}
            intensity={0.48}
            color="#ff2200"
          />
          <Suspense fallback={<LoadingFallback />}>
            <DarthHelmet scrollProgress={scrollProgress} />
          </Suspense>
          <ParticleField />
        </Canvas>
      </div>

      <div className="hero-content pointer-events-auto relative z-10 flex h-full flex-col items-center justify-center px-3 text-center sm:px-4">
        <p className="hero-subtitle font-mono text-vader-red text-xs sm:text-sm tracking-[0.3em] uppercase mb-6">
          &gt; Full Stack Developer_
        </p>

        <h1 className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-white tracking-wider leading-none">
          <span className="hero-title-line block">BERNARDO</span>
          <span className="hero-title-line block text-glow-red text-vader-red">
            PEREIRA
          </span>
        </h1>

        <p className="hero-tagline text-gray-600 text-xs sm:text-sm md:text-base mt-5 sm:mt-8 max-w-md font-light tracking-wide">
          Transformando código em poder.
          <br />
          <span className="text-gray-500">
            O lado sombrio do desenvolvimento.
          </span>
        </p>

        <div className="flex gap-6 sm:gap-8 md:gap-12 mt-8 sm:mt-12">
          {[
            { value: '4+', label: 'Anos' },
            { value: '15+', label: 'Tecnologias' },
            { value: '∞', label: 'Dedicação' },
          ].map((stat) => (
            <div key={stat.label} className="hero-stat text-center">
              <p className="font-display text-2xl sm:text-3xl text-vader-red text-glow-red">
                {stat.value}
              </p>
              <p className="text-[10px] sm:text-xs text-gray-600 uppercase tracking-[0.2em] mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="hero-scroll-hint absolute bottom-5 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-[10px] text-gray-600 uppercase tracking-[0.2em] font-mono">
          scroll
        </span>
        <div className="w-5 h-8 border border-vader-red/30 rounded-full flex justify-center pt-1.5">
          <div className="w-0.5 h-2 bg-vader-red/60 rounded-full animate-bounce" />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </section>
  );
}
