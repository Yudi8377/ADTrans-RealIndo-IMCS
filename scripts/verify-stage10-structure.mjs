import fs from 'node:fs';

const required = [
  'index.html',
  'imcs.html',
  'src/public-entry.js',
  'src/imcs-entry.js',
  'src/public-site.js',
  'src/main.js',
  'src/ai-companion.js',
  'src/adei-ui.js',
  'src/workforce.js',
  'src/operations.js',
  'src/finance-controls.js',
  'supabase/functions/aig-gateway/index.ts'
];
for (const file of required) {
  if (!fs.existsSync(file)) throw new Error(`Missing Stage 10 file: ${file}`);
}
const corporate = fs.readFileSync('index.html', 'utf8');
const imcs = fs.readFileSync('imcs.html', 'utf8');
const workflow = fs.readFileSync('.github/workflows/ci.yml', 'utf8');
if (!corporate.includes('public-entry.js')) throw new Error('Corporate boundary missing');
if (!imcs.includes('imcs-entry.js')) throw new Error('IMCS boundary missing');
if (!imcs.includes('noindex,nofollow')) throw new Error('IMCS indexing guard missing');
if (!workflow.includes('playwright@1.55.0 screenshot')) throw new Error('Browser smoke gate missing');
console.log(`Stage 10 structural verification: PASS (${required.length} required surfaces)`);
