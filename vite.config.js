import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

const rootDir = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  // GitHub Pages serves this project from /ADTrans-RealIndo-IMCS/.
  // Keep local development at / while producing correct production asset URLs.
  base: process.env.GITHUB_ACTIONS ? '/ADTrans-RealIndo-IMCS/' : '/',
  build: {
    rollupOptions: {
      // Explicit multi-page inputs ensure dist/imcs.html is emitted.
      input: {
        corporate: `${rootDir}index.html`,
        imcs: `${rootDir}imcs.html`,
      },
    },
  },
});
