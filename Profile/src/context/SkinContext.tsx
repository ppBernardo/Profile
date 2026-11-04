import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { SKINS, UNLOCKABLE_BY_SIDE, type ForceSide, type Skin, type SkinId, type UnlockRule } from '../lib/sprites';
import { CRYSTALS_PER_PROJECT, PROJECTS } from '../data/profile';
import { useSide } from './SideContext';

const STORAGE_KEY = 'sith-inventory-v2';

interface Stored {
  /** Personagem escolhido em cada lado da Força. */
  skins: Record<ForceSide, SkinId>;
  collected: string[];
}

interface SkinContextValue {
  skin: Skin;
  skinId: SkinId;
  setSkinId: (id: SkinId) => void;
  /** Patentes do lado atual, em ordem de liberação. */
  unlockables: UnlockRule[];
  crystals: number;
  totalCrystals: number;
  collected: Set<string>;
  collect: (projectId: string) => boolean;
  isUnlocked: (id: SkinId) => boolean;
}

const SkinContext = createContext<SkinContextValue | null>(null);

const DEFAULT_SKINS: Record<ForceSide, SkinId> = {
  sith: UNLOCKABLE_BY_SIDE.sith[0].id,
  rebel: UNLOCKABLE_BY_SIDE.rebel[0].id,
};

function validSkin(side: ForceSide, id: unknown): SkinId {
  const ok = typeof id === 'string' && UNLOCKABLE_BY_SIDE[side].some((u) => u.id === id);
  return ok ? (id as SkinId) : DEFAULT_SKINS[side];
}

function load(): Stored {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<Stored>;
      return {
        skins: {
          sith: validSkin('sith', parsed.skins?.sith),
          rebel: validSkin('rebel', parsed.skins?.rebel),
        },
        collected: Array.isArray(parsed.collected) ? parsed.collected : [],
      };
    }
    // Versão anterior: só os cristais coletados são aproveitados.
    const legacy = localStorage.getItem('sith-inventory-v1');
    if (legacy) {
      const parsed = JSON.parse(legacy) as { collected?: unknown };
      return { skins: { ...DEFAULT_SKINS }, collected: Array.isArray(parsed.collected) ? (parsed.collected as string[]) : [] };
    }
  } catch {
    /* storage indisponível */
  }
  return { skins: { ...DEFAULT_SKINS }, collected: [] };
}

export function SkinProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Stored>(load);
  const { config } = useSide();
  const side: ForceSide = config.id;

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);

  const totalCrystals = PROJECTS.length * CRYSTALS_PER_PROJECT;
  const crystals = Math.min(totalCrystals, state.collected.length * CRYSTALS_PER_PROJECT);
  const unlockables = UNLOCKABLE_BY_SIDE[side];

  const isUnlocked = useCallback(
    (id: SkinId) => {
      const rule = unlockables.find((u) => u.id === id);
      if (!rule) return false;
      return crystals >= rule.threshold;
    },
    [crystals, unlockables]
  );

  const setSkinId = useCallback(
    (id: SkinId) => {
      if (!isUnlocked(id)) return;
      setState((s) => ({ ...s, skins: { ...s.skins, [side]: id } }));
    },
    [isUnlocked, side]
  );

  const collect = useCallback((projectId: string) => {
    let added = false;
    setState((s) => {
      if (s.collected.includes(projectId)) return s;
      added = true;
      return { ...s, collected: [...s.collected, projectId] };
    });
    return added;
  }, []);

  const skinId = validSkin(side, state.skins[side]);

  const value = useMemo<SkinContextValue>(
    () => ({
      skin: SKINS[skinId],
      skinId,
      setSkinId,
      unlockables,
      crystals,
      totalCrystals,
      collected: new Set(state.collected),
      collect,
      isUnlocked,
    }),
    [skinId, unlockables, state.collected, setSkinId, crystals, totalCrystals, collect, isUnlocked]
  );

  return <SkinContext.Provider value={value}>{children}</SkinContext.Provider>;
}

export function useSkin() {
  const ctx = useContext(SkinContext);
  if (!ctx) throw new Error('useSkin deve ser usado dentro de SkinProvider');
  return ctx;
}
