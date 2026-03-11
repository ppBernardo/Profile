/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        lando: {
          bg: '#0a0c0a',
          surface: '#101400',
          lime: '#d2ff00',
          limeDim: 'rgba(210, 255, 0, 0.15)',
          muted: '#6b7280',
          border: 'rgba(255,255,255,0.08)',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
