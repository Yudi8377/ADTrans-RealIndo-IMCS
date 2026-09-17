# Build repair record — 2026-09-17

The Pages pipeline reached `Build production bundle` successfully but failed at `Verify production artifact` before deployment. The failure occurred because the application-entry mechanism relied on a custom HTML placeholder transform instead of letting Vite process native `<script type="module" src="./src/...">` entries directly.

## Repair decision
Use Vite's native multi-page HTML entry handling:
- `index.html` directly references `./src/public-entry.js` as a module.
- `imcs.html` directly references `./src/imcs-entry.js` as a module.
- `vite.config.js` no longer needs the custom `transformIndexHtml` placeholder plugin.
- The explicit `base` remains controlled by `VITE_BASE_PATH` for GitHub Pages.

This removes a fragile transformation layer and makes the build artifact easier to reason about and test. Vite documents that module asset paths in HTML are rewritten according to the configured `base`, including nested GitHub Pages deployments. citeturn2search0turn2search2

## Verification target
The next Pages run must pass:
1. Build production bundle
2. Verify public boundary
3. Verify release source
4. Verify production artifact
5. Verify hosting-path portability
6. Verify GitHub Pages asset base
7. Deploy verified artifact

Only after the successful deployment will the preview be considered verified live.
