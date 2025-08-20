/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  // Enable JIT mode for better performance and development experience
  mode: 'jit',
  // Disable preflight to avoid CSS conflicts
  corePlugins: {
    preflight: false,
  },
  // Safelist any classes that should never be purged
  safelist: [
    'html',
    'body',
    'bg-gray-50',
    'text-gray-900',
    'dark:bg-gray-800',
    'dark:text-white',
  ],
}
