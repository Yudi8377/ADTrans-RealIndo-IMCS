import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  // GitHub Pages serves this project from /ADTrans-RealIndo-IMCS/.
  // Keep local development at / while producing correct production asset URLs.
  base: process.env.GITHUB_ACTIONS ? '/ADTrans-RealIndo-IMCS/' : '/',
  build: {
    rollupOptions: {
      // Explicit multi-page inputs are required so the dedicated IMCS entry
      // is emitted to dist/imcs.html alongside the corporate index.html.
      input: {
        corporate: resolve(__dirname, 'index.html'),
        imcs: resolve(__dirname, 'imcs.html'),
      },
    },
  },
});
