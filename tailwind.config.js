/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#F5F0E8',
        'cream-muted': '#C8BEA8',
        amber: {
          DEFAULT: '#D97706',
          hover: '#B45309',
          light: '#F59E0B',
          dim: '#92400E',
        },
        warm: {
          950: '#0F0D0A',
          900: '#1A1410',
          800: '#231E18',
          750: '#2D2620',
          700: '#3D3530',
          600: '#57493F',
          500: '#7A6A5C',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        sans: ['DM Sans', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
