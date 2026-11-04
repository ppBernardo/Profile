import { useState } from 'react';
import Mascot, { type Pose } from './Mascot';
import { useWhipIn } from '../hooks/useWhipIn';
import { useSide } from '../context/SideContext';
import { PROFILE } from '../data/profile';

export default function Footer() {
  const { config, switchSide } = useSide();
  const [pose, setPose] = useState<Pose>('idle');
  const [say, setSay] = useState<string | null>(null);
  const ref = useWhipIn<HTMLDivElement>({
    start: 'top 85%',
    onEnter: () => {
      setSay('ponto final.');
      window.setTimeout(() => {
        setSay(null);
        setPose('sleep');
      }, 2400);
    },
  });
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-sith-void pb-12 pt-28 sm:pt-36">
      <div className="pointer-events-none absolute inset-x-0 top-0 hairline" />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[60vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 opacity-40"
        style={{ background: 'radial-gradient(ellipse at center, rgb(var(--c-blood) / 0.3), transparent 65%)' }}
        aria-hidden
      />

      <div ref={ref} className="relative mx-auto max-w-6xl px-5 text-center sm:px-8">
        <div className="relative inline-block">
          <div className="absolute bottom-full left-[6%] translate-y-[8px] sm:left-[9%] sm:translate-y-[18px]">
            <Mascot pose={pose} facing="right" scale={4} say={say} />
          </div>
          <p
            data-reveal
            className="select-none font-display text-[clamp(64px,17vw,230px)] font-light leading-[0.9] tracking-[-0.03em] text-sith-ink"
          >
            {PROFILE.wordmark}
            <span className="text-sith-crimson">.</span>
          </p>
        </div>

        <p data-reveal className="mt-4 font-display text-2xl font-light italic text-sith-ink/90 sm:text-3xl">
          {PROFILE.role}.
        </p>
        <p data-reveal className="mx-auto mt-3 max-w-md text-sm text-sith-muted">
          {PROFILE.pitch}
        </p>

        <div data-reveal className="mt-8 flex flex-col items-center gap-3">
          <span className="eyebrow">{config.copy.switchKicker}</span>
          <button type="button" onClick={switchSide} className="pixel-btn is-gold" title="Trocar de lado na Força">
            {config.copy.switchCta}
          </button>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
            <a href={PROFILE.github} target="_blank" rel="noopener noreferrer" className="pixel-btn">
              github
            </a>
            <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer" className="pixel-btn">
              linkedin
            </a>
            <a href={`mailto:${PROFILE.email}`} className="pixel-btn">
              e-mail
            </a>
          </div>
        </div>

        <div data-reveal className="mt-16 flex flex-col items-center justify-between gap-3 border-t border-sith-line pt-6 font-mono text-[10px] uppercase tracking-[0.26em] text-sith-faint sm:flex-row">
          <span>© {year} {PROFILE.name}</span>
          <span>{config.copy.footer}</span>
          <span>feito com react · gsap · pixels</span>
        </div>
      </div>
    </footer>
  );
}
