/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./assets/**/*.{js,css}"
  ],
  theme: {
    extend: {
      colors: {
        'flower': {
          50: '#f2e6fe',
          100: '#e5cefd',
          200: '#cc9cfc',
          300: '#b26bfa',
          400: '#9939f9',
          500: '#7f08f7',
          600: '#6606c6',
          700: '#4c0594',
          800: '#330363',
          900: '#190231',
          950: '#0d0119',
        },
      },
    },
  },
  plugins: [],
}
