/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        vader: {
          black: '#000000',
          bg: '#050505',
          surface: '#0a0a0f',
          red: '#ff0000',
          redDim: 'rgba(255, 0, 0, 0.15)',
          redGlow: 'rgba(255, 0, 0, 0.4)',
          metal: '#1a1a2e',
          metalLight: '#2a2a3e',
          border: 'rgba(255, 255, 255, 0.06)',
          borderRed: 'rgba(255, 0, 0, 0.2)',
        },
      },
      fontFamily: {
        display: ['Orbitron', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Share Tech Mono', 'monospace'],
      },
      animation: {
        'pulse-red': 'pulse-red 2s ease-in-out infinite',
        blink: 'blink 1s step-end infinite',
      },
      keyframes: {
        'pulse-red': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(255,0,0,0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(255,0,0,0.6)' },
        },
        blink: {
          '50%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};
