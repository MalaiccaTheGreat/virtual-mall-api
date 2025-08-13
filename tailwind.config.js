import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./resources/**/*.blade.php",
    "./resources/**/*.js",
    "./resources/**/*.jsx",
    "./resources/**/*.tsx",
    './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
    './storage/framework/views/*.php',
    './resources/views/**/*.blade.php',
    './resources/js/**/*.jsx',
    './resources/**/*.{js,jsx,ts,tsx,vue,blade.php}',
  ],

  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f4ff',
          100: '#dbe4ff',
          200: '#bfd3ff',
          300: '#93b4ff',
          400: '#608cff',
          500: '#4169E1', // Royal Blue
          600: '#2952cc',
          700: '#1e3da6',
          800: '#1a3488',
          900: '#1a2d6d',
        },
        secondary: {
          50: '#fff9eb',
          100: '#ffefc6',
          200: '#ffd980',
          300: '#ffc341',
          400: '#ffb01f',
          500: '#FFD700', // Gold
          600: '#e6a500',
          700: '#cc7a00',
          800: '#a65c00',
          900: '#804800',
        },
      },
      fontFamily: {
        sans: ['Figtree', ...defaultTheme.fontFamily.sans],
      },
    },
  },

  plugins: [
    forms,
    require('@tailwindcss/typography'), // Uncomment if needed
    require('@tailwindcss/aspect-ratio'), // Uncomment if needed
  ],
};
