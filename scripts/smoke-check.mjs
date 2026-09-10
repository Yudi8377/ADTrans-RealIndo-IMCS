import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const required = ['index.html','src/main.js','src/style.css','supabase/migrations/0008_realindo_auth_profile_bootstrap.sql'];
for (const file of required) {
  if (!fs.existsSync(file)) throw new Error(`Missing required file: ${file}`);
}
execFileSync(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run','build'], { stdio:'inherit' });
if (!fs.existsSync('dist/index.html')) throw new Error('Vite build did not produce dist/index.html');
const html = fs.readFileSync('dist/index.html','utf8');
if (!html.includes('<script')) throw new Error('Built index.html has no script entrypoint');
console.log('ADTrans RealIndo smoke check: PASS');
