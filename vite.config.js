import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  server: {
    fs: {
      deny: ['.env', '.env.*', 'node_modules', '../'],
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
