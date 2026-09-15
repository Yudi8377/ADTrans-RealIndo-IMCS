// Core browser entry for the IMCS application.
// Optional modules load after the core renderer so one module cannot blank the app.
import './main.js';
import './brand-enhancer.js';
import { mountAICompanion } from './ai-companion.js';
import { resolveAIRuntimeContext } from './ai-runtime-context.js';

Promise.allSettled([
  import('./admin.js'),
  import('./aig.js'),
  import('./housing.js'),
  import('./master-data.js'),
  import('./enterprise.js'),
  import('./workforce.js'),
  import('./operations.js'),
  import('./transaction-controls.js'),
  import('./finance-controls.js'),
]).then(async (results) => {
  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      const names = ['admin', 'AIG', 'housing', 'master-data', 'enterprise', 'workforce', 'operations', 'transaction-controls', 'finance-controls'];
      console.error(`[IMCS] ${names[index]} module failed to load`, result.reason);
    }
  });

  // Resolve the AI principal from the authenticated profile. The client never
  // invents organization or role context for the Companion.
  try {
    const context = await resolveAIRuntimeContext('IMCS');
    mountAICompanion(context);
  } catch (error) {
    console.error('[IMCS] AI Companion context resolution failed', error);
    mountAICompanion({ application: 'IMCS' });
  }
});
