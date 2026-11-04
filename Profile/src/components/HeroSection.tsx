import { Suspense, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import gsap from 'gsap';
import Mascot, { type Pose } from './Mascot';
import Fighter, { CameraShake, TIE_HIDDEN, TIE_PATROL_FROM, TIE_PATROL_TO_X, type TieFlight, type TieMotion } from './TieFighter';
import bustSith from '../../imgs/busto-sith.png';
import bustRebel from '../../imgs/busto-rebel.png';
import { PROFILE } from '../data/profile';
import { useSide } from '../context/SideContext';
import { useSkin } from '../context/SkinContext';
import { prefersReducedMotion } from '../lib/scroll';

const SLAB_W = 300;
const SLAB_H = 400;
const CAMERA: [number, number, number] = [0, 0.3, 6];

interface Shard {
  points: string;
  cx: number;
  cy: number;
  row: number;
  fill: string;
}

const SHARD_ROWS = 7;

/** Divide o bloco em triângulos irregulares — a "crosta" de carbonita que vai estilhaçar. */
function makeShards(cols = 5, rows = SHARD_ROWS, seed = 11): Shard[] {
  let s = seed;
  const rnd = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  const cw = SLAB_W / cols;
  const ch = SLAB_H / rows;
  const pts: { x: number; y: number }[][] = [];
  for (let j = 0; j <= rows; j++) {
    pts[j] = [];
    for (let i = 0; i <= cols; i++) {
      const inner = i > 0 && i < cols && j > 0 && j < rows;
      const jx = inner ? (rnd() - 0.5) * cw * 0.62 : 0;
      const jy = inner ? (rnd() - 0.5) * ch * 0.62 : 0;
      pts[j][i] = { x: +(i * cw + jx).toFixed(1), y: +(j * ch + jy).toFixed(1) };
    }
  }
  const fills = ['#2b2730', '#34303a', '#262229', '#3b3641', '#2f2b35', '#282430', '#302c36'];
  const out: Shard[] = [];
  type P = { x: number; y: number };
  const tri = (a: P, b: P, c: P, row: number) => {
    out.push({
      points: `${a.x},${a.y} ${b.x},${b.y} ${c.x},${c.y}`,
      cx: +((a.x + b.x + c.x) / 3).toFixed(1),
      cy: +((a.y + b.y + c.y) / 3).toFixed(1),
      row,
      fill: fills[Math.floor(rnd() * fills.length)],
    });
  };
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const p00 = pts[j][i];
      const p10 = pts[j][i + 1];
      const p01 = pts[j + 1][i];
      const p11 = pts[j + 1][i + 1];
      if ((i + j) % 2 === 0) {
        tri(p00, p10, p11, j);
        tri(p00, p11, p01, j);
      } else {
        tri(p00, p10, p01, j);
        tri(p10, p11, p01, j);
      }
    }
  }
  return out;
}

/** Estrelas estáticas com cintilação — geradas uma vez, determinísticas. */
function makeStars(count = 90, seed = 3) {
  let s = seed;
  const rnd = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: +(rnd() * 100).toFixed(2),
    top: +(rnd() * 100).toFixed(2),
    size: rnd() > 0.85 ? 2 : 1,
    delay: +(rnd() * 6).toFixed(2),
    dur: +(2.5 + rnd() * 4).toFixed(2),
    warm: rnd() > 0.88,
  }));
}

interface Props {
  ready: boolean;
}

export default function HeroSection({ ready }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const walkerRef = useRef<HTMLDivElement>(null);
  const slabRef = useRef<HTMLDivElement>(null);
  const slabInnerRef = useRef<HTMLDivElement>(null);
  const crustRef = useRef<SVGSVGElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const burstRef = useRef<HTMLDivElement>(null);
  const slashRef = useRef<SVGSVGElement>(null);
  const cutRef = useRef<HTMLDivElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const dustRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const patrolRef = useRef<gsap.core.Tween | null>(null);

  const tie = useRef<TieMotion>({ ...TIE_HIDDEN });
  const flight = useRef<TieFlight>({ active: false, t: 0, stretch: 1 });
  const shakeAmp = useRef({ v: 0 });

  const [walkerPose, setWalkerPose] = useState<Pose>('walk');
  const [walkerFacing, setWalkerFacing] = useState<'left' | 'right'>('right');
  const [walkerSay, setWalkerSay] = useState<string | null>(null);
  const [walkerSaber, setWalkerSaber] = useState(false);
  const [sitterVisible, setSitterVisible] = useState(false);
  const [sitterSay, setSitterSay] = useState<string | null>(null);
  const [inView, setInView] = useState(true);
  const quipIndex = useRef(0);
  const { config } = useSide();
  const { skin } = useSkin();
  const copy = config.copy.hero;
  const bust = config.id === 'rebel' ? bustRebel : bustSith;

  const shards = useMemo(() => makeShards(), []);
  const stars = useMemo(() => makeStars(), []);

  // Pausa o WebGL quando o herói sai da tela.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => setInView(!!entry?.isIntersecting), { threshold: 0 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Estado inicial (antes de qualquer animação).
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(slabRef.current, { xPercent: -50, left: '50%', y: -2400 });
      gsap.set(walkerRef.current, { xPercent: -50, left: '-12%' });
      gsap.set(portraitRef.current, { opacity: 1, scale: 1 });
      gsap.set(burstRef.current, { opacity: 0, scale: 0.5 });
      gsap.set([slashRef.current, cutRef.current], { opacity: 0 });
      gsap.set(taglineRef.current?.querySelectorAll('[data-line]') ?? [], {
        opacity: 0,
        y: 22,
        filter: 'blur(8px)',
      });
      gsap.set(hintRef.current, { opacity: 0 });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    if (!ready) return;
    const stage = stageRef.current;
    const walker = walkerRef.current;
    const slab = slabRef.current;
    const slabInner = slabInnerRef.current;
    const crust = crustRef.current;
    if (!stage || !walker || !slab || !slabInner || !crust) return;

    const ctx = gsap.context(() => {
      const stageW = stage.clientWidth;
      const stageH = stage.clientHeight;
      const slabW = slab.offsetWidth;
      const slabH = slab.offsetHeight;
      const walkerW = walker.offsetWidth;
      const gap = stageW < 640 ? 10 : 34;
      const standX = Math.min(stageW - walkerW / 2 - 6, stageW / 2 + slabW / 2 + gap + walkerW / 2);

      const polys = Array.from(crust.querySelectorAll<SVGPolygonElement>('polygon'));
      const lines = taglineRef.current?.querySelectorAll('[data-line]') ?? [];
      const dust = dustRef.current?.children ?? [];
      const chips = chipsRef.current?.children ?? [];
      const slash = slashRef.current;
      const cut = cutRef.current;

      /** Um corte de sabre na fileira `row` do bloco: arco, linha de corte, lascas e cacos voando. */
      const carveRow = (row: number) => {
        const yPct = ((row + 0.5) / SHARD_ROWS) * 100;
        if (slash) {
          gsap.set(slash, { top: `${yPct}%` });
          gsap.fromTo(slash, { opacity: 1, rotate: 28, scaleX: 0.7 }, { opacity: 0, rotate: -34, scaleX: 1.1, duration: 0.34, ease: 'power2.out', overwrite: true });
        }
        if (cut) {
          gsap.set(cut, { top: `${yPct}%` });
          gsap.fromTo(cut, { opacity: 1, scaleX: 0 }, { scaleX: 1, duration: 0.12, ease: 'power3.out', overwrite: true });
          gsap.to(cut, { opacity: 0, duration: 0.3, delay: 0.12 });
        }
        if (chips.length) {
          gsap.set(chips, { top: `${yPct}%` });
          gsap.fromTo(
            chips,
            { x: 0, y: 0, opacity: 1, scale: 1 },
            {
              x: () => gsap.utils.random(-70, 40),
              y: () => gsap.utils.random(-60, 30),
              opacity: 0,
              scale: 0.3,
              duration: 0.55,
              ease: 'power2.out',
              overwrite: true,
            }
          );
        }
        const rowPolys = polys.filter((p) => Number(p.dataset.row) === row);
        gsap.to(rowPolys, {
          x: (_i: number, el: SVGPolygonElement) => (Number(el.dataset.cx) - SLAB_W / 2) * gsap.utils.random(0.9, 2.2) - gsap.utils.random(20, 90),
          y: () => -gsap.utils.random(40, 150) + gsap.utils.random(120, 260),
          rotation: () => gsap.utils.random(-220, 220),
          scale: () => gsap.utils.random(0.15, 0.6),
          opacity: 0,
          transformOrigin: '50% 50%',
          duration: 0.95,
          ease: 'power3.out',
          stagger: { each: 0.012, from: 'random' },
        });
        gsap.fromTo(slabInner, { x: 0 }, { x: 4, duration: 0.04, repeat: 5, yoyo: true, ease: 'none', onComplete: () => gsap.set(slabInner, { x: 0 }) });
      };

      const startPatrol = () => {
        patrolRef.current?.kill();
        flight.current.active = false;
        Object.assign(tie.current, TIE_PATROL_FROM);
        patrolRef.current = gsap.to(tie.current, {
          x: TIE_PATROL_TO_X,
          duration: 30,
          ease: 'none',
          repeat: -1,
          repeatDelay: 6,
        });
      };

      const tl = gsap.timeline({ delay: 0.3, defaults: { ease: 'power2.inOut' } });
      tlRef.current = tl;

      // 1 · o aprendiz chega
      tl.call(() => {
        setWalkerPose('walk');
        setWalkerFacing('right');
      });
      tl.to(walker, { left: standX, duration: 1.5, ease: 'none' });
      tl.call(() => {
        setWalkerPose('idle');
        setWalkerSay('senti sua presença.');
      });
      tl.to({}, { duration: 1.1 });
      tl.call(() => {
        setWalkerSay(copy.gift);
        setWalkerFacing('left');
      });

      // 2 · voo contínuo pela spline (um único easing = sem solavancos)
      tl.add('flight', '+=0.2');
      tl.call(
        () => {
          flight.current.t = 0;
          flight.current.stretch = 1;
          flight.current.active = true;
        },
        undefined,
        'flight'
      );
      tl.to(flight.current, { t: 1, duration: 3.6, ease: 'power1.inOut' }, 'flight');
      tl.call(() => setWalkerSay(copy.incoming), undefined, 'flight+=1.35');
      tl.call(() => setWalkerPose('jump'), undefined, 'flight+=1.75');

      // Passagem rasante: só um tremor leve de câmera
      tl.to(shakeAmp.current, { v: 0.45, duration: 0.2, ease: 'power2.in' }, 'flight+=1.7');
      tl.to(shakeAmp.current, { v: 0, duration: 0.7, ease: 'power2.out' }, 'flight+=1.95');

      // 3 · a carga é solta: a carbonita cai e assenta com um quique elástico
      tl.fromTo(
        slab,
        { y: -(stageH * 0.95 + slabH) },
        { y: 0, duration: 0.85, ease: 'power2.in' },
        'flight+=1.75'
      );
      tl.call(
        () => {
          setWalkerPose('idle');
          setWalkerSay(copy.carbonite);
        },
        undefined,
        'flight+=2.6'
      );
      tl.fromTo(
        slabInner,
        { scaleY: 0.92, scaleX: 1.04, transformOrigin: '50% 100%' },
        { scaleY: 1, scaleX: 1, duration: 0.7, ease: 'elastic.out(1, 0.45)' },
        'flight+=2.6'
      );
      tl.fromTo(stage, { x: 0 }, { x: 4, duration: 0.04, repeat: 7, yoyo: true, ease: 'none' }, 'flight+=2.6');
      tl.set(stage, { x: 0 });
      if (dust.length) {
        tl.fromTo(
          dust,
          { opacity: 1, x: 0, y: 0, scale: 1 },
          {
            opacity: 0,
            x: (i: number) => (i % 2 === 0 ? -1 : 1) * gsap.utils.random(14, 48),
            y: () => -gsap.utils.random(10, 40),
            scale: 0.3,
            duration: 0.8,
            ease: 'power2.out',
            stagger: 0.02,
          },
          'flight+=2.6'
        );
      }
      tl.call(startPatrol, undefined, 'flight+=3.45');

      // 4 · o sabre esculpe o bloco: o aprendiz sobe pela lateral e corta fileira por fileira
      tl.add('carve', 'flight+=3.9');
      tl.call(
        () => {
          setWalkerSay('o sabre esculpe o que a Força escolhe.');
          setWalkerFacing('left');
          setWalkerSaber(true);
        },
        undefined,
        'carve'
      );
      tl.to(walker, { y: -(slabH + 70), duration: 0.36, ease: 'power2.out' }, 'carve+=0.7');
      const feetY = (row: number) => -(slabH - ((row + 0.5) / SHARD_ROWS) * slabH) - 26;
      tl.to(walker, { y: feetY(0), duration: 0.26, ease: 'power2.in' }, 'carve+=1.06');
      for (let row = 0; row < SHARD_ROWS; row++) {
        const at = `carve+=${(1.35 + row * 0.44).toFixed(2)}`;
        if (row > 0) tl.to(walker, { y: feetY(row), duration: 0.3, ease: 'power2.inOut' }, `${at}-=0.3`);
        tl.call(() => setWalkerPose('swing'), undefined, at);
        tl.call(() => carveRow(row), undefined, `${at}+=0.08`);
        tl.call(() => setWalkerPose('idle'), undefined, `${at}+=0.3`);
      }
      tl.add('carved', `carve+=${(1.35 + SHARD_ROWS * 0.44).toFixed(2)}`);
      tl.fromTo(
        burstRef.current,
        { opacity: 0, scale: 0.5 },
        { opacity: 1, scale: 1.5, duration: 0.45, ease: 'power2.out' },
        'carved'
      );
      tl.to(burstRef.current, { opacity: 0, duration: 0.9, ease: 'power2.out' }, 'carved+=0.45');
      tl.call(
        () => {
          setWalkerSay(null);
          setWalkerPose('jump');
        },
        undefined,
        'carved'
      );
      tl.to(walker, { y: 0, duration: 0.32, ease: 'power2.in' }, 'carved');
      tl.call(() => {
        setWalkerPose('idle');
        setWalkerSaber(false);
      }, undefined, 'carved+=0.34');
      tl.to(
        lines,
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, stagger: 0.14, ease: 'power3.out' },
        'carved+=0.2'
      );
      tl.to(skipRef.current, { autoAlpha: 0, duration: 0.3 }, 'carved');

      // 5 · sobe no busto e vigia
      tl.add('jump', 'carved+=0.9');
      tl.call(() => setWalkerPose('jump'), undefined, 'jump');
      tl.to(walker, { left: stageW / 2, duration: 0.62, ease: 'power1.inOut' }, 'jump');
      tl.to(walker, { y: -(slabH + 90), duration: 0.34, ease: 'power2.out' }, 'jump');
      tl.to(walker, { y: -slabH, duration: 0.28, ease: 'power2.in' }, 'jump+=0.34');
      tl.call(
        () => {
          gsap.set(walker, { autoAlpha: 0 });
          setSitterVisible(true);
        },
        undefined,
        'jump+=0.62'
      );
      tl.call(() => setSitterSay(copy.sitter), undefined, 'jump+=1.0');
      tl.to(hintRef.current, { opacity: 1, duration: 0.8 }, 'jump+=1.2');
      tl.to({}, { duration: 2.8 }, 'jump+=1.0');
      tl.call(() => setSitterSay(null));

      if (prefersReducedMotion()) tl.progress(1);
    }, sectionRef);

    return () => {
      ctx.revert();
      patrolRef.current?.kill();
      patrolRef.current = null;
      tlRef.current = null;
    };
  }, [ready, copy]);

  const skipIntro = useCallback(() => {
    const tl = tlRef.current;
    if (!tl) return;
    tl.progress(1);
  }, []);

  const quip = useCallback(() => {
    const line = copy.quips[quipIndex.current % copy.quips.length];
    quipIndex.current += 1;
    setSitterSay(line);
    window.setTimeout(() => setSitterSay((s) => (s === line ? null : s)), 2200);
  }, [copy]);

  return (
    <section
      ref={sectionRef}
      id="inicio"
      className="relative h-[100svh] min-h-[640px] overflow-hidden bg-sith-void"
    >
      <h1 className="sr-only">
        {PROFILE.name} — {PROFILE.role}
      </h1>

      {/* Fundo: estrelas, marca d'água e brasas */}
      <div className="absolute inset-0">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          {stars.map((st) => (
            <span
              key={st.id}
              className="star"
              style={{
                left: `${st.left}%`,
                top: `${st.top}%`,
                width: st.size,
                height: st.size,
                background: st.warm ? '#ffb4a0' : '#e8e4f0',
                animationDelay: `${st.delay}s`,
                animationDuration: `${st.dur}s`,
              }}
            />
          ))}
        </div>

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden" aria-hidden>
          <span className="select-none whitespace-nowrap font-display text-[27vw] font-light leading-none tracking-[-0.03em] text-sith-ink/[0.06] md:text-[19vw]">
            {PROFILE.wordmark}
            <span className="text-sith-crimson/20">.</span>
          </span>
        </div>

        <div className="pointer-events-none absolute inset-0" aria-hidden>
          {Array.from({ length: 14 }).map((_, i) => (
            <span
              key={i}
              className="ember-float"
              style={{
                left: `${6 + ((i * 53) % 88)}%`,
                bottom: `${4 + ((i * 29) % 30)}%`,
                ['--d' as string]: `${6 + (i % 5) * 1.7}s`,
                ['--delay' as string]: `${(i * 0.9) % 6}s`,
                ['--x' as string]: `${((i % 3) - 1) * 40}px`,
              }}
            />
          ))}
        </div>
      </div>

      {/* TIE Fighter — voo rasante e patrulha ao fundo */}
      <div className="pointer-events-none absolute inset-0 z-[1] [&_canvas]:pointer-events-none" aria-hidden>
        {ready && (
          <Canvas
            camera={{ position: CAMERA, fov: 50 }}
            dpr={[1, 1.5]}
            frameloop={inView ? 'always' : 'never'}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', toneMapping: 3 }}
            onCreated={({ gl }) => {
              gl.toneMappingExposure = 1.2;
            }}
            style={{ width: '100%', height: '100%', background: 'transparent' }}
          >
            <fog attach="fog" args={[config.scene.fog, 12, 46]} />
            <ambientLight intensity={0.3} />
            <hemisphereLight color="#8a98c8" groundColor={config.scene.ground} intensity={0.5} />
            <directionalLight position={[4, 6, 5]} intensity={1.7} color="#ffffff" />
            <directionalLight position={[-5, 2, -4]} intensity={1.2} color={config.accent} />
            <CameraShake amp={shakeAmp} basePosition={CAMERA} />
            <Suspense fallback={null}>
              <Fighter motion={tie} flight={flight} model={config.fighter} />
            </Suspense>
          </Canvas>
        )}
      </div>

      {/* Palco */}
      <div ref={stageRef} className="hero-stage absolute inset-0 z-[2]">
        {/* Luz vermelha no chão */}
        <div
          className="pointer-events-none absolute left-1/2 h-[42vh] w-[90vw] -translate-x-1/2 md:w-[60vw]"
          style={{
            bottom: 'calc(var(--floor) - 12vh)',
            background:
              'radial-gradient(ellipse at center, rgb(var(--c-crimson) / 0.22) 0%, rgb(var(--c-blood) / 0.08) 40%, transparent 70%)',
          }}
          aria-hidden
        />

        {/* Bloco de carbonita */}
        <div
          ref={slabRef}
          className="absolute w-[54vw] max-w-[300px] sm:w-[42vw] md:w-[300px]"
          style={{ bottom: 'var(--floor)', aspectRatio: '3 / 4' }}
        >
          <div ref={slabInnerRef} className="relative h-full w-full">
            {/* Explosão de luz */}
            <div
              ref={burstRef}
              className="pointer-events-none absolute inset-[-40%]"
              style={{
                background:
                  `radial-gradient(circle at 50% 50%, ${skin.saberCore}e6 0%, ${skin.saber}73 28%, transparent 62%)`,
                filter: 'blur(6px)',
              }}
              aria-hidden
            />

            {/* Busto Sith (revelado pelo sabre) */}
            <div
              ref={portraitRef}
              className="absolute inset-0 overflow-hidden border border-sith-line bg-sith-surface"
              style={{ boxShadow: '0 0 0 1px rgba(201,164,76,0.12), 0 40px 90px -30px rgba(0,0,0,0.9), 0 0 80px rgb(var(--c-crimson) / 0.2)' }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'radial-gradient(ellipse 80% 55% at 50% 100%, rgb(var(--c-crimson) / 0.28) 0%, rgb(var(--c-blood) / 0.1) 45%, transparent 75%), linear-gradient(180deg, var(--panel-a) 0%, var(--panel-b) 100%)',
                }}
              />
              <img
                src={bust}
                alt=""
                className="absolute inset-x-0 bottom-0 h-[96%] w-full object-contain object-bottom"
                style={{ filter: 'drop-shadow(0 18px 24px rgba(0,0,0,0.7))' }}
                draggable={false}
              />
              <div
                className="absolute inset-0"
                style={{
                  background: 'repeating-linear-gradient(0deg, transparent 0 3px, rgba(0,0,0,0.12) 3px 4px)',
                  opacity: 0.5,
                }}
              />
              <div className="absolute inset-x-3 top-3 flex items-start justify-between">
                <div>
                  <p className="font-display text-base font-medium tracking-wide text-sith-ink">B. PEREIRA</p>
                  <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-sith-crimson/80">{copy.badge}</p>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-sith-muted">
                  <span className="blink-dot inline-block h-1.5 w-1.5 rounded-full bg-sith-crimson" />
                  online
                </div>
              </div>
            </div>

            {/* Crosta de carbonita (estilhaça) */}
            <svg
              ref={crustRef}
              className="absolute inset-0 h-full w-full"
              viewBox={`0 0 ${SLAB_W} ${SLAB_H}`}
              preserveAspectRatio="none"
              aria-hidden
            >
              <defs>
                <linearGradient id="crust-sheen" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#fff" stopOpacity="0.08" />
                  <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
                  <stop offset="1" stopColor="#000" stopOpacity="0.25" />
                </linearGradient>
              </defs>
              {shards.map((sh, i) => (
                <polygon
                  key={i}
                  points={sh.points}
                  fill={sh.fill}
                  stroke="#0b090c"
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                  data-cx={sh.cx}
                  data-cy={sh.cy}
                  data-row={sh.row}
                />
              ))}
              {shards.map((sh, i) => (
                <polygon key={`s-${i}`} points={sh.points} fill="url(#crust-sheen)" pointerEvents="none" data-cx={sh.cx} data-cy={sh.cy} data-row={sh.row} />
              ))}
            </svg>

            {/* Corte do sabre: arco, linha incandescente e lascas */}
            <svg
              ref={slashRef}
              viewBox="0 0 100 100"
              className="pointer-events-none absolute right-[-18%] z-30 h-[46%] w-[70%] -translate-y-1/2 opacity-0"
              style={{ filter: `drop-shadow(0 0 8px ${skin.saber})`, transformOrigin: '90% 50%' }}
              aria-hidden
            >
              <path d="M 92 10 A 70 70 0 0 1 10 70" fill="none" stroke={skin.saber} strokeWidth="6" strokeLinecap="round" opacity="0.95" />
              <path d="M 92 10 A 70 70 0 0 1 10 70" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <div
              ref={cutRef}
              className="pointer-events-none absolute inset-x-[-6%] z-30 h-[3px] -translate-y-1/2 opacity-0"
              style={{ background: `linear-gradient(90deg, transparent, ${skin.saber} 20%, #fff 50%, ${skin.saber} 80%, transparent)`, boxShadow: `0 0 14px ${skin.saber}`, transformOrigin: '100% 50%' }}
              aria-hidden
            />
            <div ref={chipsRef} className="pointer-events-none absolute right-[8%] z-30" aria-hidden>
              {Array.from({ length: 9 }).map((_, i) => (
                <span
                  key={i}
                  className="absolute opacity-0"
                  style={{ width: 3 + (i % 3), height: 3 + ((i + 1) % 3), background: i % 3 === 0 ? skin.saberCore : '#6a6270', boxShadow: i % 3 === 0 ? `0 0 6px ${skin.saber}` : 'none' }}
                />
              ))}
            </div>

            {/* Poeira */}
            <div ref={dustRef} className="pointer-events-none absolute inset-x-0 bottom-0" aria-hidden>
              {Array.from({ length: 10 }).map((_, i) => (
                <span key={i} className="absolute h-1 w-1 bg-[#6b5a4a] opacity-0" style={{ left: `${8 + i * 9}%`, bottom: -2 }} />
              ))}
            </div>

            {/* Mascote sentado em cima do bloco */}
            {sitterVisible && (
              <button
                type="button"
                onClick={quip}
                className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-full cursor-pointer"
                aria-label="Falar com o aprendiz"
              >
                <Mascot pose="idle" facing="right" scale={4} say={sitterSay} />
              </button>
            )}
          </div>
        </div>

        {/* Mascote andando */}
        <div ref={walkerRef} className="absolute z-20" style={{ bottom: 'var(--floor)' }}>
          <Mascot pose={walkerPose} facing={walkerFacing} scale={4} say={walkerSay} saberOn={walkerSaber || walkerPose === 'swing'} bob={false} />
        </div>
      </div>

      {/* Tagline */}
      <div
        ref={taglineRef}
        className="absolute left-6 top-[13%] z-[3] sm:left-10 md:left-[7vw] md:top-1/2 md:-translate-y-1/2 lg:left-[9vw]"
      >
        <p className="font-display text-[clamp(28px,7vw,34px)] font-light italic leading-[1.05] tracking-tight text-sith-ink md:text-[clamp(34px,3.6vw,58px)]">
          {config.copy.tagline.map((line) => (
            <span key={line} data-line className="block">
              {line}
            </span>
          ))}
        </p>
        <p data-line className="mt-4 font-mono text-[10px] uppercase tracking-[0.3em] text-sith-faint md:mt-6">
          {PROFILE.name} — {PROFILE.role}
        </p>
      </div>

      {/* Dica de scroll */}
      <div
        ref={hintRef}
        className="absolute bottom-6 left-1/2 z-[4] flex -translate-x-1/2 flex-col items-center gap-2 font-mono text-[9px] uppercase tracking-[0.3em] text-sith-faint"
      >
        <span>scroll</span>
        <svg width="12" height="18" viewBox="0 0 6 9" shapeRendering="crispEdges" className="animate-bounce" aria-hidden>
          <rect x="2" y="0" width="2" height="5" style={{ fill: 'var(--crimson)' }} />
          <rect x="0" y="4" width="2" height="2" style={{ fill: 'var(--crimson)' }} />
          <rect x="4" y="4" width="2" height="2" style={{ fill: 'var(--crimson)' }} />
          <rect x="1" y="6" width="4" height="2" style={{ fill: 'var(--crimson)' }} />
          <rect x="2" y="8" width="2" height="1" style={{ fill: 'var(--crimson)' }} />
        </svg>
      </div>

      <button
        ref={skipRef}
        type="button"
        onClick={skipIntro}
        className="absolute bottom-6 right-5 z-[4] font-mono text-[10px] uppercase tracking-[0.28em] text-sith-faint transition-colors hover:text-sith-ink sm:right-8"
      >
        pular intro →
      </button>

      <style>{`
        .hero-stage { --floor: 11%; }
        @media (min-width: 768px) { .hero-stage { --floor: 16%; } }
      `}</style>
    </section>
  );
}
