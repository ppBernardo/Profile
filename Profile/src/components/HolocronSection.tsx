import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ArrowLeft, ArrowRight, ArrowUpRight, Lock, X } from 'lucide-react';
import Holocron from './Holocron';
import InventoryModal from './InventoryModal';
import Mascot, { type Pose } from './Mascot';
import { useSkin } from '../context/SkinContext';
import { useSide } from '../context/SideContext';
import { useWhipIn } from '../hooks/useWhipIn';
import { CRYSTALS_PER_PROJECT, PROJECTS } from '../data/profile';
import { SKINS } from '../lib/sprites';
import { prefersReducedMotion } from '../lib/scroll';

/** Cristal kyber: vermelho sangrado (Sith) ou azul (Jedi). */
const CRYSTAL = {
  crimson: { main: '#ff2a2a', light: '#ffb3b3', dark: '#9a1016' },
  azure: { main: '#4aa8ff', light: '#cfe6ff', dark: '#1b4f8a' },
};
type Hue = keyof typeof CRYSTAL;

function CrystalIcon({ size = 14, hue }: { size?: number; hue: Hue }) {
  const c = CRYSTAL[hue];
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden style={{ filter: `drop-shadow(0 0 4px ${c.main})` }}>
      <polygon points="8,0 16,8 8,16 0,8" fill={c.main} />
      <polygon points="8,2 13,8 8,8" fill={c.light} />
      <polygon points="8,8 8,14 3,8" fill={c.dark} />
    </svg>
  );
}

const spawnSvg = (hue: Hue) => {
  const c = CRYSTAL[hue];
  return `<svg width="18" height="18" viewBox="0 0 16 16" style="filter:drop-shadow(0 0 5px ${c.main})"><polygon points="8,0 16,8 8,16 0,8" fill="${c.main}"/><polygon points="8,2 13,8 8,8" fill="${c.light}"/><polygon points="8,8 8,14 3,8" fill="${c.dark}"/></svg>`;
};

export default function HolocronSection() {
  const { collected, collect, crystals, totalCrystals, isUnlocked, unlockables } = useSkin();
  const { config } = useSide();
  const hue: Hue = config.id === 'rebel' ? 'azure' : 'crimson';
  const wrapRef = useWhipIn<HTMLDivElement>();
  const stageRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const fxRef = useRef<HTMLDivElement>(null);

  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [inventory, setInventory] = useState(false);
  const [pose, setPose] = useState<Pose>('idle');
  const [say, setSay] = useState<string | null>(null);
  const busy = useRef(false);
  const unlockedBefore = useRef<Set<string>>(new Set(unlockables.filter((u) => isUnlocked(u.id)).map((u) => u.id)));

  const project = PROJECTS[index];
  const n = PROJECTS.length;

  const sayFor = useCallback((text: string, ms = 2600) => {
    setSay(text);
    window.setTimeout(() => setSay((s) => (s === text ? null : s)), ms);
  }, []);

  // Avisa quando uma patente nova ficou disponível.
  useEffect(() => {
    for (const u of unlockables) {
      if (isUnlocked(u.id) && !unlockedBefore.current.has(u.id)) {
        unlockedBefore.current.add(u.id);
        if (u.threshold > 0) sayFor(`${SKINS[u.id].name.toLowerCase()} liberado. abre o inventário.`, 3600);
      }
    }
  }, [crystals, isUnlocked, sayFor, unlockables]);

  const spawnCrystals = useCallback(
    (projectId: string) => {
      const fx = fxRef.current;
      const from = activeRef.current;
      const to = counterRef.current;
      if (!fx || !from || !to) {
        collect(projectId);
        return;
      }
      const fr = from.getBoundingClientRect();
      const tr = to.getBoundingClientRect();
      const sx = fr.left + fr.width / 2;
      const sy = fr.top + fr.height * 0.42;
      const ex = tr.left + tr.width * 0.2;
      const ey = tr.top + tr.height / 2;
      const reduced = prefersReducedMotion();

      let landed = 0;
      for (let i = 0; i < CRYSTALS_PER_PROJECT; i++) {
        const el = document.createElement('div');
        el.className = 'absolute';
        el.style.left = `${sx}px`;
        el.style.top = `${sy}px`;
        el.innerHTML = `<div class="crystal-inner">${spawnSvg(hue)}</div>`;
        fx.appendChild(el);
        const inner = el.firstElementChild as HTMLElement;
        const spread = (i - 1) * 36;

        gsap
          .timeline({
            delay: reduced ? 0 : i * 0.13,
            onComplete: () => {
              el.remove();
              landed += 1;
              if (landed === CRYSTALS_PER_PROJECT) {
                collect(projectId);
                gsap.fromTo(to, { scale: 1.35 }, { scale: 1, duration: 0.5, ease: 'back.out(3)' });
              }
            },
          })
          .fromTo(
            el,
            { x: 0, y: 0, scale: 0.4, opacity: 0 },
            { x: spread, y: -40, scale: 1, opacity: 1, duration: reduced ? 0.01 : 0.32, ease: 'back.out(2)' }
          )
          .to(el, { x: ex - sx, y: ey - sy, duration: reduced ? 0.01 : 0.95, ease: 'power2.inOut' })
          .fromTo(inner, { y: 0 }, { y: -70, duration: 0.47, yoyo: true, repeat: 1, ease: 'power1.out' }, '<');
      }
    },
    [collect, hue]
  );

  const openActive = useCallback(() => {
    if (busy.current || open) return;
    busy.current = true;
    setPose('swing');
    const reduced = prefersReducedMotion();
    window.setTimeout(
      () => {
        setOpen(true);
        setPose('idle');
        if (!collected.has(project.id)) {
          window.setTimeout(() => spawnCrystals(project.id), 350);
          sayFor('cristais!');
        }
        busy.current = false;
      },
      reduced ? 0 : 320
    );
  }, [open, project.id, collected, spawnCrystals, sayFor]);

  const close = useCallback(() => setOpen(false), []);

  const go = useCallback(
    (dir: 1 | -1) => {
      setOpen(false);
      setIndex((i) => (i + dir + n) % n);
      setPose('jump');
      window.setTimeout(() => setPose('idle'), 320);
    },
    [n]
  );

  // Cartão sobe quando o holocron abre.
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    if (open) {
      gsap.fromTo(
        card,
        { opacity: 0, y: 36, scale: 0.96, filter: 'blur(8px)' },
        { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.6, ease: 'power3.out', delay: 0.18 }
      );
    }
  }, [open, index]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, close]);

  return (
    <section id="holocrons" className="relative overflow-hidden bg-sith-void py-28 sm:py-36">
      <div className="pointer-events-none absolute inset-x-0 top-0 hairline" />

      {/* Colunas laterais */}
      {[0, 1].map((side) => (
        <div
          key={side}
          className={`pointer-events-none absolute bottom-0 top-0 hidden w-9 md:block ${side === 0 ? 'left-6 lg:left-12' : 'right-6 lg:right-12'}`}
          style={{
            background:
              'repeating-linear-gradient(90deg, var(--raised) 0 5px, var(--void) 5px 7px, var(--surface) 7px 9px)',
            boxShadow: 'inset 0 0 14px rgba(0,0,0,0.35)',
          }}
          aria-hidden
        >
          <div className="absolute -left-2 -right-2 top-14 h-3 bg-sith-raised" />
          <div className="absolute -left-2 -right-2 bottom-0 h-3 bg-sith-raised" />
        </div>
      ))}

      <div ref={wrapRef} className="relative mx-auto max-w-5xl px-5 sm:px-8">
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
          <div>
            <p data-reveal className="eyebrow">
              holocrons recuperados
            </p>
            <h2 data-reveal className="mt-4 font-display text-5xl font-light tracking-tight text-sith-ink sm:text-6xl lg:text-7xl">
              Projetos<span className="text-sith-crimson">.</span>
            </h2>
            <p data-reveal className="mt-4 max-w-md text-sm text-sith-muted sm:text-base">
              Cada holocron guarda uma entrega. Abra, colete os cristais e suba de patente.
            </p>
          </div>

          <div data-reveal className="flex items-center gap-3">
            <div ref={counterRef} className="pixel-chip flex items-center gap-2">
              <CrystalIcon hue={hue} />
              <span>
                {crystals}/{totalCrystals}
              </span>
            </div>
            <button type="button" className="pixel-btn is-gold" onClick={() => setInventory(true)}>
              inventário
            </button>
          </div>
        </div>

        {/* Palco dos holocrons */}
        <div ref={stageRef} data-reveal className="relative mt-10 h-[560px] sm:mt-14 sm:h-[520px]">
          {/* Luz do chão */}
          <div
            className="pointer-events-none absolute bottom-[14%] left-1/2 h-32 w-[70%] -translate-x-1/2"
            style={{ background: 'radial-gradient(ellipse at center, rgb(var(--c-crimson) / 0.2), transparent 70%)' }}
            aria-hidden
          />

          {PROJECTS.map((p, i) => {
            let off = (((i - index) % n) + n) % n;
            if (off > n / 2) off -= n;
            const isActive = off === 0;
            const visible = Math.abs(off) <= 1;
            return (
              <div
                key={p.id}
                ref={isActive ? activeRef : undefined}
                className="absolute left-1/2 top-[58%]"
                style={{
                  transform: `translate(calc(-50% + ${off * 30}vw), -50%) scale(${isActive ? 1 : 0.62})`,
                  opacity: visible ? (isActive ? 1 : 0.5) : 0,
                  transition: 'transform 0.65s cubic-bezier(0.22,1,0.36,1), opacity 0.5s ease',
                  pointerEvents: visible ? 'auto' : 'none',
                  zIndex: isActive ? 10 : 5,
                }}
              >
                <button
                  type="button"
                  onClick={() => (isActive ? (open ? close() : openActive()) : go(off > 0 ? 1 : -1))}
                  className="block"
                  aria-label={isActive ? `Abrir holocron ${p.numeral}: ${p.title}` : `Ir para ${p.title}`}
                >
                  <Holocron open={isActive && open} size={isActive ? 230 : 180} numeral={p.numeral} dim={!isActive} hue={hue} />
                </button>
              </div>
            );
          })}

          {/* Mascote ao lado do holocron ativo */}
          <div className="pointer-events-none absolute left-1/2 top-[58%] z-20 -translate-x-[calc(50%+118px)] translate-y-[52px] sm:-translate-x-[calc(50%+170px)] sm:translate-y-[48px]">
            <Mascot pose={pose} facing="right" scale={4} say={say} />
          </div>

          {/* Navegação */}
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-5">
            <button type="button" onClick={() => go(-1)} className="p-2 text-sith-muted transition-colors hover:text-sith-ink" aria-label="Holocron anterior">
              <ArrowLeft size={18} />
            </button>
            <div className="text-center">
              <p className="eyebrow">holocron {project.numeral}</p>
              <p className="font-display text-2xl text-sith-ink sm:text-3xl">{project.title}</p>
            </div>
            <button type="button" onClick={() => go(1)} className="p-2 text-sith-muted transition-colors hover:text-sith-ink" aria-label="Próximo holocron">
              <ArrowRight size={18} />
            </button>
          </div>

          {!open && (
            <div className="pointer-events-none absolute left-1/2 top-[6%] -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.3em] text-sith-faint sm:top-[10%]">
              toque no holocron para abrir
            </div>
          )}

          {/* Cartão do projeto */}
          {open && (
            <div
              ref={cardRef}
              className="panel absolute left-1/2 top-0 z-30 w-[min(94vw,680px)] -translate-x-1/2 p-5 sm:p-6"
              role="dialog"
              aria-label={project.title}
            >
              <button
                type="button"
                onClick={close}
                className="absolute right-3 top-3 p-1 text-sith-muted hover:text-sith-ink"
                aria-label="Fechar"
              >
                <X size={16} />
              </button>
              <div className="grid gap-5 sm:grid-cols-[200px_1fr] sm:gap-7">
                <div className="flex aspect-[4/3] flex-col justify-between border border-sith-line bg-sith-bg p-4 sm:aspect-auto">
                  <span className="font-mono text-[9px] uppercase leading-relaxed tracking-[0.26em] text-sith-faint">
                    holocron {project.numeral}
                    <br />
                    {project.kind}
                  </span>
                  <span className="font-display text-[26px] font-medium leading-[1.05] tracking-tight text-sith-ink">
                    {project.title}
                    <span className="text-sith-crimson">.</span>
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="font-display text-2xl leading-tight text-sith-ink sm:text-[26px]">{project.headline}</p>
                  <p className="mt-3 text-[13px] leading-relaxed text-sith-muted">{project.description}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {project.stack.map((s) => (
                      <span key={s} className="border border-sith-line px-2 py-0.5 font-mono text-[10px] tracking-[0.1em] text-sith-muted">
                        {s}
                      </span>
                    ))}
                  </div>
                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-sith-line pt-4">
                    <span className="font-mono text-[9px] uppercase tracking-[0.26em] text-sith-faint">{project.stack.length} módulos</span>
                    {project.privateRepo ? (
                      <span className="inline-flex items-center gap-1.5 border border-sith-crimson/40 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-sith-crimson">
                        <Lock size={11} /> repositório privado
                      </span>
                    ) : (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pixel-btn is-primary inline-flex items-center gap-1.5 !py-2"
                      >
                        abrir canal <ArrowUpRight size={14} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div ref={fxRef} className="pointer-events-none fixed inset-0 z-[65]" aria-hidden />
      <InventoryModal open={inventory} onClose={() => setInventory(false)} />
    </section>
  );
}
