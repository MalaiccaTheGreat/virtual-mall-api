// Minimal Vitest configuration for React testing
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom', // Use jsdom for React component testing
    setupFiles: ['./src/setupTests.ts'],
    include: ['src/**/*.test.{js,ts,tsx}'],
    exclude: ['node_modules', 'dist', '.idea', '.git'],
  },
});
