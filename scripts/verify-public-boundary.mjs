import { readFile } from 'node:fs/promises';

const files = ['index.html', 'src/public-site.js', 'src/public-interface-guard.js'];
const forbidden = [
  /IMCS\s+LOGIN/i,
  /IMCS\s+LOG\s*IN/i,
  /SECURE\s+MANAGEMENT\s+ACCESS/i,
  /href\s*=\s*["']#imcs["']/i
];

let failed = false;
for (const file of files) {
  const text = await readFile(file, 'utf8');
  for (const pattern of forbidden) {
    if (pattern.test(text)) {
      console.error(`FAIL  Public boundary violation: ${file} matches ${pattern}`);
      failed = true;
    }
  }
  console.log(`PASS  Public boundary scanned: ${file}`);
}

if (failed) process.exit(1);
console.log('Public boundary check passed. Internal access is not exposed by the corporate frontend source.');
