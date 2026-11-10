/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        arcum: {
          bg: "#070A14",
          bgElevated: "#0B1020",
          surface: "#0E1428",
          card: "#121A36",
          cardInner: "#0E1630",
          border: "rgba(255, 255, 255, 0.08)",
          borderLight: "rgba(255, 255, 255, 0.14)",
          borderGlow: "rgba(25, 230, 255, 0.35)",
          gold: "#D4AF37",
          goldLight: "#FDE68A",
          goldMuted: "#C5A880",
          goldDark: "#997A2E",
          up: "#10B981",
          upLight: "#34D399",
          down: "#F43F5E",
          downLight: "#FB7185",
          text: "#F8FAFC",
          muted: "#94A3B8",
          dark: "#03050B",
          cyan: "#19E6FF",
          cobalt: "#2B4BFF",
          violet: "#8B3CFF",
          lime: "#80A800",
          cyanGlow: "rgba(25, 230, 255, 0.35)",
        }
      },
      fontFamily: {
        display: ['Unbounded', 'system-ui', 'sans-serif'],
        sans: ['Geist', 'Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Unbounded', 'Space Grotesk', 'sans-serif'],
        brand: ['Unbounded', 'Cinzel', 'serif'],
        mono: ['Geist Mono', 'JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'bezel-outer': '0 0 0 1px rgba(255, 255, 255, 0.08), 0 20px 40px -15px rgba(0, 0, 0, 0.7)',
        'bezel-inner': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.12), inset 0 -1px 1px 0 rgba(0, 0, 0, 0.5)',
        'gold-bloom': '0 0 30px -5px rgba(212, 175, 55, 0.25)',
        'cyan-glow': '0 0 0 1px rgba(25, 230, 255, 0.3), 0 0 36px -6px rgba(25, 230, 255, 0.35)',
        'up-bloom': '0 0 25px -5px rgba(16, 185, 129, 0.3)',
        'down-bloom': '0 0 25px -5px rgba(244, 63, 94, 0.3)',
      },
      animation: {
        'shimmer': 'shimmer 2.5s infinite linear',
        'pulse-subtle': 'pulseSubtle 4s infinite ease-in-out',
        'float': 'float 6s ease-in-out infinite',
        'prism-pan': 'prismPan 6s linear infinite',
      },
      keyframes: {
        prismPan: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
