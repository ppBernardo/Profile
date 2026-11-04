import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, MapPin } from 'lucide-react';
import Mascot, { type Pose } from './Mascot';
import { EXPERIENCES } from '../data/profile';
import { prefersReducedMotion } from '../lib/scroll';

gsap.registerPlugin(ScrollTrigger);

export default function ExperienceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const walkerRef = useRef<HTMLDivElement>(null);
  const [pose, setPose] = useState<Pose>('idle');
  const [facing, setFacing] = useState<'left' | 'right'>('right');
  const idleTimer = useRef<number | undefined>(undefined);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const walker = walkerRef.current;
    if (!section || !track || !walker) return;

    const reduced = prefersReducedMotion();
    const mm = gsap.matchMedia();

    mm.add('(min-width: 768px)', () => {
      const getDist = () => Math.max(0, track.scrollWidth - window.innerWidth + 96);
      const cards = track.querySelectorAll<HTMLElement>('.campaign-card');
      const header = track.querySelector<HTMLElement>('.campaign-header');

      if (!reduced) {
        gsap.set(cards, { opacity: 0, y: 48, filter: 'blur(10px)' });
        if (header) gsap.set(header, { opacity: 0, y: 30, filter: 'blur(10px)' });
      }

      const scroll = gsap.to(track, {
        x: () => -getDist(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${getDist()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const vw = window.innerWidth;
            gsap.set(walker, { x: vw * 0.06 + self.progress * vw * 0.86 });
            setFacing(self.direction < 0 ? 'left' : 'right');
            setPose('walk');
            window.clearTimeout(idleTimer.current);
            idleTimer.current = window.setTimeout(() => setPose('idle'), 170);
          },
        },
      });

      if (header) {
        gsap.to(header, {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 70%', once: true },
        });
      }
      cards.forEach((card) => {
        gsap.to(card, {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            containerAnimation: scroll,
            start: 'left 88%',
            once: true,
          },
        });
      });
    });

    mm.add('(max-width: 767px)', () => {
      const items = track.querySelectorAll<HTMLElement>('.campaign-card, .campaign-header');
      if (reduced) return;
      items.forEach((item) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 40, filter: 'blur(10px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: { trigger: item, start: 'top 85%', once: true },
          }
        );
      });
    });

    return () => {
      mm.revert();
      window.clearTimeout(idleTimer.current);
    };
  }, []);

  return (
    <section ref={sectionRef} id="campanhas" className="relative overflow-hidden bg-sith-void">
      <div className="pointer-events-none absolute inset-x-0 top-0 hairline" />

      {/* Trilha no chão (desktop) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[9%] hidden md:block" aria-hidden>
        <div
          className="h-px w-full"
          style={{
            background:
              'repeating-linear-gradient(90deg, rgb(var(--c-crimson) / 0.35) 0 10px, transparent 10px 22px)',
          }}
        />
      </div>
      <div
        ref={walkerRef}
        className="pointer-events-none absolute bottom-[9%] left-0 z-20 hidden md:block"
        aria-hidden
      >
        <Mascot pose={pose} facing={facing} scale={4} bob={false} />
      </div>

      <div className="flex min-h-screen items-center py-24 md:h-screen md:py-0">
        <div
          ref={trackRef}
          className="flex flex-col gap-6 px-5 sm:px-8 md:flex-row md:items-stretch md:gap-8 md:pl-[6vw] md:pr-[8vw]"
        >
          <div className="campaign-header flex shrink-0 flex-col justify-center md:w-[34vw] md:pr-6">
            <p className="eyebrow">registro de missões</p>
            <h2 className="mt-4 font-display text-5xl font-light leading-[0.95] tracking-tight text-sith-ink sm:text-6xl lg:text-7xl">
              Campanhas<span className="text-sith-crimson">.</span>
            </h2>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-sith-muted sm:text-base">
              Cada empresa foi um campo de batalha diferente. Cada entrega, uma habilidade
              forjada. <span className="hidden md:inline">Role para avançar na linha do tempo.</span>
            </p>
            <div className="mt-8 h-px w-32 bg-gradient-to-r from-sith-crimson to-transparent" />
          </div>

          {EXPERIENCES.map((exp, i) => (
            <article
              key={exp.company}
              className="campaign-card panel group relative flex shrink-0 flex-col p-6 sm:p-7 md:w-[440px] lg:w-[470px]"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sith-crimson/0 to-transparent transition-all duration-700 group-hover:via-sith-crimson/70" />
              <span className="absolute right-5 top-5 font-mono text-[9px] uppercase tracking-[0.3em] text-sith-faint">
                {exp.current ? (
                  <span className="flex items-center gap-1.5 text-sith-crimson">
                    <span className="blink-dot inline-block h-1.5 w-1.5 rounded-full bg-sith-crimson" />
                    em curso
                  </span>
                ) : (
                  `missão ${String(EXPERIENCES.length - i).padStart(2, '0')}`
                )}
              </span>

              <p className="font-display text-6xl font-light leading-none tracking-tight text-sith-crimson text-glow-crimson">
                {exp.year}
              </p>

              <h3 className="mt-5 font-display text-[28px] font-medium leading-tight text-sith-ink">
                {exp.company}
              </h3>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-sith-crimson/80">
                {exp.role}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-[0.16em] text-sith-faint">
                <span>{exp.period}</span>
                <span className="flex items-center gap-1">
                  <MapPin size={11} /> {exp.location}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={11} /> {exp.duration}
                </span>
                <span>{exp.type}</span>
              </div>

              <p className="mt-5 text-[13px] leading-relaxed text-sith-muted">{exp.summary}</p>

              {exp.highlights && (
                <ul className="mt-3 flex-grow space-y-1.5">
                  {exp.highlights.map((h) => (
                    <li key={h} className="flex gap-2 text-[12px] leading-relaxed text-sith-muted">
                      <span className="mt-[7px] h-1 w-1 shrink-0 bg-sith-crimson" aria-hidden />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-5 flex flex-wrap gap-1.5 border-t border-sith-line pt-4">
                {exp.technologies.map((t) => (
                  <span
                    key={t}
                    className="border border-sith-line px-2 py-0.5 font-mono text-[10px] tracking-[0.1em] text-sith-muted transition-colors group-hover:border-sith-crimson/30 group-hover:text-sith-ink"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </article>
          ))}

          <div className="campaign-card flex shrink-0 flex-col items-center justify-center text-center md:w-[220px]">
            <div className="flex h-16 w-16 items-center justify-center border border-sith-crimson/40 font-display text-2xl text-sith-crimson">
              +
            </div>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.3em] text-sith-faint">
              próxima campanha
            </p>
            <p className="mt-1 font-display text-xl italic text-sith-muted">em aberto.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
