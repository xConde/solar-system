import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  server: {
    fs: {
      // Deny access to files outside the project root
      deny: ['**/.env', '**/.env.*', '**/node_modules/**', '../**'],
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
