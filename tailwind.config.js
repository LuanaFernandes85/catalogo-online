/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Sora"', 'sans-serif'],
        sans: ['"Inter"', 'sans-serif'],
      },
      colors: {
        ink: {
          950: '#0B1210',
          900: '#12201C',
          800: '#1B2E28',
          700: '#2A4139',
        },
        brand: {
          50: '#ECFAF6',
          100: '#D2F2E9',
          300: '#7FD6C0',
          500: '#0F766E',
          600: '#0D6259',
          700: '#0A4D46',
        },
        clay: {
          400: '#F5A524',
          500: '#F59E0B',
          600: '#D9840A',
        },
        canvas: '#F7F7F5',
      },
      boxShadow: {
        card: '0 1px 2px rgba(11,18,16,0.06), 0 8px 24px -12px rgba(11,18,16,0.15)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
}
