import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' so the build can be served from any sub-path (GitHub Pages, Netlify, a folder).
export default defineConfig({
  base: './',
  plugins: [react()],
  // The main chunk is mostly React plus the curated seed text; the AI SDK is split out and lazy.
  build: { chunkSizeWarningLimit: 800 },
  test: { environment: 'node' },
} as never);
