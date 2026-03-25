/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: '#0a0e1a',
        blueprint: '#0d1b2a',
        surface: '#111827',
        'surface-light': '#1f2937',
        accent: '#0891b2',
        'accent-light': '#22d3ee',
        risk: {
          low: '#22c55e',
          moderate: '#f59e0b',
          high: '#f97316',
          critical: '#ef4444',
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
