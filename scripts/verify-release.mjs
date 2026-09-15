import { readFile, access } from 'node:fs/promises';

const required = [
  'index.html',
  'imcs.html',
  'src/main.js',
  'src/style.css',
  'src/imcs-entry.js',
  'src/public-entry.js',
  'src/public-site.js',
  'vite.config.js',
  '.env.example',
  'docs/OPERATING_MODEL.md',
  'docs/PREVIEW_ARCHITECTURE.md'
];

for (const file of required) await access(file);

const main = await readFile('src/main.js', 'utf8');
const env = await readFile('.env.example', 'utf8');
const html = await readFile('index.html', 'utf8');
const imcsHtml = await readFile('imcs.html', 'utf8');
const publicEntry = await readFile('src/public-entry.js', 'utf8');
const imcsEntry = await readFile('src/imcs-entry.js', 'utf8');
const publicSite = await readFile('src/public-site.js', 'utf8');
const architecture = await readFile('docs/PREVIEW_ARCHITECTURE.md', 'utf8');

const checks = [
  ['Supabase URL is environment-driven', main.includes('import.meta.env.VITE_SUPABASE_URL')],
  ['Publishable-key support exists', main.includes('VITE_SUPABASE_PUBLISHABLE_KEY')],
  ['Legacy anon-key compatibility exists', main.includes('VITE_SUPABASE_ANON_KEY')],
  ['Dedicated IMCS entry exists', imcsHtml.includes('./src/imcs-entry.js') && imcsEntry.includes('./main.js')],
  ['Dedicated corporate entry exists', html.includes('./src/public-entry.js') && publicEntry.includes('./public-site.js')],
  ['Auth gate exists', main.includes('signInWithPassword') && main.includes('getSession')],
  ['Profile/role gate exists', main.includes("from('profiles')") && main.includes('role')],
  ['Organization-scoped writes exist', main.includes('organization_id')],
  ['Environment template contains publishable variables', env.includes('VITE_SUPABASE_URL=') && env.includes('VITE_SUPABASE_PUBLISHABLE_KEY=')],
  ['Corporate HTML has non-empty title', /<title>[^<]+<\/title>/i.test(html)],
  ['IMCS HTML has non-empty title', /<title>[^<]+<\/title>/i.test(imcsHtml)],
  ['IMCS is noindex', /name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(imcsHtml)],
  ['No service-role key in frontend source', !main.toLowerCase().includes('service_role')],
  ['No JWT-shaped secret in frontend source', !/eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\./.test(main)],
  ['Public portfolio sections exist', ['#home','#about','#projects','#business','#governance','#contact'].every(x=>publicSite.includes(x))],
  ['IMCS management modules exist', ['Land Bank','Property & Asset','Development','Investment','Finance','Contracts & Legal','Risk & Compliance','Governance','KPI & Alerts'].every(x=>main.includes(x))],
  ['Future production domain boundary is documented', architecture.includes('www.adtransrealindo.com') && architecture.includes('imcs.adtransrealindo.com')],
  ['Corporate source does not load IMCS entry', !publicEntry.includes('imcs-entry') && !publicSite.includes('signInWithPassword')],
  ['IMCS source does not render corporate site', !imcsEntry.includes('public-site')]
];

const failed = checks.filter(([, ok]) => !ok);
for (const [label, ok] of checks) console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}`);
if (failed.length) process.exit(1);
console.log(`Release smoke check passed: ${checks.length} checks.`);
