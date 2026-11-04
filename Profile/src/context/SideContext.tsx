import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { SIDES, type SideConfig, type SideId } from '../data/sides';
import { useLang } from '../i18n/LangContext';
import { sideCopy, sideName } from '../i18n/sideCopy';

const KEY = 'force-side-v1';
const SKIP_KEY = 'force-side-skip';

function readStored(): SideId | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'sith' || v === 'rebel' ? v : null;
  } catch {
    return null;
  }
}

/** Lado a aplicar sem perguntar (logo depois de "trocar de lado"); consome a flag. */
export function consumeAutoSide(): SideId | null {
  try {
    if (localStorage.getItem(SKIP_KEY) !== '1') return null;
    localStorage.removeItem(SKIP_KEY);
    return readStored();
  } catch {
    return null;
  }
}

interface SideValue {
  /** Lado escolhido nesta visita (null até a tela de carregamento perguntar). */
  side: SideId | null;
  /** Configuração em vigor (do lado escolhido, do lembrado, ou Sith por padrão), com as falas no idioma atual. */
  config: SideConfig;
  remembered: SideId | null;
  choose: (s: SideId) => void;
  /** Troca o lado e recarrega a página já no outro tema. */
  switchSide: () => void;
  /** Nome de um lado no idioma atual. */
  nameOf: (s: SideId) => string;
}

const SideContext = createContext<SideValue | null>(null);

export function SideProvider({ children }: { children: ReactNode }) {
  const { lang } = useLang();
  const [side, setSide] = useState<SideId | null>(null);
  const [remembered] = useState<SideId | null>(readStored);
  const effective: SideId = side ?? remembered ?? 'sith';

  useEffect(() => {
    document.documentElement.dataset.side = effective;
  }, [effective]);

  const choose = useCallback((s: SideId) => {
    setSide(s);
    try {
      localStorage.setItem(KEY, s);
    } catch {
      /* storage indisponível */
    }
  }, []);

  const switchSide = useCallback(() => {
    const next: SideId = effective === 'sith' ? 'rebel' : 'sith';
    try {
      localStorage.setItem(KEY, next);
      localStorage.setItem(SKIP_KEY, '1');
    } catch {
      /* storage indisponível */
    }
    // Recarrega no topo: sem restaurar a posição do scroll, a página volta à intro do outro lado.
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    window.location.reload();
  }, [effective]);

  const value = useMemo<SideValue>(
    () => ({
      side,
      config: { ...SIDES[effective], name: sideName(effective, lang), copy: sideCopy(effective, lang) },
      remembered,
      choose,
      switchSide,
      nameOf: (s: SideId) => sideName(s, lang),
    }),
    [side, effective, remembered, choose, switchSide, lang]
  );

  return <SideContext.Provider value={value}>{children}</SideContext.Provider>;
}

export function useSide() {
  const ctx = useContext(SideContext);
  if (!ctx) throw new Error('useSide deve ser usado dentro de SideProvider');
  return ctx;
}
