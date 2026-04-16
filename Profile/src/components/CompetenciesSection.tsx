import {
  Suspense,
  useLayoutEffect,
  useRef,
  useState,
  useEffect,
} from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import StarDestroyer, { type StarDestroyerMotion } from './StarDestroyer';
import CanvasViewportSync from './CanvasViewportSync';

useGLTF.preload('/planet_of_phoenix.glb');

gsap.registerPlugin(ScrollTrigger);

/* ─── Dados dos sistemas (hardpoints no casco + fim de linha → telemetria) ─ */

const HUD_NODES = [
  {
    code: 'SYS-01',
    shortLabel: '01',
    region: 'POPA · REATOR',
    system: 'Propulsion Systems',
    domain: 'Frontend',
    desc: 'Interfaces React/TypeScript, motion e componentes escaláveis.',
    level: 96,
    techs: ['React', 'TypeScript', 'Motion', 'Tailwind'],
    color: '#22d3ee',
    glow: 'rgba(34,211,238,0.22)',
    anchor: { x: 6, y: 69 },
    lineEnd: { x: 70, y: 32 },
  },
  {
    code: 'SYS-02',
    shortLabel: '02',
    region: 'CASCO · NÚCLEO',
    system: 'Defense Systems',
    domain: 'Backend',
    desc: 'Node.js, dados e processamento assíncrono resiliente.',
    level: 93,
    techs: ['Node.js', 'SQL', 'PostgreSQL', 'Cache'],
    color: '#a855f7',
    glow: 'rgba(168,85,247,0.22)',
    anchor: { x: 25, y: 69 },
    lineEnd: { x: 70, y: 40 },
  },
  {
    code: 'SYS-03',
    shortLabel: '03',
    region: 'TORRE · SENSORES',
    system: 'Sensor Arrays',
    domain: 'APIs & Integrações',
    desc: 'REST, JWT, webhooks e comunicação entre serviços.',
    level: 91,
    techs: ['REST', 'JWT', 'Webhooks', 'Queue'],
    color: '#f59e0b',
    glow: 'rgba(245,158,11,0.22)',
    anchor: { x: 33, y: 25 },
    lineEnd: { x: 70, y: 48 },
  },
  {
    code: 'SYS-04',
    shortLabel: '04',
    region: 'PROA · NAVEGAÇÃO',
    system: 'Navigation Core',
    domain: 'Arquitetura',
    desc: 'Docker, CI/CD, Git e entrega sustentável com testes.',
    level: 88,
    techs: ['Docker', 'CI/CD', 'Git', 'Tests'],
    color: '#34d399',
    glow: 'rgba(52,211,153,0.22)',
    anchor: { x: 54, y: 47 },
    lineEnd: { x: 70, y: 56 },
  },
] as const;

/* ─── Star field (camadas: distantes + brilhantes) ─────────────────────── */

function StarFieldLayer({
  count,
  minSize,
  maxSize,
  opacityMul,
  twinkleMin,
  twinkleMax,
}: {
  count: number;
  minSize: number;
  maxSize: number;
  opacityMul: number;
  twinkleMin: number;
  twinkleMax: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const frag = document.createDocumentFragment();
    const pickColor = () => {
      const r = Math.random();
      if (r > 0.97) return 'rgba(167,139,250,0.42)';
      if (r > 0.93) return 'rgba(251,113,133,0.32)';
      if (r > 0.84) return 'rgba(56,189,248,0.5)';
      return `rgba(255,255,255,${(0.08 + Math.random() * 0.32) * opacityMul})`;
    };
    for (let i = 0; i < count; i++) {
      const d = document.createElement('div');
      const sz = Math.random() * (maxSize - minSize) + minSize;
      Object.assign(d.style, {
        position: 'absolute',
        width: `${sz}px`,
        height: `${sz}px`,
        borderRadius: '50%',
        backgroundColor: pickColor(),
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animation: `comp-twinkle ${twinkleMin + Math.random() * (twinkleMax - twinkleMin)}s ease-in-out ${Math.random() * 4}s infinite`,
      });
      frag.appendChild(d);
    }
    el.appendChild(frag);
    return () => { el.innerHTML = ''; };
  }, [count, minSize, maxSize, opacityMul, twinkleMin, twinkleMax]);
  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
    />
  );
}

/* ─── Planeta 3D (background) ─────────────────────────────────────────── */

function PlanetModel() {
  const { scene } = useGLTF('/planet_of_phoenix.glb');
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.elapsedTime * 0.018;
  });

  return (
    <group ref={ref} position={[3.2, -1.95, -6]} scale={4.75}>
      <Center>
        <primitive object={scene} />
      </Center>
    </group>
  );
}

function SpaceBackdrop() {
  return (
    <>
      {/* Gradiente base — vácuo escuro */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            'linear-gradient(170deg, #000003 0%, #020308 18%, #05030e 40%, #060210 62%, #030108 82%, #000002 100%)',
        }}
        aria-hidden
      />

      {/* Galáxia distante (canto superior-esquerdo) */}
      <div
        className="pointer-events-none absolute z-0 space-nebula-drift opacity-[0.70]"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 55% 45% at 12% 18%, rgba(68,28,90,0.35) 0%, transparent 50%),' +
            'radial-gradient(ellipse 40% 30% at 18% 22%, rgba(95,38,60,0.15) 0%, transparent 42%),' +
            'radial-gradient(ellipse 28% 24% at 8% 14%, rgba(38,18,55,0.28) 0%, transparent 38%)',
          backgroundSize: '120% 120%',
          backgroundPosition: '50% 50%',
          width: '100%',
          height: '100%',
          inset: 0,
          position: 'absolute',
        }}
        aria-hidden
      />

      {/* Vinheta profunda */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          boxShadow:
            'inset 0 0 120px rgba(0,0,0,0.75), inset 0 -50px 90px rgba(0,0,0,0.55), inset 0 50px 80px rgba(0,0,0,0.35)',
        }}
        aria-hidden
      />

      {/* Planeta 3D — área extra no topo para não cortar o disco */}
      <div
        className="pointer-events-none absolute z-0"
        style={{
          top: '-22%',
          right: '-10%',
          bottom: '-14%',
          width: '68%',
          minHeight: 'min(115vh, 120%)',
        }}
        aria-hidden
      >
        <Canvas
          className="h-full min-h-[70vh] w-full"
          camera={{ position: [0, -0.45, 8.2], fov: 48 }}
          gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
          dpr={[1, 1.25]}
          style={{ background: 'transparent' }}
        >
          <CanvasViewportSync maxDpr={1.25} />
          <ambientLight intensity={0.15} color="#443355" />
          <directionalLight position={[-3, 2, 5]} intensity={1.8} color="#ffddbb" />
          <directionalLight position={[4, -1, -3]} intensity={0.4} color="#4422aa" />
          <pointLight position={[-2, 3, 4]} intensity={0.6} color="#ff6633" distance={18} decay={1.5} />
          <Suspense fallback={null}>
            <PlanetModel />
          </Suspense>
        </Canvas>
      </div>
    </>
  );
}

/* ─── SVG connector lines ────────────────────────────────────────────── */

interface SVGLinesProps {
  linesRef: React.RefObject<(SVGPathElement | null)[]>;
  active: number;
}

function SVGLines({ linesRef, active }: SVGLinesProps) {
  const DASHLEN = 24;

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full z-10"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        {HUD_NODES.map((node) => (
          <filter key={node.code} id={`glow-${node.code}`}>
            <feGaussianBlur stdDeviation="0.4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        ))}
      </defs>

      {HUD_NODES.map((node, i) => {
        const { anchor, lineEnd } = node;
        const cx1 = anchor.x + (lineEnd.x - anchor.x) * 0.38;
        const cx2 = anchor.x + (lineEnd.x - anchor.x) * 0.78;
        const d = `M ${anchor.x} ${anchor.y} C ${cx1} ${anchor.y} ${cx2} ${lineEnd.y} ${lineEnd.x} ${lineEnd.y}`;
        const isActive = active === i;

        return (
          <g key={node.code}>
            <path
              d={d}
              stroke={node.color}
              strokeWidth={isActive ? '0.85' : '0.5'}
              fill="none"
              strokeDasharray={DASHLEN}
              strokeDashoffset={DASHLEN}
              opacity={isActive ? 0.2 : 0.08}
              style={{ transition: 'stroke-width 0.25s, opacity 0.25s' }}
            />
            <path
              ref={(el) => {
                if (linesRef.current) linesRef.current[i] = el;
              }}
              d={d}
              stroke={node.color}
              strokeWidth={isActive ? '0.26' : '0.16'}
              fill="none"
              strokeDasharray={DASHLEN}
              strokeDashoffset={DASHLEN}
              opacity={isActive ? 1 : undefined}
              className={isActive ? '' : 'hud-line-idle'}
              style={{ transition: 'stroke-width 0.25s, opacity 0.25s' }}
            />
            <circle
              cx={lineEnd.x}
              cy={lineEnd.y}
              r={isActive ? '0.55' : '0.35'}
              fill={node.color}
              opacity={isActive ? 0.85 : 0.35}
            />
          </g>
        );
      })}
    </svg>
  );
}

/* ─── Marcadores no casco (desktop): toque na nave ───────────────────── */

function HullMarkers({
  active,
  onPick,
}: {
  active: number;
  onPick: (i: number) => void;
}) {
  return (
    <>
      {HUD_NODES.map((node, i) => {
        const on = active === i;
        return (
          <button
            key={node.code}
            type="button"
            className="hull-marker absolute z-[25] hidden h-9 w-9 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border bg-black/55 font-mono text-[10px] font-bold tabular-nums tracking-widest text-slate-200 backdrop-blur-sm transition-all duration-200 lg:flex"
            style={{
              left: `${node.anchor.x}%`,
              top: `${node.anchor.y}%`,
              borderColor: on ? `${node.color}aa` : 'rgba(255,255,255,0.14)',
              boxShadow: on
                ? `0 0 22px ${node.glow}, inset 0 0 12px ${node.glow.replace('0.22', '0.1')}`
                : '0 0 0 1px rgba(0,0,0,0.5)',
              color: on ? node.color : 'rgba(226,232,240,0.85)',
            }}
            aria-label={`${node.region}: ${node.domain}`}
            aria-pressed={on}
            onMouseEnter={() => onPick(i)}
            onClick={() => onPick(i)}
          >
            {node.shortLabel}
          </button>
        );
      })}
    </>
  );
}

/* ─── Telemetria: uma única leitura (sem cards) + abas mínimas no mobile ─ */

function TelemetryReadout({
  active,
  onPick,
  readoutRef,
}: {
  active: number;
  onPick: (i: number) => void;
  readoutRef: React.RefObject<HTMLDivElement | null>;
}) {
  const node = HUD_NODES[active];
  return (
    <div
      ref={readoutRef}
      className="systems-readout pointer-events-auto absolute inset-x-0 bottom-0 z-[26] border-t border-white/[0.08] bg-gradient-to-t from-black via-black/88 to-transparent px-4 pb-5 pt-3 backdrop-blur-md lg:inset-x-auto lg:bottom-auto lg:left-[70%] lg:right-auto lg:top-[44%] lg:w-[min(400px,28vw)] lg:-translate-y-1/2 lg:border lg:border-white/[0.09] lg:bg-black/50 lg:px-5 lg:pb-5 lg:pt-4 lg:backdrop-blur-lg"
      style={{
        borderLeftWidth: 3,
        borderLeftColor: node.color,
        borderLeftStyle: 'solid',
      }}
      role="region"
      aria-live="polite"
      aria-label="Telemetria do sistema selecionado"
    >
      {/* Seletor compacto — só mobile */}
      <div className="mb-3 flex gap-0.5 border-b border-white/[0.06] pb-2 lg:hidden">
        {HUD_NODES.map((n, i) => (
          <button
            key={n.code}
            type="button"
            className="mobile-sys-tab flex-1 py-2 font-mono text-[9px] uppercase tracking-[0.2em] text-slate-500 transition-colors"
            style={{
              color: active === i ? n.color : undefined,
              borderBottom: active === i ? `2px solid ${n.color}` : '2px solid transparent',
            }}
            onClick={() => onPick(i)}
          >
            {n.shortLabel}
          </button>
        ))}
      </div>

      <p className="font-mono text-[7.5px] uppercase tracking-[0.42em] text-slate-500">
        {'>'} telemetria_ativa
      </p>
      <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.28em]" style={{ color: `${node.color}bb` }}>
        {node.region}
      </p>
      <p className="mt-0.5 font-mono text-[9px] text-slate-500">
        {node.code} — {node.system}
      </p>

      <h3 className="mt-2 font-display text-lg font-semibold tracking-wide text-slate-100 lg:text-xl">
        {node.domain}
      </h3>

      <p className="mt-2 max-w-prose text-[11px] leading-relaxed text-slate-400 lg:text-xs">
        {node.desc}
      </p>

      <div className="mt-4 flex items-baseline gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">
          carga
        </span>
        <div className="h-1 min-w-0 flex-1 bg-white/[0.06]">
          <div
            className="hud-power-bar h-full origin-left"
            style={{
              width: `${node.level}%`,
              background: node.color,
              boxShadow: `0 0 12px ${node.glow}`,
            }}
          />
        </div>
        <span className="font-mono text-sm tabular-nums" style={{ color: node.color }}>
          {node.level}%
        </span>
      </div>

      <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.22em] text-slate-600">
        módulos
      </p>
      <p className="mt-1 font-mono text-[10px] leading-relaxed tracking-wide text-slate-400">
        {node.techs.join(' · ')}
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   SECTION
   ═══════════════════════════════════════════════════════════════════════ */

export default function CompetenciesSection() {
  const sectionRef  = useRef<HTMLElement>(null);
  const canvasRef   = useRef<HTMLDivElement>(null);
  const motionRef   = useRef<StarDestroyerMotion>({ scroll: 0, intro: 0 });
  const readoutRef  = useRef<HTMLDivElement>(null);

  const linesRef = useRef<(SVGPathElement | null)[]>([null, null, null, null]);

  const [active, setActive] = useState(0);

  /* ── GSAP animations ────────────────────────────────────────────────── */
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const trigger = {
        trigger: section,
        start: 'top 78%',
        toggleActions: 'play none none reverse',
      } as const;

      /* Canvas: gentle fade + scale up */
      if (canvasRef.current) {
        gsap.fromTo(
          canvasRef.current,
          { opacity: 0, scale: 0.96 },
          { opacity: 1, scale: 1, duration: 1.5, ease: 'power3.out', scrollTrigger: trigger },
        );
      }

      /* Telemetria + marcadores no casco */
      if (readoutRef.current) {
        gsap.fromTo(
          readoutRef.current,
          { opacity: 0, y: 22 },
          {
            opacity: 1,
            y: 0,
            duration: 0.95,
            ease: 'power3.out',
            delay: 0.38,
            scrollTrigger: trigger,
          },
        );
      }

      gsap.fromTo(
        '.hull-marker',
        { opacity: 0, scale: 0.2 },
        {
          opacity: 1,
          scale: 1,
          stagger: 0.07,
          duration: 0.55,
          ease: 'back.out(1.35)',
          delay: 0.28,
          scrollTrigger: trigger,
        },
      );

      gsap.fromTo(
        '.mobile-sys-tab',
        { opacity: 0, y: 8 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.06,
          duration: 0.45,
          ease: 'power2.out',
          delay: 0.42,
          scrollTrigger: trigger,
        },
      );

      /* SVG lines: draw-on (stroke-dashoffset 24 → 0) */
      const lines = linesRef.current.filter(Boolean) as SVGPathElement[];
      if (lines.length) {
        gsap.fromTo(
          lines,
          { strokeDashoffset: 24 },
          {
            strokeDashoffset: 0,
            stagger: { amount: 0.5, from: 'start' },
            duration: 1.1,
            ease: 'power2.inOut',
            delay: 0.5,
            scrollTrigger: trigger,
          },
        );
      }

      /* Nave: entra pequena da esquerda → pose final (mais longa; desacelera no fim) */
      gsap.fromTo(
        motionRef.current,
        { intro: 0 },
        {
          intro: 1,
          duration: 1.12,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 78%',
            toggleActions: 'play none none reverse',
          },
        },
      );

      /* Scroll parallax driver */
      ScrollTrigger.create({
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => { motionRef.current.scroll = self.progress; },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="competencies"
      className="relative h-screen w-full overflow-x-hidden overflow-y-visible bg-black"
      aria-label="Competências"
    >
      {/* Espaço: gradiente + nebulosa + estrelas em camadas */}
      <SpaceBackdrop />
      <StarFieldLayer
        count={110}
        minSize={0.12}
        maxSize={0.85}
        opacityMul={0.65}
        twinkleMin={3.8}
        twinkleMax={8}
      />
      <StarFieldLayer
        count={65}
        minSize={0.75}
        maxSize={2.15}
        opacityMul={1}
        twinkleMin={2.2}
        twinkleMax={5.5}
      />

      {/* Borda sutil topo/fundo */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-rose-900/15 to-transparent" />

      {/* ── 3D Canvas ─────────────────────────────────────────────────── */}
      <div ref={canvasRef} className="absolute inset-0 z-[1]" style={{ opacity: 0 }}>
        <Suspense
          fallback={
            <div className="flex h-full items-center justify-center font-mono text-[9px] uppercase tracking-[0.25em] text-gray-700">
              sincronizando propulsores…
            </div>
          }
        >
          <Canvas
            className="h-full w-full touch-none"
            camera={{ position: [1.35, 0.88, 5.35], fov: 44 }}
            gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
          >
            <CanvasViewportSync maxDpr={1.5} />
            <fog attach="fog" args={['#030108', 10, 55]} />
            <StarDestroyer motionRef={motionRef} />
          </Canvas>
        </Suspense>
      </div>

      {/* ── SVG connector lines (desktop only) ────────────────────────── */}
      <div className="absolute inset-0 z-[10] hidden lg:block">
        <SVGLines linesRef={linesRef} active={active} />
      </div>

      <HullMarkers active={active} onPick={setActive} />

      {/* ── Section label ─────────────────────────────────────────────── */}
      <div className="pointer-events-none absolute left-[30%] top-[1.5%] z-30 hidden lg:block">
        <p className="font-mono text-[8px] uppercase tracking-[0.45em] text-cyan-500/35">
          {'>'} IMPERIAL_SKILL_MATRIX
        </p>
        <h2 className="mt-0.5 font-display text-lg font-semibold uppercase tracking-[0.12em]">
          <span className="text-glow-red text-vader-red">Competências</span>{' '}
          <span className="text-gray-600">da Nave</span>
        </h2>
      </div>

      <TelemetryReadout active={active} onPick={setActive} readoutRef={readoutRef} />

      <style>{`
        .systems-readout,
        .hull-marker,
        .mobile-sys-tab {
          opacity: 0;
        }
        @keyframes space-nebula-drift {
          0%, 100% { transform: scale(1) translate(0, 0); opacity: 0.75; }
          50%      { transform: scale(1.035) translate(0.6%, -0.4%); opacity: 0.88; }
        }
        .space-nebula-drift {
          animation: space-nebula-drift 32s ease-in-out infinite;
        }
        @keyframes space-planet-drift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%      { transform: translate(-0.4%, 0.3%) scale(1.008); }
        }
        .space-planet-drift {
          animation: space-planet-drift 22s ease-in-out infinite;
        }
        @keyframes comp-twinkle {
          0%, 100% { opacity: 0.14; }
          50%       { opacity: 0.72; }
        }
        @keyframes hud-line-idle-pulse {
          0%, 100% { opacity: 0.45; }
          50%       { opacity: 0.82; }
        }
        @keyframes hud-dot-idle-pulse {
          0%, 100% { opacity: 0.55; }
          50%       { opacity: 0.9; }
        }
        .hud-line-idle { animation: hud-line-idle-pulse 3.2s ease-in-out infinite; }
        .hud-dot-idle  { animation: hud-dot-idle-pulse 2.8s ease-in-out infinite; }
        .hud-power-bar { animation: hud-power-bar 4s ease-in-out infinite; }
        @keyframes hud-power-bar {
          0%, 100% { opacity: 0.65; }
          50%       { opacity: 1; }
        }
      `}</style>
    </section>
  );
}
