import { readFile } from 'node:fs/promises';
import { access } from 'node:fs/promises';

const required = [
  'index.html',
  'src/main.js',
  'src/style.css',
  'vite.config.js',
  '.env.example',
  'supabase/migrations/0003_secure_budget_lines_rls.sql',
  'docs/OPERATING_MODEL.md'
];

for (const file of required) {
  await access(file);
}

const main = await readFile('src/main.js', 'utf8');
const env = await readFile('.env.example', 'utf8');
const html = await readFile('index.html', 'utf8');

const checks = [
  ['Supabase client is environment-driven', main.includes('import.meta.env.VITE_SUPABASE_URL') && main.includes('import.meta.env.VITE_SUPABASE_ANON_KEY')],
  ['Public/internal route exists', main.includes("location.hash") && main.includes("#imcs")],
  ['Auth gate exists', main.includes('signInWithPassword') && main.includes('getSession')],
  ['Environment template contains publishable variables', env.includes('VITE_SUPABASE_URL=') && env.includes('VITE_SUPABASE_ANON_KEY=')],
  ['HTML has non-empty title', /<title>[^<]+<\/title>/i.test(html)],
  ['No service-role key in frontend source', !main.toLowerCase().includes('service_role')],
  ['No hard-coded Supabase secret in frontend source', !/eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\./.test(main)]
];

const failed = checks.filter(([, ok]) => !ok);
for (const [label, ok] of checks) console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}`);
if (failed.length) process.exit(1);
console.log(`Release smoke check passed: ${checks.length} checks.`);
