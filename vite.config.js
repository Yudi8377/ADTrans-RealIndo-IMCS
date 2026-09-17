import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

const rootDir = fileURLToPath(new URL('.', import.meta.url));

// Keep the public base explicit for GitHub Pages previews and override it for
// future production domains/deployments without changing application code.
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
