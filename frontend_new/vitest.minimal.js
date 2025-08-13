// Minimal Vitest configuration that doesn't use Vite
export default {
  test: {
    globals: true,
    environment: 'node', // Using node environment to avoid Vite dependency
    include: ['src/**/*.test.{js,ts,tsx}'],
    exclude: ['node_modules', 'dist', '.idea', '.git'],
  },
};
