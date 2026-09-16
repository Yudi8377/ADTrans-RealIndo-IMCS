import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

const rootDir = fileURLToPath(new URL('.', import.meta.url));

// Use relative production asset URLs by default so the same artifact works from:
// - a local Vite preview
// - GitHub Pages project hosting
// - a future custom domain
// GitHub Pages overrides this with its explicit project base path in CI.
const base = process.env.VITE_BASE_PATH || './';

export default defineConfig({
  base,
  build: {
    rollupOptions: {
      // Explicit multi-page inputs keep Corporate and IMCS as separate application surfaces.
      input: {
        corporate: `${rootDir}index.html`,
        imcs: `${rootDir}imcs.html`,
      },
    },
  },
});
