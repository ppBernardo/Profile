import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Mascot, { type Pose } from './Mascot';
import { useWhipIn } from '../hooks/useWhipIn';
import { useLang } from '../i18n/LangContext';
import { PROFILE } from '../data/profile';
import { prefersReducedMotion } from '../lib/scroll';

gsap.registerPlugin(ScrollTrigger);

const YEAR = new Date().getFullYear();
const WEEKS = 53;

interface Day {
  date: string;
  count: number;
  level: number;
}

interface ApiResponse {
  total: Record<string, number>;
  contributions: Day[];
}

/** Padrão determinístico usado quando a API do GitHub não responde. */
function fallbackDays(): { days: Day[]; total: number } {
  let s = 2026;
  const rnd = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  const start = new Date(YEAR, 0, 1);
  const days: Day[] = [];
  let total = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const weekend = d.getDay() === 0 || d.getDay() === 6;
    const r = rnd() * (weekend ? 0.55 : 1);
    const level = r < 0.42 ? 0 : r < 0.64 ? 1 : r < 0.82 ? 2 : r < 0.94 ? 3 : 4;
    const count = level === 0 ? 0 : level * 3 + Math.floor(rnd() * 5);
    total += count;
    days.push({ date: d.toISOString().slice(0, 10), count, level });
  }
  return { days, total };
}

function toGrid(days: Day[]): (Day | null)[] {
  const first = new Date(`${YEAR}-01-01T00:00:00`);
  const offset = first.getDay();
  const cells: (Day | null)[] = Array.from({ length: WEEKS * 7 }, () => null);
  days.forEach((d, i) => {
    const idx = offset + i;
    if (idx < cells.length) cells[idx] = d;
  });
  return cells;
}

export default function CommitsSection() {
  const { t, locale } = useLang();
  const fmt = useMemo(() => new Intl.NumberFormat(locale), [locale]);
  const [days, setDays] = useState<Day[] | null>(null);
  const [total, setTotal] = useState<number | null>(null);
  const [offline, setOffline] = useState(false);
  const [played, setPlayed] = useState(false);
  const [workersPose, setWorkersPose] = useState<Pose>('idle');
  const [bossSay, setBossSay] = useState<string | null>(null);
  const [narrow, setNarrow] = useState(false);

  const boardRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const wrapRef = useWhipIn<HTMLDivElement>();

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const apply = () => setNarrow(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    const ctrl = new AbortController();
    const timeout = window.setTimeout(() => ctrl.abort(), 6000);
    fetch(`https://github-contributions-api.jogruber.de/v4/${PROFILE.githubUser}?y=${YEAR}`, {
      signal: ctrl.signal,
    })
      .then((r) => (r.ok ? (r.json() as Promise<ApiResponse>) : Promise.reject(new Error(String(r.status)))))
      .then((json) => {
        const list = (json.contributions ?? []).filter((d) => d.date.startsWith(String(YEAR)));
        if (!list.length) throw new Error('vazio');
        setDays(list);
        setTotal(json.total?.[String(YEAR)] ?? list.reduce((a, d) => a + d.count, 0));
        setOffline(false);
      })
      .catch((err: unknown) => {
        // Abort do cleanup (StrictMode remonta o efeito) não é falha de rede.
        if (err instanceof DOMException && err.name === 'AbortError') return;
        const fb = fallbackDays();
        setDays(fb.days);
        setTotal(fb.total);
        setOffline(true);
      })
      .finally(() => window.clearTimeout(timeout));
    return () => {
      window.clearTimeout(timeout);
      ctrl.abort();
    };
  }, []);

  const cells = useMemo(() => (days ? toGrid(days) : []), [days]);
  const visibleCells = useMemo(() => {
    if (!narrow) return cells;
    const weeks = 26;
    return cells.slice(cells.length - weeks * 7);
  }, [cells, narrow]);

  // Acende o painel quando entra em cena (depois que os dados chegam).
  useLayoutEffect(() => {
    const board = boardRef.current;
    const num = numberRef.current;
    if (!board || !num || !days || total === null || played) return;

    const cellEls = board.querySelectorAll<HTMLElement>('.cell');
    const reduced = prefersReducedMotion();
    gsap.set(cellEls, { opacity: reduced ? 1 : 0, scale: reduced ? 1 : 0.4 });

    const st = ScrollTrigger.create({
      trigger: board,
      start: 'top 78%',
      once: true,
      onEnter: () => {
        setPlayed(true);
        setBossSay(t('commits.boss'));
        setWorkersPose('hammer');
        const counter = { v: 0 };
        const tl = gsap.timeline({
          onComplete: () => {
            setWorkersPose('idle');
            setBossSay(t('commits.total', { n: fmt.format(total) }));
            window.setTimeout(() => setBossSay(null), 3200);
          },
        });
        tl.to(cellEls, {
          opacity: 1,
          scale: 1,
          duration: 0.45,
          ease: 'back.out(2.2)',
          stagger: { each: reduced ? 0 : 0.0032 },
        });
        tl.to(
          counter,
          {
            v: total,
            duration: reduced ? 0.01 : 1.9,
            ease: 'power2.out',
            onUpdate: () => {
              num.textContent = fmt.format(Math.round(counter.v));
            },
          },
          0.1
        );
      },
    });

    return () => st.kill();
  }, [days, total, played, fmt, t]);

  return (
    <section id="commits" className="relative overflow-hidden bg-sith-void py-28 sm:py-36">
      <div className="pointer-events-none absolute inset-x-0 top-0 hairline" />

      <div ref={wrapRef} className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <div className="text-center">
          <p data-reveal className="eyebrow">
            {t('commits.eyebrow', { year: YEAR })}
          </p>
          <h2 data-reveal className="mt-4 font-display text-5xl font-light tracking-tight text-sith-ink sm:text-6xl lg:text-7xl">
            {t('commits.title')}<span className="text-sith-crimson">.</span>
          </h2>
          <p data-reveal className="mt-4 text-sm text-sith-muted sm:text-base">
            {t('commits.sub', { year: YEAR })}
          </p>
        </div>

        {/* Console imperial */}
        <div data-reveal className="relative mt-20 sm:mt-24">
          {/* Operários */}
          <div className="pointer-events-none absolute inset-x-0 -top-[58px] hidden md:block" aria-hidden>
            {[14, 44, 74].map((x, i) => (
              <div key={x} className="absolute bottom-0" style={{ left: `${x}%` }}>
                <Mascot pose={workersPose} facing="right" scale={3.5} bob={false} skinId={i === 1 ? 'lorde' : undefined} />
                {workersPose === 'hammer' && (
                  <>
                    <span className="spark" style={{ left: 44, top: 30, ['--sx' as string]: '10px', ['--sy' as string]: '-16px' }} />
                    <span className="spark" style={{ left: 48, top: 32, animationDelay: '0.18s', ['--sx' as string]: '16px', ['--sy' as string]: '-6px' }} />
                    <span className="spark" style={{ left: 42, top: 34, animationDelay: '0.33s', ['--sx' as string]: '6px', ['--sy' as string]: '-20px' }} />
                  </>
                )}
              </div>
            ))}
          </div>
          <div className="absolute -top-[64px] right-[4%] z-10 md:-top-[72px]">
            <Mascot pose="idle" facing="left" scale={4} say={bossSay} />
          </div>

          <div ref={boardRef} className="console-frame p-4 sm:p-6">
            <div className="rivet left-2.5 top-2.5" />
            <div className="rivet right-2.5 top-2.5" />
            <div className="rivet bottom-2.5 left-2.5" />
            <div className="rivet bottom-2.5 right-2.5" />

            <div className="relative bg-sith-bg p-3 sm:p-4" style={{ boxShadow: 'inset 0 0 30px rgb(var(--c-void) / 0.9)' }}>
              <div
                className="pointer-events-none absolute inset-0 opacity-50"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(0deg, transparent 0 2px, rgba(255,255,255,0.025) 2px 3px)',
                }}
              />
              {days ? (
                <div
                  className="grid gap-[2px] sm:gap-[3px]"
                  style={{
                    gridTemplateColumns: `repeat(${narrow ? 26 : WEEKS}, minmax(0, 1fr))`,
                    gridTemplateRows: 'repeat(7, minmax(0, 1fr))',
                    gridAutoFlow: 'column',
                  }}
                >
                  {visibleCells.map((d, i) => (
                    <div
                      key={i}
                      className="cell"
                      data-level={d ? d.level : 0}
                      style={d ? undefined : { opacity: 0.25 }}
                      title={d ? t('commits.day', { date: d.date, n: d.count }) : undefined}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex h-[112px] items-center justify-center font-mono text-[10px] uppercase tracking-[0.3em] text-sith-faint">
                  {t('commits.syncing')}
                </div>
              )}
            </div>

            <div className="mt-3 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.26em] text-sith-faint">
              <span>{narrow ? t('commits.last26') : t('commits.range', { year: YEAR })}</span>
              <span className="flex items-center gap-2">
                {[0, 1, 2, 3, 4].map((l) => (
                  <span key={l} className="cell !w-2.5" data-level={l} />
                ))}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-14 text-center">
          <p className="font-display text-[clamp(64px,12vw,128px)] font-light leading-none tracking-tight text-sith-ink">
            <span ref={numberRef}>0</span>
          </p>
          <p className="mt-2 eyebrow">
            {t('commits.contribs', { year: YEAR })}
            {offline && t('commits.offline')}
          </p>
        </div>
      </div>
    </section>
  );
}
