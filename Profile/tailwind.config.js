/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        sith: {
          void: '#050405',
          bg: '#0a0809',
          surface: '#120f12',
          raised: '#1a1519',
          line: 'rgba(255,255,255,0.07)',
          ink: '#ece4dc',
          muted: '#9a9098',
          faint: '#5a525a',
          crimson: '#e3242b',
          ember: '#ff5a3c',
          blood: '#7a0f14',
          gold: '#c9a44c',
          goldDim: '#8a6f2e',
          violet: '#a855f7',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        pixel: ['VT323', 'monospace'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 12px rgba(227,36,43,0.6), 0 0 32px rgba(227,36,43,0.25)',
        'glow-soft': '0 0 24px rgba(227,36,43,0.18)',
        pixel: '4px 4px 0 0 #000',
      },
    },
  },
  plugins: [],
};
