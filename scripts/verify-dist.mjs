import { readFile, readdir } from 'node:fs/promises';
import { access } from 'node:fs/promises';

const dist = 'dist';
await access(dist);
await access('dist/index.html');
await access('dist/imcs.html');

const [corporate, imcs] = await Promise.all([
  readFile('dist/index.html', 'utf8'),
  readFile('dist/imcs.html', 'utf8')
]);

const checks = [
  ['dist/index.html exists', true],
  ['dist/imcs.html exists', true],
  ['Corporate HTML has no raw source module entry', !corporate.includes('./src/')],
  ['IMCS HTML has no raw source module entry', !imcs.includes('./src/')],
  ['Corporate HTML has bundled asset entry', /\/assets\/[^"']+\.js/.test(corporate)],
  ['IMCS HTML has bundled asset entry', /\/assets\/[^"']+\.js/.test(imcs)],
  ['IMCS HTML has no bare Supabase package import', !imcs.includes('@supabase/supabase-js')],
  ['IMCS HTML has no direct branding source entry', !imcs.includes('brand-enhancer.js')],
  ['Corporate HTML has no direct branding source entry', !corporate.includes('brand-enhancer.js')],
];

const assets = await readdir('dist/assets');
checks.push(['Vite asset directory is populated', assets.length > 0]);

const failed = checks.filter(([, ok]) => !ok);
for (const [label, ok] of checks) console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}`);
if (failed.length) process.exit(1);
console.log(`Production artifact verification passed: ${checks.length} checks.`);
