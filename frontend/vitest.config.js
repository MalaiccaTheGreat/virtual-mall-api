// Use dynamic import to avoid ESM issues with require
export default async () => {
  const { defineConfig } = await import('vite');
  const react = await import('@vitejs/plugin-react');
  
  return defineConfig({
    plugins: [react.default()],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.ts',
      coverage: {
        reporter: ['text', 'json', 'html'],
        exclude: [
          'node_modules/',
          'src/setupTests.ts',
          '**/*.d.ts',
          '**/types.ts',
        ],
      },
    },
  });
};
