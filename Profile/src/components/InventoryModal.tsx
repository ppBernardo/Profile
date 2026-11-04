import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import PixelSprite from './PixelSprite';
import Mascot from './Mascot';
import { useSkin } from '../context/SkinContext';
import { SKINS, type SkinId } from '../lib/sprites';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function InventoryModal({ open, onClose }: Props) {
  const { skin, skinId, setSkinId, crystals, totalCrystals, isUnlocked, unlockables } = useSkin();
  const [say, setSay] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setSay('minha ficha.');
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const pick = (id: SkinId) => {
    if (!isUnlocked(id) || id === skinId) return;
    setSkinId(id);
    setSay(`${SKINS[id].name.toLowerCase()}. agora sim.`);
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Inventário">
      <button
        type="button"
        className="absolute inset-0 bg-sith-void/80 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Fechar inventário"
      />
      <div
        className="relative w-full max-w-[460px] border-2 border-sith-goldDim bg-[#120d0f] p-6 shadow-[0_0_0_1px_#2a1f12,0_40px_80px_-20px_rgba(0,0,0,0.9)] sm:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 p-1.5 text-sith-muted hover:text-sith-ink"
          aria-label="Fechar"
        >
          <X size={16} />
        </button>

        <div className="flex items-start justify-between gap-5">
          <div className="min-w-0 flex-1">
            <p className="font-display text-3xl font-medium tracking-wide text-sith-ink">Inventário</p>
            <p className="mt-1 font-mono text-[10px] tracking-[0.14em] text-sith-faint">
              troca o que estiver liberado.
            </p>
            <p className="eyebrow mt-6">personagem</p>
            <p className="mt-1 font-display text-2xl uppercase tracking-[0.08em] text-sith-ink">
              {skin.name}
            </p>
            <p className="mt-1 font-pixel text-lg text-sith-muted">
              {crystals} de {totalCrystals} cristais{crystals >= totalCrystals ? '. todos.' : '.'}
            </p>
          </div>
          <div className="shrink-0 pr-4 pt-14">
            <Mascot pose="idle" scale={4} say={say} bubbleGap={8} />
          </div>
        </div>

        <p className="eyebrow mt-7">patente</p>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {unlockables.map(({ id, threshold }) => {
            const s = SKINS[id];
            const unlocked = isUnlocked(id);
            const active = id === skinId;
            return (
              <button
                key={id}
                type="button"
                onClick={() => pick(id)}
                disabled={!unlocked}
                className={`flex flex-col items-center gap-2 border-2 px-2 pb-3 pt-4 transition-colors ${
                  active
                    ? 'border-sith-gold bg-[#2a2112]'
                    : unlocked
                      ? 'border-[#3a2d20] bg-[#1a1412] hover:border-sith-gold/70'
                      : 'cursor-not-allowed border-[#241c1a] bg-[#120e0f] opacity-55'
                }`}
                aria-pressed={active}
              >
                <PixelSprite frame="idle" skin={s} scale={3} />
                <span className="font-display text-base uppercase tracking-[0.1em] text-sith-ink">
                  {s.name.split(' ')[0]}
                </span>
                <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-sith-faint">
                  {active ? 'em uso' : unlocked ? 'liberado' : `${threshold} cristais`}
                </span>
              </button>
            );
          })}
        </div>

        <p className="mt-5 font-mono text-[10px] leading-relaxed tracking-[0.1em] text-sith-faint">
          Abra holocrons na seção de projetos para coletar cristais kyber e liberar patentes.
        </p>
      </div>
    </div>
  );
}
