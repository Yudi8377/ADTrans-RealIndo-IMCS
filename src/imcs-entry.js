// Core browser entry for the IMCS application.
// Optional modules load after the core renderer so one module cannot blank the app.
import './main.js';
import './brand-enhancer.js';

Promise.allSettled([
  import('./admin.js'),
  import('./aig.js'),
  import('./housing.js'),
  import('./master-data.js'),
  import('./enterprise.js'),
  import('./workforce.js'),
  import('./operations.js'),
  import('./transaction-controls.js'),
]).then((results) => {
  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      const names = ['admin', 'AIG', 'housing', 'master-data', 'enterprise', 'workforce', 'operations', 'transaction-controls'];
      console.error(`[IMCS] ${names[index]} module failed to load`, result.reason);
    }
  });
});
