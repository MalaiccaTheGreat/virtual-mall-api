import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    laravel({
      input: ['resources/css/app.css', 'resources/js/app.js'],
      refresh: true,
      buildDirectory: 'build',
      manifest: {
        path: 'build/manifest.json',
        publicPath: '/build/',
      }
    }),
    react(),
  ],
  resolve: {
    alias: {
      '@': '/resources/js',
    },
  },
  server: {
    hmr: {
      host: 'localhost',
    },
    watch: {
      usePolling: true,
    },
  },
  build: {
    outDir: 'public/build',
    assetsDir: 'assets',
    emptyOutDir: true,
    manifest: true,
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
  },
});
