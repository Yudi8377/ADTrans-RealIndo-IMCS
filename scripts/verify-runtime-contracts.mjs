import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root,p),'utf8');
const must = (condition, message) => { if (!condition) throw new Error(message); };

const index = read('index.html');
const imcs = read('imcs.html');
const vite = read('vite.config.js');
const main = read('src/main.js');
const entry = read('src/imcs-entry.js');

must(index.includes('src/public-entry.js'), 'Corporate entry missing');
must(index.includes('ADTrans RealIndo Corporate'), 'Corporate identity missing');
must(imcs.includes('src/imcs-entry.js'), 'IMCS entry missing');
must(vite.includes("imcs: `${rootDir}imcs.html`"), 'IMCS multi-page build input missing');
must(entry.includes("mountAICompanion"), 'AI Companion mount missing');
must(entry.includes("mountADEI"), 'ADEI mount missing');
must(main.includes("signInWithPassword"), 'Supabase password authentication flow missing');
must(main.includes("from('profiles')"), 'Profile authorization lookup missing');
must(!/service_role|sb_secret_/i.test(main), 'Secret/service-role credential detected in frontend');

console.log('Runtime contract verification: PASS');
console.log('Corporate and IMCS entrypoints are separated.');
console.log('IMCS auth/profile boundary and AI/ADEI mounts are present.');
