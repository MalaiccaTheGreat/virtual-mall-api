// Minimal Vitest config that doesn't depend on Vite
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    // Disable Vite for now
    server: {
      deps: {
        inline: ['@testing-library/react']
      }
    }
  }
});
