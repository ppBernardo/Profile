import { forwardRef, useEffect, useState, type CSSProperties } from 'react';
import PixelSprite from './PixelSprite';
import SpeechBubble from './SpeechBubble';
import { useSkin } from '../context/SkinContext';
import { SKINS, SPRITE_H, SPRITE_W, type FrameName, type SkinId } from '../lib/sprites';

export type Pose = 'idle' | 'walk' | 'jump' | 'swing' | 'hammer' | 'pull' | 'sleep' | 'salute' | 'kneel';

export interface MascotProps {
  pose?: Pose;
  facing?: 'left' | 'right';
  scale?: number;
  saberOn?: boolean;
  say?: string | null;
  /** Força uma skin específica (ex.: o duelista "sombra"). */
  skinId?: SkinId;
  bob?: boolean;
  className?: string;
  style?: CSSProperties;
  bubbleGap?: number;
}

const Mascot = forwardRef<HTMLDivElement, MascotProps>(function Mascot(
  {
    pose = 'idle',
    facing = 'right',
    scale = 4,
    saberOn,
    say = null,
    skinId,
    bob = true,
    className = '',
    style,
    bubbleGap,
  },
  ref
) {
  const { skin: currentSkin } = useSkin();
  const skin = skinId ? SKINS[skinId] : currentSkin;
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (pose !== 'walk' && pose !== 'hammer') return;
    const ms = pose === 'walk' ? 140 : 210;
    const id = window.setInterval(() => setTick((t) => t + 1), ms);
    return () => window.clearInterval(id);
  }, [pose]);

  let frame: FrameName = 'idle';
  if (pose === 'walk') frame = tick % 2 === 0 ? 'walk1' : 'walk2';
  else if (pose === 'hammer') frame = tick % 2 === 0 ? 'swing' : 'idle';
  else frame = pose;

  const saber = saberOn ?? (pose === 'hammer' || pose === 'swing' || pose === 'salute');

  return (
    <div
      ref={ref}
      className={`relative ${className}`}
      style={{ width: SPRITE_W * scale, height: SPRITE_H * scale, ...style }}
    >
      {say && <SpeechBubble text={say} gap={bubbleGap} />}
      <div className={bob && (pose === 'idle' || pose === 'sleep') ? 'animate-bob' : ''}>
        <PixelSprite frame={frame} skin={skin} scale={scale} flip={facing === 'left'} saberOn={saber} />
      </div>
      {pose === 'sleep' && (
        <>
          <span className="sleep-z text-lg" style={{ right: -4, top: -6, animationDelay: '0s' }}>
            z
          </span>
          <span className="sleep-z text-xl" style={{ right: -10, top: -10, animationDelay: '0.8s' }}>
            z
          </span>
          <span className="sleep-z text-2xl" style={{ right: -16, top: -14, animationDelay: '1.6s' }}>
            z
          </span>
        </>
      )}
    </div>
  );
});

export default Mascot;
