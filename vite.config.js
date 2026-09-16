import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

const rootDir = fileURLToPath(new URL('.', import.meta.url));

// Use relative production asset URLs so the same artifact works from:
// - local Vite preview
// - GitHub Pages project hosting
// - future custom domains
const base = process.env.VITE_BASE_PATH || './';

function adtransEntryPlaceholders() {
  return {
    name: 'adtrans-entry-placeholders',
    transformIndexHtml(html) {
      return html
        .replace(
          '<script id="app-entry" type="text/plain" data-vite-entry="./src/public-entry.js"></script>',
          '<script id="app-entry" type="module" src="./src/public-entry.js"></script>'
        )
        .replace(
          '<script id="app-entry" type="text/plain" data-vite-entry="./src/imcs-entry.js"></script>',
          '<script id="app-entry" type="module" src="./src/imcs-entry.js"></script>'
        );
    },
  };
}

export default defineConfig({
  plugins: [adtransEntryPlaceholders()],
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
