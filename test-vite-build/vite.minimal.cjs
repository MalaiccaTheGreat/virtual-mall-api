// Minimal Vite configuration with PostCSS disabled
module.exports = {
  root: '.',
  publicDir: 'public',
  css: {
    postcss: false // Disable PostCSS processing
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: 'src/main.jsx'
    }
  },
  server: {
    open: true,
    port: 3000
  },
  plugins: []
};
