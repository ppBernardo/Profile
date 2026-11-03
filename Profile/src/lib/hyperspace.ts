/** Rastros de estrelas do salto para o hiperespaço — usado no menu e na chegada do TIE Fighter. */

export interface Streak {
  a: number;
  r: number;
  s: number;
}

export function makeStreaks(count: number, maxR: number): Streak[] {
  return Array.from({ length: count }, () => ({
    a: Math.random() * Math.PI * 2,
    r: 16 + Math.random() * maxR,
    s: 0.35 + Math.random() * 1.3,
  }));
}

export interface DrawOptions {
  origin?: { x: number; y: number };
  /** Escurece o fundo conforme o progresso (transição de página). */
  dim?: boolean;
  /** Clarão branco no fim. */
  flash?: boolean;
  maxLen?: number;
  tint?: string;
}

export function drawHyperspace(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  p: number,
  streaks: Streak[],
  opts: DrawOptions = {}
) {
  const {
    origin = { x: w / 2, y: h / 2 },
    dim = true,
    flash = true,
    maxLen = 460,
    tint = 'rgba(255,110,110,0.95)',
  } = opts;
  const e = p * p;
  ctx.clearRect(0, 0, w, h);
  if (dim) {
    ctx.fillStyle = `rgba(5,4,5,${Math.min(1, p * 1.5)})`;
    ctx.fillRect(0, 0, w, h);
  }
  for (const st of streaks) {
    const len = 3 + e * maxLen * st.s;
    const r0 = st.r * (1 - e * 0.55);
    const x0 = origin.x + Math.cos(st.a) * r0;
    const y0 = origin.y + Math.sin(st.a) * r0;
    const x1 = origin.x + Math.cos(st.a) * (r0 + len);
    const y1 = origin.y + Math.sin(st.a) * (r0 + len);
    const g = ctx.createLinearGradient(x0, y0, x1, y1);
    g.addColorStop(0, 'rgba(255,255,255,0)');
    g.addColorStop(1, p > 0.55 ? tint : 'rgba(255,255,255,0.85)');
    ctx.strokeStyle = g;
    ctx.lineWidth = 0.8 + st.s * e * 1.6;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
  }
  if (flash && p > 0.72) {
    const f = (p - 0.72) / 0.28;
    ctx.fillStyle = `rgba(255,228,228,${f * 0.92})`;
    ctx.fillRect(0, 0, w, h);
  }
}

/** Ajusta o canvas ao viewport com DPR limitado e devolve o contexto já escalado. */
export function prepareCanvas(canvas: HTMLCanvasElement, w: number, h: number, maxDpr = 2) {
  const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;
  const ctx = canvas.getContext('2d');
  if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
}
