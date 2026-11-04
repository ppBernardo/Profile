import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ArrowUpRight, Copy } from 'lucide-react';
import Mascot, { type Pose } from './Mascot';
import PodRacer, { type PodVariant } from './PodRacer';
import PodWreck from './PodWreck';
import { TATOOINE_GROUND } from './TatooineEntry';
import { useWhipIn } from '../hooks/useWhipIn';
import { useSide } from '../context/SideContext';
import { useLang } from '../i18n/LangContext';
import { CONTACTS, type ContactChannel } from '../data/profile';
import { prefersReducedMotion } from '../lib/scroll';

const ADOBE = '#e6cb96';
const ADOBE2 = '#d2b176';
const ADOBE3 = '#b28c54';
const DEEP = '#7d5c33';
const EDGE = '#5a3f22';

/** Casas de Tatooine: domo dos Lars, fazenda de umidade com vaporador, cantina e torre de Mos Espa. */
function Homestead({ variant, active, glyph }: { variant: ContactChannel['variant']; active: boolean; glyph: string }) {
  const door = active ? '#ffb14a' : '#2b1c12';
  const doorStyle = { transition: 'fill 0.35s ease, filter 0.35s ease', filter: active ? 'drop-shadow(0 0 10px #ffb14a)' : 'none' };
  const glyphColor = active ? '#e3242b' : '#6b4a26';
  const win = { fill: door, opacity: active ? 0.9 : 0.55, style: doorStyle };

  return (
    <svg viewBox="0 0 160 150" className="block w-full" aria-hidden>
      <ellipse cx="80" cy="134" rx="72" ry="5" fill="rgba(70,45,20,0.22)" />

      {variant === 'homestead' && (
        <>
          {/* Vaporador ao lado */}
          <rect x="13" y="68" width="6" height="64" fill={ADOBE3} stroke={EDGE} />
          {[74, 86, 98].map((y) => (
            <rect key={y} x="10" y={y} width="12" height="3" fill={DEEP} />
          ))}
          <rect x="11" y="64" width="10" height="5" fill={DEEP} />
          {/* Domo principal e anexo */}
          <path d="M24 132 A56 46 0 0 1 136 132 Z" fill={ADOBE} stroke={EDGE} />
          <path d="M42 132 A38 30 0 0 1 118 132" fill="none" stroke={ADOBE3} strokeWidth="1.2" opacity="0.6" />
          <path d="M104 132 A26 22 0 0 1 156 132 Z" fill={ADOBE2} stroke={EDGE} />
          <rect x="130" y="112" width="8" height="8" rx="4" {...win} />
          {/* Entrada */}
          <path d="M66 132 V117 A14 14 0 0 1 94 117 V132 Z" fill={door} style={doorStyle} />
          <text x="80" y="104" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="11" fill={glyphColor}>
            {glyph}
          </text>
        </>
      )}

      {variant === 'vaporator' && (
        <>
          {/* Casa cúbica com teto em domo */}
          <rect x="44" y="92" width="76" height="40" fill={ADOBE} stroke={EDGE} />
          <path d="M44 92 A38 26 0 0 1 120 92 Z" fill={ADOBE2} stroke={EDGE} />
          <rect x="56" y="104" width="10" height="10" rx="5" {...win} />
          <rect x="98" y="104" width="10" height="10" rx="5" {...win} />
          <path d="M73 132 V117 A9 9 0 0 1 91 117 V132 Z" fill={door} style={doorStyle} />
          {/* Vaporador de umidade */}
          <rect x="130" y="38" width="7" height="94" fill={ADOBE3} stroke={EDGE} />
          {[46, 58, 70].map((y) => (
            <rect key={y} x="126" y={y} width="15" height="3" fill={DEEP} />
          ))}
          <rect x="128" y="33" width="11" height="6" fill={DEEP} />
          <rect x="120" y="122" width="10" height="3" fill={DEEP} />
          <text x="82" y="84" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="11" fill={glyphColor}>
            {glyph}
          </text>
        </>
      )}

      {variant === 'cantina' && (
        <>
          {/* Corpo largo arredondado, domo central e antena */}
          <rect x="14" y="96" width="132" height="36" rx="6" fill={ADOBE} stroke={EDGE} />
          <rect x="22" y="90" width="34" height="7" rx="3" fill={ADOBE2} stroke={EDGE} />
          <rect x="104" y="90" width="34" height="7" rx="3" fill={ADOBE2} stroke={EDGE} />
          <path d="M56 96 A24 20 0 0 1 104 96 Z" fill={ADOBE2} stroke={EDGE} />
          <line x1="134" y1="90" x2="134" y2="70" stroke={DEEP} strokeWidth="1.5" />
          <circle cx="134" cy="68" r="3" fill={ADOBE3} stroke={EDGE} />
          {/* Toldo e janelas */}
          <rect x="60" y="107" width="40" height="5" fill="#8a2a2a" opacity="0.85" />
          <rect x="28" y="106" width="12" height="12" rx="6" {...win} />
          <rect x="120" y="106" width="12" height="12" rx="6" {...win} />
          <path d="M70 132 V113 A10 10 0 0 1 90 113 V132 Z" fill={door} style={doorStyle} />
          <text x="80" y="85" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="11" fill={glyphColor}>
            {glyph}
          </text>
        </>
      )}

      {variant === 'tower' && (
        <>
          {/* Torre de Mos Espa com bandeira */}
          <rect x="46" y="40" width="68" height="92" fill={ADOBE} stroke={EDGE} />
          <rect x="40" y="34" width="80" height="8" rx="4" fill={ADOBE2} stroke={EDGE} />
          <rect x="46" y="86" width="68" height="4" fill={ADOBE3} />
          <rect x="52" y="74" width="56" height="3" fill={DEEP} />
          <rect x="58" y="52" width="12" height="14" rx="6" {...win} />
          <rect x="90" y="52" width="12" height="14" rx="6" {...win} />
          <rect x="74" y="98" width="12" height="12" rx="6" {...win} />
          <path d="M70 132 V114 A10 10 0 0 1 90 114 V132 Z" fill={door} style={doorStyle} />
          <line x1="80" y1="34" x2="80" y2="14" stroke={DEEP} strokeWidth="1.5" />
          <polygon points="80,14 97,18 80,22" style={{ fill: 'var(--crimson)' }} opacity="0.85" />
          <text x="80" y="82" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="11" fill={glyphColor}>
            {glyph}
          </text>
        </>
      )}
    </svg>
  );
}

const OFFSET_CLASSES = ['md:mt-0', 'md:mt-[70px]', 'md:mt-6', 'md:mt-[92px]'];

/** Pods que não param de passar pela pista atrás do assentamento. */
const PASSING_PODS: { variant: PodVariant; d: string; delay: string; top: string; width: number; z: number }[] = [
  { variant: 'gasgano', d: '13s', delay: '-4s', top: '2%', width: 90, z: 1 },
  { variant: 'sebulba', d: '9.5s', delay: '-1s', top: '14%', width: 140, z: 2 },
  { variant: 'anakin', d: '7s', delay: '-6s', top: '26%', width: 200, z: 3 },
];

/** Vaporadores ao fundo do assentamento. */
const FAR_VAPORATORS = [
  { left: '6%', h: 110, o: 0.35 },
  { left: '18%', h: 70, o: 0.25 },
  { left: '79%', h: 90, o: 0.3 },
  { left: '92%', h: 130, o: 0.38 },
];

export default function ContactSection() {
  const { config } = useSide();
  const { t } = useLang();
  const tRef = useRef(t);
  tRef.current = t;
  const landing = config.copy.contact.landing;
  const wrapRef = useWhipIn<HTMLDivElement>();
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const walkerRef = useRef<HTMLDivElement>(null);
  const doorRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [pose, setPose] = useState<Pose>('idle');
  const [facing, setFacing] = useState<'left' | 'right'>('left');
  const [say, setSay] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [kidSay, setKidSay] = useState<string | null>(null);
  const wreckRef = useRef<HTMLDivElement>(null);
  const firstPlacement = useRef(true);
  const greeted = useRef(false);
  const kidGreeted = useRef(false);

  const moveWalker = useCallback((toIndex: number, instant: boolean) => {
    const stage = stageRef.current;
    const walker = walkerRef.current;
    const door = doorRefs.current[toIndex];
    if (!stage || !walker || !door) return;
    const sr = stage.getBoundingClientRect();
    const dr = door.getBoundingClientRect();
    const x = dr.left - sr.left + dr.width / 2 + 40;
    const y = dr.bottom - sr.top;
    const cur = gsap.getProperty(walker, 'x') as number;
    if (instant || prefersReducedMotion()) {
      gsap.set(walker, { x, y });
      return;
    }
    setFacing(x < cur ? 'left' : 'right');
    setPose('walk');
    gsap.to(walker, {
      x,
      y,
      duration: Math.min(1.1, 0.35 + Math.abs(x - cur) / 520),
      ease: 'power2.inOut',
      onComplete: () => {
        setPose('idle');
        setFacing('left');
      },
    });
  }, []);

  useLayoutEffect(() => {
    if (!window.matchMedia('(min-width: 768px)').matches) return;
    moveWalker(active, firstPlacement.current);
    firstPlacement.current = false;
  }, [active, moveWalker]);

  useEffect(() => {
    const onResize = () => moveWalker(active, true);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [active, moveWalker]);

  // O oficial desembarca e reclama da areia (uma vez).
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || greeted.current) return;
        greeted.current = true;
        setSay(landing);
        window.setTimeout(() => setSay((s) => (s === landing ? null : s)), 2800);
        obs.disconnect();
      },
      { threshold: 0.45 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [landing]);

  // O pequeno Anakin comenta quando o pátio aparece (uma vez).
  useEffect(() => {
    const el = wreckRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || kidGreeted.current) return;
        kidGreeted.current = true;
        const line = tRef.current('contact.kid');
        setKidSay(line);
        window.setTimeout(() => setKidSay((s) => (s === line ? null : s)), 3000);
        obs.disconnect();
      },
      { threshold: 0.6 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const copyEmail = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setSay(t('contact.copiedQuip'));
      window.setTimeout(() => {
        setCopied(false);
        setSay(null);
      }, 1800);
    } catch {
      setSay(t('contact.copyFail'));
      window.setTimeout(() => setSay(null), 2200);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="contato"
      className="relative overflow-hidden pt-24 sm:pt-32"
      style={{ background: `linear-gradient(180deg, ${TATOOINE_GROUND} 0%, #c39654 32%, #ab7b3e 60%, #6f4a2c 82%, var(--void) 100%)` }}
    >
      {/* Ondulações da areia */}
      <svg className="pointer-events-none absolute inset-x-0 top-0 h-full w-full opacity-[0.22]" viewBox="0 0 1440 900" preserveAspectRatio="none" aria-hidden>
        {Array.from({ length: 14 }).map((_, i) => (
          <path
            key={i}
            d={`M-40 ${60 + i * 62} C 240 ${30 + i * 62}, 480 ${90 + i * 62}, 760 ${50 + i * 62} S 1240 ${80 + i * 62}, 1480 ${40 + i * 62}`}
            fill="none"
            stroke="#8a6436"
            strokeWidth="1.4"
          />
        ))}
      </svg>

      {/* Vaporadores ao longe */}
      <div className="pointer-events-none absolute inset-x-0 top-10 hidden md:block" aria-hidden>
        {FAR_VAPORATORS.map((v, i) => (
          <div key={i} className="absolute" style={{ left: v.left, top: 0, opacity: v.o }}>
            <div className="mx-auto w-[5px]" style={{ height: v.h, background: '#7d5c33' }} />
            <div className="absolute left-1/2 top-2 h-[3px] w-[13px] -translate-x-1/2 bg-[#5a3f22]" />
            <div className="absolute left-1/2 top-6 h-[3px] w-[13px] -translate-x-1/2 bg-[#5a3f22]" />
            <div className="absolute left-1/2 top-10 h-[3px] w-[13px] -translate-x-1/2 bg-[#5a3f22]" />
          </div>
        ))}
      </div>

      {/* Calor subindo da areia */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-40"
        style={{ background: 'linear-gradient(180deg, rgba(255,246,220,0.55), rgba(255,246,220,0))' }}
        aria-hidden
      />

      {/* Pista da corrida de pods: passam atrás do título, sem parar */}
      <div className="pointer-events-none absolute inset-x-0 top-6 h-56 overflow-hidden sm:top-8" aria-hidden>
        {PASSING_PODS.map((pod) => (
          <div
            key={pod.variant}
            className="pod-pass absolute left-0"
            style={{ top: pod.top, zIndex: pod.z, ['--d' as string]: pod.d, ['--delay' as string]: pod.delay }}
          >
            <PodRacer variant={pod.variant} width={pod.width} />
          </div>
        ))}
      </div>

      <div ref={wrapRef} className="relative mx-auto max-w-6xl px-5 pb-28 sm:px-8 sm:pb-36">
        <div className="text-center">
          <p data-reveal className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#6a4a26]">
            {t('contact.eyebrow')}
          </p>
          <h2 data-reveal className="mt-4 font-display text-5xl font-light tracking-tight text-[#2a1a10] sm:text-6xl lg:text-7xl">
            {t('contact.title')}<span className="text-sith-crimson">.</span>
          </h2>
          <p data-reveal className="mt-4 text-sm text-[#4a3320] sm:text-base">
            {config.copy.contact.pitch}
          </p>
        </div>

        <div ref={stageRef} data-reveal className="relative mt-16 sm:mt-20">
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
            {CONTACTS.map((c, i) => {
              const isActive = active === i;
              return (
                <div
                  key={c.id}
                  className={`relative ${OFFSET_CLASSES[i]}`}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                >
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    className="group block w-full"
                    aria-label={`${c.label}: ${c.value}`}
                  >
                    <div className="relative mx-auto w-full max-w-[200px] transition-transform duration-500 group-hover:-translate-y-1">
                      <Homestead variant={c.variant} active={isActive} glyph={c.glyph} />
                      <div
                        ref={(el) => {
                          doorRefs.current[i] = el;
                        }}
                        className="pointer-events-none absolute bottom-[12%] left-1/2 h-px w-px"
                      />
                    </div>
                  </button>

                  {/* Placa */}
                  <div
                    className="relative mx-auto mt-3 max-w-[220px] origin-top transition-all duration-500"
                    style={{
                      transform: isActive ? 'scaleY(1)' : 'scaleY(0.96)',
                      opacity: isActive ? 1 : 0.8,
                    }}
                  >
                    <div className="h-[6px] w-full bg-gradient-to-r from-[#8a6f2e] via-[#e6c467] to-[#8a6f2e]" />
                    <div className="border-x border-[#3a2a1c] bg-[#1a120c] px-3 py-3 text-center">
                      <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-sith-goldDim">{c.label}</p>
                      <p className="mt-1 break-all font-pixel text-[17px] leading-tight text-sith-ink sm:text-[19px]">{c.value}</p>
                      <div className="mt-2.5 flex justify-center">
                        {c.copy ? (
                          <button type="button" className="pixel-btn inline-flex items-center gap-1.5 !px-3 !py-1.5 !text-[16px]" onClick={() => copyEmail(c.value)}>
                            <Copy size={12} /> {copied && isActive ? t('contact.copied') : t('contact.copy')}
                          </button>
                        ) : (
                          <a
                            href={c.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="pixel-btn inline-flex items-center gap-1.5 !px-3 !py-1.5 !text-[16px]"
                          >
                            {t('contact.open')} <ArrowUpRight size={12} />
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="h-[6px] w-full bg-gradient-to-r from-[#8a6f2e] via-[#e6c467] to-[#8a6f2e]" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pátio ao lado das casas: o pod que não sobreviveu à Boonta Eve e o menino que o construiu */}
          <div ref={wreckRef} className="mt-10 flex items-end gap-1 sm:mt-14 sm:gap-2">
            <PodWreck width={230} className="w-[190px] sm:w-[260px]" style={{ height: 'auto', aspectRatio: '16 / 7' }} />
            <div className="relative -ml-3 mb-1 sm:-ml-4">
              <Mascot pose="hammer" facing="left" scale={2.6} skinId="anakinKid" saberOn={false} say={kidSay} bob={false} />
            </div>
          </div>

          {/* Mascote caminhando entre as casas (desktop) */}
          <div
            ref={walkerRef}
            className="pointer-events-none absolute left-0 top-0 z-20 hidden -translate-y-full md:block"
            style={{ marginTop: -2 }}
            aria-hidden
          >
            <div className="-translate-x-1/2">
              <Mascot pose={pose} facing={facing} scale={3.5} say={say} bob={false} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
