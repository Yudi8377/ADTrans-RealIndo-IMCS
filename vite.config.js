import { defineConfig } from 'vite';

export default defineConfig({
  // GitHub Pages serves this project from /ADTrans-RealIndo-IMCS/.
  // Keep local development at / while producing correct production asset URLs.
  base: process.env.GITHUB_ACTIONS ? '/ADTrans-RealIndo-IMCS/' : '/',
});
