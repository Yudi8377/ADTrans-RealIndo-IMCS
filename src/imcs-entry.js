// Core browser entry for the IMCS application.
// Keep optional administration/AIG modules out of the critical startup path.
// Branding is imported here so production Vite builds one application graph and
// never require the browser to execute the raw source branding module directly.
import './main.js';
import './brand-enhancer.js';

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
