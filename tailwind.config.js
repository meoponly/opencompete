/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#09090B',
        surface: {
          DEFAULT: '#121215',
          elevated: '#17171C',
          active: '#1C1C21',
          hover: '#19191E',
          muted: '#141418',
        },
        border: {
          DEFAULT: '#222226',
          subtle: '#1C1C20',
          hover: '#2E2E35',
          active: '#3F3F46',
        },
        foreground: {
          DEFAULT: '#FAFAFA',
          secondary: '#71717A',
          muted: '#A1A1AA',
          subtle: '#52525B',
        },
        accent: {
          DEFAULT: '#FFFFFF',
          dark: '#E4E4E7',
          emerald: '#10B981',
          amber: '#F59E0B',
          rose: '#F43F5E',
          cyan: '#06B6D4',
          indigo: '#6366F1',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Geist Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.4', transform: 'scale(1.2)' },
        },
        slideDown: {
          from: { height: '0', opacity: '0' },
          to: { height: 'var(--radix-accordion-content-height)', opacity: '1' },
        },
        slideUp: {
          from: { height: 'var(--radix-accordion-content-height)', opacity: '1' },
          to: { height: '0', opacity: '0' },
        },
        flashHighlight: {
          '0%': { backgroundColor: 'rgba(255, 255, 255, 0.15)' },
          '100%': { backgroundColor: 'transparent' },
        }
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'flash-highlight': 'flashHighlight 1.5s ease-out forwards',
      },
    },
  },
  plugins: [],
}
