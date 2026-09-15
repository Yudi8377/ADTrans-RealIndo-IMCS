import { readFile } from 'node:fs/promises';

const companion = await readFile('src/ai-companion.js', 'utf8');
const checks = [
  ['AI Companion persists messages through saveMessage', companion.includes("from('ai_companion_messages').insert")],
  ['Local capability action uses null gateway request id', companion.includes("await saveMessage('assistant',text,null,{source:'local_capabilities'})")],
  ['Gateway invocation carries conversation id', companion.includes('conversation_id:state.conversation?.id||null')],
  ['Gateway invocation carries companion id', companion.includes('companion_id:state.companion?.id||null')],
  ['Voice recognition uses Indonesian locale', companion.includes("recognition.lang='id-ID'")],
  ['AI Companion exposes only safe public context', companion.includes('companionId:state.companion?.id||null') && !companion.includes('companion:state.companion,conversation:state.conversation')],
  ['No service-role key in AI Companion', !companion.toLowerCase().includes('service_role')]
];

const failed = checks.filter(([, ok]) => !ok);
for (const [label, ok] of checks) console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}`);
if (failed.length) process.exit(1);
console.log(`AI Companion smoke check passed: ${checks.length} checks.`);
