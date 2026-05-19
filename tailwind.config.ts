import type { Config } from 'tailwindcss';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mocha: {
          50: '#faf7f4',
          100: '#f4ede5',
          200: '#e8d9c9',
          300: '#d9bfa4',
          400: '#c89f7b',
          500: '#b8885d',
          600: '#a67352',
          700: '#8a5d45',
          800: '#6f4d3b',
          900: '#5a4031',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
