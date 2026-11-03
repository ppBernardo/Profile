import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Mascot, { type Pose } from './Mascot';
import { useWhipIn } from '../hooks/useWhipIn';
import { SKILLS, type Skill } from '../data/profile';
import { prefersReducedMotion } from '../lib/scroll';

gsap.registerPlugin(ScrollTrigger);

const CRIMSON = '#e3242b';
const VIOLET = '#a855f7';
const BLUE = '#4aa8ff';

function Plaque({ glyph, tone }: { glyph: string; tone: 'crimson' | 'violet' }) {
  const color = tone === 'crimson' ? CRIMSON : VIOLET;
  return (
    <div
      className="relative mx-auto flex h-24 w-24 items-center justify-center sm:h-32 sm:w-32"
      style={{
        background: 'linear-gradient(145deg, #1d171b 0%, #0f0b0e 100%)',
        boxShadow:
          'inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -2px 0 rgba(0,0,0,0.6), 0 20px 40px -20px rgba(0,0,0,0.9)',
        border: '1px solid #2b2226',
      }}
    >
      <div className="absolute inset-2 border border-white/[0.04]" />
      <span
        className="font-mono text-3xl font-medium tracking-tight sm:text-4xl"
        style={{
          color: '#6b555d',
          textShadow: `0 1px 0 rgba(255,255,255,0.12), 0 -1px 0 rgba(0,0,0,0.95), 0 0 22px ${color}99`,
        }}
      >
        {glyph}
      </span>
      <span
        className="absolute inset-x-6 bottom-2 h-px opacity-60"
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
      />
    </div>
  );
}

function SkillBars({ items, tone }: { items: Skill[]; tone: 'crimson' | 'violet' }) {
  const color = tone === 'crimson' ? CRIMSON : VIOLET;
  return (
    <ul className="mt-6 space-y-2.5 text-left">
      {items.map((s) => (
        <li key={s.name}>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-[11px] tracking-[0.12em] text-sith-ink/90">{s.name}</span>
            <span className="font-mono text-[10px] text-sith-faint">{s.pct}%</span>
          </div>
          <div className="mt-1.5 h-[5px] w-full bg-[#1a1519]">
            <div
              className="skill-bar h-full"
              style={{
                width: `${s.pct}%`,
                background: `linear-gradient(90deg, ${color}aa, ${color})`,
                boxShadow: `0 0 10px ${color}88`,
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Arco de rastro do sabre, desenhado no golpe. */
function SaberArc({ color, flip, innerRef }: { color: string; flip?: boolean; innerRef: (el: SVGSVGElement | null) => void }) {
  return (
    <svg
      ref={innerRef}
      viewBox="0 0 100 100"
      className="pointer-events-none absolute top-[-14px] h-[96px] w-[96px] opacity-0"
      style={{
        left: flip ? 'auto' : '38px',
        right: flip ? '38px' : 'auto',
        transform: flip ? 'scaleX(-1)' : undefined,
        filter: `drop-shadow(0 0 6px ${color})`,
      }}
      aria-hidden
    >
      <path d="M 8 82 A 60 60 0 0 1 86 18" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" opacity="0.95" />
      <path d="M 8 82 A 60 60 0 0 1 86 18" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" opacity="0.9" />
    </svg>
  );
}

/** Rocha pixel-art (três silhuetas). */
const ROCK_SHAPES = [
  ['..XXXX..', '.XXxXXX.', 'XXXXXXXX', 'XXXXxXXX', '.XXXXXX.'],
  ['...XXX..', '.XXXxXX.', 'XXXXXXXX', '.XXxXXXX', '..XXXX..'],
  ['.XXXX...', 'XXXxXXX.', 'XXXXXXXX', '.XXXXXX.', '..XXXX..'],
];
function Rock({ shape, scale = 3 }: { shape: number; scale?: number }) {
  const rows = ROCK_SHAPES[shape % ROCK_SHAPES.length];
  return (
    <svg width={8 * scale} height={5 * scale} viewBox="0 0 8 5" shapeRendering="crispEdges" aria-hidden style={{ display: 'block' }}>
      {rows.map((row, y) =>
        [...row].map((ch, x) =>
          ch === '.' ? null : <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={ch === 'x' ? '#5c5f6b' : '#363944'} />
        )
      )}
    </svg>
  );
}

const ROCKS = [
  { left: 56, shape: 0, scale: 3 },
  { left: 61, shape: 1, scale: 2.4 },
  { left: 66, shape: 2, scale: 3.2 },
  { left: 71, shape: 0, scale: 2.6 },
  { left: 76, shape: 1, scale: 3 },
  { left: 81, shape: 2, scale: 2.5 },
  { left: 86, shape: 0, scale: 3.2 },
  { left: 91, shape: 1, scale: 2.7 },
];
const PILE_DX = [-22, 18, -4, -30, 28, -12, 10, 0];
const PILE_DY = [0, 0, -12, -4, -4, -24, -24, -36];

const SPARK_COUNT = 10;

export default function DuelSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const wrapRef = useWhipIn<HTMLDivElement>();
  const arenaRef = useRef<HTMLDivElement>(null);
  const obiRef = useRef<HTMLDivElement>(null);
  const vaderRef = useRef<HTMLDivElement>(null);
  const obiArc = useRef<SVGSVGElement | null>(null);
  const vaderArc = useRef<SVGSVGElement | null>(null);
  const rocksRef = useRef<HTMLDivElement>(null);
  const sparksRef = useRef<HTMLDivElement>(null);
  const hitRef = useRef<HTMLDivElement>(null);
  const lockRef = useRef<HTMLDivElement>(null);
  const forceRef = useRef<HTMLDivElement>(null);
  const dimRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const breathRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const [fighting, setFighting] = useState(false);
  const [obiPose, setObiPose] = useState<Pose>('idle');
  const [vaderPose, setVaderPose] = useState<Pose>('idle');
  const [obiFacing, setObiFacing] = useState<'left' | 'right'>('right');
  const [vaderFacing, setVaderFacing] = useState<'left' | 'right'>('left');
  const [obiSaber, setObiSaber] = useState(false);
  const [vaderSaber, setVaderSaber] = useState(false);
  const [vaderCracked, setVaderCracked] = useState(false);
  const [obiSay, setObiSay] = useState<string | null>(null);
  const [vaderSay, setVaderSay] = useState<string | null>(null);
  const [refPose, setRefPose] = useState<Pose>('idle');
  const [refSay, setRefSay] = useState<string | null>(null);
  const [banner, setBanner] = useState<string | null>(null);
  const [rounds, setRounds] = useState(0);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from('.skill-bar', {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 1.1,
        ease: 'power3.out',
        stagger: 0.07,
        scrollTrigger: { trigger: section, start: 'top 55%', once: true },
      });
    }, section);
    return () => ctx.revert();
  }, []);

  // Posições iniciais (centro dos sprites em 25% / 75% da arena).
  useLayoutEffect(() => {
    const arena = arenaRef.current;
    const o = obiRef.current;
    const v = vaderRef.current;
    if (!arena || !o || !v) return;
    const place = () => {
      if (tlRef.current?.isActive()) return;
      const w = arena.clientWidth;
      gsap.set(o, { x: w * 0.25, xPercent: -50, y: 0, opacity: 1 });
      gsap.set(v, { x: w * 0.75, xPercent: -50, y: 0 });
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(arena);
    return () => ro.disconnect();
  }, []);

  const skipDuel = useCallback(() => {
    tlRef.current?.progress(1);
  }, []);

  const startDuel = useCallback(() => {
    const arena = arenaRef.current;
    const o = obiRef.current;
    const v = vaderRef.current;
    const rocks = rocksRef.current ? Array.from(rocksRef.current.children) : [];
    const sparks = sparksRef.current?.children;
    const banner = bannerRef.current;
    if (!arena || !o || !v || !banner || fighting) return;

    setFighting(true);
    const reduced = prefersReducedMotion();
    const w = arena.clientWidth;
    const home = { o: w * 0.25, v: w * 0.75 };
    const near = { o: w / 2 - 38, v: w / 2 + 38 };
    const xOf = (el: HTMLElement) => Number(gsap.getProperty(el, 'x'));

    const shake = (amp: number, reps: number) =>
      gsap.fromTo(arena, { x: -amp }, { x: amp, duration: 0.035, repeat: reps, yoyo: true, ease: 'none', onComplete: () => gsap.set(arena, { x: 0 }) });

    const burstSparks = () => {
      if (!sparks?.length) return;
      gsap.fromTo(
        sparks,
        { x: 0, y: 0, opacity: 1, scale: 1 },
        { x: () => gsap.utils.random(-46, 46), y: () => gsap.utils.random(-56, 26), opacity: 0, scale: 0.2, duration: 0.5, ease: 'power2.out', overwrite: true }
      );
      if (hitRef.current) gsap.fromTo(hitRef.current, { opacity: 1, scale: 0.4 }, { opacity: 0, scale: 1.8, duration: 0.35, ease: 'power2.out', overwrite: true });
    };

    const arcOf = (who: 'O' | 'V') => {
      const arc = who === 'O' ? obiArc.current : vaderArc.current;
      if (arc) gsap.fromTo(arc, { opacity: 1, rotate: -30 }, { opacity: 0, rotate: 25, duration: 0.32, ease: 'power2.out', overwrite: true });
    };

    const tl = gsap.timeline({
      onComplete: () => {
        setFighting(false);
        setRounds((n) => n + 1);
      },
    });
    tlRef.current = tl;

    if (reduced) {
      tl.call(() => {
        setObiSaber(true);
        setVaderSaber(true);
        setBanner('ADEUS, DARTH');
        setRefSay('o mestre perdeu essa.');
      })
        .to({}, { duration: 1.8 })
        .call(() => {
          setObiSaber(false);
          setVaderSaber(false);
          setBanner(null);
          setRefSay(null);
        });
      return;
    }

    // ── 0 · entrada ──────────────────────────────────────────────
    tl.set(o, { x: -70, opacity: 1 });
    tl.set(v, { x: w + 70 });
    tl.set(rocks, { x: 0, y: 0, rotate: 0, opacity: 1 });
    tl.call(() => {
      setVaderCracked(false);
      setObiPose('walk');
      setVaderPose('walk');
      setObiFacing('right');
      setVaderFacing('left');
      setObiSaber(false);
      setVaderSaber(false);
      setRefSay('o mestre contra o jedi.');
      if (breathRef.current) breathRef.current.className = 'breathe';
    });
    tl.to(o, { x: home.o + 20, duration: 1.3, ease: 'none' }, 0.1);
    tl.to(v, { x: home.v - 10, duration: 1.6, ease: 'none' }, 0.1);
    tl.call(() => setObiPose('idle'), undefined, 1.4);
    tl.call(() => setVaderPose('idle'), undefined, 1.7);

    // ── 1 · diálogo ─────────────────────────────────────────────
    tl.call(() => setVaderSay('Veio me destruir, Obi-Wan?'), undefined, 1.9);
    tl.call(
      () => {
        setVaderSay(null);
        setObiSay('Farei o que for preciso.');
        setObiSaber(true);
      },
      undefined,
      4.1
    );
    tl.call(
      () => {
        setObiSay(null);
        setVaderSay('Então você vai morrer.');
        setVaderSaber(true);
      },
      undefined,
      6.0
    );
    tl.call(() => setVaderSay(null), undefined, 7.6);

    // ── 2 · Vader ataca ─────────────────────────────────────────
    tl.add('r1', 7.7);
    tl.call(() => setRefSay(null), undefined, 'r1');
    tl.call(() => {
      setObiPose('walk');
      setVaderPose('walk');
    }, undefined, 'r1');
    tl.to(o, { x: near.o, duration: 0.6, ease: 'power1.inOut' }, 'r1');
    tl.to(v, { x: near.v, duration: 0.6, ease: 'power1.inOut' }, 'r1');
    tl.call(() => {
      setObiPose('idle');
      setVaderPose('idle');
    }, undefined, 'r1+=0.6');
    for (let i = 0; i < 3; i++) {
      const at = `r1+=${(0.75 + i * 0.5).toFixed(2)}`;
      tl.call(() => setVaderPose('swing'), undefined, at);
      tl.to(v, { x: '-=22', duration: 0.12, ease: 'power3.in' }, at);
      tl.call(() => {
        arcOf('V');
        burstSparks();
        shake(3, 5);
        setObiPose('salute');
      }, undefined, `${at}+=0.1`);
      tl.to(o, { x: '-=18', duration: 0.16, ease: 'power3.out' }, `${at}+=0.1`);
      tl.to(v, { x: '+=10', duration: 0.22, ease: 'power2.out' }, `${at}+=0.2`);
      tl.call(() => {
        setVaderPose('idle');
        setObiPose('idle');
      }, undefined, `${at}+=0.34`);
    }

    // ── 3 · a Força: rochas enterram Obi-Wan ────────────────────
    tl.add('bury', 'r1+=2.4');
    tl.call(() => {
      setVaderSaber(false);
      setVaderPose('swing');
      setObiPose('salute');
    }, undefined, 'bury');
    tl.to(v, { x: '+=30', duration: 0.4, ease: 'power2.out' }, 'bury');
    tl.to(rocks, { y: -70, rotate: () => gsap.utils.random(-40, 40), duration: 0.5, ease: 'power2.out', stagger: 0.04 }, 'bury+=0.1');
    tl.to(
      rocks,
      {
        x: (i: number, el: HTMLElement) => xOf(o) - (el.offsetLeft + el.offsetWidth / 2) + PILE_DX[i],
        y: (i: number) => PILE_DY[i],
        rotate: () => gsap.utils.random(-15, 15),
        duration: 0.5,
        ease: 'power3.in',
        stagger: 0.05,
      },
      'bury+=0.75'
    );
    tl.to(o, { opacity: 0, duration: 0.35 }, 'bury+=1.05');
    tl.call(() => {
      shake(4, 7);
      setRefSay('ele enterrou o jedi.');
    }, undefined, 'bury+=1.2');
    tl.call(() => {
      setVaderPose('walk');
      setVaderFacing('right');
      setVaderSaber(false);
    }, undefined, 'bury+=1.6');
    tl.to(v, { x: home.v + 20, duration: 0.9, ease: 'none' }, 'bury+=1.6');
    tl.call(() => setVaderPose('idle'), undefined, 'bury+=2.5');

    // ── 4 · Obi-Wan se levanta ──────────────────────────────────
    tl.add('rise', 'bury+=3.2');
    tl.call(() => {
      setRefSay('...ele lembrou de Luke e Leia.');
      if (forceRef.current) forceRef.current.style.left = `${xOf(o)}px`;
    }, undefined, 'rise');
    tl.fromTo(forceRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 }, 'rise');
    tl.to(rocks, { x: '+=2', duration: 0.05, repeat: 14, yoyo: true, ease: 'none' }, 'rise+=0.2');
    tl.to(
      rocks,
      {
        x: (i: number) => `+=${(i % 2 === 0 ? -1 : 1) * gsap.utils.random(90, 220)}`,
        y: () => -gsap.utils.random(90, 170),
        rotate: () => gsap.utils.random(-260, 260),
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.02,
      },
      'rise+=1.0'
    );
    tl.to(forceRef.current, { opacity: 0, duration: 0.4 }, 'rise+=1.1');
    tl.call(() => {
      setObiPose('salute');
      setObiSaber(true);
      shake(5, 7);
    }, undefined, 'rise+=1.0');
    tl.to(o, { opacity: 1, duration: 0.3 }, 'rise+=1.0');
    tl.call(() => {
      setVaderFacing('left');
      setVaderPose('idle');
      setVaderSaber(true);
      setRefSay(null);
    }, undefined, 'rise+=1.5');

    // ── 5 · Obi-Wan revida ──────────────────────────────────────
    tl.add('r2', 'rise+=1.9');
    tl.call(() => {
      setObiPose('walk');
      setVaderPose('walk');
    }, undefined, 'r2');
    tl.to(o, { x: near.o, duration: 0.55, ease: 'power1.inOut' }, 'r2');
    tl.to(v, { x: near.v, duration: 0.55, ease: 'power1.inOut' }, 'r2');
    tl.call(() => {
      setObiPose('idle');
      setVaderPose('idle');
    }, undefined, 'r2+=0.55');
    for (let i = 0; i < 3; i++) {
      const at = `r2+=${(0.7 + i * 0.45).toFixed(2)}`;
      tl.call(() => setObiPose('swing'), undefined, at);
      tl.to(o, { x: '+=22', duration: 0.11, ease: 'power3.in' }, at);
      tl.call(() => {
        arcOf('O');
        burstSparks();
        shake(3, 5);
        setVaderPose('salute');
      }, undefined, `${at}+=0.1`);
      tl.to(v, { x: '+=16', duration: 0.16, ease: 'power3.out' }, `${at}+=0.1`);
      tl.to(o, { x: '-=10', duration: 0.2, ease: 'power2.out' }, `${at}+=0.2`);
      tl.call(() => {
        setObiPose('idle');
        setVaderPose('idle');
      }, undefined, `${at}+=0.32`);
    }
    // empurrão da Força
    tl.add('push', 'r2+=2.2');
    tl.call(() => {
      setObiPose('salute');
      setObiSaber(false);
      setVaderPose('jump');
      shake(5, 8);
    }, undefined, 'push');
    tl.to(v, { x: '+=70', duration: 0.45, ease: 'power3.out' }, 'push');
    tl.fromTo(v, { y: 0 }, { y: -26, duration: 0.22, yoyo: true, repeat: 1, ease: 'power1.out' }, 'push');
    tl.call(() => {
      setVaderPose('idle');
      setObiSaber(true);
      setObiPose('idle');
    }, undefined, 'push+=0.5');

    // ── 6 · sabres travados e o golpe na máscara ────────────────
    tl.add('lock', 'push+=0.8');
    tl.call(() => {
      setObiPose('walk');
    }, undefined, 'lock');
    tl.to(o, { x: () => xOf(v) - 74, duration: 0.45, ease: 'power1.inOut' }, 'lock');
    tl.call(() => {
      setObiPose('swing');
      setVaderPose('swing');
      if (lockRef.current) lockRef.current.style.left = `${xOf(v) - 36}px`;
    }, undefined, 'lock+=0.45');
    tl.fromTo(lockRef.current, { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1.5, duration: 0.8, ease: 'power2.in' }, 'lock+=0.45');
    tl.to(dimRef.current, { opacity: 0.55, duration: 0.6, ease: 'power2.in' }, 'lock+=0.45');
    tl.to(arena, { x: 1.5, duration: 0.04, repeat: 18, yoyo: true, ease: 'none' }, 'lock+=0.45');
    tl.set(arena, { x: 0 });

    tl.add('crack', 'lock+=1.3');
    tl.call(() => {
      arcOf('O');
      burstSparks();
    }, undefined, 'crack');
    tl.fromTo(flashRef.current, { opacity: 0 }, { opacity: 0.95, duration: 0.06 }, 'crack');
    tl.to(flashRef.current, { opacity: 0, duration: 0.6, ease: 'power2.out' }, 'crack+=0.06');
    tl.to(lockRef.current, { opacity: 0, scale: 3, duration: 0.4, ease: 'power2.out' }, 'crack');
    tl.to(dimRef.current, { opacity: 0, duration: 0.6 }, 'crack');
    tl.call(() => {
      setVaderCracked(true);
      setVaderPose('kneel');
      setVaderSaber(false);
      setObiPose('idle');
      shake(6, 9);
      if (breathRef.current) breathRef.current.className = 'breathe-broken';
    }, undefined, 'crack+=0.05');
    tl.to(v, { x: '+=26', y: 8, duration: 0.4, ease: 'power3.out' }, 'crack+=0.05');
    tl.to(o, { x: '-=8', duration: 0.3, ease: 'power2.out' }, 'crack+=0.05');

    // ── 7 · despedida ───────────────────────────────────────────
    tl.call(() => setVaderSay('Você não matou Anakin. Eu matei.'), undefined, 'crack+=0.9');
    tl.call(() => {
      setVaderSay(null);
      setObiSay('Então meu amigo está mesmo morto.');
    }, undefined, 'crack+=3.3');
    tl.call(() => setObiSay('Adeus, Darth.'), undefined, 'crack+=5.6');
    tl.add('leave', 'crack+=7.1');
    tl.call(() => {
      setObiSay(null);
      setObiSaber(false);
      setObiFacing('left');
      setObiPose('walk');
      setBanner('ADEUS, DARTH');
      setRefPose('jump');
      setRefSay('o mestre perdeu essa.');
    }, undefined, 'leave');
    tl.fromTo(banner, { scale: 2.8, opacity: 0, rotate: 5 }, { scale: 1, opacity: 1, rotate: -3, duration: 0.45, ease: 'power4.out' }, 'leave');
    tl.to(o, { x: -70, duration: 1.4, ease: 'none' }, 'leave');
    tl.call(() => setRefPose('idle'), undefined, 'leave+=0.4');
    tl.to(banner, { opacity: 0, y: -16, duration: 0.4, ease: 'power2.in' }, 'leave+=2.6');
    tl.set(banner, { y: 0 });

    // ── 8 · reset ───────────────────────────────────────────────
    tl.add('reset', 'leave+=3.1');
    tl.call(() => {
      setBanner(null);
      setRefSay(null);
      setVaderCracked(false);
      setVaderPose('walk');
      setVaderFacing('left');
      setObiPose('walk');
      setObiFacing('right');
      if (breathRef.current) breathRef.current.className = 'breathe';
    }, undefined, 'reset');
    tl.to(v, { x: home.v, y: 0, duration: 0.8, ease: 'power1.inOut' }, 'reset');
    tl.to(o, { x: home.o, duration: 1.0, ease: 'none' }, 'reset');
    tl.to(rocks, { x: 0, y: 0, rotate: 0, opacity: 1, duration: 0.01 }, 'reset+=0.5');
    tl.call(() => {
      setVaderPose('idle');
      setObiPose('idle');
    }, undefined, 'reset+=1.0');
  }, [fighting]);

  return (
    <section ref={sectionRef} id="duelo" className="relative overflow-hidden bg-sith-void py-28 sm:py-36">
      {/* Céu de Mustafar fora da arena */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'linear-gradient(180deg, #050405 0%, #0a0608 50%, #1d0909 82%, #4a160f 100%)' }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] lava-flow"
        style={{
          backgroundImage: 'linear-gradient(90deg, #ff4a1a, #ffb347, #ff2e00, #ff8a3c, #ff4a1a)',
          boxShadow: '0 0 30px rgba(255,90,60,0.7), 0 -10px 40px rgba(255,90,60,0.25)',
        }}
        aria-hidden
      />
      {[0, 1].map((side) => (
        <div
          key={side}
          className={`pointer-events-none absolute bottom-0 top-16 hidden w-12 lg:block ${side === 0 ? 'left-10' : 'right-10'}`}
          style={{
            background: 'repeating-linear-gradient(90deg, #1a1316 0 6px, #0d0a0c 6px 9px, #221a1d 9px 12px)',
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.9), 0 0 40px rgba(0,0,0,0.6)',
          }}
          aria-hidden
        >
          <div className="absolute -left-2 -right-2 -top-3 h-4 bg-[#2a2023]" />
        </div>
      ))}

      <div ref={wrapRef} className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <div className="text-center">
          <p data-reveal className="eyebrow">
            competências
          </p>
          <h2 data-reveal className="mt-4 font-display text-5xl font-light tracking-tight text-sith-ink sm:text-6xl lg:text-7xl">
            Frontend <span className="text-sith-crimson">✕</span> Backend
          </h2>
          <p data-reveal className="mt-4 text-sm text-sith-muted sm:text-base">
            Obi-Wan contra Vader. Os dois lados da Força, frente a frente.
          </p>
        </div>

        {/* Placas */}
        <div data-reveal className="mt-14 grid grid-cols-2 gap-5 sm:gap-10 lg:gap-20">
          <Plaque glyph="</>" tone="crimson" />
          <Plaque glyph="{ }" tone="violet" />
        </div>

        {/* Arena */}
        <div data-reveal className="relative mt-6">
          {/* Juiz */}
          <div className="pointer-events-none absolute left-1/2 top-[-18px] z-30 -translate-x-1/2">
            <Mascot pose={refPose} facing="right" scale={3} say={refSay} bob />
          </div>

          <div
            ref={arenaRef}
            className="arena-night relative h-[250px] overflow-hidden border border-white/[0.06] sm:h-[270px]"
            style={{ boxShadow: 'inset 0 0 60px rgba(0,0,0,0.7), 0 30px 60px -30px rgba(0,0,0,0.9)' }}
          >
            {/* Lua e rochas ao fundo */}
            <div
              className="pointer-events-none absolute right-[12%] top-[14px] h-10 w-10 rounded-full"
              style={{ background: 'radial-gradient(circle at 40% 40%, #e8e6df, #b9b6ad 70%)', boxShadow: '0 0 30px rgba(232,230,223,0.35)' }}
              aria-hidden
            />
            {[
              { l: '2%', w: 90, h: 58 },
              { l: '18%', w: 60, h: 34 },
              { l: '70%', w: 70, h: 42 },
              { l: '88%', w: 110, h: 66 },
            ].map((r, i) => (
              <div
                key={i}
                className="pointer-events-none absolute bottom-[30px] rounded-t-[40%]"
                style={{ left: r.l, width: r.w, height: r.h, background: 'linear-gradient(180deg, #23262f, #15171f)', opacity: 0.9 }}
                aria-hidden
              />
            ))}
            <div className="arena-ground pointer-events-none absolute inset-x-0 bottom-0 h-[30px]" aria-hidden />
            <div className="pointer-events-none absolute inset-x-0 bottom-[30px] h-px bg-white/10" aria-hidden />

            {/* Respiração do Vader */}
            <div ref={vaderRef} className="absolute bottom-[30px] left-0 z-10">
              <div
                ref={breathRef}
                className="breathe pointer-events-none absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(227,36,43,0.32), transparent 65%)' }}
                aria-hidden
              />
              <SaberArc color={CRIMSON} flip innerRef={(el) => (vaderArc.current = el)} />
              <Mascot pose={vaderPose} facing={vaderFacing} scale={5} skinId={vaderCracked ? 'vaderCracked' : 'vader'} saberOn={vaderSaber} say={vaderSay} bob={!fighting} />
            </div>

            {/* Obi-Wan */}
            <div ref={obiRef} className="absolute bottom-[30px] left-0 z-10">
              <SaberArc color={BLUE} innerRef={(el) => (obiArc.current = el)} />
              <Mascot pose={obiPose} facing={obiFacing} scale={5} skinId="jedi" saberOn={obiSaber} say={obiSay} bob={!fighting} />
            </div>

            {/* Escurecimento */}
            <div ref={dimRef} className="pointer-events-none absolute inset-[-40px] z-[15] bg-sith-void opacity-0" aria-hidden />

            {/* Luz da Força sob as rochas */}
            <div
              ref={forceRef}
              className="force-glow pointer-events-none absolute bottom-[30px] left-1/2 z-[12] h-24 w-40 rounded-full opacity-0"
              style={{ background: `radial-gradient(ellipse, ${BLUE}99 0%, ${BLUE}33 40%, transparent 70%)`, filter: 'blur(4px)' }}
              aria-hidden
            />

            {/* Rochas */}
            <div ref={rocksRef} className="pointer-events-none absolute inset-x-0 bottom-[30px] z-20" aria-hidden>
              {ROCKS.map((r, i) => (
                <div key={i} className="absolute bottom-0" style={{ left: `${r.left}%` }}>
                  <Rock shape={r.shape} scale={r.scale} />
                </div>
              ))}
            </div>

            {/* Brilho do travamento e impacto */}
            <div
              ref={lockRef}
              className="pointer-events-none absolute bottom-[62px] left-1/2 z-[16] h-40 w-40 -translate-x-1/2 translate-y-1/2 rounded-full opacity-0"
              style={{
                background:
                  'radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(160,200,255,0.7) 22%, rgba(227,36,43,0.35) 42%, rgba(74,168,255,0.2) 60%, transparent 72%)',
                filter: 'blur(2px)',
              }}
              aria-hidden
            />
            <div
              ref={hitRef}
              className="pointer-events-none absolute bottom-[62px] left-1/2 z-[21] h-16 w-16 -translate-x-1/2 translate-y-1/2 rounded-full opacity-0"
              style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(180,210,255,0.6) 35%, transparent 70%)' }}
              aria-hidden
            />
            <div ref={sparksRef} className="pointer-events-none absolute bottom-[62px] left-1/2 z-[22]" aria-hidden>
              {Array.from({ length: SPARK_COUNT }).map((_, i) => (
                <span
                  key={i}
                  className="absolute h-[3px] w-[3px] opacity-0"
                  style={{
                    background: i % 3 === 0 ? '#fff1d6' : i % 3 === 1 ? '#ff6b5c' : '#a9d4ff',
                    boxShadow: `0 0 6px ${i % 3 === 2 ? BLUE : '#ff5a3c'}`,
                  }}
                />
              ))}
            </div>

            {/* Banner pixel */}
            <div className="pointer-events-none absolute inset-x-0 top-[70px] z-30 flex justify-center">
              <div ref={bannerRef} className="duel-banner opacity-0">
                {banner ?? ''}
              </div>
            </div>

            {/* Clarão */}
            <div ref={flashRef} className="pointer-events-none absolute inset-[-60px] z-[40] bg-white opacity-0" aria-hidden />

            {/* Nomes */}
            <div className="pointer-events-none absolute bottom-2 left-3 font-mono text-[9px] uppercase tracking-[0.3em] text-sith-faint">
              obi-wan · frontend
            </div>
            <div className="pointer-events-none absolute bottom-2 right-3 font-mono text-[9px] uppercase tracking-[0.3em] text-sith-faint">
              vader · backend
            </div>
          </div>

          <div className="mt-6 flex flex-col items-center gap-2">
            <div className="flex items-center gap-3">
              <button type="button" className="pixel-btn is-primary" onClick={startDuel} disabled={fighting} style={{ opacity: fighting ? 0.6 : 1 }}>
                {fighting ? 'duelando…' : rounds > 0 ? 'de novo' : 'duelar'}
              </button>
              {fighting && (
                <button type="button" className="pixel-btn !px-3" onClick={skipDuel}>
                  pular
                </button>
              )}
            </div>
            {rounds > 0 && (
              <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-sith-faint">
                {rounds} {rounds === 1 ? 'duelo' : 'duelos'} · o jedi sempre vai embora
              </span>
            )}
          </div>
        </div>

        {/* Placar */}
        <div className="mt-12 grid grid-cols-2 gap-5 sm:gap-10 lg:gap-20">
          <div data-reveal className="text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-sith-faint">{SKILLS.frontend.label}</p>
            <p className="font-display text-6xl font-light leading-none text-sith-ink sm:text-7xl">
              {SKILLS.frontend.score}
              <span className="text-3xl text-sith-crimson">%</span>
            </p>
            <p className="eyebrow mt-1">domínio</p>
            <SkillBars items={SKILLS.frontend.items} tone="crimson" />
          </div>
          <div data-reveal className="text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-sith-faint">{SKILLS.backend.label}</p>
            <p className="font-display text-6xl font-light leading-none text-sith-ink sm:text-7xl">
              {SKILLS.backend.score}
              <span className="text-3xl text-sith-violet">%</span>
            </p>
            <p className="eyebrow mt-1">domínio</p>
            <SkillBars items={SKILLS.backend.items} tone="violet" />
          </div>
        </div>

        {/* Arsenal */}
        <div data-reveal className="mt-20 text-center">
          <p className="eyebrow">arsenal</p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {SKILLS.arsenal.map((t) => (
              <span
                key={t}
                className="border border-sith-line bg-sith-void/40 px-3 py-1.5 font-mono text-[11px] tracking-[0.12em] text-sith-muted transition-colors hover:border-sith-gold/50 hover:text-sith-gold"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
