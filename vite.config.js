import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

const rootDir = fileURLToPath(new URL('.', import.meta.url));

// GitHub Pages serves this repository under /ADTrans-RealIndo-IMCS/.
// Custom-domain deployments can set VITE_BASE_PATH=/ at build time.
const base = process.env.VITE_BASE_PATH || '/';

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
