import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PodRacer, { type PodVariant } from './PodRacer';
import { prefersReducedMotion } from '../lib/scroll';

gsap.registerPlugin(ScrollTrigger);

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (a: number, b: number, t: number) => {
  const u = clamp01((t - a) / (b - a));
  return u * u * (3 - 2 * u);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Cor do chão no fim do pouso — a seção de contato começa exatamente com ela. */
export const TATOOINE_GROUND = '#c9a260';

/** Corrida de pods durante o pouso: cada um cruza a tela num trecho do scroll, do longe para o perto. */
const PODS: { variant: PodVariant; start: number; end: number; top: string; width: number; z: number }[] = [
  { variant: 'gasgano', start: 0.7, end: 0.86, top: '56%', width: 110, z: 1 },
  { variant: 'sebulba', start: 0.76, end: 0.93, top: '62%', width: 170, z: 2 },
  { variant: 'anakin', start: 0.84, end: 1, top: '69%', width: 260, z: 3 },
];

const DUNES = [
  { color: '#ead3a0', d: 'M0 96 C 180 46, 360 126, 540 76 S 900 36, 1080 86 S 1320 66, 1440 56 L1440 200 L0 200 Z', start: 0.56 },
  { color: '#d7b678', d: 'M0 126 C 200 76, 420 156, 640 106 S 980 66, 1200 126 S 1380 106, 1440 116 L1440 200 L0 200 Z', start: 0.62 },
  { color: TATOOINE_GROUND, d: 'M0 156 C 240 106, 480 186, 720 136 S 1120 96, 1440 156 L1440 200 L0 200 Z', start: 0.68 },
];

/**
 * Transição Projetos → Contato: aproximação orbital de Tatooine, reentrada atmosférica
 * (calor, estrias, tremor) e pouso entre as dunas sob os dois sóis. Tudo guiado pelo scroll.
 */
export default function TatooineEntry() {
  const sectionRef = useRef<HTMLElement>(null);
  const shakeRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<HTMLDivElement>(null);
  const planetRef = useRef<HTMLDivElement>(null);
  const heatRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<HTMLDivElement>(null);
  const skyRef = useRef<HTMLDivElement>(null);
  const sunsRef = useRef<HTMLDivElement>(null);
  const hazeRef = useRef<HTMLDivElement>(null);
  const groundRef = useRef<HTMLDivElement>(null);
  const duneRefs = useRef<(SVGSVGElement | null)[]>([]);
  const podRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hudRef = useRef<HTMLDivElement>(null);
  const altRef = useRef<HTMLSpanElement>(null);
  const velRef = useRef<HTMLSpanElement>(null);
  const tempRef = useRef<HTMLSpanElement>(null);
  const phaseRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reduced = prefersReducedMotion();

    const apply = (p: number) => {
      const approach = smooth(0, 0.5, p);
      const heat = Math.max(0, Math.sin(Math.PI * clamp01((p - 0.3) / 0.38)));
      const land = smooth(0.58, 1, p);

      if (starsRef.current) gsap.set(starsRef.current, { opacity: 1 - smooth(0.3, 0.55, p) });
      if (planetRef.current) {
        gsap.set(planetRef.current, {
          scale: lerp(0.22, 7.5, approach * approach),
          opacity: 1 - smooth(0.5, 0.62, p),
          yPercent: -50 + lerp(0, 18, smooth(0.3, 0.6, p)),
        });
      }
      if (heatRef.current) gsap.set(heatRef.current, { opacity: heat * 0.95 });
      if (linesRef.current) gsap.set(linesRef.current, { opacity: heat * 0.6, rotation: p * 70, scale: 1 + heat * 0.35 });
      if (shakeRef.current) gsap.set(shakeRef.current, { x: Math.sin(p * 420) * 10 * heat, y: Math.cos(p * 390) * 7 * heat });
      if (skyRef.current) gsap.set(skyRef.current, { opacity: smooth(0.42, 0.68, p) });
      if (sunsRef.current) gsap.set(sunsRef.current, { opacity: smooth(0.62, 0.82, p), y: lerp(-60, 0, land) });
      duneRefs.current.forEach((d, k) => {
        if (d) gsap.set(d, { yPercent: lerp(100, 0, smooth(DUNES[k].start, 1, p)) });
      });
      if (groundRef.current) gsap.set(groundRef.current, { yPercent: lerp(100, 0, smooth(0.74, 1, p)) });
      if (hazeRef.current) gsap.set(hazeRef.current, { opacity: smooth(0.76, 1, p) * 0.7 });
      podRefs.current.forEach((el, k) => {
        if (!el) return;
        const pod = PODS[k];
        const u = clamp01((p - pod.start) / (pod.end - pod.start));
        gsap.set(el, { x: `${lerp(112, -40, u)}vw`, opacity: u > 0 && u < 1 ? 1 : 0 });
      });

      if (altRef.current) altRef.current.textContent = `${Math.round(lerp(420, 0, smooth(0.04, 0.97, p)))} km`;
      if (velRef.current) velRef.current.textContent = `${lerp(7.8, 0.1, smooth(0.3, 0.97, p)).toFixed(1)} km/s`;
      if (tempRef.current) tempRef.current.textContent = `${Math.round(40 + heat * 1610)} °C`;
      if (phaseRef.current) {
        phaseRef.current.textContent = p < 0.3 ? 'aproximação orbital' : p < 0.64 ? 'reentrada atmosférica' : 'pouso em tatooine';
      }
      if (barRef.current) gsap.set(barRef.current, { scaleX: p });
      if (hudRef.current) gsap.set(hudRef.current, { opacity: 1 - smooth(0.86, 0.97, p) });
      if (titleRef.current) gsap.set(titleRef.current, { opacity: smooth(0.8, 0.95, p), y: lerp(24, 0, smooth(0.8, 0.95, p)) });
    };

    const ctx = gsap.context(() => {
      if (reduced) {
        apply(1);
        return;
      }
      apply(0);
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=180%',
        pin: true,
        scrub: 0.8,
        invalidateOnRefresh: true,
        onUpdate: (self) => apply(self.progress),
      });
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden bg-sith-void" aria-label="Entrada na atmosfera de Tatooine">
      <div ref={shakeRef} className="absolute inset-[-12px] will-change-transform">
        {/* Espaço */}
        <div ref={starsRef} className="pointer-events-none absolute inset-0" aria-hidden>
          {Array.from({ length: 80 }).map((_, i) => (
            <span
              key={i}
              className="star"
              style={{
                left: `${(i * 41) % 100}%`,
                top: `${(i * 67) % 100}%`,
                width: i % 9 === 0 ? 2 : 1,
                height: i % 9 === 0 ? 2 : 1,
                background: i % 13 === 0 ? '#ffd9b0' : '#ece8f2',
                animationDelay: `${(i * 0.41) % 6}s`,
                animationDuration: `${3 + (i % 4)}s`,
              }}
            />
          ))}
        </div>

        {/* Tatooine */}
        <div
          ref={planetRef}
          className="pointer-events-none absolute left-1/2 top-1/2 h-[64vmin] w-[64vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background: 'radial-gradient(circle at 36% 32%, #f6e6b6 0%, #e0bf80 28%, #c3924f 60%, #6f4c28 100%)',
            boxShadow: 'inset -60px -40px 120px rgba(25,12,6,0.78), 0 0 90px 16px rgba(255,205,130,0.22)',
          }}
          aria-hidden
        >
          <svg viewBox="0 0 200 200" className="h-full w-full opacity-30">
            <ellipse cx="80" cy="70" rx="46" ry="12" fill="#8f6a3c" transform="rotate(-18 80 70)" />
            <ellipse cx="128" cy="112" rx="38" ry="9" fill="#8f6a3c" transform="rotate(-12 128 112)" />
            <ellipse cx="70" cy="132" rx="30" ry="7" fill="#a67f49" transform="rotate(-22 70 132)" />
            <ellipse cx="120" cy="52" rx="18" ry="5" fill="#a67f49" transform="rotate(-10 120 52)" />
          </svg>
        </div>

        {/* Céu de Tatooine */}
        <div
          ref={skyRef}
          className="pointer-events-none absolute inset-0 opacity-0"
          style={{ background: 'linear-gradient(180deg, #5c84b8 0%, #9fb9d6 36%, #e6cf9e 60%, #f3dfae 100%)' }}
          aria-hidden
        />

        {/* Sóis gêmeos */}
        <div ref={sunsRef} className="pointer-events-none absolute left-[60%] top-[22%] opacity-0" aria-hidden>
          <div
            className="h-[11vmin] w-[11vmin] rounded-full"
            style={{ background: 'radial-gradient(circle, #fff7d6 0%, #ffe9a8 55%, rgba(255,220,150,0) 72%)', boxShadow: '0 0 60px 20px rgba(255,236,180,0.55)' }}
          />
          <div
            className="absolute left-[9vmin] top-[6vmin] h-[7vmin] w-[7vmin] rounded-full"
            style={{ background: 'radial-gradient(circle, #ffe3a8 0%, #ffc777 55%, rgba(255,190,110,0) 72%)', boxShadow: '0 0 40px 14px rgba(255,200,120,0.45)' }}
          />
        </div>

        {/* Dunas em paralaxe */}
        {DUNES.map((d, k) => (
          <svg
            key={k}
            ref={(el) => {
              duneRefs.current[k] = el;
            }}
            className="pointer-events-none absolute inset-x-0 bottom-0 w-full"
            style={{ height: `${58 - k * 8}%` }}
            viewBox="0 0 1440 200"
            preserveAspectRatio="none"
            aria-hidden
          >
            <path d={d.d} fill={d.color} />
          </svg>
        ))}
        <div ref={groundRef} className="pointer-events-none absolute inset-x-0 bottom-0 h-[30%]" style={{ background: TATOOINE_GROUND }} aria-hidden />

        {/* Corrida de pods rasgando as dunas */}
        {PODS.map((pod, k) => (
          <div
            key={pod.variant}
            ref={(el) => {
              podRefs.current[k] = el;
            }}
            className="pointer-events-none absolute left-0 opacity-0"
            style={{ top: pod.top, zIndex: pod.z, transform: 'translateX(112vw)' }}
            aria-hidden
          >
            <PodRacer variant={pod.variant} width={pod.width} />
          </div>
        ))}

        {/* Névoa de calor no horizonte */}
        <div
          ref={hazeRef}
          className="pointer-events-none absolute inset-x-0 top-[40%] h-[26%] opacity-0"
          style={{ background: 'linear-gradient(180deg, rgba(255,245,220,0) 0%, rgba(255,245,220,0.55) 50%, rgba(255,245,220,0) 100%)' }}
          aria-hidden
        />

        {/* Reentrada: plasma nas bordas e estrias */}
        <div
          ref={linesRef}
          className="pointer-events-none absolute inset-[-25%] opacity-0"
          style={{ background: 'repeating-conic-gradient(from 0deg at 50% 50%, rgba(255,150,70,0.42) 0deg 1.1deg, transparent 1.1deg 5.5deg)' }}
          aria-hidden
        />
        <div
          ref={heatRef}
          className="pointer-events-none absolute inset-0 opacity-0"
          style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(255,120,40,0) 28%, rgba(255,120,40,0.55) 66%, rgba(255,60,20,0.95) 100%)', mixBlendMode: 'screen' }}
          aria-hidden
        />
      </div>

      {/* HUD de descida */}
      <div ref={hudRef} className="pointer-events-none absolute inset-0 z-10" aria-hidden>
        {[
          'left-5 top-24 border-l border-t',
          'right-5 top-24 border-r border-t',
          'bottom-8 left-5 border-b border-l',
          'bottom-8 right-5 border-b border-r',
        ].map((c) => (
          <span key={c} className={`absolute h-6 w-6 border-sith-crimson/70 ${c}`} />
        ))}
        <div className="absolute left-8 top-28 font-mono text-[10px] uppercase tracking-[0.28em] text-sith-ink/80 sm:left-10">
          <p className="text-sith-crimson">
            {'>'} <span ref={phaseRef}>aproximação orbital</span>
          </p>
          <p className="mt-3">
            altitude <span ref={altRef} className="text-sith-ink">420 km</span>
          </p>
          <p className="mt-1">
            velocidade <span ref={velRef} className="text-sith-ink">7.8 km/s</span>
          </p>
          <p className="mt-1">
            casco <span ref={tempRef} className="text-sith-ink">40 °C</span>
          </p>
        </div>
        <div className="absolute bottom-12 left-8 right-8 sm:left-10 sm:right-10">
          <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.3em] text-sith-ink/60">trajetória de descida · setor de comunicações</p>
          <div className="h-px w-full bg-sith-ink/15">
            <div ref={barRef} className="h-full origin-left bg-sith-crimson" style={{ transform: 'scaleX(0)' }} />
          </div>
        </div>
      </div>

      {/* Chegada */}
      <div ref={titleRef} className="pointer-events-none absolute bottom-[12%] left-6 z-10 opacity-0 sm:left-10 md:left-[7vw] lg:left-[9vw]">
        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#6a4a26]">pouso concluído · orla do mar de dunas</p>
        <h2 className="mt-3 font-display text-[clamp(40px,8vw,56px)] font-light leading-[0.95] tracking-tight text-[#2a1a10] md:text-[clamp(48px,5vw,80px)]">
          Tatooine<span className="text-sith-crimson">.</span>
        </h2>
        <p className="mt-3 max-w-xs text-sm text-[#4a3320]">Onde tudo começou. O setor de comunicações fica logo adiante.</p>
      </div>
    </section>
  );
}
