import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface Props {
  progress: number;
  finished: boolean;
  onComplete: () => void;
}

export default function LoadingScreen({ progress, finished, onComplete }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const hasExited = useRef(false);

  useEffect(() => {
    if (!barRef.current || !percentRef.current) return;

    gsap.to(barRef.current, {
      width: `${progress}%`,
      duration: 0.5,
      ease: 'power2.out',
    });

    gsap.to(percentRef.current, {
      textContent: progress,
      duration: 0.4,
      snap: { textContent: 1 },
      ease: 'power1.out',
    });
  }, [progress]);

  useEffect(() => {
    if (!finished || hasExited.current || !containerRef.current) return;
    hasExited.current = true;

    const tl = gsap.timeline({
      onComplete,
    });

    tl.to(containerRef.current, {
      opacity: 0,
      duration: 0.8,
      delay: 0.35,
      ease: 'power3.inOut',
    });
  }, [finished, onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center"
    >
      <div className="flex flex-col items-center gap-8 w-full max-w-md px-8">
        {/* Logo / título */}
        <div className="text-center">
          <p className="font-display text-4xl sm:text-5xl text-vader-red text-glow-red tracking-[0.2em]">
            VADER
          </p>
          <p className="font-mono text-[10px] text-gray-600 tracking-[0.4em] uppercase mt-2">
            Inicializando sistema
          </p>
        </div>

        {/* Barra de progresso */}
        <div className="w-full">
          <div className="relative w-full h-[2px] bg-vader-border overflow-hidden rounded-full">
            <div
              ref={barRef}
              className="absolute inset-y-0 left-0 bg-vader-red rounded-full"
              style={{ width: '0%', boxShadow: '0 0 12px rgba(255,0,0,0.6), 0 0 30px rgba(255,0,0,0.2)' }}
            />
          </div>

          <div className="flex justify-between items-center mt-3">
            <p className="font-mono text-[10px] text-gray-700 tracking-wider">
              Carregando assets 3D...
            </p>
            <p className="font-mono text-xs text-vader-red">
              <span ref={percentRef}>0</span>
              <span className="text-gray-600">%</span>
            </p>
          </div>
        </div>

        {/* Indicador pulsante */}
        <div className="flex items-center gap-2 mt-4">
          <span className="w-1.5 h-1.5 rounded-full bg-vader-red animate-pulse-red" />
          <span className="font-mono text-[9px] text-gray-600 uppercase tracking-[0.3em]">
            {finished ? 'Pronto' : 'Processando'}
          </span>
        </div>
      </div>
    </div>
  );
}
