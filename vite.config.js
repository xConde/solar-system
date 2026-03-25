// Build: npm run build → outputs to dist/
// Deploy: Connect GitHub repo to Cloudflare Pages
// Build command: npm run build
// Build output directory: dist
import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      // Explicitly exclude test files from the production bundle.
      // Vite will not bundle files not reachable from the entry point, but
      // this makes the intent explicit and guards against accidental imports.
      external: (id) => /\.test\.(ts|js)$/.test(id) || /\.spec\.(ts|js)$/.test(id),
    },
  },
  server: {
    fs: {
      deny: ['.env', '.env.*', 'node_modules', '../'],
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    exclude: ['**/node_modules/**', '**/dist/**', 'e2e/**'],
  },
});
