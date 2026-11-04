/**
 * Sprites pixel-art: o aprendiz (encapuzado), Darth Vader, Obi-Wan, Anakin, Han Solo e Yoda.
 * Cada frame é uma grade 12×16; cada caractere mapeia para uma cor da skin.
 *
 *  K outline   H hood   h hood light   s skin   d skin shadow
 *  e eye       - eye closed   R robe   r robe light
 *  b belt      g buckle       G glove  . transparent
 *  Extras (por skin): V/v capacete, E lentes, m grade, p/x/y peitoral,
 *  C/c capa, A/a cabelo, B barba, T/t túnica, q botas
 */

export const SPRITE_W = 12;
export const SPRITE_H = 16;

export type FrameName = 'idle' | 'walk1' | 'walk2' | 'jump' | 'swing' | 'pull' | 'sleep' | 'salute' | 'kneel';
export type SpriteFrame = readonly string[];
export type SpriteKind = 'hooded' | 'vader' | 'vaderCracked' | 'jedi' | 'hair' | 'vest' | 'yoda' | 'trooper' | 'ewok';

export interface SaberAnchor {
  x: number;
  y: number;
  angle: number;
}
type AnchorSet = Record<FrameName, SaberAnchor | null>;
type FrameSet = Record<FrameName, SpriteFrame>;

/* ─── Aprendiz encapuzado ───────────────────────────────────────────── */

const HEAD = [
  '...KKKKKK...',
  '..KHhhhhHK..',
  '.KHhhhhhhHK.',
  '.KHhhhhhhHK.',
  '.KHssssssHK.',
  '.KHsessesHK.',
  '.KHssssssHK.',
  '.KHdssssdHK.',
] as const;

const HEAD_SLEEP = [
  '...KKKKKK...',
  '..KHhhhhHK..',
  '.KHhhhhhhHK.',
  '.KHhhhhhhHK.',
  '.KHssssssHK.',
  '.KHs-ss-sHK.',
  '.KHssssssHK.',
  '.KHdssssdHK.',
] as const;

const BODY_IDLE = [
  '..KRRRRRRK..',
  '.KRrRRRRRRK.',
  '.KRrRRRRRRK.',
  '.KRbbgbbRRG.',
  '.KRRRRRRRRK.',
  '.KRRRRRRRRK.',
] as const;

const BODY_SWING = [
  '..KRRRRRRKG.',
  '.KRrRRRRRRK.',
  '.KRrRRRRRRK.',
  '.KRbbgbbRRK.',
  '.KRRRRRRRRK.',
  '.KRRRRRRRRK.',
] as const;

const BODY_PULL = [
  '..KRRRRRRK..',
  '.KRrRRRRRRK.',
  'GKRrRRRRRRK.',
  'GKRbbgbbRRK.',
  '.KRRRRRRRRK.',
  '.KRRRRRRRRK.',
] as const;

const LEGS_IDLE = ['..KRRK.KRRK.', '..KKKK.KKKK.'] as const;
const LEGS_WALK1 = ['.KRRK..KRRK.', '.KKKK..KKKK.'] as const;
const LEGS_WALK2 = ['...KRRRRK...', '...KKKKKK...'] as const;
const LEGS_JUMP = ['..KRRRRRRK..', '...KKKKKK...'] as const;

const HOODED: FrameSet = {
  idle: [...HEAD, ...BODY_IDLE, ...LEGS_IDLE],
  walk1: [...HEAD, ...BODY_IDLE, ...LEGS_WALK1],
  walk2: [...HEAD, ...BODY_IDLE, ...LEGS_WALK2],
  jump: [...HEAD, ...BODY_IDLE, ...LEGS_JUMP],
  swing: [...HEAD, ...BODY_SWING, ...LEGS_IDLE],
  pull: [...HEAD, ...BODY_PULL, ...LEGS_WALK1],
  sleep: [...HEAD_SLEEP, ...BODY_IDLE, ...LEGS_IDLE],
  salute: [...HEAD, ...BODY_SWING, ...LEGS_IDLE],
  kneel: [...HEAD, ...BODY_IDLE, ...LEGS_JUMP],
};

const HOODED_ANCHORS: AnchorSet = {
  idle: { x: 11, y: 11.5, angle: 0 },
  walk1: { x: 11, y: 11.5, angle: 0 },
  walk2: { x: 11, y: 11.5, angle: 0 },
  jump: { x: 11, y: 11.5, angle: -20 },
  swing: { x: 11, y: 8.5, angle: -52 },
  pull: null,
  sleep: null,
  salute: { x: 11, y: 8.5, angle: -90 },
  kneel: { x: 11, y: 11.5, angle: 0 },
};

/* ─── Darth Vader (corpo deslocado 1 coluna à direita; capa nas colunas 0–1) ── */

const HEAD_VADER = [
  '....KKKKKK..',
  '...KVVVVVVK.',
  '..KVvVVVVVVK',
  '..KVVVVVVVVK',
  '..KVEEVVEEVK',
  '..KVVEVVEVVK',
  '..KVVmmmmVVK',
  '...KVmmmmVK.',
] as const;

const HEAD_VADER_CRACKED = [
  '....KKKKKK..',
  '...KVVVVVVK.',
  '..KVvVVVKssK',
  '..KVVVVKsssK',
  '..KVEEVKsesK',
  '..KVVEVKsssK',
  '..KVVmmKsssK',
  '...KVmmKssK.',
] as const;

const BODY_VADER_IDLE = [
  'C.KRRRRRRRK.',
  'CCKRRppppRRK',
  'CCKRRpxpyRRK',
  'CCKRbbgbbRRG',
  'CCKRRRRRRRRK',
  'CCKRRRRRRRRK',
] as const;

const BODY_VADER_SWING = [
  'C.KRRRRRRRKG',
  'CCKRRppppRRK',
  'CCKRRpxpyRRK',
  'CCKRbbgbbRRK',
  'CCKRRRRRRRRK',
  'CCKRRRRRRRRK',
] as const;

const LEGS_VADER_IDLE = ['.CKRRK.KRRK.', '..KKKK.KKKK.'] as const;
const LEGS_VADER_WALK1 = ['.CKRRK..KRRK', '..KKKK..KKKK'] as const;
const LEGS_VADER_WALK2 = ['....KRRRRK..', '....KKKKKK..'] as const;
const LEGS_VADER_KNEEL = ['...KRRRRRRK.', '....KKKKKK..'] as const;

function vaderSet(head: readonly string[]): FrameSet {
  return {
    idle: [...head, ...BODY_VADER_IDLE, ...LEGS_VADER_IDLE],
    walk1: [...head, ...BODY_VADER_IDLE, ...LEGS_VADER_WALK1],
    walk2: [...head, ...BODY_VADER_IDLE, ...LEGS_VADER_WALK2],
    jump: [...head, ...BODY_VADER_IDLE, ...LEGS_VADER_KNEEL],
    swing: [...head, ...BODY_VADER_SWING, ...LEGS_VADER_IDLE],
    pull: [...head, ...BODY_VADER_IDLE, ...LEGS_VADER_WALK1],
    sleep: [...head, ...BODY_VADER_IDLE, ...LEGS_VADER_IDLE],
    salute: [...head, ...BODY_VADER_SWING, ...LEGS_VADER_IDLE],
    kneel: [...head, ...BODY_VADER_IDLE, ...LEGS_VADER_KNEEL],
  };
}

const VADER_ANCHORS: AnchorSet = {
  idle: { x: 12, y: 11.5, angle: 0 },
  walk1: { x: 12, y: 11.5, angle: 0 },
  walk2: { x: 12, y: 11.5, angle: 0 },
  jump: { x: 12, y: 11.5, angle: -20 },
  swing: { x: 12, y: 8.5, angle: -52 },
  pull: null,
  sleep: null,
  salute: { x: 12, y: 8.5, angle: -90 },
  kneel: { x: 12, y: 11.5, angle: 0 },
};

/* ─── Obi-Wan (cabelo, barba, túnica) ──────────────────────────────── */

const HEAD_JEDI = [
  '...KKKKKK...',
  '..KAAAAAAK..',
  '.KAAAAAAAAK.',
  '.KAassssaAK.',
  '.KssssssssK.',
  '.KsessesssK.',
  '.KBBssssBBK.',
  '..KBBBBBBK..',
] as const;

const BODY_JEDI_IDLE = [
  '..KTTTTTTK..',
  '.KTtTTTTTTK.',
  '.KTtTTTTTTK.',
  '.KTbbgbbTTG.',
  '.KTTTTTTTTK.',
  '.KTtTTTTtTK.',
] as const;

const BODY_JEDI_SWING = [
  '..KTTTTTTKG.',
  '.KTtTTTTTTK.',
  '.KTtTTTTTTK.',
  '.KTbbgbbTTK.',
  '.KTTTTTTTTK.',
  '.KTtTTTTtTK.',
] as const;

const LEGS_JEDI_IDLE = ['..KqqK.KqqK.', '..KKKK.KKKK.'] as const;
const LEGS_JEDI_WALK1 = ['.KqqK..KqqK.', '.KKKK..KKKK.'] as const;
const LEGS_JEDI_WALK2 = ['...KqqqqK...', '...KKKKKK...'] as const;
const LEGS_JEDI_KNEEL = ['..KqqqqqqK..', '...KKKKKK...'] as const;

const JEDI: FrameSet = {
  idle: [...HEAD_JEDI, ...BODY_JEDI_IDLE, ...LEGS_JEDI_IDLE],
  walk1: [...HEAD_JEDI, ...BODY_JEDI_IDLE, ...LEGS_JEDI_WALK1],
  walk2: [...HEAD_JEDI, ...BODY_JEDI_IDLE, ...LEGS_JEDI_WALK2],
  jump: [...HEAD_JEDI, ...BODY_JEDI_IDLE, ...LEGS_JEDI_KNEEL],
  swing: [...HEAD_JEDI, ...BODY_JEDI_SWING, ...LEGS_JEDI_IDLE],
  pull: [...HEAD_JEDI, ...BODY_JEDI_IDLE, ...LEGS_JEDI_WALK1],
  sleep: [...HEAD_JEDI, ...BODY_JEDI_IDLE, ...LEGS_JEDI_IDLE],
  salute: [...HEAD_JEDI, ...BODY_JEDI_SWING, ...LEGS_JEDI_IDLE],
  kneel: [...HEAD_JEDI, ...BODY_JEDI_IDLE, ...LEGS_JEDI_KNEEL],
};

/* ─── Cabelo sem capuz (Anakin, Han Solo) ───────────────────────────── */

const HEAD_HAIR = [
  '...KKKKKK...',
  '..KAAAAAAK..',
  '.KAAAAAAAAK.',
  '.KAassssaAK.',
  '.KAssssssAK.',
  '.KAsessesAK.',
  '.KssssssssK.',
  '..KdssssdK..',
] as const;

const HEAD_HAIR_SLEEP = [
  '...KKKKKK...',
  '..KAAAAAAK..',
  '.KAAAAAAAAK.',
  '.KAassssaAK.',
  '.KAssssssAK.',
  '.KAs-ss-sAK.',
  '.KssssssssK.',
  '..KdssssdK..',
] as const;

/** Anakin: cabelo + túnica escura (mesmo corpo do encapuzado). */
const HAIR: FrameSet = {
  idle: [...HEAD_HAIR, ...BODY_IDLE, ...LEGS_IDLE],
  walk1: [...HEAD_HAIR, ...BODY_IDLE, ...LEGS_WALK1],
  walk2: [...HEAD_HAIR, ...BODY_IDLE, ...LEGS_WALK2],
  jump: [...HEAD_HAIR, ...BODY_IDLE, ...LEGS_JUMP],
  swing: [...HEAD_HAIR, ...BODY_SWING, ...LEGS_IDLE],
  pull: [...HEAD_HAIR, ...BODY_PULL, ...LEGS_WALK1],
  sleep: [...HEAD_HAIR_SLEEP, ...BODY_IDLE, ...LEGS_IDLE],
  salute: [...HEAD_HAIR, ...BODY_SWING, ...LEGS_IDLE],
  kneel: [...HEAD_HAIR, ...BODY_IDLE, ...LEGS_JUMP],
};

/* ─── Han Solo (camisa, colete, calça com listra) ───────────────────── */

const BODY_VEST_IDLE = [
  '..KttttttK..',
  '.KTtttttttK.',
  '.KTttttttTK.',
  '.KTbbgbbTTG.',
  '.KqqqqqqqqK.',
  '.KqqqqqqqqK.',
] as const;

const BODY_VEST_SWING = [
  '..KttttttKG.',
  '.KTtttttttK.',
  '.KTttttttTK.',
  '.KTbbgbbTTK.',
  '.KqqqqqqqqK.',
  '.KqqqqqqqqK.',
] as const;

const BODY_VEST_PULL = [
  '..KttttttK..',
  '.KTtttttttK.',
  'GKTttttttTK.',
  'GKTbbgbbTTK.',
  '.KqqqqqqqqK.',
  '.KqqqqqqqqK.',
] as const;

const VEST: FrameSet = {
  idle: [...HEAD_HAIR, ...BODY_VEST_IDLE, ...LEGS_JEDI_IDLE],
  walk1: [...HEAD_HAIR, ...BODY_VEST_IDLE, ...LEGS_JEDI_WALK1],
  walk2: [...HEAD_HAIR, ...BODY_VEST_IDLE, ...LEGS_JEDI_WALK2],
  jump: [...HEAD_HAIR, ...BODY_VEST_IDLE, ...LEGS_JEDI_KNEEL],
  swing: [...HEAD_HAIR, ...BODY_VEST_SWING, ...LEGS_JEDI_IDLE],
  pull: [...HEAD_HAIR, ...BODY_VEST_PULL, ...LEGS_JEDI_WALK1],
  sleep: [...HEAD_HAIR_SLEEP, ...BODY_VEST_IDLE, ...LEGS_JEDI_IDLE],
  salute: [...HEAD_HAIR, ...BODY_VEST_SWING, ...LEGS_JEDI_IDLE],
  kneel: [...HEAD_HAIR, ...BODY_VEST_IDLE, ...LEGS_JEDI_KNEEL],
};

/* ─── Yoda (baixinho, orelhas grandes, túnica marrom) ──────────────── */

const HEAD_YODA = [
  '............',
  '............',
  '............',
  '............',
  '...KKKKKK...',
  '..KssssssK..',
  'KssssssssssK',
  'KsssessesssK',
  '.KKssssssKK.',
  '..KddssddK..',
] as const;

const HEAD_YODA_SLEEP = [
  '............',
  '............',
  '............',
  '............',
  '...KKKKKK...',
  '..KssssssK..',
  'KssssssssssK',
  'Ksss-ss-sssK',
  '.KKssssssKK.',
  '..KddssddK..',
] as const;

const BODY_YODA_IDLE = ['..KRRRRRRK..', '.KRrRRRRRRK.', '.KRbbgbbRRG.', '.KRRRRRRRRK.'] as const;
const BODY_YODA_SWING = ['..KRRRRRRKG.', '.KRrRRRRRRK.', '.KRbbgbbRRK.', '.KRRRRRRRRK.'] as const;
const BODY_YODA_PULL = ['..KRRRRRRK..', 'GKRrRRRRRRK.', 'GKRbbgbbRRK.', '.KRRRRRRRRK.'] as const;

const YODA: FrameSet = {
  idle: [...HEAD_YODA, ...BODY_YODA_IDLE, ...LEGS_IDLE],
  walk1: [...HEAD_YODA, ...BODY_YODA_IDLE, ...LEGS_WALK1],
  walk2: [...HEAD_YODA, ...BODY_YODA_IDLE, ...LEGS_WALK2],
  jump: [...HEAD_YODA, ...BODY_YODA_IDLE, ...LEGS_JUMP],
  swing: [...HEAD_YODA, ...BODY_YODA_SWING, ...LEGS_IDLE],
  pull: [...HEAD_YODA, ...BODY_YODA_PULL, ...LEGS_WALK1],
  sleep: [...HEAD_YODA_SLEEP, ...BODY_YODA_IDLE, ...LEGS_IDLE],
  salute: [...HEAD_YODA, ...BODY_YODA_SWING, ...LEGS_IDLE],
  kneel: [...HEAD_YODA, ...BODY_YODA_IDLE, ...LEGS_JUMP],
};

const YODA_ANCHORS: AnchorSet = {
  idle: { x: 11, y: 12.5, angle: 0 },
  walk1: { x: 11, y: 12.5, angle: 0 },
  walk2: { x: 11, y: 12.5, angle: 0 },
  jump: { x: 11, y: 12.5, angle: -20 },
  swing: { x: 11, y: 10.5, angle: -52 },
  pull: null,
  sleep: null,
  salute: { x: 11, y: 10.5, angle: -90 },
  kneel: { x: 11, y: 12.5, angle: 0 },
};

/* ─── Stormtrooper (capacete branco, lentes pretas, armadura branca) ─── */

const HEAD_TROOPER = [
  '...KKKKKK...',
  '..KVVVVVVK..',
  '.KVvVVVVVVK.',
  '.KVVVVVVVVK.',
  '.KEEEVVEEEK.',
  '.KVEEVVEEVK.',
  '.KVVmVVmVVK.',
  '..KVmmmmVK..',
] as const;

const TROOPER: FrameSet = {
  idle: [...HEAD_TROOPER, ...BODY_IDLE, ...LEGS_IDLE],
  walk1: [...HEAD_TROOPER, ...BODY_IDLE, ...LEGS_WALK1],
  walk2: [...HEAD_TROOPER, ...BODY_IDLE, ...LEGS_WALK2],
  jump: [...HEAD_TROOPER, ...BODY_IDLE, ...LEGS_JUMP],
  swing: [...HEAD_TROOPER, ...BODY_SWING, ...LEGS_IDLE],
  pull: [...HEAD_TROOPER, ...BODY_PULL, ...LEGS_WALK1],
  sleep: [...HEAD_TROOPER, ...BODY_IDLE, ...LEGS_IDLE],
  salute: [...HEAD_TROOPER, ...BODY_SWING, ...LEGS_IDLE],
  kneel: [...HEAD_TROOPER, ...BODY_IDLE, ...LEGS_JUMP],
};

/* ─── Ewok (baixinho, peludo, capuz com orelhas) ─── */

const HEAD_EWOK = [
  '............',
  '............',
  '............',
  '............',
  '..KK....KK..',
  '.KHHKKKKHHK.',
  '.KHhHHHHHHK.',
  '.KHssssssHK.',
  '.KHseddesHK.',
  '..KsddddsK..',
] as const;

const HEAD_EWOK_SLEEP = [
  '............',
  '............',
  '............',
  '............',
  '..KK....KK..',
  '.KHHKKKKHHK.',
  '.KHhHHHHHHK.',
  '.KHssssssHK.',
  '.KHs-dd-sHK.',
  '..KsddddsK..',
] as const;

const EWOK: FrameSet = {
  idle: [...HEAD_EWOK, ...BODY_YODA_IDLE, ...LEGS_IDLE],
  walk1: [...HEAD_EWOK, ...BODY_YODA_IDLE, ...LEGS_WALK1],
  walk2: [...HEAD_EWOK, ...BODY_YODA_IDLE, ...LEGS_WALK2],
  jump: [...HEAD_EWOK, ...BODY_YODA_IDLE, ...LEGS_JUMP],
  swing: [...HEAD_EWOK, ...BODY_YODA_SWING, ...LEGS_IDLE],
  pull: [...HEAD_EWOK, ...BODY_YODA_PULL, ...LEGS_WALK1],
  sleep: [...HEAD_EWOK_SLEEP, ...BODY_YODA_IDLE, ...LEGS_IDLE],
  salute: [...HEAD_EWOK, ...BODY_YODA_SWING, ...LEGS_IDLE],
  kneel: [...HEAD_EWOK, ...BODY_YODA_IDLE, ...LEGS_JUMP],
};

export const FRAME_SETS: Record<SpriteKind, FrameSet> = {
  hooded: HOODED,
  vader: vaderSet(HEAD_VADER),
  vaderCracked: vaderSet(HEAD_VADER_CRACKED),
  jedi: JEDI,
  hair: HAIR,
  vest: VEST,
  yoda: YODA,
  trooper: TROOPER,
  ewok: EWOK,
};

export const ANCHOR_SETS: Record<SpriteKind, AnchorSet> = {
  hooded: HOODED_ANCHORS,
  vader: VADER_ANCHORS,
  vaderCracked: VADER_ANCHORS,
  jedi: HOODED_ANCHORS,
  hair: HOODED_ANCHORS,
  vest: HOODED_ANCHORS,
  yoda: YODA_ANCHORS,
  trooper: HOODED_ANCHORS,
  ewok: YODA_ANCHORS,
};

/** Compatibilidade: frames e âncoras do aprendiz. */
export const FRAMES = HOODED;
export const SABER_ANCHOR = HOODED_ANCHORS;

/* ─── Skins ───────────────────────────────────────────────────────── */

export type SkinId = 'aprendiz' | 'lorde' | 'imperador' | 'sombra' | 'vader' | 'vaderCracked' | 'jedi' | 'anakin' | 'anakinKid' | 'han' | 'yoda' | 'stormtrooper' | 'ewok' | 'ewokChief';

export interface Skin {
  id: SkinId;
  name: string;
  sprite: SpriteKind;
  outline: string;
  hood: string;
  hoodLight: string;
  skin: string;
  skinShadow: string;
  eye: string;
  eyeClosed: string;
  robe: string;
  robeLight: string;
  belt: string;
  buckle: string;
  glove: string;
  hiltLight: string;
  hiltDark: string;
  saber: string;
  saberCore: string;
  /** Cores extras usadas pelos sprites especiais. */
  extra?: Record<string, string>;
}

const VADER_BASE: Omit<Skin, 'id' | 'name' | 'sprite'> = {
  outline: '#0b0b10',
  hood: '#2b2b33',
  hoodLight: '#45454f',
  skin: '#d9c9c9',
  skinShadow: '#b59f9f',
  eye: '#ffb62e',
  eyeClosed: '#6b5f7a',
  robe: '#1d1d24',
  robeLight: '#2b2b34',
  belt: '#2a2a30',
  buckle: '#a0a0ab',
  glove: '#131318',
  hiltLight: '#c9c9d3',
  hiltDark: '#5f5f6b',
  saber: '#ff2a2a',
  saberCore: '#ffe3e3',
  extra: {
    V: '#2b2b33',
    v: '#4a4a56',
    E: '#0c0c11',
    m: '#747480',
    p: '#3b3b46',
    x: '#ff3b3b',
    y: '#4aa8ff',
    C: '#111117',
    c: '#1b1b23',
  },
};

export const SKINS: Record<SkinId, Skin> = {
  aprendiz: {
    id: 'aprendiz',
    name: 'Aprendiz',
    sprite: 'hooded',
    outline: '#120e16',
    hood: '#3a3142',
    hoodLight: '#4d4259',
    skin: '#d9cfe3',
    skinShadow: '#b3a7c2',
    eye: '#ffb62e',
    eyeClosed: '#7d7190',
    robe: '#2b2433',
    robeLight: '#3a3145',
    belt: '#4a3826',
    buckle: '#c9a44c',
    glove: '#1b1620',
    hiltLight: '#c4c4cf',
    hiltDark: '#5f5f6b',
    saber: '#ff2a2a',
    saberCore: '#ffe3e3',
  },
  lorde: {
    id: 'lorde',
    name: 'Lorde Sith',
    sprite: 'hooded',
    outline: '#120709',
    hood: '#5a1a22',
    hoodLight: '#7a2630',
    skin: '#dccfd6',
    skinShadow: '#b89ea9',
    eye: '#ff3c3c',
    eyeClosed: '#7a4a52',
    robe: '#2a0f14',
    robeLight: '#3d161c',
    belt: '#3a2416',
    buckle: '#d9b45c',
    glove: '#150a0c',
    hiltLight: '#d0d0da',
    hiltDark: '#6a6a76',
    saber: '#ff1f1f',
    saberCore: '#ffe9e9',
  },
  imperador: {
    id: 'imperador',
    name: 'Imperador',
    sprite: 'hooded',
    outline: '#0d0b10',
    hood: '#1b1720',
    hoodLight: '#2a2430',
    skin: '#d9d2d6',
    skinShadow: '#aaa0a8',
    eye: '#f2c238',
    eyeClosed: '#6a6070',
    robe: '#15121a',
    robeLight: '#221d28',
    belt: '#2a2230',
    buckle: '#6a6070',
    glove: '#0f0d12',
    hiltLight: '#e2d7b0',
    hiltDark: '#8a7a4a',
    saber: '#ff2a2a',
    saberCore: '#fff0c8',
  },
  sombra: {
    id: 'sombra',
    name: 'Sombra',
    sprite: 'hooded',
    outline: '#100c1a',
    hood: '#3b2a63',
    hoodLight: '#4f3b82',
    skin: '#d4cfe6',
    skinShadow: '#aba3c7',
    eye: '#b48cff',
    eyeClosed: '#6b5f91',
    robe: '#241a3d',
    robeLight: '#33265a',
    belt: '#3a2f52',
    buckle: '#b6a5e8',
    glove: '#151024',
    hiltLight: '#c4c4cf',
    hiltDark: '#5f5f6b',
    saber: '#a855f7',
    saberCore: '#efe3ff',
  },
  vader: { id: 'vader', name: 'Darth Vader', sprite: 'vader', ...VADER_BASE },
  vaderCracked: { id: 'vaderCracked', name: 'Darth Vader', sprite: 'vaderCracked', ...VADER_BASE },
  jedi: {
    id: 'jedi',
    name: 'Obi-Wan',
    sprite: 'jedi',
    outline: '#15110e',
    hood: '#b9b0a4',
    hoodLight: '#d0c8bd',
    skin: '#e4cfb6',
    skinShadow: '#c4ab8c',
    eye: '#3f5f8f',
    eyeClosed: '#8a7a6a',
    robe: '#cdb58d',
    robeLight: '#d9c7a4',
    belt: '#5a3f26',
    buckle: '#8a6a3a',
    glove: '#e4cfb6',
    hiltLight: '#d8d8e0',
    hiltDark: '#6a6a76',
    saber: '#4aa8ff',
    saberCore: '#eaf5ff',
    extra: {
      A: '#b9b0a4',
      a: '#8f867a',
      B: '#a39a8e',
      T: '#cdb58d',
      t: '#ab9470',
      q: '#4a3426',
    },
  },
  anakin: {
    id: 'anakin',
    name: 'Anakin',
    sprite: 'hair',
    outline: '#120e16',
    hood: '#1a171c',
    hoodLight: '#2a252d',
    skin: '#e7d3c0',
    skinShadow: '#c4ab8c',
    eye: '#f2c238',
    eyeClosed: '#7a6a5a',
    robe: '#1a171c',
    robeLight: '#2a252d',
    belt: '#3a2a1e',
    buckle: '#8a7a5a',
    glove: '#0f0d10',
    hiltLight: '#c4c4cf',
    hiltDark: '#5f5f6b',
    saber: '#4aa8ff',
    saberCore: '#eaf5ff',
    extra: {
      A: '#6b4a2a',
      a: '#4e3419',
    },
  },
  anakinKid: {
    id: 'anakinKid',
    name: 'Ani',
    sprite: 'hair',
    outline: '#2a1f16',
    hood: '#cdb58d',
    hoodLight: '#dcc8a6',
    skin: '#ead8c3',
    skinShadow: '#c9b092',
    eye: '#3f5f8f',
    eyeClosed: '#8a7a6a',
    robe: '#cdb58d',
    robeLight: '#dcc8a6',
    belt: '#5a3f26',
    buckle: '#8a6a3a',
    glove: '#ead8c3',
    hiltLight: '#9a9aa4',
    hiltDark: '#4a4a52',
    saber: '#ffd36a',
    saberCore: '#ffffff',
    extra: {
      A: '#c9a35a',
      a: '#a3803f',
    },
  },
  han: {
    id: 'han',
    name: 'Han Solo',
    sprite: 'vest',
    outline: '#15110e',
    hood: '#1d1a1e',
    hoodLight: '#2b2a2e',
    skin: '#e4cfb6',
    skinShadow: '#c4ab8c',
    eye: '#3a2a1a',
    eyeClosed: '#8a7a6a',
    robe: '#1d1a1e',
    robeLight: '#2b2a2e',
    belt: '#3a2a1e',
    buckle: '#8a8a94',
    glove: '#e4cfb6',
    hiltLight: '#8a8a94',
    hiltDark: '#3a3a40',
    saber: '#ff4a3c',
    saberCore: '#ffd6cc',
    extra: {
      A: '#5a3a22',
      a: '#3f2816',
      T: '#1d1a1e',
      t: '#ece7dc',
      q: '#2f3f6a',
    },
  },
  yoda: {
    id: 'yoda',
    name: 'Yoda',
    sprite: 'yoda',
    outline: '#1a2412',
    hood: '#8a6a3a',
    hoodLight: '#a98350',
    skin: '#8fbf4a',
    skinShadow: '#6f9a37',
    eye: '#2b2a1a',
    eyeClosed: '#5a7a30',
    robe: '#8a6a3a',
    robeLight: '#a98350',
    belt: '#5a3f26',
    buckle: '#c9a44c',
    glove: '#8fbf4a',
    hiltLight: '#c4c4cf',
    hiltDark: '#5f5f6b',
    saber: '#6dff6a',
    saberCore: '#eaffe6',
  },
  stormtrooper: {
    id: 'stormtrooper',
    name: 'Stormtrooper',
    sprite: 'trooper',
    outline: '#16161b',
    hood: '#e9e9ee',
    hoodLight: '#ffffff',
    skin: '#e9e9ee',
    skinShadow: '#b9b9c2',
    eye: '#0c0c10',
    eyeClosed: '#0c0c10',
    robe: '#e9e9ee',
    robeLight: '#ffffff',
    belt: '#c4c4cc',
    buckle: '#3a3a42',
    glove: '#18181d',
    hiltLight: '#c4c4cf',
    hiltDark: '#5f5f6b',
    saber: '#ff2a2a',
    saberCore: '#ffe3e3',
    extra: {
      V: '#e9e9ee',
      v: '#ffffff',
      E: '#0c0c10',
      m: '#7a7a86',
    },
  },
  ewok: {
    id: 'ewok',
    name: 'Ewok',
    sprite: 'ewok',
    outline: '#1e140c',
    hood: '#c4692a',
    hoodLight: '#de8a46',
    skin: '#7a5232',
    skinShadow: '#a8805a',
    eye: '#0e0906',
    eyeClosed: '#4a3220',
    robe: '#6b4527',
    robeLight: '#87593a',
    belt: '#4a3020',
    buckle: '#b08a52',
    glove: '#5a3a22',
    hiltLight: '#c4c4cf',
    hiltDark: '#5f5f6b',
    saber: '#4aa8ff',
    saberCore: '#eaf5ff',
  },
  ewokChief: {
    id: 'ewokChief',
    name: 'Chefe Ewok',
    sprite: 'ewok',
    outline: '#1e140c',
    hood: '#6f6a5e',
    hoodLight: '#8f897a',
    skin: '#5e4a3a',
    skinShadow: '#8a7360',
    eye: '#0e0906',
    eyeClosed: '#3a2a1e',
    robe: '#4f3a2a',
    robeLight: '#6a5040',
    belt: '#3a2a1e',
    buckle: '#d9c38a',
    glove: '#3f2e22',
    hiltLight: '#c4c4cf',
    hiltDark: '#5f5f6b',
    saber: '#4aa8ff',
    saberCore: '#eaf5ff',
  },
};

export type ForceSide = 'sith' | 'rebel';

export interface UnlockRule {
  id: SkinId;
  threshold: number;
}

/** Patentes por lado da Força: cada lado tem seu próprio trio liberado por cristais. */
export const UNLOCKABLE_BY_SIDE: Record<ForceSide, UnlockRule[]> = {
  sith: [
    { id: 'anakin', threshold: 0 },
    { id: 'vader', threshold: 6 },
    { id: 'imperador', threshold: 12 },
  ],
  rebel: [
    { id: 'jedi', threshold: 0 },
    { id: 'han', threshold: 6 },
    { id: 'yoda', threshold: 12 },
  ],
};

/** Compatibilidade: a lista do lado sombrio. */
export const UNLOCKABLE = UNLOCKABLE_BY_SIDE.sith;

export function paletteOf(skin: Skin): Record<string, string> {
  return {
    K: skin.outline,
    H: skin.hood,
    h: skin.hoodLight,
    s: skin.skin,
    d: skin.skinShadow,
    e: skin.eye,
    '-': skin.eyeClosed,
    R: skin.robe,
    r: skin.robeLight,
    b: skin.belt,
    g: skin.buckle,
    G: skin.glove,
    ...(skin.extra ?? {}),
  };
}
