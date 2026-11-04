/** Falas e títulos de cada lado da Força em inglês e espanhol. O português vive em data/sides.ts. */
import { SIDES, type SideCopy, type SideId } from '../data/sides';
import type { Lang } from './messages';

const EN: Record<SideId, SideCopy> = {
  sith: {
    loading: 'loading the dark side',
    tracking: 'tracking the TIE Fighter',
    tagline: ['a portfolio', 'forged on the', 'dark side.'],
    hero: {
      gift: 'the Empire sent a gift.',
      incoming: 'get down! TIE Fighter!',
      carbonite: "imperial carbonite. from the master.",
      sitter: "don't underestimate the dark side.",
      badge: 'dark side',
      quips: ['the Empire is stronger.', 'scroll down. the master awaits.', 'i keep watch for the Emperor.', "don't blink. he sees everything."],
    },
    fleet: {
      title: ['The fleet of the', 'Empire.'],
      arrived: "the master's fleet.",
      systems: { ponte: 'Command bridge', armas: 'Weapons · turbolasers', hangar: 'Hangar and communications', escudos: 'Deflector shields' },
    },
    contact: { pitch: 'We landed where it all began. Pick a house. The dark side is recruiting.', landing: 'tatooine. i hate sand.' },
    footer: 'the dark side of code',
    switchKicker: 'a call from the other side',
    switchCta: 'There is still light in you',
  },
  rebel: {
    loading: 'loading the Resistance',
    tracking: 'tracking the X-wing',
    tagline: ['a portfolio', 'forged in the', 'Resistance.'],
    hero: {
      gift: 'the Resistance sent a gift.',
      incoming: 'look! an X-wing!',
      carbonite: 'carbonite. courtesy of the Alliance.',
      sitter: 'may the Force be with you.',
      badge: 'resistance',
      quips: ['hope is stronger.', 'scroll down. the base awaits.', 'i keep watch for the Alliance.', "don't blink. the Empire sees everything."],
    },
    fleet: {
      title: ['The fleet of the', 'Resistance.'],
      arrived: "the alliance's fleet.",
      systems: { ponte: 'Cockpit', armas: 'Quad laser cannons', hangar: 'Cargo holds and communications', escudos: 'Deflector shields' },
    },
    contact: { pitch: 'We landed where it all began. Pick a house. The Resistance is recruiting.', landing: 'tatooine. back home.' },
    footer: 'the light side of code',
    switchKicker: "an offer from the Emperor",
    switchCta: 'Join the dark side',
  },
};

const ES: Record<SideId, SideCopy> = {
  sith: {
    loading: 'cargando el lado oscuro',
    tracking: 'rastreando el caza TIE',
    tagline: ['un portafolio', 'forjado en el', 'lado oscuro.'],
    hero: {
      gift: 'el Imperio mandó un regalo.',
      incoming: '¡agáchate! ¡caza TIE!',
      carbonite: 'carbonita imperial. del maestro.',
      sitter: 'no subestimes el lado oscuro.',
      badge: 'lado oscuro',
      quips: ['el Imperio es más fuerte.', 'baja. el maestro espera.', 'vigilo por el Emperador.', 'no parpadees. él lo ve todo.'],
    },
    fleet: {
      title: ['La flota del', 'Imperio.'],
      arrived: 'la flota del maestro.',
      systems: { ponte: 'Puente de mando', armas: 'Armas · turboláseres', hangar: 'Hangar y comunicaciones', escudos: 'Escudos deflectores' },
    },
    contact: { pitch: 'Aterrizamos donde todo empezó. Elige una casa. El lado oscuro está reclutando.', landing: 'tatooine. odio la arena.' },
    footer: 'el lado oscuro del código',
    switchKicker: 'una llamada del otro lado',
    switchCta: 'Aún hay luz en ti',
  },
  rebel: {
    loading: 'cargando la Resistencia',
    tracking: 'rastreando el Ala-X',
    tagline: ['un portafolio', 'forjado en la', 'Resistencia.'],
    hero: {
      gift: 'la Resistencia mandó un regalo.',
      incoming: '¡mira! ¡un Ala-X!',
      carbonite: 'carbonita. cortesía de la Alianza.',
      sitter: 'que la Fuerza te acompañe.',
      badge: 'resistencia',
      quips: ['la esperanza es más fuerte.', 'baja. la base espera.', 'vigilo por la Alianza.', 'no parpadees. el Imperio lo ve todo.'],
    },
    fleet: {
      title: ['La flota de la', 'Resistencia.'],
      arrived: 'la flota de la alianza.',
      systems: { ponte: 'Cabina de mando', armas: 'Cañones cuádruples', hangar: 'Bodegas de carga y comunicaciones', escudos: 'Escudos deflectores' },
    },
    contact: { pitch: 'Aterrizamos donde todo empezó. Elige una casa. La Resistencia está reclutando.', landing: 'tatooine. de vuelta a casa.' },
    footer: 'el lado luminoso del código',
    switchKicker: 'una oferta del Emperador',
    switchCta: 'Únete al lado oscuro',
  },
};

const SIDE_NAME: Record<Exclude<Lang, 'pt'>, Record<SideId, string>> = {
  en: { sith: 'Dark side', rebel: 'Resistance' },
  es: { sith: 'Lado oscuro', rebel: 'Resistencia' },
};

export function sideCopy(side: SideId, lang: Lang): SideCopy {
  if (lang === 'pt') return SIDES[side].copy;
  return lang === 'en' ? EN[side] : ES[side];
}

export function sideName(side: SideId, lang: Lang): string {
  return lang === 'pt' ? SIDES[side].name : SIDE_NAME[lang][side];
}
