import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { SKINS, UNLOCKABLE, type Skin, type SkinId } from '../lib/sprites';
import { CRYSTALS_PER_PROJECT, PROJECTS } from '../data/profile';
import { useSide } from './SideContext';

const STORAGE_KEY = 'sith-inventory-v1';

interface Stored {
  skinId: SkinId;
  collected: string[];
}

interface SkinContextValue {
  skin: Skin;
  skinId: SkinId;
  setSkinId: (id: SkinId) => void;
  crystals: number;
  totalCrystals: number;
  collected: Set<string>;
  collect: (projectId: string) => boolean;
  isUnlocked: (id: SkinId) => boolean;
}

const SkinContext = createContext<SkinContextValue | null>(null);

function load(): Stored {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<Stored>;
      const skinId = parsed.skinId && parsed.skinId in SKINS ? parsed.skinId : 'aprendiz';
      return { skinId, collected: Array.isArray(parsed.collected) ? parsed.collected : [] };
    }
  } catch {
    /* storage indisponível */
  }
  return { skinId: 'aprendiz', collected: [] };
}

export function SkinProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Stored>(load);
  const { config } = useSide();
  // Na Resistência o mascote é o Jedi; as patentes Sith do inventário valem para o lado sombrio.
  const skinId: SkinId = config.id === 'rebel' ? config.skin : state.skinId;

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);

  const totalCrystals = PROJECTS.length * CRYSTALS_PER_PROJECT;
  const crystals = Math.min(totalCrystals, state.collected.length * CRYSTALS_PER_PROJECT);

  const isUnlocked = useCallback(
    (id: SkinId) => {
      const rule = UNLOCKABLE.find((u) => u.id === id);
      if (!rule) return false;
      return crystals >= rule.threshold;
    },
    [crystals]
  );

  const setSkinId = useCallback(
    (id: SkinId) => {
      if (!isUnlocked(id)) return;
      setState((s) => ({ ...s, skinId: id }));
    },
    [isUnlocked]
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

  const value = useMemo<SkinContextValue>(
    () => ({
      skin: SKINS[skinId],
      skinId,
      setSkinId,
      crystals,
      totalCrystals,
      collected: new Set(state.collected),
      collect,
      isUnlocked,
    }),
    [skinId, state.collected, setSkinId, crystals, totalCrystals, collect, isUnlocked]
  );

  return <SkinContext.Provider value={value}>{children}</SkinContext.Provider>;
}

export function useSkin() {
  const ctx = useContext(SkinContext);
  if (!ctx) throw new Error('useSkin deve ser usado dentro de SkinProvider');
  return ctx;
}
