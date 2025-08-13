// CommonJS config to avoid ES module resolution issues
module.exports = {
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.js'],
    // Disable Vite for now
    server: {
      deps: {
        inline: ['@testing-library/react']
      }
    }
  }
};
