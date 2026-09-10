import { readFile } from 'node:fs/promises';
import { access } from 'node:fs/promises';

const required = [
  'index.html',
  'src/main.js',
  'src/style.css',
  'vite.config.js',
  '.env.example',
  'supabase/migrations/0003_secure_budget_lines_rls.sql',
  'supabase/migrations/0008_realindo_auth_profile_bootstrap.sql',
  'docs/OPERATING_MODEL.md'
];

for (const file of required) await access(file);

const main = await readFile('src/main.js', 'utf8');
const env = await readFile('.env.example', 'utf8');
const html = await readFile('index.html', 'utf8');

const checks = [
  ['Supabase URL is environment-driven', main.includes('import.meta.env.VITE_SUPABASE_URL')],
  ['Publishable-key support exists', main.includes('VITE_SUPABASE_PUBLISHABLE_KEY')],
  ['Legacy anon-key compatibility exists', main.includes('VITE_SUPABASE_ANON_KEY')],
  ['Public/internal route exists', main.includes('location.hash') && main.includes('#imcs')],
  ['Auth gate exists', main.includes('signInWithPassword') && main.includes('getSession')],
  ['Profile/role gate exists', main.includes('from(\'profiles\')') && main.includes('role')],
  ['Organization-scoped writes exist', main.includes('organization_id')],
  ['Environment template contains publishable variables', env.includes('VITE_SUPABASE_URL=') && env.includes('VITE_SUPABASE_PUBLISHABLE_KEY=')],
  ['HTML has non-empty title', /<title>[^<]+<\/title>/i.test(html)],
  ['No service-role key in frontend source', !main.toLowerCase().includes('service_role')],
  ['No JWT-shaped secret in frontend source', !/eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\./.test(main)],
  ['Public portfolio sections exist', ['#home','#about','#projects','#investment','#contact'].every(x=>main.includes(x))],
  ['IMCS management modules exist', ['Land Bank','Property & Asset','Development','Investment','Finance','Contracts & Legal','Risk & Compliance','Governance','KPI & Alerts'].every(x=>main.includes(x))]
];

const failed = checks.filter(([, ok]) => !ok);
for (const [label, ok] of checks) console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}`);
if (failed.length) process.exit(1);
console.log(`Release smoke check passed: ${checks.length} checks.`);
