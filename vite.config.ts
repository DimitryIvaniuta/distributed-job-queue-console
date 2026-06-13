import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  base: './',
  plugins: [react()],
  server: { port: 5173, strictPort: true },
  preview: { port: 4173, strictPort: true },
  build: { sourcemap: true, target: 'es2023' },
  test: {
    environment: 'jsdom', globals: true, setupFiles: './vitest.setup.ts', exclude: ['e2e/**','node_modules/**','dist/**'],
    coverage: { provider: 'v8', reporter: ['text','html'], thresholds: { statements: 75, branches: 70, functions: 75, lines: 75 } }
  }
});
