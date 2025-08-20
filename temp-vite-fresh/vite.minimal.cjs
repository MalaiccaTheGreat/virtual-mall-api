// Minimal Vite configuration for the project
module.exports = {
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: 'src/main.jsx'
    }
  },
  css: {
    postcss: false // Disable PostCSS processing
  },
  server: {
    open: true,
    port: 3000
  },
  plugins: []
};
