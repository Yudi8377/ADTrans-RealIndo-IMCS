// Core browser entry for the IMCS application.
// Keep optional administration/AIG modules out of the critical startup path.
// This prevents a secondary module from preventing the authenticated IMCS shell
// from rendering when a stale/missing chunk is encountered.
import './main.js';

// Optional modules are loaded after the core IMCS renderer is available.
// Their failure is diagnostic-only and must never blank the main application.
Promise.allSettled([
  import('./admin.js'),
  import('./aig.js'),
]).then((results) => {
  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      console.error(index === 0 ? '[IMCS] admin module failed to load' : '[IMCS] AIG module failed to load', result.reason);
    }
  });
});
