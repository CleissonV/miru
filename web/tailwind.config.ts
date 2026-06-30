import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        purple: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        pink: {
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
        },
        brand: {
          purple: '#818cf8',
          pink: '#f472b6',
          blue: '#60a5fa',
        },
        surface: {
          DEFAULT: 'var(--surface)',
          2: 'var(--surface-2)',
          3: 'var(--surface-3)',
        },
        bg: 'var(--bg)',
        border: 'var(--border)',
        text: {
          DEFAULT: 'var(--text)',
          muted: 'var(--muted)',
          subtle: 'var(--subtle)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #818cf8 0%, #f472b6 50%, #60a5fa 100%)',
        'gradient-purple-pink': 'linear-gradient(135deg, #818cf8 0%, #f472b6 100%)',
        'gradient-pink-blue': 'linear-gradient(135deg, #f472b6 0%, #60a5fa 100%)',
      },
      boxShadow: {
        glow: '0 0 20px rgba(129, 140, 248, 0.3)',
        'glow-pink': '0 0 20px rgba(244, 114, 182, 0.3)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite linear',
        'fade-up': 'fade-up 0.4s ease forwards',
      },
    },
  },
  plugins: [],
} satisfies Config
