/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        teal: {
          50: '#f1f8f6',
          100: '#dcefea',
          200: '#bcdfd6',
          300: '#90c9bc',
          400: '#5fae9e',
          500: '#3f9687',
          600: '#317d6f',
          700: '#2a6a5e',
          800: '#245549',
          900: '#20473f',
          950: '#102923',
        },
        stone: {
          50: '#fafaf7',
          100: '#f3f3ee',
          200: '#e6e6df',
          300: '#d3d4ca',
          400: '#a9ab9f',
          500: '#7a7e71',
          600: '#5e6256',
          700: '#4a4e44',
          800: '#363a32',
          900: '#262922',
          950: '#161813',
        },
      },
    },
  },
  plugins: [],
};
