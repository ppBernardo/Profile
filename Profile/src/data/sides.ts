import type { SkinId } from '../lib/sprites';

/** Os dois lados da Força: cada um com paleta, modelos 3D e falas próprias. */
export type SideId = 'sith' | 'rebel';

export const MODEL_URLS = {
  tie: '/3d_t.i.e_fighter_-_star_wars_model.glb',
  xwing: '/x-wing.glb',
  destroyer: '/star_destroyer.glb',
  falcon: '/millenium_falcon_star_wars.glb',
} as const;

export interface FighterModel {
  url: string;
  name: string;
  /** Rotação que deixa o modelo com a frente em +Z e o topo em +Y. */
  fix: [number, number, number];
  /** Canhões, em unidades do modelo normalizado (maior dimensão = 1). */
  cannons: [number, number, number][];
  engine: string;
  trail: string;
  laser: string;
  /** Escala de cada caça na ala de escolta. */
  wingScale: { desktop: number; compact: number };
}

export interface CapitalModel {
  url: string;
  name: string;
  /** Comprimento em unidades de mundo (maior dimensão do modelo). */
  len: { desktop: number; compact: number };
  /** Deslocamento vertical da pose final (discos ficam melhor um pouco mais baixos). */
  lift: number;
  /** Escala da bolha dos escudos (coordenadas normalizadas). */
  shield: [number, number, number];
  /** Baterias de armas (coordenadas normalizadas). */
  turrets: [number, number, number][];
  lights: { bridge: [number, number, number]; engine: [number, number, number]; under: [number, number, number] };
  bolt: string;
}

export type FleetSystemId = 'ponte' | 'armas' | 'hangar' | 'escudos';

/** Falas e títulos de um lado (há uma versão por idioma; a portuguesa fica aqui). */
export interface SideCopy {
  loading: string;
  tracking: string;
  tagline: string[];
  hero: { gift: string; incoming: string; carbonite: string; sitter: string; badge: string; quips: string[] };
  fleet: { title: [string, string]; arrived: string; systems: Record<FleetSystemId, string> };
  contact: { pitch: string; landing: string };
  footer: string;
  /** Convite para trocar de lado, no rodapé: a linha acima e a frase do botão. */
  switchKicker: string;
  switchCta: string;
}

export interface SideConfig {
  id: SideId;
  name: string;
  tag: string;
  /** Cor de destaque em hex (para three.js e SVG). */
  accent: string;
  hyperTint: string;
  /** RGB do clarão do salto, "r,g,b". */
  hyperFlash: string;
  /** RGB do escurecimento do salto (cor de fundo do tema), "r,g,b". */
  hyperDim: string;
  /** Cores das cenas 3D: neblina, chão da luz hemisférica e fundo do espaço da frota. */
  scene: { fog: string; ground: string; space: string };
  skin: SkinId;
  fighter: FighterModel;
  capital: CapitalModel;
  /** Escoltas de capital (duas Star Destroyers) só no Império. */
  escorts: boolean;
  /** Pontos dos sistemas no casco da capitânia (coordenadas normalizadas do modelo). */
  anchors: Record<FleetSystemId, [number, number, number]>;
  copy: SideCopy;
}

const TIE: FighterModel = {
  url: MODEL_URLS.tie,
  name: 'TIE Fighter',
  fix: [0, 0, Math.PI],
  cannons: [
    [-0.42, -0.2, 0.55],
    [0.42, -0.2, 0.55],
  ],
  engine: '#ff5a3c',
  trail: '#ff3b2a',
  laser: '#6dff6a',
  wingScale: { desktop: 0.38, compact: 0.3 },
};

const XWING: FighterModel = {
  url: MODEL_URLS.xwing,
  name: 'X-wing',
  fix: [0, 0, 0],
  cannons: [
    [-0.45, 0.1, 0.08],
    [0.45, -0.1, 0.08],
  ],
  engine: '#ff7a9a',
  trail: '#ff8ab0',
  laser: '#ff4a4a',
  wingScale: { desktop: 0.55, compact: 0.42 },
};

const DESTROYER: CapitalModel = {
  url: MODEL_URLS.destroyer,
  name: 'Star Destroyer',
  len: { desktop: 12, compact: 6.9 },
  lift: 0,
  shield: [0.76, 0.42, 1.12],
  turrets: [
    [-0.085, 0.04, -0.22],
    [-0.07, 0.04, -0.05],
    [-0.055, 0.04, 0.12],
    [0, 0.08, -0.26],
  ],
  lights: { bridge: [0, 0.18, -0.3], engine: [0, -0.02, -0.58], under: [0, -0.35, 0.1] },
  bolt: '#ff6a3c',
};

const FALCON: CapitalModel = {
  url: MODEL_URLS.falcon,
  name: 'Millennium Falcon',
  len: { desktop: 8.5, compact: 5 },
  lift: -0.2,
  shield: [0.95, 0.52, 1.1],
  turrets: [
    [0, 0.13, 0],
    [0, -0.13, 0],
  ],
  lights: { bridge: [-0.2, 0.07, 0.2], engine: [0, 0, -0.54], under: [0, -0.3, 0.05] },
  bolt: '#ff4a4a',
};

export const SIDES: Record<SideId, SideConfig> = {
  sith: {
    id: 'sith',
    name: 'Lado sombrio',
    tag: 'tie fighter · star destroyer · sith',
    accent: '#e3242b',
    hyperTint: 'rgba(255,110,110,0.95)',
    hyperFlash: '255,228,228',
    hyperDim: '5,4,5',
    scene: {
      fog: '#050405',
      ground: '#1a0a0c',
      space: 'radial-gradient(ellipse 80% 60% at 70% 110%, rgba(122,15,20,0.25), transparent 60%), linear-gradient(180deg, #040305 0%, #07060a 60%, #0b0709 100%)',
    },
    skin: 'anakin',
    fighter: TIE,
    capital: DESTROYER,
    escorts: true,
    anchors: { ponte: [0, 0.11, -0.3], armas: [-0.08, 0.035, -0.06], hangar: [0, -0.07, 0.12], escudos: [0, -0.01, 0.46] },
    copy: {
      loading: 'carregando o lado sombrio',
      tracking: 'rastreando o TIE Fighter',
      tagline: ['um portfólio', 'forjado no', 'lado sombrio.'],
      hero: {
        gift: 'o Império mandou um presente.',
        incoming: 'abaixa! TIE Fighter!',
        carbonite: 'carbonita imperial. do mestre.',
        sitter: 'não subestime o lado sombrio.',
        badge: 'lado sombrio',
        quips: ['o Império é mais forte.', 'role pra baixo. o mestre espera.', 'eu vigio pelo Imperador.', 'não pisca. ele vê tudo.'],
      },
      fleet: {
        title: ['A frota do', 'Império.'],
        arrived: 'a frota do mestre.',
        systems: { ponte: 'Ponte de comando', armas: 'Armas · turbolasers', hangar: 'Hangar e comunicações', escudos: 'Escudos defletores' },
      },
      contact: { pitch: 'Pousamos onde tudo começou. Escolha uma casa. O lado sombrio está recrutando.', landing: 'tatooine. odeio areia.' },
      footer: 'o lado sombrio do código',
      switchKicker: 'um chamado do outro lado',
      switchCta: 'Ainda há luz em você',
    },
  },
  rebel: {
    id: 'rebel',
    name: 'Resistência',
    tag: 'x-wing · millennium falcon · jedi',
    accent: '#4aa8ff',
    hyperTint: 'rgba(130,190,255,0.95)',
    hyperFlash: '220,236,255',
    hyperDim: '5,4,5',
    scene: {
      fog: '#050405',
      ground: '#0a1424',
      space: 'radial-gradient(ellipse 80% 60% at 70% 110%, rgba(18,56,110,0.32), transparent 60%), linear-gradient(180deg, #040305 0%, #06080f 60%, #090b12 100%)',
    },
    skin: 'jedi',
    fighter: XWING,
    capital: FALCON,
    escorts: false,
    anchors: { ponte: [-0.2, 0.07, 0.2], armas: [0, 0.12, 0], hangar: [0.14, 0.04, 0.4], escudos: [0.16, 0.1, -0.18] },
    copy: {
      loading: 'carregando a Resistência',
      tracking: 'rastreando o X-wing',
      tagline: ['um portfólio', 'forjado na', 'Resistência.'],
      hero: {
        gift: 'a Resistência mandou um presente.',
        incoming: 'olha! um X-wing!',
        carbonite: 'carbonita. cortesia da Aliança.',
        sitter: 'que a Força esteja com você.',
        badge: 'resistência',
        quips: ['a esperança é mais forte.', 'role pra baixo. a base espera.', 'eu vigio pela Aliança.', 'não pisca. o Império vê tudo.'],
      },
      fleet: {
        title: ['A frota da', 'Resistência.'],
        arrived: 'a frota da aliança.',
        systems: { ponte: 'Cabine de comando', armas: 'Canhões quad-laser', hangar: 'Porões de carga e comunicações', escudos: 'Escudos defletores' },
      },
      contact: { pitch: 'Pousamos onde tudo começou. Escolha uma casa. A Resistência está recrutando.', landing: 'tatooine. de volta pra casa.' },
      footer: 'o lado da luz do código',
      switchKicker: 'uma oferta do Imperador',
      switchCta: 'Junte-se ao lado sombrio',
    },
  },
};
