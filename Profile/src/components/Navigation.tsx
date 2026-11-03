import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useHyperspace } from './Hyperspace';
import { PROFILE } from '../data/profile';

export const NAV_LINKS = [
  { id: 'sobre', label: 'sobre' },
  { id: 'commits', label: 'commits' },
  { id: 'campanhas', label: 'campanhas' },
  { id: 'frota', label: 'frota' },
  { id: 'holocrons', label: 'holocrons' },
  { id: 'contato', label: 'contato' },
];

export function SaberIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      width="22"
      height="8"
      viewBox="0 0 22 8"
      shapeRendering="crispEdges"
      className={className}
      aria-hidden
    >
      <rect x="0" y="2" width="5" height="4" fill="#c4c4cf" />
      <rect x="1" y="2" width="1" height="4" fill="#5f5f6b" />
      <rect x="3" y="2" width="1" height="4" fill="#5f5f6b" />
      <rect x="5" y="2.5" width="17" height="3" fill="#ff2a2a" style={{ filter: 'drop-shadow(0 0 3px #ff2a2a)' }} />
      <rect x="5" y="3.4" width="16" height="1.2" fill="#ffe3e3" />
    </svg>
  );
}

export default function Navigation() {
  const { jump } = useHyperspace();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const year = new Date().getFullYear();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    jump(id);
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-500 ${
          scrolled ? 'border-b border-sith-line bg-sith-void/70 backdrop-blur-md' : 'border-b border-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <button
            type="button"
            onClick={() => go('inicio')}
            className="group flex items-center gap-2.5"
            aria-label="Voltar ao início"
          >
            <SaberIcon className="transition-transform duration-300 group-hover:-rotate-12" />
            <span className="font-display text-[22px] font-medium tracking-tight text-sith-ink">
              {PROFILE.wordmark}
              <span className="text-sith-crimson">.</span>
            </span>
          </button>

          <nav className="hidden items-center gap-7 md:flex" aria-label="Seções">
            {NAV_LINKS.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => go(l.id)}
                className="group relative font-mono text-[11px] uppercase tracking-[0.22em] text-sith-muted transition-colors hover:text-sith-ink"
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-sith-crimson transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.32em] text-sith-faint md:block">
              portfólio / {year}
            </span>
            <button
              type="button"
              className="p-1.5 text-sith-muted hover:text-sith-ink md:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={open}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-30 flex flex-col items-center justify-center gap-7 bg-sith-void/95 backdrop-blur-lg transition-opacity duration-300 md:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={!open}
      >
        {NAV_LINKS.map((l, i) => (
          <button
            key={l.id}
            type="button"
            onClick={() => go(l.id)}
            className="font-display text-4xl font-light text-sith-ink transition-all duration-300 hover:text-sith-crimson"
            style={{
              transform: open ? 'translateY(0)' : 'translateY(14px)',
              opacity: open ? 1 : 0,
              transitionDelay: `${i * 50}ms`,
            }}
          >
            {l.label}
            <span className="text-sith-crimson">.</span>
          </button>
        ))}
        <span className="mt-6 font-mono text-[10px] uppercase tracking-[0.32em] text-sith-faint">
          portfólio / {year}
        </span>
      </div>
    </>
  );
}
