import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      // Enable Fast Refresh
      fastRefresh: true,
      // Use React 17+ automatic JSX transform
      jsxRuntime: 'automatic',
      // Removed Babel decorator plugin to resolve build issues
      babel: {
        presets: ['@babel/preset-react', '@babel/preset-env'],
        plugins: []
      }
    })
  ],
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis',
      },
    },
    exclude: ['expo', 'expo-gl', 'expo-camera'],
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    open: true,
    // Enable HMR over websocket
    hmr: {
      protocol: 'ws',
      host: 'localhost',
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Generate sourcemaps for better debugging
    sourcemap: true,
    // Minify for production
    minify: 'esbuild',
    // Enable code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          vendor: ['axios', 'lodash'],
        },
      },
    },
  },
  // Resolve .jsx and .tsx files
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
  // Enable CSS modules
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
    postcss: './postcss.config.mjs',
  },
});
