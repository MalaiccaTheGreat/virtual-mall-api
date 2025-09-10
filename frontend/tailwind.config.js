const { fontFamily } = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: colors.blue[600],
          light: colors.blue[500],
          dark: colors.blue[700],
          foreground: colors.white,
        },
        secondary: {
          DEFAULT: colors.gray[600],
          light: colors.gray[500],
          dark: colors.gray[700],
          foreground: colors.white,
        },
        success: {
          DEFAULT: colors.green[600],
          light: colors.green[500],
          dark: colors.green[700],
          foreground: colors.white,
        },
        warning: {
          DEFAULT: colors.amber[500],
          light: colors.amber[400],
          dark: colors.amber[600],
          foreground: colors.gray[900],
        },
        danger: {
          DEFAULT: colors.red[600],
          light: colors.red[500],
          dark: colors.red[700],
          foreground: colors.white,
        },
        background: {
          DEFAULT: colors.white,
          dark: colors.gray[900],
        },
        foreground: {
          DEFAULT: colors.gray[900],
          dark: colors.gray[50],
        },
        muted: {
          DEFAULT: colors.gray[500],
          dark: colors.gray[400],
          foreground: {
            DEFAULT: colors.gray[600],
            dark: colors.gray[300],
          },
        },
        border: colors.gray[200],
        input: colors.gray[200],
        ring: colors.blue[500],
      },
      borderRadius: {
        lg: '0.5rem',
        md: 'calc(0.5rem - 2px)',
        sm: 'calc(0.5rem - 4px)',
      },
      fontFamily: {
        sans: ['Inter var', ...fontFamily.sans],
        heading: ['Inter var', ...fontFamily.sans],
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.foreground.DEFAULT'),
            a: {
              color: theme('colors.primary.DEFAULT'),
              '&:hover': {
                color: theme('colors.primary.dark'),
              },
            },
            'h1, h2, h3, h4': {
              color: theme('colors.foreground.DEFAULT'),
              fontWeight: '600',
            },
            code: {
              color: theme('colors.primary.DEFAULT'),
              '&::before, &::after': {
                content: '"`"',
              },
            },
          },
        },
        dark: {
          css: {
            color: theme('colors.foreground.dark'),
            a: {
              color: theme('colors.primary.light'),
              '&:hover': {
                color: theme('colors.primary.DEFAULT'),
              },
            },
            'h1, h2, h3, h4': {
              color: theme('colors.foreground.dark'),
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
    require('@tailwindcss/aspect-ratio'),
  ],
  // Enable JIT mode for better performance and development experience
  mode: 'jit',
  // Configure dark mode class strategy
  darkMode: 'class',
  // Enable RTL support
  rtl: true,
  // Safelist any classes that should never be purged
  safelist: [
    'rtl',
    'ltr',
    'dark',
    'text-rtl',
    'text-ltr',
    'bg-white',
    'bg-gray-50',
    'text-gray-900',
    'dark:bg-gray-900',
    'dark:bg-gray-800',
    'dark:text-white',
    'dark:text-gray-100',
    'dark:border-gray-700',
  ],
  // Disable preflight to avoid CSS conflicts
  corePlugins: {
    preflight: false,
  },
}
