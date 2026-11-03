import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '../lib/scroll';

gsap.registerPlugin(ScrollTrigger);

interface Options {
  start?: string;
  /** Seletor de filhos que entram em cascata depois do "whip". */
  stagger?: string;
  staggerEach?: number;
  onEnter?: () => void;
}

/**
 * Entrada "whip-pan": o bloco chega com motion-blur vertical e assenta.
 * Filhos marcados com `data-reveal` (ou o seletor passado) entram em cascata.
 */
export function useWhipIn<T extends HTMLElement>(options: Options = {}) {
  const ref = useRef<T>(null);
  const { start = 'top 78%', stagger = '[data-reveal]', staggerEach = 0.09, onEnter } = options;
  const onEnterRef = useRef(onEnter);
  onEnterRef.current = onEnter;

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const children = Array.from(el.querySelectorAll<HTMLElement>(stagger));

    if (prefersReducedMotion()) {
      const st = ScrollTrigger.create({
        trigger: el,
        start,
        once: true,
        onEnter: () => onEnterRef.current?.(),
      });
      return () => st.kill();
    }

    const ctx = gsap.context(() => {
      gsap.set(el, { opacity: 0, y: 56, filter: 'blur(18px)', scaleY: 1.06 });
      if (children.length) gsap.set(children, { opacity: 0, y: 26 });

      ScrollTrigger.create({
        trigger: el,
        start,
        once: true,
        onEnter: () => {
          const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
          tl.to(el, {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            scaleY: 1,
            duration: 0.95,
            clearProps: 'filter,scaleY',
          });
          if (children.length) {
            tl.to(
              children,
              { opacity: 1, y: 0, duration: 0.7, stagger: staggerEach, clearProps: 'transform' },
              '-=0.55'
            );
          }
          tl.call(() => onEnterRef.current?.());
        },
      });
    }, el);

    return () => ctx.revert();
  }, [start, stagger, staggerEach]);

  return ref;
}
