/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FFF8F0',
        'cream-dark': '#F5EDE3',
        warm: {
          50: '#FFFCF7',
          100: '#FFF5E9',
          200: '#FFE8CC',
          300: '#FFD6A5',
          400: '#E8C49A',
          500: '#C4A882',
          600: '#9C8468',
          700: '#7A6650',
          800: '#5C4B3A',
          900: '#3D3228',
        },
        clay: {
          50: '#FAF6F1',
          100: '#F0E8DE',
          200: '#E2D5C5',
          300: '#CDB9A4',
          400: '#B49A7E',
          500: '#9A7D62',
          600: '#7C6350',
          700: '#5E4A3C',
          800: '#42342B',
          900: '#2C231D',
        },
        teal: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
        },
        risk: {
          low: '#16a34a',
          moderate: '#d97706',
          high: '#ea580c',
          critical: '#dc2626',
        }
      },
      fontFamily: {
        sans: ['"Nunito"', 'system-ui', 'sans-serif'],
        display: ['"Nunito"', 'system-ui', 'sans-serif'],
        body: ['"Nunito"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        'clay': '1.25rem',
      },
      boxShadow: {
        'clay': '0 4px 20px rgba(156, 132, 104, 0.12), 0 2px 6px rgba(156, 132, 104, 0.08)',
        'clay-lg': '0 8px 30px rgba(156, 132, 104, 0.18), 0 4px 10px rgba(156, 132, 104, 0.1)',
        'clay-inset': 'inset 0 2px 8px rgba(156, 132, 104, 0.08)',
      }
    },
  },
  plugins: [],
}
