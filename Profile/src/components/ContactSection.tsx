import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ArrowUpRight, Copy } from 'lucide-react';
import Mascot, { type Pose } from './Mascot';
import { useWhipIn } from '../hooks/useWhipIn';
import { CONTACTS, type ContactChannel } from '../data/profile';
import { prefersReducedMotion } from '../lib/scroll';

function Temple({ variant, active, glyph }: { variant: ContactChannel['variant']; active: boolean; glyph: string }) {
  const door = active ? '#ff3b43' : '#2a0a0d';
  const doorStyle = { transition: 'fill 0.35s ease, filter 0.35s ease', filter: active ? 'drop-shadow(0 0 10px #ff2a2a)' : 'none' };
  const trim = active ? 0.9 : 0.35;
  const stone = '#1c1517';
  const stone2 = '#231a1d';
  const stone3 = '#2a1f22';
  const edge = '#0d0a0b';

  return (
    <svg viewBox="0 0 160 150" className="block w-full" aria-hidden>
      {variant === 'ziggurat' && (
        <>
          <rect x="8" y="118" width="144" height="26" fill={stone} stroke={edge} />
          <rect x="28" y="90" width="104" height="28" fill={stone2} stroke={edge} />
          <rect x="48" y="62" width="64" height="28" fill={stone3} stroke={edge} />
          <polygon points="62,62 98,62 80,24" fill={stone3} stroke={edge} />
          <line x1="8" y1="118" x2="152" y2="118" stroke="#e3242b" strokeWidth="1.2" opacity={trim} />
          <line x1="28" y1="90" x2="132" y2="90" stroke="#e3242b" strokeWidth="1.2" opacity={trim} />
          <line x1="48" y1="62" x2="112" y2="62" stroke="#e3242b" strokeWidth="1.2" opacity={trim} />
          <rect x="70" y="118" width="20" height="26" fill={door} style={doorStyle} />
          <rect x="80" y="22" width="1.5" height="6" fill="#c9a44c" />
          <text x="80" y="50" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="11" fill="#c9a44c">
            {glyph}
          </text>
        </>
      )}
      {variant === 'tower' && (
        <>
          <rect x="20" y="130" width="120" height="14" fill={stone} stroke={edge} />
          <rect x="52" y="40" width="56" height="90" fill={stone2} stroke={edge} />
          {[52, 66, 80, 94].map((x) => (
            <rect key={x} x={x} y="32" width="8" height="10" fill={stone3} stroke={edge} />
          ))}
          <rect x="52" y="42" width="56" height="2" fill="#e3242b" opacity={trim} />
          <rect x="77" y="58" width="6" height="34" fill={door} style={doorStyle} />
          <rect x="70" y="104" width="20" height="26" fill={door} style={doorStyle} />
          <text x="80" y="24" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="11" fill="#c9a44c">
            {glyph}
          </text>
        </>
      )}
      {variant === 'rotunda' && (
        <>
          <rect x="18" y="130" width="124" height="14" fill={stone} stroke={edge} />
          <path d="M34 82 A46 46 0 0 1 126 82 Z" fill={stone3} stroke={edge} />
          <rect x="30" y="80" width="100" height="6" fill={stone2} stroke={edge} />
          {[36, 56, 96, 116].map((x) => (
            <rect key={x} x={x} y="86" width="8" height="44" fill={stone2} stroke={edge} />
          ))}
          <rect x="30" y="86" width="100" height="1.5" fill="#e3242b" opacity={trim} />
          <rect x="72" y="92" width="16" height="38" fill={door} style={doorStyle} />
          <circle cx="80" cy="40" r="3" fill="#c9a44c" />
          <text x="80" y="66" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="11" fill="#c9a44c">
            {glyph}
          </text>
        </>
      )}
      {variant === 'bunker' && (
        <>
          <polygon points="10,144 150,144 136,88 24,88" fill={stone} stroke={edge} />
          <rect x="50" y="70" width="60" height="18" fill={stone2} stroke={edge} />
          <rect x="24" y="88" width="112" height="1.5" fill="#e3242b" opacity={trim} />
          <line x1="80" y1="70" x2="80" y2="48" stroke="#c9a44c" strokeWidth="1.5" />
          <rect x="70" y="112" width="20" height="32" fill={door} style={doorStyle} />
          <text x="80" y="44" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="11" fill="#c9a44c">
            {glyph}
          </text>
        </>
      )}
    </svg>
  );
}

const OFFSET_CLASSES = ['md:mt-0', 'md:mt-[70px]', 'md:mt-6', 'md:mt-[92px]'];

export default function ContactSection() {
  const wrapRef = useWhipIn<HTMLDivElement>();
  const stageRef = useRef<HTMLDivElement>(null);
  const walkerRef = useRef<HTMLDivElement>(null);
  const doorRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [pose, setPose] = useState<Pose>('idle');
  const [facing, setFacing] = useState<'left' | 'right'>('left');
  const [say, setSay] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const firstPlacement = useRef(true);

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

  const copyEmail = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setSay('copiado.');
      window.setTimeout(() => {
        setCopied(false);
        setSay(null);
      }, 1800);
    } catch {
      setSay('não deu. copia na mão.');
      window.setTimeout(() => setSay(null), 2200);
    }
  };

  return (
    <section id="contato" className="relative overflow-hidden bg-sith-void pt-28 sm:pt-36">
      <div className="pointer-events-none absolute inset-x-0 top-0 hairline" />

      {/* Mustafar */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, #050405 0%, #0b0608 38%, #2a0d0b 72%, #5a1a10 92%, #3a1009 100%)',
        }}
        aria-hidden
      />
      <svg className="pointer-events-none absolute inset-x-0 bottom-0 h-[52%] w-full" viewBox="0 0 1440 400" preserveAspectRatio="none" aria-hidden>
        <polygon points="0,400 0,260 120,190 260,250 380,150 520,230 640,120 760,210 900,160 1020,240 1180,140 1300,220 1440,170 1440,400" fill="#120b0d" />
        <polygon points="0,400 0,320 160,300 300,340 460,280 620,330 780,290 940,340 1120,300 1280,340 1440,300 1440,400" fill="#1a0f10" />
        <polygon points="620,120 640,110 660,120" fill="#ff6a3c" opacity="0.8" />
        <polygon points="1170,145 1180,136 1192,146" fill="#ff6a3c" opacity="0.7" />
      </svg>
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-20 lava-flow opacity-90"
        style={{
          backgroundImage: 'linear-gradient(90deg, #ff4a1a, #ffb347, #ff2e00, #ff8a3c, #ff4a1a)',
          clipPath:
            'polygon(0 62%, 10% 46%, 22% 60%, 36% 40%, 50% 56%, 64% 36%, 78% 52%, 90% 40%, 100% 50%, 100% 100%, 0 100%)',
          boxShadow: '0 -20px 60px rgba(255,90,60,0.35)',
        }}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {Array.from({ length: 16 }).map((_, i) => (
          <span
            key={i}
            className="ember-float"
            style={{
              left: `${4 + ((i * 61) % 92)}%`,
              bottom: `${2 + ((i * 17) % 18)}%`,
              ['--d' as string]: `${5 + (i % 4) * 1.6}s`,
              ['--delay' as string]: `${(i * 0.7) % 5}s`,
              ['--x' as string]: `${((i % 3) - 1) * 30}px`,
            }}
          />
        ))}
      </div>

      <div ref={wrapRef} className="relative mx-auto max-w-6xl px-5 pb-24 sm:px-8 sm:pb-32">
        <div className="text-center">
          <p data-reveal className="eyebrow">
            setor de comunicações
          </p>
          <h2 data-reveal className="mt-4 font-display text-5xl font-light tracking-tight text-sith-ink sm:text-6xl lg:text-7xl">
            Contato<span className="text-sith-crimson">.</span>
          </h2>
          <p data-reveal className="mt-4 text-sm text-sith-muted sm:text-base">
            Escolha uma porta. O lado sombrio está recrutando.
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
                      <Temple variant={c.variant} active={isActive} glyph={c.glyph} />
                      <div
                        ref={(el) => {
                          doorRefs.current[i] = el;
                        }}
                        className="pointer-events-none absolute bottom-[4%] left-1/2 h-px w-px"
                      />
                    </div>
                  </button>

                  {/* Placa */}
                  <div
                    className="relative mx-auto mt-3 max-w-[220px] origin-top transition-all duration-500"
                    style={{
                      transform: isActive ? 'scaleY(1)' : 'scaleY(0.96)',
                      opacity: isActive ? 1 : 0.72,
                    }}
                  >
                    <div className="h-[6px] w-full bg-gradient-to-r from-[#8a6f2e] via-[#e6c467] to-[#8a6f2e]" />
                    <div className="border-x border-[#3a2a1c] bg-[#14100f] px-3 py-3 text-center">
                      <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-sith-goldDim">{c.label}</p>
                      <p className="mt-1 break-all font-pixel text-[17px] leading-tight text-sith-ink sm:text-[19px]">{c.value}</p>
                      <div className="mt-2.5 flex justify-center">
                        {c.copy ? (
                          <button type="button" className="pixel-btn inline-flex items-center gap-1.5 !px-3 !py-1.5 !text-[16px]" onClick={() => copyEmail(c.value)}>
                            <Copy size={12} /> {copied && isActive ? 'copiado' : 'copiar'}
                          </button>
                        ) : (
                          <a
                            href={c.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="pixel-btn inline-flex items-center gap-1.5 !px-3 !py-1.5 !text-[16px]"
                          >
                            abrir <ArrowUpRight size={12} />
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

          {/* Mascote caminhando entre os templos (desktop) */}
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
