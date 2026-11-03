import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGLTF, useProgress } from '@react-three/drei';
import Mascot from './Mascot';
import { TIE_URL } from './TieFighter';
import portrait from '../../imgs/busto-sith.png';
import { prefersReducedMotion } from '../lib/scroll';

interface Props {
  onComplete: () => void;
}

function preloadImage(src: string) {
  return new Promise<void>((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });
}

async function preloadFonts() {
  if (!('fonts' in document)) return;
  const loads = [
    '300 40px "Cormorant Garamond"',
    'italic 300 40px "Cormorant Garamond"',
    '500 20px "Cormorant Garamond"',
    '20px VT323',
    '400 12px "JetBrains Mono"',
    '400 14px Inter',
  ].map((f) => document.fonts.load(f).catch(() => undefined));
  await Promise.race([Promise.all(loads), new Promise((r) => setTimeout(r, 3500))]);
}

/** Baixa o TIE Fighter e resolve quando o loader do three.js terminar (ou após o limite). */
function preloadTie(onProgress: (pct: number) => void) {
  return new Promise<void>((resolve) => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      unsub();
      resolve();
    };
    const unsub = useProgress.subscribe((s) => {
      if (s.total > 0) onProgress(s.progress);
      if (!s.active && s.total > 0 && s.loaded >= s.total) finish();
    });
    useGLTF.preload(TIE_URL);
    // Já estava em cache: o loader nunca fica "active".
    window.setTimeout(() => {
      const s = useProgress.getState();
      if (!s.active && (s.total === 0 || s.loaded >= s.total)) finish();
    }, 1200);
    window.setTimeout(finish, 12000);
  });
}

export default function LoadingScreen({ onComplete }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const done = useRef(false);

  useEffect(() => {
    const bar = barRef.current;
    const pct = pctRef.current;
    const root = rootRef.current;
    if (!bar || !pct || !root) return;

    const prog = { v: 0 };
    const render = () => {
      bar.style.width = `${prog.v}%`;
      pct.textContent = String(Math.round(prog.v));
    };

    // Primeira metade: fontes e retrato; segunda metade: o TIE Fighter.
    const creep = gsap.to(prog, { v: 42, duration: 1.4, ease: 'power2.out', onUpdate: render });
    const minWait = new Promise((r) => setTimeout(r, prefersReducedMotion() ? 200 : 1400));
    const tieDone = preloadTie((p) => {
      const target = 42 + p * 0.5;
      if (target > prog.v) {
        creep.kill();
        gsap.to(prog, { v: target, duration: 0.35, ease: 'power1.out', onUpdate: render, overwrite: true });
      }
      if (labelRef.current) labelRef.current.textContent = 'rastreando o TIE Fighter';
    });

    Promise.all([preloadFonts(), preloadImage(portrait), tieDone, minWait]).then(() => {
      if (done.current) return;
      done.current = true;
      creep.kill();
      gsap
        .timeline({ onComplete })
        .to(prog, { v: 100, duration: 0.35, ease: 'power1.out', onUpdate: render, overwrite: true })
        .to(root, {
          yPercent: -100,
          filter: 'blur(14px)',
          duration: prefersReducedMotion() ? 0.01 : 0.75,
          ease: 'power3.inOut',
        });
    });

    return () => {
      creep.kill();
    };
  }, [onComplete]);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-sith-void"
      aria-label="Carregando"
    >
      <div className="relative">
        <Mascot pose="walk" scale={5} facing="right" bob={false} />
        <div className="absolute -bottom-2 left-1/2 h-px w-24 -translate-x-1/2 bg-gradient-to-r from-transparent via-sith-faint to-transparent" />
      </div>

      <div className="relative mt-9 h-[2px] w-56 overflow-hidden bg-sith-raised">
        <div ref={barRef} className="absolute inset-y-0 left-0 w-0 bg-sith-crimson shadow-glow" />
      </div>

      <p className="mt-4 font-pixel text-xl text-sith-muted">
        <span ref={labelRef}>carregando o lado sombrio</span>{' '}
        <span className="text-sith-ink">
          <span ref={pctRef}>0</span>%
        </span>
      </p>
    </div>
  );
}
