import { useEffect, useLayoutEffect, useRef, useState } from 'react';

interface Props {
  text: string;
  speed?: number;
  /** Distância (px) entre a ponta do balão e o topo do sprite. */
  gap?: number;
}

export default function SpeechBubble({ text, speed = 26, gap = 10 }: Props) {
  const [shown, setShown] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const [shift, setShift] = useState(0);

  useEffect(() => {
    setShown('');
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) window.clearInterval(id);
    }, speed);
    return () => window.clearInterval(id);
  }, [text, speed]);

  // O balão reserva a largura do texto completo, então dá para medir antes de digitar.
  // Mantém o balão dentro da viewport; a "cauda" continua apontando para o mascote.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const base = el.getBoundingClientRect();
      const pad = 10;
      let s = 0;
      const left = base.left - shiftRef.current;
      const right = base.right - shiftRef.current;
      if (left < pad) s = pad - left;
      else if (right > window.innerWidth - pad) s = window.innerWidth - pad - right;
      shiftRef.current = s;
      setShift(s);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [text]);

  const shiftRef = useRef(0);
  const done = shown.length >= text.length;
  const wrap = text.length > 26;

  return (
    <div
      ref={ref}
      className="pixel-bubble pointer-events-none absolute left-1/2 z-30"
      style={{
        bottom: `calc(100% + ${gap}px)`,
        transform: `translateX(calc(-50% + ${shift}px))`,
        ['--tail' as string]: `calc(50% - ${shift}px)`,
        width: 'max-content',
        maxWidth: 'min(78vw, 360px)',
        whiteSpace: wrap ? 'normal' : 'nowrap',
        textAlign: 'center',
      }}
      role="status"
    >
      <span className="invisible" aria-hidden>
        {text}
      </span>
      <span className={`absolute inset-0 px-[11px] pb-[6px] pt-[7px] ${done ? '' : 'caret'}`}>{shown}</span>
      <style>{`.pixel-bubble::after{left:var(--tail,50%)}`}</style>
    </div>
  );
}
