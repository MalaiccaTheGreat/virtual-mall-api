import { resolve } from 'path';
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    laravel({
      input: [
        'resources/css/app.css',
        'resources/js/app.jsx',
      ],
      refresh: [
        'resources/views/**',
        'app/Http/Controllers/**',
        'routes/**',
      ],
    }),
    react({
      fastRefresh: true,
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'resources/js'),
      '~': resolve(__dirname, 'resources'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    hmr: {
      host: 'localhost',
      protocol: 'ws',
      port: 3000,
    },
  },
  build: {
    outDir: 'public/build',
    emptyOutDir: true,
    manifest: true,
    sourcemap: true, // Enable source maps for better debugging
    minify: 'terser', // Use terser for better minification
    cssCodeSplit: true, // Enable CSS code splitting
    reportCompressedSize: true, // Show gzipped size in bundle analysis
    chunkSizeWarningLimit: 1000, // Set chunk size warning limit to 1MB
    rollupOptions: {
      input: {
        app: resolve(__dirname, 'resources/js/app.jsx'),
      },
      output: {
        entryFileNames: 'assets/js/[name].[hash].js',
        chunkFileNames: 'assets/js/[name].[hash].js',
        assetFileNames: (assetInfo) => {
          // Organize assets into subdirectories
          if (assetInfo.name.endsWith('.css')) {
            return 'assets/css/[name].[hash][extname]';
          }
          if (['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'].some(ext => assetInfo.name.endsWith(ext))) {
            return 'assets/images/[name].[hash][extname]';
          }
          if (['.woff', '.woff2', '.eot', '.ttf', '.otf'].some(ext => assetInfo.name.endsWith(ext))) {
            return 'assets/fonts/[name].[hash][extname]';
          }
          return 'assets/[name].[hash][extname]';
        },
      },
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@inertiajs/react',
      '@react-three/fiber',
      '@react-three/drei',
    ],
  },
});
