import { Suspense, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Html, useGLTF } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Mascot, { type Pose } from './Mascot';
import CapitalShip, { fleetShips, type ArriveKey, type FleetMotion } from './StarDestroyer';
import FighterWing from './TieWing';
import { useSide } from '../context/SideContext';
import { fleetSystems, SKILLS } from '../data/profile';
import { prefersReducedMotion } from '../lib/scroll';
import { drawHyperspace, makeStreaks, prepareCanvas } from '../lib/hyperspace';

gsap.registerPlugin(ScrollTrigger);

const CAMERA: [number, number, number] = [0, 1.3, 9];
const COMPACT_QUERY = '(max-width: 767px)';

/** Onde cada chegada rasga o céu (frações da tela), por layout. */
const BURST_ORIGIN: Record<Exclude<ArriveKey, 'flag'>, { desktop: [number, number]; compact: [number, number] }> = {
  two: { desktop: [0.56, 0.3], compact: [0.8, 0.2] },
  three: { desktop: [0.41, 0.24], compact: [0.67, 0.17] },
  ties: { desktop: [0.5, 0.74], compact: [0.5, 0.47] },
};

const freshArrive = (): Record<ArriveKey, number> => ({ flag: 0, two: 0, three: 0, ties: 0 });

/**
 * A frota do Império: a capitânia sai do hiperespaço (mesmo salto da navegação), freia de frente
 * para a câmera e assenta em 3/4; depois chegam duas escoltas e uma ala de TIEs, uma de cada vez.
 * Cada sistema da capitânia é uma área de competência.
 */
export default function FleetSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const fxRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const motion = useRef<FleetMotion>({ arrive: freshArrive(), orbit: 0, pointer: { x: 0, y: 0 }, compact: false, active: 0, tieBoost: 0 });
  const played = useRef(false);
  const linkRef = useRef<SVGPathElement>(null);
  const linkDotRef = useRef<SVGCircleElement>(null);
  const link = useRef({ drawn: 0 });
  const levelRef = useRef<HTMLSpanElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);
  const scanRef = useRef<HTMLDivElement>(null);
  const alertRef = useRef<HTMLDivElement>(null);
  const panelTweens = useRef<gsap.core.Tween[]>([]);

  const [near, setNear] = useState(false);
  const [inView, setInView] = useState(false);
  const [ready, setReady] = useState(false);
  const [entered, setEntered] = useState(false);
  const [hud, setHud] = useState(false);
  const [active, setActive] = useState(0);
  const [say, setSay] = useState<string | null>(null);
  const [pose, setPose] = useState<Pose>('idle');

  const { config } = useSide();
  const ships = useMemo(() => fleetShips(config.id), [config.id]);
  const systems = useMemo(() => fleetSystems(config.id), [config.id]);
  const system = systems[active];

  // Layout estreito: a nave fica menor e centralizada acima do painel.
  useEffect(() => {
    const mq = window.matchMedia(COMPACT_QUERY);
    const apply = () => {
      motion.current.compact = mq.matches;
    };
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  // Carrega o modelo (16 MB) só quando a seção se aproxima; pausa o render fora da tela.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const nearObs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          useGLTF.preload(ships[0].model.url);
          useGLTF.preload(config.fighter.url);
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
  }, [ships, config.fighter.url]);

  // Pin curto: o scroll dentro da seção só orbita a nave de leve; a chegada é uma cena com tempo próprio.
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reduced = prefersReducedMotion();
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=100%',
        pin: true,
        scrub: 0.8,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          motion.current.orbit = reduced ? 0 : self.progress;
        },
      });
      ScrollTrigger.create({
        trigger: section,
        start: 'top 55%',
        once: true,
        onEnter: () => setEntered(true),
      });
    }, section);
    return () => ctx.revert();
  }, []);

  const speak = useCallback((text: string, ms: number) => {
    setSay(text);
    window.setTimeout(() => setSay((s) => (s === text ? null : s)), ms);
  }, []);

  // Cena de chegada: rastros do salto → clarão → a capitânia surge esticada, freia e vira;
  // em seguida as escoltas e a ala de TIEs rasgam o céu, uma de cada vez.
  useEffect(() => {
    if (!entered || !ready || played.current) return;
    played.current = true;
    const canvas = fxRef.current;
    const stage = stageRef.current;
    const stars = starsRef.current;
    const arrive = motion.current.arrive;

    const settleNow = () => {
      (Object.keys(arrive) as ArriveKey[]).forEach((k) => {
        arrive[k] = 1;
      });
      setHud(true);
    };
    if (prefersReducedMotion() || !canvas) {
      settleNow();
      return;
    }
    const w = window.innerWidth;
    const h = window.innerHeight;
    const ctx = prepareCanvas(canvas, w, h);
    if (!ctx) {
      settleNow();
      return;
    }

    const compact = motion.current.compact;
    const layout = compact ? 'compact' : 'desktop';
    const origin = compact ? { x: w * 0.5, y: h * 0.42 } : { x: w * 0.4, y: h * 0.47 };
    const streaks = makeStreaks(220, Math.max(w, h) * 0.6);
    const fx = { s: 0 };
    const tint = config.hyperTint;
    const flashRgb = config.hyperFlash;
    const draw = () => {
      if (fx.s < 0.002) ctx.clearRect(0, 0, w, h);
      else drawHyperspace(ctx, w, h, fx.s, streaks, { origin, dim: false, maxLen: 520, tint, flashRgb });
      if (stars) stars.style.opacity = String(1 - fx.s * 0.9);
    };
    canvas.style.opacity = '1';

    const tl = gsap.timeline({
      onComplete: () => {
        canvas.style.opacity = '0';
        ctx.clearRect(0, 0, w, h);
      },
    });

    /** Rasgo curto de hiperespaço onde a próxima nave vai surgir. */
    const burst = (at: number, key: Exclude<ArriveKey, 'flag'>, strength: number) => {
      const [ox, oy] = BURST_ORIGIN[key][layout];
      const o = { x: w * ox, y: h * oy };
      const st = makeStreaks(90, Math.max(w, h) * 0.35);
      const b = { s: 0 };
      const d = () => {
        if (b.s < 0.002) ctx.clearRect(0, 0, w, h);
        else drawHyperspace(ctx, w, h, b.s, st, { origin: o, dim: false, flash: false, maxLen: 260, tint });
      };
      tl.to(b, { s: strength, duration: 0.28, ease: 'power2.in', onUpdate: d }, at).to(
        b,
        { s: 0, duration: 0.34, ease: 'power3.out', onUpdate: d },
        at + 0.28
      );
    };

    /** Solavanco da frenagem (amplitude 0..1). */
    const shake = (at: number, amp: number) => {
      if (!stage) return;
      tl.to(
        stage,
        {
          keyframes: [
            { x: -7 * amp, y: 4 * amp, duration: 0.05 },
            { x: 6 * amp, y: -4 * amp, duration: 0.05 },
            { x: -4 * amp, y: 2 * amp, duration: 0.06 },
            { x: 2 * amp, y: -1 * amp, duration: 0.07 },
            { x: 0, y: 0, duration: 0.12 },
          ],
        },
        at
      );
    };

    // Império: capitânia → duas escoltas → ala de TIEs. Resistência: Falcon → ala de X-wings.
    const escorts = ships.length > 1;
    const wingAt = escorts ? 5.15 : 3.2;
    tl.call(() => speak('rastro de salto detectado.', 2000), [], 0)
      .to(fx, { s: 1, duration: 1.05, ease: 'power3.in', onUpdate: draw }, 0.3)
      .to(arrive, { flag: 1, duration: 1.9, ease: 'expo.out' }, 1.35)
      .to(fx, { s: 0, duration: 0.75, ease: 'power3.out', onUpdate: draw }, 1.35)
      .call(() => setPose('salute'), [], 1.9)
      .call(() => setHud(true), [], 2.3)
      .call(() => speak(config.copy.fleet.arrived, 2600), [], escorts ? 4.4 : 3.4)
      .call(() => setPose('idle'), [], escorts ? 4.6 : 3.6)
      .to(arrive, { ties: 1, duration: 1.6, ease: 'expo.out' }, wingAt)
      .call(() => speak('toca num sistema.', 3000), [], wingAt + 2.2);
    shake(1.4, 1);
    if (escorts) {
      tl.to(arrive, { two: 1, duration: 1.5, ease: 'expo.out' }, 3.1).to(arrive, { three: 1, duration: 1.5, ease: 'expo.out' }, 4.1);
      burst(2.9, 'two', 0.72);
      shake(3.15, 0.45);
      burst(3.9, 'three', 0.62);
      shake(4.15, 0.3);
    }
    burst(wingAt - 0.15, 'ties', 0.58);

    return () => {
      tl.kill();
      played.current = false;
      motion.current.arrive = freshArrive();
      canvas.style.opacity = '0';
      if (stars) stars.style.opacity = '1';
    };
  }, [entered, ready, speak, ships, config]);

  // Painel de telemetria entra com o HUD.
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    gsap.to(panel, { opacity: hud ? 1 : 0, y: hud ? 0 : 24, duration: 0.6, ease: 'power3.out', overwrite: true });
  }, [hud]);

  // Troca de sistema: a capitânia reenquadra, o painel faz um "whip", a carga conta, a varredura digita.
  useEffect(() => {
    motion.current.active = active;
    const panel = panelRef.current;
    if (!panel || !hud) return;
    const body = panel.querySelector('[data-body]');
    if (!body) return;
    panelTweens.current.forEach((tw) => tw.kill());
    panelTweens.current = [];

    gsap.fromTo(body, { opacity: 0, y: 10, filter: 'blur(6px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.45, ease: 'power3.out', overwrite: true });
    gsap.fromTo(
      panel.querySelectorAll('.fleet-bar'),
      { scaleX: 0, transformOrigin: 'left center' },
      { scaleX: 1, duration: 0.8, ease: 'power3.out', stagger: 0.06, overwrite: true }
    );
    gsap.fromTo(link.current, { drawn: 0 }, { drawn: 1, duration: 0.55, ease: 'power2.out', overwrite: true });

    if (scanRef.current) {
      gsap.fromTo(scanRef.current, { top: '0%', opacity: 1 }, { top: '100%', opacity: 0, duration: 0.7, ease: 'power2.inOut', overwrite: true });
    }
    const sys = systems[active];
    const level = levelRef.current;
    if (level) {
      const c = { v: 0 };
      panelTweens.current.push(
        gsap.to(c, {
          v: sys.level,
          duration: 0.9,
          ease: 'power2.out',
          onUpdate: () => {
            level.textContent = `${Math.round(c.v)}%`;
          },
        })
      );
    }
    const status = statusRef.current;
    if (status) {
      const txt = `> varredura ${sys.code} concluída · ${sys.region.toLowerCase()} online`;
      const o = { n: 0 };
      status.textContent = '';
      panelTweens.current.push(
        gsap.to(o, {
          n: txt.length,
          duration: 0.9,
          delay: 0.2,
          ease: 'none',
          onUpdate: () => {
            status.textContent = txt.slice(0, Math.round(o.n));
          },
        })
      );
    }

    // Armas: a frota inteira entra em modo de batalha — alerta vermelho e o oficial avisa.
    if (alertRef.current) gsap.to(alertRef.current, { opacity: active === 1 ? 1 : 0, duration: 0.5, overwrite: true });
    if (active === 1) {
      speak('frota em modo de batalha.', 2400);
      setPose('salute');
      window.setTimeout(() => setPose('idle'), 1800);
    }

    // Hangar: a ala de TIEs faz uma passagem rápida (lançamento).
    if (active === 2) {
      gsap.fromTo(motion.current, { tieBoost: 0 }, { tieBoost: 1, duration: 0.7, ease: 'power2.inOut', yoyo: true, repeat: 1, repeatDelay: 1.6, overwrite: 'auto' });
    } else {
      gsap.to(motion.current, { tieBoost: 0, duration: 0.6, overwrite: 'auto' });
    }
  }, [active, hud, speak, systems]);

  // Linha de travamento: liga o marcador ativo ao painel (desktop), seguindo a nave a cada quadro.
  useEffect(() => {
    if (!hud) return;
    const update = () => {
      const path = linkRef.current;
      const dot = linkDotRef.current;
      const panel = panelRef.current;
      const section = sectionRef.current;
      if (!path || !dot || !panel || !section) return;
      if (window.innerWidth < 768) {
        path.setAttribute('d', '');
        dot.setAttribute('r', '0');
        return;
      }
      const marker = section.querySelector<HTMLElement>('.fleet-marker.is-active');
      if (!marker) return;
      const sr = section.getBoundingClientRect();
      const mr = marker.getBoundingClientRect();
      const pr = panel.getBoundingClientRect();
      const mx = mr.left + mr.width / 2 - sr.left;
      const my = mr.top + mr.height / 2 - sr.top;
      const px = pr.left - sr.left - 2;
      const py = pr.top - sr.top + 62;
      const r = mr.width / 2 + 5;
      const ang = Math.atan2(py - my, px - mx);
      const sx = mx + Math.cos(ang) * r;
      const sy = my + Math.sin(ang) * r;
      path.setAttribute('d', `M${sx.toFixed(1)},${sy.toFixed(1)} L${(px - 36).toFixed(1)},${sy.toFixed(1)} L${px.toFixed(1)},${py.toFixed(1)}`);
      const len = path.getTotalLength();
      const drawn = link.current.drawn;
      path.style.strokeDasharray = `${len}`;
      path.style.strokeDashoffset = `${len * (1 - drawn)}`;
      dot.setAttribute('cx', px.toFixed(1));
      dot.setAttribute('cy', py.toFixed(1));
      dot.setAttribute('r', (3 * drawn).toFixed(2));
    };
    gsap.ticker.add(update);
    return () => gsap.ticker.remove(update);
  }, [hud]);

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
        style={{ background: config.scene.space }}
        aria-hidden
      />
      <div ref={starsRef} className="pointer-events-none absolute inset-0" aria-hidden>
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
      <div ref={stageRef} className="absolute inset-0 will-change-transform [&_canvas]:pointer-events-none">
        {near && (
          <Canvas
            camera={{ position: CAMERA, fov: 48 }}
            dpr={[1, 1.5]}
            frameloop={inView ? 'always' : 'never'}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', toneMapping: 3 }}
            onCreated={({ gl, camera }) => {
              gl.toneMappingExposure = 1.15;
              camera.lookAt(0, 0, 0);
            }}
            style={{ width: '100%', height: '100%', background: 'transparent' }}
          >
            <fog attach="fog" args={[config.scene.fog, 16, 90]} />
            <ambientLight intensity={0.22} color="#6b7a99" />
            <hemisphereLight color="#9fb0d8" groundColor={config.scene.ground} intensity={0.5} />
            <directionalLight position={[6, 9, 4]} intensity={3.2} color="#dce8ff" />
            <directionalLight position={[-7, 3, -6]} intensity={1.3} color="#ffffff" />
            <directionalLight position={[0, -6, 2]} intensity={0.8} color="#ff2a2a" />
            <Suspense fallback={null}>
              {ships.slice(1).map((s) => (
                <CapitalShip key={s.key} spec={s} motion={motion} />
              ))}
              <FighterWing motion={motion} model={config.fighter} flagship={ships[0]} />
              <CapitalShip
                spec={ships[0]}
                motion={motion}
                onReady={handleReady}
                hotspots={systems.map((s) => ({ position: s.anchor, color: s.color }))}
              >
                {systems.map((s, i) => (
                  <Html key={s.id} position={s.anchor} center zIndexRange={[40, 10]} style={{ pointerEvents: hud ? 'auto' : 'none' }}>
                    <button
                      type="button"
                      className={`fleet-marker ${active === i ? 'is-active' : ''}`}
                      style={{ opacity: hud ? 1 : 0, transitionDelay: hud ? `${i * 120}ms` : '0ms', ['--c' as string]: s.color }}
                      onMouseEnter={() => setActive(i)}
                      onClick={() => setActive(i)}
                      aria-label={`${s.region}: ${s.domain}`}
                      aria-pressed={active === i}
                    >
                      {s.code}
                    </button>
                  </Html>
                ))}
              </CapitalShip>
            </Suspense>
          </Canvas>
        )}
      </div>

      {/* Rastros do salto (mesmo efeito da navegação) */}
      <canvas ref={fxRef} className="pointer-events-none absolute inset-0 z-10 opacity-0" aria-hidden />

      {/* Linha de travamento: marcador ativo → telemetria (desktop) */}
      <svg
        className="pointer-events-none absolute inset-0 z-[15] hidden h-full w-full md:block"
        style={{ filter: `drop-shadow(0 0 6px ${system.color})`, opacity: hud ? 1 : 0, transition: 'opacity 0.4s' }}
        aria-hidden
      >
        <path ref={linkRef} fill="none" stroke={system.color} strokeWidth={1} strokeOpacity={0.8} />
        <circle ref={linkDotRef} r={0} fill={system.color} />
      </svg>

      {/* Vinheta */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 85% 70% at 50% 50%, transparent 55%, rgb(var(--c-void) / 0.85) 100%)' }}
        aria-hidden
      />

      {/* Alerta vermelho (modo de batalha) */}
      <div ref={alertRef} className="pointer-events-none absolute inset-0 z-[12] opacity-0" aria-hidden>
        <div
          className="red-alert absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 85% 75% at 50% 50%, transparent 45%, rgb(var(--c-crimson) / 0.42) 100%)' }}
        />
        <div className="red-alert absolute inset-x-0 top-0 h-px bg-sith-crimson/70" />
        <div className="red-alert absolute inset-x-0 bottom-0 h-px bg-sith-crimson/70" />
      </div>

      {/* Cabeçalho */}
      <div className="pointer-events-none absolute left-6 top-24 z-20 sm:left-10 md:left-[7vw] lg:left-[9vw]">
        <p className="eyebrow">competências · ponte de comando</p>
        <h2 className="mt-3 font-display text-[clamp(36px,8vw,48px)] font-light leading-[0.95] tracking-tight text-sith-ink md:text-[clamp(44px,4.6vw,72px)]">
          {config.copy.fleet.title[0]}
          <br />
          <span className="italic text-sith-crimson text-glow-crimson">{config.copy.fleet.title[1]}</span>
        </h2>
        <p className="mt-4 max-w-xs text-sm text-sith-muted">
          Cada sistema da capitânia é uma área que eu domino.{' '}
          <span className="hidden md:inline">Toque nos marcadores do casco para inspecionar.</span>
        </p>
        {near && !ready && (
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.3em] text-sith-faint">sincronizando com a frota…</p>
        )}
      </div>

      {/* Telemetria */}
      <div
        ref={panelRef}
        className="absolute inset-x-3 bottom-3 z-20 opacity-0 md:inset-x-auto md:bottom-auto md:right-[6vw] md:top-1/2 md:w-[min(380px,34vw)] md:-translate-y-1/2 lg:right-[8vw]"
        style={{ borderLeft: `3px solid ${system.color}`, background: 'rgb(var(--c-surface) / 0.82)', backdropFilter: 'blur(14px)', boxShadow: '0 30px 60px -30px rgba(0,0,0,0.6), inset 0 1px 0 rgb(var(--c-line) / 0.05)' }}
        role="region"
        aria-live="polite"
        aria-label="Telemetria do sistema selecionado"
      >
        {/* Oficial de ponte (mobile): apoiado no painel */}
        <div className="pointer-events-none absolute -top-14 right-3 md:hidden">
          <Mascot pose={pose} facing="left" scale={2.6} say={say} />
        </div>

        {/* Abas (mobile) */}
        <div className="flex border-b border-sith-ink/10 md:hidden">
          {systems.map((s, i) => (
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

        <div data-body className="relative overflow-hidden p-4 sm:p-5">
          {/* Varredura: linha que desce o painel a cada troca */}
          <div
            ref={scanRef}
            className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-0"
            style={{ background: `linear-gradient(90deg, transparent, ${system.color}, transparent)`, boxShadow: `0 0 14px ${system.color}` }}
            aria-hidden
          />
          <p className="font-mono text-[8px] uppercase tracking-[0.42em] text-sith-faint">{'>'} telemetria ativa</p>
          <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.28em]" style={{ color: system.color }}>
            {system.code} — {system.region}
          </p>
          <h3 className="mt-2 font-display text-2xl font-medium tracking-wide text-sith-ink md:text-3xl">{system.domain}</h3>
          <p className="mt-2 text-[12px] leading-relaxed text-sith-muted md:text-[13px]">{system.desc}</p>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-sith-faint">carga</span>
            <div className="h-[5px] min-w-0 flex-1 bg-sith-ink/10">
              <div className="fleet-bar h-full" style={{ width: `${system.level}%`, background: system.color, boxShadow: `0 0 12px ${system.color}88` }} />
            </div>
            <span ref={levelRef} className="w-10 text-right font-mono text-sm tabular-nums" style={{ color: system.color }}>
              {system.level}%
            </span>
          </div>
          <p ref={statusRef} className="mt-2 min-h-[14px] font-mono text-[9px] tracking-[0.18em] text-sith-faint" aria-hidden />


          <ul className="mt-4 space-y-2">
            {system.techs.map((tch) => (
              <li key={tch.name}>
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-[10.5px] tracking-[0.1em] text-sith-ink/90">{tch.name}</span>
                  <span className="font-mono text-[9px] text-sith-faint">{tch.pct}%</span>
                </div>
                <div className="mt-1 h-[3px] w-full bg-sith-ink/10">
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

      {/* Oficial de ponte (desktop) */}
      <div className="pointer-events-none absolute bottom-[9%] left-[7vw] z-20 hidden md:block lg:left-[9vw]">
        <Mascot pose={pose} facing="right" scale={3.5} say={say} />
      </div>
    </section>
  );
}
