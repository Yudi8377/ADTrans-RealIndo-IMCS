import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const required = [
  'index.html','imcs.html','src/public-entry.js','src/imcs-entry.js','src/public-site.js',
  'src/main.js','src/ai-companion.js','src/adei-ui.js','src/workforce.js','src/transaction-controls.js',
  'src/finance-controls.js','supabase/functions/aig-gateway/index.ts','docs/FINISH_GATE.md'
];
for (const file of required) {
  if (!fs.existsSync(path.join(root,file))) throw new Error(`Missing required file: ${file}`);
}
const publicHtml=fs.readFileSync(path.join(root,'index.html'),'utf8');
const imcsHtml=fs.readFileSync(path.join(root,'imcs.html'),'utf8');
const main=fs.readFileSync(path.join(root,'src/main.js'),'utf8');
const gateway=fs.readFileSync(path.join(root,'supabase/functions/aig-gateway/index.ts'),'utf8');
if (!publicHtml.includes('public-entry.js')) throw new Error('Corporate entry boundary missing');
if (!imcsHtml.includes('imcs-entry.js')) throw new Error('IMCS entry boundary missing');
if (/service_role|sb_secret_/i.test(main)) throw new Error('Secret/service-role credential exposed in frontend');
if (!gateway.includes("Authorization") || !gateway.includes("getUser()")) throw new Error('AIG authentication boundary missing');
if (!gateway.includes('ai_tool_registry')) throw new Error('AIG tool governance boundary missing');
console.log('Finish gate structural verification: PASS');
