// Minimal Vite configuration for testing
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'url'

export default defineConfig({
  plugins: [react()],
  root: 'resources',
  base: '/build/',
  publicDir: fileURLToPath(new URL('./public', import.meta.url)),
  build: {
    outDir: fileURLToPath(new URL('./public/build', import.meta.url)),
    emptyOutDir: true,
    manifest: true,
    rollupOptions: {
      input: 'js/app.jsx'
    }
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    hmr: {
      host: 'localhost',
      protocol: 'ws',
      port: 3000
    }
  }
});
