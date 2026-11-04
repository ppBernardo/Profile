import type { CSSProperties } from 'react';

export type PodVariant = 'anakin' | 'sebulba' | 'gasgano';

const VARIANTS: Record<PodVariant, { body: string; dark: string; pod: string; accent: string; flame: string }> = {
  anakin: { body: '#d9d0b8', dark: '#8f8673', pod: '#cfc6ad', accent: '#4aa8ff', flame: '#9fd0ff' },
  sebulba: { body: '#e27b2a', dark: '#8a4716', pod: '#d9a24a', accent: '#ff5a3c', flame: '#ffb347' },
  gasgano: { body: '#7aa35a', dark: '#4a6a36', pod: '#c9c25a', accent: '#ffe15a', flame: '#ffd36a' },
};

interface Props {
  variant?: PodVariant;
  /** Largura em px (a proporção é 3:1). */
  width?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * Podracer de Tatooine visto de lado, voando para a esquerda: dois motores ligados pelo
 * arco de energia, chamas que tremulam e o pod do piloto puxado pelos cabos. Deixa poeira atrás.
 */
export default function PodRacer({ variant = 'anakin', width = 240, className = '', style }: Props) {
  const c = VARIANTS[variant];
  return (
    <div className={`pointer-events-none relative ${className}`} style={{ width, height: width / 3, ...style }} aria-hidden>
      {/* Poeira levantada pelos motores */}
      <span
        className="pod-dust absolute left-[12%] top-[55%] h-[70%] w-[120%]"
        style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(214,178,118,0.55), rgba(214,178,118,0) 70%)' }}
      />
      <svg viewBox="0 0 120 40" className="pod-bob relative block h-full w-full" style={{ overflow: 'visible' }}>
        {/* Motor de trás (mais alto, mais escuro) */}
        <g transform="translate(6 0)">
          <rect x="0" y="2" width="68" height="12" rx="6" fill={c.dark} />
          <rect x="0" y="4" width="6" height="8" rx="3" fill="#2a2420" />
          <rect x="24" y="2" width="3" height="12" fill="#2a2420" opacity="0.5" />
          <g transform="translate(68 8)">
            <g className="pod-flame">
              <ellipse cx="7" cy="0" rx="9" ry="3" fill={c.flame} opacity="0.8" />
              <ellipse cx="5" cy="0" rx="5" ry="1.5" fill="#fff3c0" />
            </g>
          </g>
        </g>

        {/* Arco de energia entre os motores */}
        <path d="M8 13 Q 10 7 13 3" stroke="#b58cff" strokeWidth="1.4" fill="none" className="pod-binder" />
        <path d="M8 13 Q 11 8 13 3" stroke="#ffffff" strokeWidth="0.5" fill="none" opacity="0.7" />

        {/* Motor da frente */}
        <rect x="0" y="12" width="70" height="14" rx="7" fill={c.body} />
        <rect x="10" y="13" width="48" height="3.5" rx="1.8" fill="#ffffff" opacity="0.28" />
        <rect x="0" y="14" width="7" height="10" rx="3.5" fill="#2a2420" />
        <rect x="26" y="12" width="3" height="14" fill={c.dark} />
        <rect x="46" y="12" width="3" height="14" fill={c.dark} />
        <rect x="56" y="16" width="10" height="6" rx="1" fill={c.dark} opacity="0.6" />
        <g transform="translate(70 19)">
          <g className="pod-flame">
            <ellipse cx="9" cy="0" rx="11" ry="3.6" fill={c.flame} opacity="0.85" />
            <ellipse cx="6" cy="0" rx="6" ry="1.8" fill="#fff6d0" />
          </g>
        </g>

        {/* Cabos até o pod do piloto */}
        <line x1="70" y1="17" x2="95" y2="24" stroke="#5a5048" strokeWidth="1" />
        <line x1="74" y1="9" x2="97" y2="22" stroke="#5a5048" strokeWidth="1" />

        {/* Pod do piloto */}
        <rect x="94" y="19" width="24" height="12" rx="6" fill={c.pod} />
        <rect x="96" y="20" width="18" height="3" rx="1.5" fill="#ffffff" opacity="0.25" />
        <rect x="100" y="15" width="11" height="6" rx="3" fill={c.accent} opacity="0.9" />
        <circle cx="106" cy="18" r="2.4" fill="#3a2a1a" />
        <rect x="112" y="23" width="8" height="2.5" rx="1" fill={c.dark} />
      </svg>
    </div>
  );
}
