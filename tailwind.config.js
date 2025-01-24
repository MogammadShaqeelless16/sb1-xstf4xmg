/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#32465a',
          dark: '#1d4ed8',
        },
        secondary: '#64748b',
        accent: '#0ea5e9',
        background: '#f8fafc',
        surface: '#ffffff',
      }
    },
  },
  plugins: [],
};