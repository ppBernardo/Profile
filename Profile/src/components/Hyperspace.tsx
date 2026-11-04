import { createContext, useCallback, useContext, useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion, scrollToId } from '../lib/scroll';
import { drawHyperspace, makeStreaks, prepareCanvas } from '../lib/hyperspace';
import { useSide } from '../context/SideContext';

gsap.registerPlugin(ScrollTrigger);

interface HyperspaceValue {
  jump: (id: string) => void;
}

const HyperspaceContext = createContext<HyperspaceValue>({ jump: (id) => scrollToId(id) });

/**
 * Transição de navegação: salto para o hiperespaço.
 * Estrelas viram rastros, flash branco→vermelho, e a página já está na seção destino.
 */
export function HyperspaceProvider({ children }: { children: ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const busy = useRef(false);
  const { config } = useSide();
  const tint = config.hyperTint;
  const flashRgb = config.hyperFlash;
  const dimRgb = config.hyperDim;

  const jump = useCallback((id: string) => {
    const canvas = canvasRef.current;
    if (!canvas || busy.current || prefersReducedMotion()) {
      scrollToId(id, { immediate: prefersReducedMotion() });
      return;
    }
    const w = window.innerWidth;
    const h = window.innerHeight;
    const ctx = prepareCanvas(canvas, w, h);
    if (!ctx) {
      scrollToId(id);
      return;
    }
    busy.current = true;

    const streaks = makeStreaks(240, Math.max(w, h) * 0.6);
    const state = { p: 0 };
    const draw = () => drawHyperspace(ctx, w, h, state.p, streaks, { tint, flashRgb, dimRgb });

    canvas.style.opacity = '1';
    canvas.style.pointerEvents = 'auto';

    gsap
      .timeline({
        onComplete: () => {
          canvas.style.opacity = '0';
          canvas.style.pointerEvents = 'none';
          ctx.clearRect(0, 0, w, h);
          busy.current = false;
        },
      })
      .to(state, { p: 1, duration: 0.72, ease: 'power3.in', onUpdate: draw })
      .call(() => {
        scrollToId(id, { immediate: true });
        ScrollTrigger.update();
      })
      .to(state, { p: 0, duration: 0.62, ease: 'power3.out', onUpdate: draw });
  }, [tint, flashRgb, dimRgb]);

  return (
    <HyperspaceContext.Provider value={{ jump }}>
      {children}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-[80] opacity-0"
        aria-hidden
      />
    </HyperspaceContext.Provider>
  );
}

export function useHyperspace() {
  return useContext(HyperspaceContext);
}
