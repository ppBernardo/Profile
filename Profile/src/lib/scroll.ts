import type Lenis from 'lenis';

let lenis: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenis = instance;
}

export function getLenis() {
  return lenis;
}

export function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  );
}

export function scrollToId(id: string, opts: { immediate?: boolean; offset?: number } = {}) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) {
    lenis.scrollTo(el, {
      offset: opts.offset ?? 0,
      immediate: !!opts.immediate,
      duration: 1.4,
    });
  } else {
    el.scrollIntoView({ behavior: opts.immediate ? 'auto' : 'smooth', block: 'start' });
  }
}
