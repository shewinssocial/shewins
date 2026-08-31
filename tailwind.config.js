/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#F3EFE6',
          50: '#FCFBF8',
          100: '#F3EFE6',
          200: '#EAE2D2',
          300: '#DFD3B9',
        },
        ink: {
          DEFAULT: '#3A2E29',
          soft: '#5E4E47',
          faint: '#8A796F',
        },
        rose: {
          50: '#FBF1F1',
          100: '#F5DEE0',
          200: '#E9BEC2',
          300: '#D999A0',
          400: '#C97B84',
          500: '#B4616C',
          600: '#8C4B56',
          700: '#6E3A43',
          900: '#3F2126',
        },
        white: '#FFFFFF',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 8px 30px -12px rgba(58, 46, 41, 0.18)',
        card: '0 2px 14px -4px rgba(58, 46, 41, 0.12)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        drift: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.7s ease-out both',
        drift: 'drift 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
