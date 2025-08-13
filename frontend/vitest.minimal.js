// Minimal Vitest configuration that doesn't rely on Vite
export default {
  test: {
    globals: true,
    environment: 'node', // Using node environment instead of jsdom to avoid browser dependencies
    include: ['src/__tests__/**/*.test.js'],
    exclude: ['node_modules', 'dist', '.idea', '.git'],
  },
};
