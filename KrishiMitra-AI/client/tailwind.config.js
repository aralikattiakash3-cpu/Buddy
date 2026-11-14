/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        leaf: {
          light: '#86efac',
          DEFAULT: '#22c55e',
          dark: '#16a34a',
        },
        cream: {
          50: '#fdfcf9',
          100: '#f9f8f2',
          200: '#f4f2e6',
          300: '#ece8d5',
          DEFAULT: '#f9f8f2',
        },
        earth: {
          50: '#fbf8f4',
          100: '#f5eee6',
          500: '#8b5cf6',
          700: '#78350f',
          800: '#451a03',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
