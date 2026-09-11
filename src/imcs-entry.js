// Single browser entry for the IMCS application.
// Keeping package imports behind Vite's module graph prevents GitHub Pages
// from attempting to resolve bare npm specifiers directly in the browser.
import './main.js';
import './admin.js';
import './aig.js';
