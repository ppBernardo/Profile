import { memo, useMemo, type CSSProperties } from 'react';
import {
  ANCHOR_SETS,
  FRAME_SETS,
  SPRITE_H,
  SPRITE_W,
  paletteOf,
  type FrameName,
  type Skin,
} from '../lib/sprites';

interface Props {
  frame: FrameName;
  skin: Skin;
  scale?: number;
  flip?: boolean;
  saberOn?: boolean;
  className?: string;
  style?: CSSProperties;
}

function PixelSprite({ frame, skin, scale = 4, flip = false, saberOn = false, className, style }: Props) {
  const rects = useMemo(() => {
    const pal = paletteOf(skin);
    const rows = FRAME_SETS[skin.sprite][frame];
    const out: { x: number; y: number; c: string }[] = [];
    rows.forEach((row, y) => {
      for (let x = 0; x < row.length; x++) {
        const c = pal[row[x]];
        if (c) out.push({ x, y, c });
      }
    });
    return out;
  }, [frame, skin]);

  const anchor = ANCHOR_SETS[skin.sprite][frame];

  return (
    <svg
      width={SPRITE_W * scale}
      height={SPRITE_H * scale}
      viewBox={`0 0 ${SPRITE_W} ${SPRITE_H}`}
      shapeRendering="crispEdges"
      className={className}
      style={{ display: 'block', overflow: 'visible', ...style }}
      aria-hidden
    >
      <g transform={flip ? `translate(${SPRITE_W} 0) scale(-1 1)` : undefined}>
        {rects.map((r) => (
          <rect key={`${r.x}-${r.y}`} x={r.x} y={r.y} width={1} height={1} fill={r.c} />
        ))}
        {anchor && (
          <g transform={`translate(${anchor.x} ${anchor.y}) rotate(${anchor.angle})`}>
            <rect x={0} y={-0.5} width={2.4} height={1} fill={skin.hiltLight} />
            <rect x={0.7} y={-0.5} width={0.6} height={1} fill={skin.hiltDark} />
            <rect x={1.7} y={-0.5} width={0.4} height={1} fill={skin.hiltDark} />
            {saberOn && (
              <g
                shapeRendering="geometricPrecision"
                style={{
                  filter: `drop-shadow(0 0 1.1px ${skin.saber}) drop-shadow(0 0 2.5px ${skin.saber})`,
                  transformBox: 'fill-box',
                  transformOrigin: '0% 50%',
                  animation: 'saber-ignite 0.32s cubic-bezier(0.2, 0.9, 0.3, 1.2)',
                }}
              >
                <rect x={2.4} y={-0.46} width={7.2} height={0.92} rx={0.46} fill={skin.saber} />
                <rect x={2.7} y={-0.2} width={6.6} height={0.4} rx={0.2} fill={skin.saberCore} />
              </g>
            )}
          </g>
        )}
      </g>
    </svg>
  );
}

export default memo(PixelSprite);
