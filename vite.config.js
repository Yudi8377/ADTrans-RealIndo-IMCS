import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

const rootDir = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  // Relative production asset URLs keep both entry points portable:
  // GitHub Pages (/ADTrans-RealIndo-IMCS/), custom domains (/), and local preview.
  // This is especially important because Corporate and IMCS are separate HTML entry points.
  base: './',
  build: {
    rollupOptions: {
      // Explicit multi-page inputs ensure both production surfaces are emitted.
      input: {
        corporate: `${rootDir}index.html`,
        imcs: `${rootDir}imcs.html`,
      },
    },
  },
});
