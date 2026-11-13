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
        earth: {
          50: '#fbf8f3',
          100: '#f4ede1',
          200: '#e8dac2',
          300: '#d7c19c',
          400: '#c5a574',
          500: '#b38d56',
          600: '#9b7346',
          700: '#7c583a',
          800: '#674834',
          900: '#563c2e',
        },
      },
    },
  },
  plugins: [],
}
