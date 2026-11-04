import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { LANGS, LANG_LOCALE, translate, type Lang } from './messages';
import { localizedDossier, localizedExperiences, localizedProfile, localizedProjects } from './data';

const KEY = 'force-lang-v1';

function detect(): Lang {
  try {
    const stored = localStorage.getItem(KEY);
    if (stored && (LANGS as string[]).includes(stored)) return stored as Lang;
  } catch {
    /* storage indisponível */
  }
  const nav = (navigator.language || 'pt').toLowerCase();
  if (nav.startsWith('es')) return 'es';
  if (nav.startsWith('en')) return 'en';
  return 'pt';
}

interface LangValue {
  lang: Lang;
  locale: string;
  setLang: (l: Lang) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
  profile: ReturnType<typeof localizedProfile>;
  dossier: ReturnType<typeof localizedDossier>;
  experiences: ReturnType<typeof localizedExperiences>;
  projects: ReturnType<typeof localizedProjects>;
}

const LangContext = createContext<LangValue | null>(null);

/** Idioma do site (português, inglês ou espanhol): textos de interface e dados do currículo. */
export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detect);

  useEffect(() => {
    document.documentElement.lang = LANG_LOCALE[lang];
    document.title = translate(lang, 'meta.title');
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<LangValue>(
    () => ({
      lang,
      locale: LANG_LOCALE[lang],
      setLang,
      t: (key, vars) => translate(lang, key, vars),
      profile: localizedProfile(lang),
      dossier: localizedDossier(lang),
      experiences: localizedExperiences(lang),
      projects: localizedProjects(lang),
    }),
    [lang, setLang]
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang deve ser usado dentro de LangProvider');
  return ctx;
}
