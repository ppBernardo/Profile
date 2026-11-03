import { Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Html, useGLTF } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Mascot from './Mascot';
import StarDestroyer, { DESTROYER_URL, type FleetMotion } from './StarDestroyer';
import { FLEET_SYSTEMS, SKILLS } from '../data/profile';
import { prefersReducedMotion } from '../lib/scroll';

gsap.registerPlugin(ScrollTrigger);

const CAMERA: [number, number, number] = [0, 0.4, 9];

/**
 * A frota do Império: o Star Destroyer cruza por cima da câmera e assenta em vista 3/4.
 * Cada sistema da nave é uma área de competência; os marcadores no casco abrem a telemetria.
 */
export default function FleetSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const motion = useRef<FleetMotion>({ p: 0, pointer: { x: 0, y: 0 } });
  const [near, setNear] = useState(false);
  const [inView, setInView] = useState(false);
  const [ready, setReady] = useState(false);
  const [hud, setHud] = useState(false);
  const [active, setActive] = useState(0);
  const [say, setSay] = useState<string | null>(null);
  const spoke = useRef({ a: false, b: false });
  const panelRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const system = FLEET_SYSTEMS[active];

  // Carrega o modelo (16 MB) só quando a seção se aproxima; pausa o render fora da tela.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const nearObs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          useGLTF.preload(DESTROYER_URL);
          setNear(true);
          nearObs.disconnect();
        }
      },
      { rootMargin: '1400px 0px' }
    );
    const viewObs = new IntersectionObserver(([entry]) => setInView(!!entry?.isIntersecting), { rootMargin: '150px 0px' });
    nearObs.observe(el);
    viewObs.observe(el);
    return () => {
      nearObs.disconnect();
      viewObs.disconnect();
    };
  }, []);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=220%',
        pin: true,
        scrub: 0.9,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = reduced ? 1 : self.progress;
          motion.current.p = p;
          setHud(p > 0.8);
          if (p > 0.04 && !spoke.current.a) {
            spoke.current.a = true;
            setSay('a frota do mestre.');
            window.setTimeout(() => setSay((s) => (s === 'a frota do mestre.' ? null : s)), 2600);
          }
          if (p > 0.82 && !spoke.current.b) {
            spoke.current.b = true;
            setSay('toca num sistema.');
            window.setTimeout(() => setSay((s) => (s === 'toca num sistema.' ? null : s)), 3000);
          }
        },
      });
      if (reduced) {
        motion.current.p = 1;
        setHud(true);
      }
    }, section);
    return () => ctx.revert();
  }, []);

  // Painel de telemetria entra com o HUD.
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    gsap.to(panel, { opacity: hud ? 1 : 0, y: hud ? 0 : 24, duration: 0.6, ease: 'power3.out', overwrite: true });
  }, [hud]);

  // Troca de sistema: conteúdo do painel faz um "whip" curto.
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel || !hud) return;
    const body = panel.querySelector('[data-body]');
    if (!body) return;
    gsap.fromTo(body, { opacity: 0, y: 10, filter: 'blur(6px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.45, ease: 'power3.out', overwrite: true });
    gsap.fromTo(
      panel.querySelectorAll('.fleet-bar'),
      { scaleX: 0, transformOrigin: 'left center' },
      { scaleX: 1, duration: 0.8, ease: 'power3.out', stagger: 0.06, overwrite: true }
    );
  }, [active, hud]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    motion.current.pointer = {
      x: (e.clientX / window.innerWidth - 0.5) * 2,
      y: (e.clientY / window.innerHeight - 0.5) * 2,
    };
  }, []);

  const handleReady = useCallback(() => setReady(true), []);

  return (
    <section
      ref={sectionRef}
      id="frota"
      className="relative h-screen overflow-hidden bg-sith-void"
      onPointerMove={onPointerMove}
      aria-label="A frota do Império — competências"
    >
      {/* Espaço profundo */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 70% 110%, rgba(122,15,20,0.25), transparent 60%), linear-gradient(180deg, #040305 0%, #07060a 60%, #0b0709 100%)' }}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {Array.from({ length: 70 }).map((_, i) => (
          <span
            key={i}
            className="star"
            style={{
              left: `${(i * 37) % 100}%`,
              top: `${(i * 59) % 100}%`,
              width: i % 7 === 0 ? 2 : 1,
              height: i % 7 === 0 ? 2 : 1,
              background: i % 11 === 0 ? '#ffb4a0' : '#e8e4f0',
              animationDelay: `${(i * 0.37) % 6}s`,
              animationDuration: `${3 + (i % 4)}s`,
            }}
          />
        ))}
      </div>

      {/* WebGL */}
      <div className="absolute inset-0 [&_canvas]:pointer-events-none">
        {near && (
          <Canvas
            camera={{ position: CAMERA, fov: 48 }}
            dpr={[1, 1.5]}
            frameloop={inView ? 'always' : 'never'}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', toneMapping: 3 }}
            onCreated={({ gl, camera }) => {
              gl.toneMappingExposure = 1.15;
              camera.lookAt(0, 0.2, 0);
            }}
            style={{ width: '100%', height: '100%', background: 'transparent' }}
          >
            <fog attach="fog" args={['#040305', 14, 44]} />
            <ambientLight intensity={0.22} color="#6b7a99" />
            <hemisphereLight color="#9fb0d8" groundColor="#2a0a0c" intensity={0.5} />
            <directionalLight position={[6, 9, 4]} intensity={3.2} color="#dce8ff" />
            <directionalLight position={[-7, 3, -6]} intensity={1.3} color="#ffffff" />
            <directionalLight position={[0, -6, 2]} intensity={0.8} color="#ff2a2a" />
            <Suspense fallback={null}>
              <StarDestroyer motion={motion} onReady={handleReady}>
                {FLEET_SYSTEMS.map((s, i) => (
                  <Html key={s.id} position={s.anchor} center zIndexRange={[40, 10]} style={{ pointerEvents: hud ? 'auto' : 'none' }}>
                    <button
                      type="button"
                      className={`fleet-marker ${active === i ? 'is-active' : ''}`}
                      style={{ opacity: hud ? 1 : 0, ['--c' as string]: s.color }}
                      onMouseEnter={() => setActive(i)}
                      onClick={() => setActive(i)}
                      aria-label={`${s.region}: ${s.domain}`}
                      aria-pressed={active === i}
                    >
                      {s.code}
                    </button>
                  </Html>
                ))}
              </StarDestroyer>
            </Suspense>
          </Canvas>
        )}
      </div>

      {/* Vinheta */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 85% 70% at 50% 50%, transparent 55%, rgba(4,3,5,0.85) 100%)' }}
        aria-hidden
      />

      {/* Cabeçalho */}
      <div ref={headerRef} className="pointer-events-none absolute left-6 top-24 z-20 sm:left-10 md:left-[7vw] lg:left-[9vw]">
        <p className="eyebrow">competências · ponte de comando</p>
        <h2 className="mt-3 font-display text-[clamp(36px,8vw,48px)] font-light leading-[0.95] tracking-tight text-sith-ink md:text-[clamp(44px,4.6vw,72px)]">
          A frota do
          <br />
          <span className="italic text-sith-crimson text-glow-crimson">Império.</span>
        </h2>
        <p className="mt-4 max-w-xs text-sm text-sith-muted">
          Cada sistema da nave é uma área que eu domino.{' '}
          <span className="hidden md:inline">Role para a nave assentar e toque nos marcadores.</span>
        </p>
        {near && !ready && (
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.3em] text-sith-faint">sincronizando com a frota…</p>
        )}
      </div>

      {/* Telemetria */}
      <div
        ref={panelRef}
        className="absolute inset-x-3 bottom-3 z-20 opacity-0 md:inset-x-auto md:bottom-auto md:right-[6vw] md:top-1/2 md:w-[min(380px,34vw)] md:-translate-y-1/2 lg:right-[8vw]"
        style={{ borderLeft: `3px solid ${system.color}`, background: 'rgba(8,6,9,0.78)', backdropFilter: 'blur(14px)', boxShadow: '0 30px 60px -30px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.05)' }}
        role="region"
        aria-live="polite"
        aria-label="Telemetria do sistema selecionado"
      >
        {/* Abas (mobile) */}
        <div className="flex border-b border-white/[0.06] md:hidden">
          {FLEET_SYSTEMS.map((s, i) => (
            <button
              key={s.id}
              type="button"
              className="flex-1 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors"
              style={{ color: active === i ? s.color : '#5a525a', borderBottom: active === i ? `2px solid ${s.color}` : '2px solid transparent' }}
              onClick={() => setActive(i)}
            >
              {s.code}
            </button>
          ))}
        </div>

        <div data-body className="p-4 sm:p-5">
          <p className="font-mono text-[8px] uppercase tracking-[0.42em] text-sith-faint">{'>'} telemetria ativa</p>
          <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.28em]" style={{ color: system.color }}>
            {system.code} — {system.region}
          </p>
          <h3 className="mt-2 font-display text-2xl font-medium tracking-wide text-sith-ink md:text-3xl">{system.domain}</h3>
          <p className="mt-2 text-[12px] leading-relaxed text-sith-muted md:text-[13px]">{system.desc}</p>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-sith-faint">carga</span>
            <div className="h-[5px] min-w-0 flex-1 bg-white/[0.06]">
              <div className="fleet-bar h-full" style={{ width: `${system.level}%`, background: system.color, boxShadow: `0 0 12px ${system.color}88` }} />
            </div>
            <span className="font-mono text-sm tabular-nums" style={{ color: system.color }}>
              {system.level}%
            </span>
          </div>

          <ul className="mt-4 space-y-2">
            {system.techs.map((tch) => (
              <li key={tch.name}>
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-[10.5px] tracking-[0.1em] text-sith-ink/90">{tch.name}</span>
                  <span className="font-mono text-[9px] text-sith-faint">{tch.pct}%</span>
                </div>
                <div className="mt-1 h-[3px] w-full bg-white/[0.06]">
                  <div className="fleet-bar h-full" style={{ width: `${tch.pct}%`, background: `linear-gradient(90deg, ${system.color}99, ${system.color})` }} />
                </div>
              </li>
            ))}
          </ul>

          <p className="mt-4 hidden font-mono text-[9px] uppercase tracking-[0.22em] text-sith-faint md:block">
            arsenal · {SKILLS.arsenal.slice(0, 6).join(' · ')}
          </p>
        </div>
      </div>

      {/* Oficial de ponte */}
      <div className="pointer-events-none absolute bottom-[12%] left-6 z-20 sm:left-10 md:bottom-[9%] md:left-[7vw] lg:left-[9vw]">
        <Mascot pose="idle" facing="right" scale={3.5} say={say} />
      </div>
    </section>
  );
}
