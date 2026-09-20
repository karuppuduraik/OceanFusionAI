/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ocean: {
          primary: '#0077B6',
          secondary: '#00B4D8',
          accent: '#48CAE4',
          bg: 'var(--ocean-bg)',
          card: 'var(--ocean-card)',
          sidebar: 'var(--ocean-sidebar)',
          text: 'var(--ocean-text)',
          textMuted: 'var(--ocean-text-muted)',
          border: 'var(--ocean-border)',
          borderDark: '#1E293B',
          subtle: 'var(--ocean-subtle)',
          success: '#22C55E',
          warning: '#F59E0B',
          danger: '#EF4444',
          // Subtle tints
          primaryHover: '#005F92',
          primaryLight: 'rgba(0, 119, 182, 0.08)',
          accentLight: 'rgba(72, 202, 228, 0.15)',
          // Dark theme and oceanic tokens
          navy: '#0A192F',
          teal: '#00B4D8',
          sky: '#38BDF8',
          deep: '#070E1E',
          dark: '#0B132B',
          surface: 'var(--ocean-card)',
        }
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      boxShadow: {
        'card-soft': '0 4px 20px -2px rgba(0, 119, 182, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 10px 25px -5px rgba(0, 119, 182, 0.12), 0 4px 10px -2px rgba(0, 0, 0, 0.04)',
        'sidebar-shadow': '4px 0 24px 0 rgba(2, 62, 138, 0.12)',
        'glow-teal': '0 0 20px rgba(0, 180, 216, 0.35)',
      }
    },
  },
  plugins: [],
}

