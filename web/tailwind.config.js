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
          bg: "#070B19",
          surface: "#0B132B",
          card: "#101B3A",
          border: "#1E2A4A",
          borderLight: "#2A3B66",
          gold: "#D4AF37",
          goldLight: "#F3E5AB",
          goldMuted: "#C5A880",
          up: "#10B981",
          down: "#F43F5E",
          text: "#F8FAFC",
          muted: "#94A3B8",
          dark: "#040711",
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      }
    },
  },
  plugins: [],
}
