import { useLang } from '../i18n/LangContext';
import { LANGS, LANG_LABEL, LANG_NAME } from '../i18n/messages';

interface Props {
  className?: string;
  size?: 'sm' | 'md';
}

/** Seletor de idioma: PT · EN · ES. */
export default function LangSwitch({ className = '', size = 'sm' }: Props) {
  const { lang, setLang, t } = useLang();
  const text = size === 'sm' ? 'text-[9px]' : 'text-[11px]';
  return (
    <div className={`inline-flex items-center border border-sith-line ${className}`} role="group" aria-label={t('nav.language')}>
      {LANGS.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          className={`px-2 py-1 font-mono ${text} uppercase tracking-[0.22em] transition-colors ${
            l === lang ? 'bg-sith-crimson/15 text-sith-crimson' : 'text-sith-muted hover:text-sith-ink'
          }`}
          aria-pressed={l === lang}
          title={LANG_NAME[l]}
        >
          {LANG_LABEL[l]}
        </button>
      ))}
    </div>
  );
}
