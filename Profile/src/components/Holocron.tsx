interface Props {
  open: boolean;
  size: number;
  numeral: string;
  dim?: boolean;
  /** Cristal vermelho (Sith) ou azul (Jedi). */
  hue?: 'crimson' | 'azure';
}

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

const HUES = {
  crimson: { l0: '#8e1419', l1: '#3a070b', r0: '#d8262e', r1: '#6d0f15', beam0: '#ff6b6b', beam: '#ff2a2a', core0: '#ffd9d9', core1: '#ff4040' },
  azure: { l0: '#143f8e', l1: '#07183a', r0: '#2a7fd8', r1: '#0f3a6d', beam0: '#7ab8ff', beam: '#3a9bff', core0: '#dceeff', core1: '#4aa8ff' },
};

/**
 * Holocron — pirâmide de cristal com arestas douradas.
 * A tampa levanta e um feixe de luz sobe quando `open` é verdadeiro.
 */
export default function Holocron({ open, size, numeral, dim = false, hue = 'crimson' }: Props) {
  const id = `holo-${numeral}`;
  const c = HUES[hue];
  return (
    <svg
      width={size}
      height={size * 1.1}
      viewBox="0 0 120 132"
      className={open ? 'holo-pulse' : ''}
      style={{
        overflow: 'visible',
        filter: dim ? 'grayscale(0.4) brightness(0.55)' : undefined,
        transition: `filter 0.6s ${EASE}`,
      }}
      aria-hidden
    >
      <defs>
        <linearGradient id={`${id}-l`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={c.l0} />
          <stop offset="1" stopColor={c.l1} />
        </linearGradient>
        <linearGradient id={`${id}-r`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={c.r0} />
          <stop offset="1" stopColor={c.r1} />
        </linearGradient>
        <linearGradient id={`${id}-beam`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor={c.beam0} stopOpacity="0.85" />
          <stop offset="0.5" stopColor={c.beam} stopOpacity="0.28" />
          <stop offset="1" stopColor={c.beam} stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${id}-core`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={c.core0} />
          <stop offset="0.4" stopColor={c.core1} />
          <stop offset="1" stopColor={c.beam} stopOpacity="0" />
        </radialGradient>
        <clipPath id={`${id}-top`}>
          <rect x="-20" y="-60" width="160" height="110" />
        </clipPath>
        <clipPath id={`${id}-bottom`}>
          <rect x="-20" y="50" width="160" height="90" />
        </clipPath>
      </defs>

      {/* Pedestal */}
      <rect x="16" y="112" width="88" height="10" style={{ fill: 'var(--surface)', stroke: 'var(--raised)' }} />
      <rect x="22" y="110" width="76" height="2" fill="#c9a44c" opacity="0.55" />

      {/* Feixe de luz */}
      <g style={{ opacity: open ? 1 : 0, transition: `opacity 0.5s ${EASE}` }}>
        <polygon points="44,50 76,50 118,-70 2,-70" fill={`url(#${id}-beam)`} />
        <ellipse cx="60" cy="50" rx="24" ry="8" fill={`url(#${id}-core)`} />
      </g>

      {/* Metade de baixo */}
      <g clipPath={`url(#${id}-bottom)`}>
        <polygon points="60,14 12,92 60,112" fill={`url(#${id}-l)`} />
        <polygon points="60,14 60,112 108,92" fill={`url(#${id}-r)`} />
        <polyline points="12,92 60,112 108,92" fill="none" stroke="#c9a44c" strokeWidth="1.4" />
        <line x1="60" y1="14" x2="60" y2="112" stroke="#e6c467" strokeWidth="1.2" />
        <line x1="60" y1="14" x2="12" y2="92" stroke="#c9a44c" strokeWidth="1.2" />
        <line x1="60" y1="14" x2="108" y2="92" stroke="#c9a44c" strokeWidth="1.2" />
        {/* Rebites */}
        {[0.25, 0.5, 0.75].map((t) => (
          <g key={t}>
            <circle cx={12 + (60 - 12) * t} cy={92 + (112 - 92) * t} r="1.4" fill="#e6c467" />
            <circle cx={60 + (108 - 60) * t} cy={112 - (112 - 92) * t} r="1.4" fill="#e6c467" />
          </g>
        ))}
        <text
          x="79"
          y="86"
          textAnchor="middle"
          fontFamily="'Cormorant Garamond', serif"
          fontSize="17"
          fontWeight="500"
          fill="#f0dca6"
          opacity="0.95"
        >
          {numeral}
        </text>
      </g>

      {/* Tampa */}
      <g
        clipPath={`url(#${id}-top)`}
        style={{
          transform: open ? 'translate(0px, -18px) rotate(-7deg)' : 'translate(0px, 0px) rotate(0deg)',
          transformOrigin: '60px 50px',
          transition: `transform 0.7s ${EASE}`,
        }}
      >
        <polygon points="60,14 12,92 60,112" fill={`url(#${id}-l)`} />
        <polygon points="60,14 60,112 108,92" fill={`url(#${id}-r)`} />
        <line x1="60" y1="14" x2="60" y2="112" stroke="#e6c467" strokeWidth="1.2" />
        <line x1="60" y1="14" x2="12" y2="92" stroke="#c9a44c" strokeWidth="1.2" />
        <line x1="60" y1="14" x2="108" y2="92" stroke="#c9a44c" strokeWidth="1.2" />
        <circle cx="60" cy="13" r="2.2" fill="#e6c467" />
      </g>

      {/* Linha de corte */}
      <line x1="38" y1="50" x2="82" y2="50" stroke="#e6c467" strokeWidth="0.8" opacity={open ? 0 : 0.5} />
    </svg>
  );
}
