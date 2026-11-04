import type { CSSProperties } from 'react';

interface Props {
  /** Largura em px (a proporção é 16:7). */
  width?: number;
  className?: string;
  style?: CSSProperties;
}

const BODY = '#d9d0b8';
const DARK = '#8f8673';
const POD = '#cfc6ad';
const BURN = '#3a2d26';

/**
 * Podracer acidentado no pátio: motor principal tombado e amassado, o outro arrancado,
 * cabos soltos, o pod do piloto virado e fumaça subindo do motor.
 */
export default function PodWreck({ width = 260, className = '', style }: Props) {
  const height = (width * 7) / 16;
  return (
    <div className={`pointer-events-none relative ${className}`} style={{ width, height, ...style }} aria-hidden>
      {/* Fumaça saindo do motor tombado */}
      {[0, 0.9, 1.7, 2.3].map((delay, i) => (
        <span
          key={i}
          className="pod-smoke"
          style={{
            left: `${38 + i * 4}%`,
            top: '34%',
            animationDelay: `${delay}s`,
            background: 'radial-gradient(circle, rgba(70,58,52,0.8), rgba(70,58,52,0) 70%)',
          }}
        />
      ))}

      <svg viewBox="0 0 160 70" className="relative block h-full w-full" style={{ overflow: 'visible' }}>
        {/* Chamuscado no chão e destroços */}
        <ellipse cx="62" cy="63" rx="56" ry="5" fill={BURN} opacity="0.32" />
        <ellipse cx="128" cy="64" rx="16" ry="3" fill={BURN} opacity="0.22" />
        <rect x="88" y="58" width="6" height="3" fill={DARK} />
        <rect x="100" y="60" width="4" height="2" fill={BURN} />
        <rect x="18" y="60" width="5" height="2.5" fill={DARK} />

        {/* Motor arrancado, fincado no chão em ângulo */}
        <g transform="rotate(32 30 40)">
          <rect x="2" y="34" width="50" height="12" rx="6" fill={DARK} />
          <rect x="2" y="36" width="6" height="8" rx="3" fill="#2a2420" />
          <rect x="20" y="34" width="3" height="12" fill="#2a2420" opacity="0.5" />
          <polygon points="52,34 46,38 54,41 47,44 52,46" fill={BURN} />
        </g>

        {/* Motor principal tombado e amassado */}
        <g transform="rotate(-9 60 50)">
          <rect x="16" y="42" width="72" height="14" rx="7" fill={BODY} />
          <rect x="26" y="43" width="40" height="3" rx="1.5" fill="#ffffff" opacity="0.25" />
          <rect x="16" y="44" width="7" height="10" rx="3.5" fill="#2a2420" />
          <rect x="42" y="42" width="3" height="14" fill={DARK} />
          <path d="M60 42 l6 5 l-4 4 l6 5" stroke={BURN} strokeWidth="1.2" fill="none" />
          <polygon points="88,42 82,46 90,49 83,53 88,56 76,56 76,42" fill={BURN} />
          <ellipse cx="78" cy="49" rx="9" ry="5" fill="#1d1715" opacity="0.6" />
          {/* brasas no rasgo */}
          <circle cx="80" cy="47" r="1.3" fill="#ff8a3c" className="pod-ember" />
          <circle cx="84" cy="51" r="1" fill="#ffb347" className="pod-ember" style={{ animationDelay: '0.4s' }} />
        </g>

        {/* Cabos soltos, caídos no chão */}
        <path d="M86 46 C 96 52, 100 60, 112 58" stroke="#5a5048" strokeWidth="1" fill="none" />
        <path d="M84 40 C 98 44, 104 56, 116 54" stroke="#5a5048" strokeWidth="1" fill="none" />

        {/* Pod do piloto virado de lado */}
        <g transform="rotate(-38 128 52)">
          <rect x="116" y="46" width="24" height="12" rx="6" fill={POD} />
          <rect x="118" y="47" width="18" height="3" rx="1.5" fill="#ffffff" opacity="0.25" />
          <rect x="122" y="42" width="11" height="6" rx="3" fill="#4aa8ff" opacity="0.85" />
          <path d="M124 43 l3 3 l-2 2" stroke="#ffffff" strokeWidth="0.6" fill="none" opacity="0.8" />
          <rect x="134" y="50" width="8" height="2.5" rx="1" fill={DARK} />
        </g>
      </svg>
    </div>
  );
}
