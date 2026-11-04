/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Os tons de destaque vêm de variáveis CSS: mudam com o lado da Força (html[data-side]).
        // A base escura é a mesma nos dois lados.
        sith: {
          void: '#050405',
          bg: '#0a0809',
          surface: '#120f12',
          raised: '#1a1519',
          line: 'rgba(255,255,255,0.07)',
          ink: '#ece4dc',
          muted: '#9a9098',
          faint: '#5a525a',
          crimson: 'rgb(var(--c-crimson) / <alpha-value>)',
          ember: 'rgb(var(--c-ember) / <alpha-value>)',
          blood: 'rgb(var(--c-blood) / <alpha-value>)',
          gold: 'rgb(var(--c-gold) / <alpha-value>)',
          goldDim: 'rgb(var(--c-goldDim) / <alpha-value>)',
          violet: 'rgb(var(--c-violet) / <alpha-value>)',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        pixel: ['VT323', 'monospace'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 12px rgb(var(--c-crimson) / 0.6), 0 0 32px rgb(var(--c-crimson) / 0.25)',
        'glow-soft': '0 0 24px rgb(var(--c-crimson) / 0.18)',
        pixel: '4px 4px 0 0 #000',
      },
    },
  },
  plugins: [],
};
