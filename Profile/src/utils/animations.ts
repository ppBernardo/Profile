import { Variants } from 'framer-motion';

/** Viewport config padrão: anima quando ~15% do elemento está visível, só uma vez */
export const viewportDefault = { once: true, amount: 0.15 } as const;

const landoEase = [0.25, 0.46, 0.45, 0.94] as const;

/** Duração e easing no estilo Lando (suave, premium) */
export const transitionSpring = {
  type: 'tween' as const,
  duration: 0.6,
  ease: landoEase,
};

export const transitionSlow = {
  type: 'tween' as const,
  duration: 0.8,
  ease: landoEase,
};

/** Container: filhos entram em sequência (stagger) */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

/** Item que sobe suavemente ao entrar */
export const fadeUpItem: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: landoEase },
  },
};

/** Item que entra pela esquerda */
export const fadeLeftItem: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: landoEase },
  },
};

/** Item que entra pela direita */
export const fadeRightItem: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: landoEase },
  },
};

/** Entrada suave com leve scale (para cards) */
export const scaleInItem: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.5, ease: landoEase },
  },
};

/** Seção inteira: fade + slide up ao entrar no viewport */
export const sectionReveal: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: landoEase,
      staggerChildren: 0.06,
      delayChildren: 0.15,
    },
  },
};
