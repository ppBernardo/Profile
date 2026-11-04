import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGLTF, useProgress } from '@react-three/drei';
import Mascot from './Mascot';
import bustSith from '../../imgs/busto-sith.png';
import bustRebel from '../../imgs/busto-rebel.png';
import { prefersReducedMotion } from '../lib/scroll';
import { consumeAutoSide, useSide } from '../context/SideContext';
import { SIDES, type SideId } from '../data/sides';

interface Props {
  onComplete: () => void;
}

type Phase = 'boot' | 'choose' | 'tracking';

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

/** Baixa o caça do lado escolhido e resolve quando o loader do three.js terminar (ou após o limite). */
function preloadModel(url: string, onProgress: (pct: number) => void) {
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
    useGLTF.preload(url);
    // Já estava em cache: o loader nunca fica "active".
    window.setTimeout(() => {
      const s = useProgress.getState();
      if (!s.active && (s.total === 0 || s.loaded >= s.total)) finish();
    }, 1200);
    window.setTimeout(finish, 12000);
  });
}

const ORDER: SideId[] = ['sith', 'rebel'];
const KICKER: Record<SideId, string> = { sith: 'lado negro da força', rebel: 'lado da luz' };
const PORTRAIT: Record<SideId, string> = { sith: bustSith, rebel: bustRebel };

/**
 * Tela de carregamento: prepara fontes e retrato, pergunta de que lado da Força você está
 * e só então rastreia o caça daquele lado (TIE Fighter ou X-wing).
 */
export default function LoadingScreen({ onComplete }: Props) {
  const { choose, remembered } = useSide();
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);
  const done = useRef(false);
  const prog = useRef({ v: 0 });
  const [phase, setPhase] = useState<Phase>('boot');
  const [label, setLabel] = useState('preparando o salto');
  const [hover, setHover] = useState<SideId | null>(null);

  const render = useCallback(() => {
    if (barRef.current) barRef.current.style.width = `${prog.current.v}%`;
    if (pctRef.current) pctRef.current.textContent = String(Math.round(prog.current.v));
  }, []);

  const pick = useCallback(
    (s: SideId) => {
      if (done.current) return;
      const cfg = SIDES[s];
      choose(s);
      setPhase('tracking');
      setLabel(cfg.copy.tracking);
      Promise.all([
        preloadImage(PORTRAIT[s]),
        preloadModel(cfg.fighter.url, (p) => {
          const target = 42 + p * 0.5;
          if (target > prog.current.v) {
            gsap.to(prog.current, { v: target, duration: 0.35, ease: 'power1.out', onUpdate: render, overwrite: true });
          }
        }),
      ]).then(() => {
        if (done.current) return;
        done.current = true;
        const root = rootRef.current;
        gsap
          .timeline({ onComplete })
          .to(prog.current, { v: 100, duration: 0.35, ease: 'power1.out', onUpdate: render, overwrite: true })
          .to(root, {
            yPercent: -100,
            filter: 'blur(14px)',
            duration: prefersReducedMotion() ? 0.01 : 0.75,
            ease: 'power3.inOut',
          });
      });
    },
    [choose, onComplete, render]
  );

  // Fase 1: fontes; depois a escolha (ou o lado já decidido ao "trocar de lado"). O retrato vem com o lado.
  useEffect(() => {
    let cancelled = false;
    const creep = gsap.to(prog.current, { v: 42, duration: 1.4, ease: 'power2.out', onUpdate: render });
    const minWait = new Promise((r) => setTimeout(r, prefersReducedMotion() ? 200 : 1200));
    Promise.all([preloadFonts(), minWait]).then(() => {
      if (cancelled) return;
      creep.kill();
      const auto = consumeAutoSide();
      if (auto) pick(auto);
      else setPhase('choose');
    });
    return () => {
      cancelled = true;
      creep.kill();
    };
  }, [pick, render]);

  // Barra volta a existir na fase de rastreio: repinta o valor atual.
  useEffect(() => {
    render();
  }, [phase, render]);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-sith-void px-5"
      aria-label="Carregando"
    >
      {phase === 'choose' ? (
        <div className="w-full max-w-3xl text-center">
          <p className="eyebrow">antes de embarcar</p>
          <h2 className="mt-3 font-display text-4xl font-light tracking-tight text-sith-ink sm:text-5xl">
            Escolha o seu lado<span className="text-sith-crimson">.</span>
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-sith-muted">
            Cada lado muda as naves, as cores e quem narra a história. Dá para trocar depois, no menu.
          </p>

          <div className="mt-9 grid gap-4 sm:grid-cols-2">
            {ORDER.map((id) => {
              const s = SIDES[id];
              const remember = remembered === id && !hover;
              return (
                <button
                  key={id}
                  type="button"
                  className={`side-card p-5 text-left sm:p-6 ${remember ? 'is-remembered' : ''}`}
                  style={{ ['--c' as string]: s.accent }}
                  onMouseEnter={() => setHover(id)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(id)}
                  onBlur={() => setHover(null)}
                  onClick={() => pick(id)}
                  aria-label={`Entrar pelo ${s.name}`}
                >
                  <div className="flex items-end justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-mono text-[9px] uppercase tracking-[0.3em]" style={{ color: s.accent }}>
                        {KICKER[id]}
                      </p>
                      <p className="mt-2 font-display text-3xl font-medium tracking-tight text-sith-ink">{s.name}</p>
                      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-sith-faint">{s.tag}</p>
                    </div>
                    <div className="shrink-0 pb-1">
                      <Mascot pose="idle" facing="left" scale={4} skinId={s.skin} saberOn bob={false} />
                    </div>
                  </div>
                  <p className="mt-4 h-3 font-mono text-[9px] uppercase tracking-[0.25em] text-sith-faint">
                    {remembered === id ? 'última escolha' : ''}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <>
          <div className="relative">
            <Mascot pose="walk" scale={5} facing="right" bob={false} />
            <div className="absolute -bottom-2 left-1/2 h-px w-24 -translate-x-1/2 bg-gradient-to-r from-transparent via-sith-faint to-transparent" />
          </div>

          <div className="relative mt-9 h-[2px] w-56 overflow-hidden bg-sith-raised">
            <div ref={barRef} className="absolute inset-y-0 left-0 w-0 bg-sith-crimson shadow-glow" />
          </div>

          <p className="mt-4 font-pixel text-xl text-sith-muted">
            {label}{' '}
            <span className="text-sith-ink">
              <span ref={pctRef}>0</span>%
            </span>
          </p>
        </>
      )}
    </div>
  );
}
