import { useState } from 'react';
import Mascot from './Mascot';
import { useWhipIn } from '../hooks/useWhipIn';
import { useLang } from '../i18n/LangContext';
import { PROFILE } from '../data/profile';

export default function AboutSection() {
  const { t, profile, dossier } = useLang();
  const [say, setSay] = useState<string | null>(null);
  const ref = useWhipIn<HTMLDivElement>({
    onEnter: () => {
      setSay(t('about.quip'));
      window.setTimeout(() => setSay(null), 2600);
    },
  });

  return (
    <section id="sobre" className="relative overflow-hidden bg-sith-void py-28 sm:py-36">
      <div className="pointer-events-none absolute inset-x-0 top-0 hairline" />
      <div
        className="pointer-events-none absolute -left-40 top-1/3 h-[60vh] w-[60vh] rounded-full opacity-40"
        style={{ background: 'radial-gradient(circle, rgb(var(--c-blood) / 0.35), transparent 65%)' }}
        aria-hidden
      />

      <div ref={ref} className="relative mx-auto grid max-w-6xl gap-14 px-6 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        <div>
          <p data-reveal className="eyebrow">
            {t('about.eyebrow')}
          </p>
          <h2 data-reveal className="mt-5 font-display text-5xl font-light leading-[0.95] tracking-tight text-sith-ink sm:text-6xl lg:text-7xl">
            {t('about.title1')}
            <br />
            <span className="italic text-sith-crimson text-glow-crimson">{t('about.title2')}</span>
          </h2>

          <p data-reveal className="mt-10 max-w-xl font-display text-2xl font-light italic leading-snug text-sith-ink/90 sm:text-[28px]">
            “{profile.quote}”
          </p>

          <div className="mt-8 max-w-xl space-y-5 text-[15px] leading-relaxed text-sith-muted sm:text-base">
            {profile.bio.map((p) => (
              <p key={p} data-reveal>
                {p}
              </p>
            ))}
          </div>

          <div data-reveal className="mt-9 flex flex-wrap gap-2">
            {PROFILE.tags.map((tag) => (
              <span
                key={tag}
                className="border border-sith-line px-3 py-1.5 font-mono text-[11px] tracking-[0.12em] text-sith-muted transition-colors hover:border-sith-crimson/50 hover:text-sith-ink"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="relative lg:pt-16">
          <div className="absolute -top-2 right-6 z-10 lg:right-10 lg:top-2">
            <Mascot pose="idle" facing="left" scale={4} say={say} />
          </div>

          <div data-reveal className="panel relative p-7 sm:p-9">
            <div className="rivet left-2 top-2" />
            <div className="rivet right-2 top-2" />
            <div className="rivet bottom-2 left-2" />
            <div className="rivet bottom-2 right-2" />

            <p className="eyebrow">{t('about.dossier')}</p>
            <p className="mt-2 font-display text-3xl font-medium tracking-tight text-sith-ink">
              {PROFILE.fullName}
            </p>
            <p className="mt-1 font-mono text-[10px] tracking-[0.12em] text-sith-crimson/80">
              {profile.role}
            </p>
            <p className="mt-1 font-mono text-[10px] leading-relaxed tracking-[0.08em] text-sith-faint">
              {PROFILE.headline}
            </p>

            <dl className="mt-7 divide-y divide-sith-line border-y border-sith-line">
              {dossier.map((row) => (
                <div key={row.k} className="grid grid-cols-[96px_1fr] gap-4 py-3.5 sm:grid-cols-[124px_1fr]">
                  <dt className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.2em] text-sith-faint">{row.k}</dt>
                  <dd>
                    <p className="text-[13px] leading-snug text-sith-ink sm:text-sm">{row.v}</p>
                    <p className="mt-0.5 font-mono text-[10px] leading-relaxed tracking-[0.1em] text-sith-crimson/70">{row.s}</p>
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-6 flex items-center justify-between">
              <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-sith-muted">
                <span className="blink-dot inline-block h-1.5 w-1.5 rounded-full bg-sith-crimson" />
                {t('about.available')}
              </span>
              <span className="pixel-chip">{t('about.status')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
