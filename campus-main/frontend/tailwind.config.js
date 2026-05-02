/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        coral: {
          50: '#fff1f2',
          100: '#ffe4e6',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c'
        }
      },
      boxShadow: {
        glow: '0 18px 45px rgba(20, 184, 166, 0.18)'
      }
    }
  },
  plugins: []
};
