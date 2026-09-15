import { createClient } from '@supabase/supabase-js';

const COMPANION_ID = 'adtrans-ai-companion';
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://nfvkdqpxexfymzuwdorx.supabase.co';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_4BG89zR_2gWWWeLqqDzALw_Atx9jAJ6';
const sb = SUPABASE_URL && SUPABASE_KEY ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;

const ROLE_CAPABILITIES = {
  SUPER_ADMIN: ['enterprise', 'security', 'system'],
  DIRECTOR: ['executive', 'enterprise', 'project', 'finance', 'risk'],
  COMMISSIONER: ['executive', 'enterprise', 'risk'],
  EXECUTIVE: ['executive', 'enterprise', 'project', 'finance', 'risk'],
  DEPARTMENT_HEAD: ['department', 'project', 'reporting'],
  MANAGER: ['department', 'project', 'operations', 'reporting'],
  STAFF: ['department', 'operations', 'knowledge'],
  AUDITOR: ['audit', 'reporting', 'knowledge'],
};

const state = {
  open: false,
  context: null,
  messages: [],
  memory: [],
  companion: null,
  busy: false,
  voiceListening: false,
};

function getHost() { return document.body || document.documentElement; }
function escapeHtml(value = '') { return String(value).replace(/[&<>\"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;' }[char])); }
function speechAvailable() { return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window; }

function style() {
  if (document.getElementById(`${COMPANION_ID}-style`)) return;
  const css = document.createElement('style'); css.id = `${COMPANION_ID}-style`;
  css.textContent = `
    #${COMPANION_ID}{position:fixed;right:20px;bottom:20px;z-index:99990;font-family:Inter,system-ui,sans-serif}
    #${COMPANION_ID} .aic-launch{width:60px;height:60px;border:0;border-radius:50%;cursor:pointer;background:linear-gradient(145deg,#111827,#334155);color:#fff;box-shadow:0 14px 38px rgba(0,0,0,.28);font-weight:800;letter-spacing:.04em}
    #${COMPANION_ID} .aic-panel{width:min(420px,calc(100vw - 28px));height:min(650px,calc(100vh - 92px));display:flex;flex-direction:column;background:#fff;border:1px solid #e2e8f0;border-radius:20px;box-shadow:0 28px 80px rgba(15,23,42,.25);overflow:hidden}
    #${COMPANION_ID} .aic-head{padding:15px 16px;background:#0f172a;color:#fff;display:flex;justify-content:space-between;align-items:center}.aic-ident{display:flex;gap:10px;align-items:center}.aic-avatar{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;background:#334155;font-weight:800}.aic-title{font-weight:800}.aic-sub{font-size:11px;opacity:.72;margin-top:2px}.aic-close{border:0;background:transparent;color:#fff;font-size:20px;cursor:pointer}
    #${COMPANION_ID} .aic-context{padding:8px 12px;background:#f8fafc;border-bottom:1px solid #e2e8f0;font-size:10px;color:#475569;display:flex;justify-content:space-between;gap:8px}.aic-context span:last-child{font-weight:700}
    #${COMPANION_ID} .aic-body{flex:1;padding:14px;overflow:auto;background:#f8fafc}.aic-msg{padding:10px 12px;border-radius:14px;margin:8px 0;max-width:90%;font-size:13px;line-height:1.5;white-space:pre-wrap}.aic-ai{background:#fff;border:1px solid #e2e8f0}.aic-user{background:#0f172a;color:#fff;margin-left:auto}.aic-meta{font-size:10px;color:#64748b;margin-top:4px}
    #${COMPANION_ID} .aic-welcome{font-size:12px;color:#475569;margin-bottom:10px;padding:10px;border:1px dashed #cbd5e1;border-radius:12px;background:#fff}
    #${COMPANION_ID} .aic-foot{padding:10px;border-top:1px solid #e2e8f0;background:#fff}.aic-compose{display:flex;gap:7px}.aic-input{flex:1;resize:none;border:1px solid #cbd5e1;border-radius:12px;padding:10px;font:inherit;font-size:13px;min-height:42px}.aic-send,.aic-mic{border:0;border-radius:12px;background:#0f172a;color:#fff;padding:0 12px;cursor:pointer}.aic-mic{background:#475569}.aic-send:disabled{opacity:.55;cursor:wait}.aic-tools{display:flex;gap:6px;margin-top:7px}.aic-tool{border:1px solid #e2e8f0;background:#fff;border-radius:9px;padding:5px 8px;font-size:10px;color:#334155;cursor:pointer}.aic-status{font-size:10px;color:#64748b;margin-top:6px}
    #${COMPANION_ID} .aic-onboard{padding:16px;background:#fff;border-bottom:1px solid #e2e8f0}.aic-onboard p{font-size:12px;color:#475569;margin:0 0 9px}.aic-name-row{display:flex;gap:7px}.aic-name{flex:1;border:1px solid #cbd5e1;border-radius:10px;padding:9px;font-size:13px}.aic-save{border:0;border-radius:10px;background:#0f172a;color:#fff;padding:0 12px;cursor:pointer}
  `; document.head.appendChild(css);
}

async function ensureCompanion() {
  if (!sb || !state.context?.userId || !state.context?.organizationId) return null;
  const { data: existing } = await sb.from('ai_companions').select('id,companion_name,persona,status,context_policy,preferences').eq('user_id', state.context.userId).eq('organization_id', state.context.organizationId).maybeSingle();
  if (existing) { state.companion = existing; return existing; }
  const { data: created } = await sb.from('ai_companions').insert({ organization_id: state.context.organizationId, user_id: state.context.userId, companion_name: 'ADTrans AI', persona: `${state.context.role || 'STAFF'} Personal AI Companion`, status: 'ACTIVE', context_policy: { application: state.context.application, role: state.context.role, project_id: state.context.projectId, cross_department: false }, preferences: { language: 'id-ID', voice_enabled: true, proactive: false } }).select('id,companion_name,persona,status,context_policy,preferences').single();
  state.companion = created || null;
  return state.companion;
}

async function loadMemory() {
  if (!sb || !state.companion?.id) return;
  const { data } = await sb.from('ai_companion_memories').select('id,memory_scope,memory_type,content,confidence,status,created_at').eq('companion_id', state.companion.id).in('status', ['APPROVED','ACTIVE']).order('created_at', { ascending: false }).limit(20);
  state.memory = data || [];
}

async function sendToGateway(text) {
  if (!sb) return { ok: false, error: 'Supabase belum dikonfigurasi.' };
  const requestType = state.context?.application === 'IMCS' ? 'assistant' : 'assistant';
  const { data, error } = await sb.functions.invoke('aig-gateway', { body: { request_type: requestType, input_text: text, input_metadata: { companion_id: state.companion?.id || null, application: state.context?.application || 'IMCS', role_hint: state.context?.role || null }, project_id: state.context?.projectId || null } });
  if (error) return { ok: false, error: error.message || 'AI Gateway gagal dihubungi.' };
  return data || { ok: false, error: 'Respons gateway kosong.' };
}

function fallbackText(result) {
  if (result?.error) return `AI Gateway belum dapat memproses permintaan: ${result.error}`;
  if (result?.provider_stage === 'not_configured') return 'Permintaan sudah masuk ke ADTrans AI Gateway dan tercatat dengan kontrol akses. Provider model belum dikonfigurasi pada lingkungan ini, sehingga saya tidak akan berpura-pura memberikan jawaban AI. Setelah provider diaktifkan, percakapan ini dapat diproses tanpa mengubah kontrol RBAC, RLS, approval, dan audit.';
  return result?.answer || 'Permintaan diterima dan diproses sesuai policy ADTrans.';
}

function render() {
  const root = document.getElementById(COMPANION_ID); if (!root) return;
  const companionName = state.companion?.companion_name || 'ADTrans AI';
  const needsName = state.companion && companionName === 'ADTrans AI';
  root.innerHTML = state.open ? `
    <section class="aic-panel" aria-label="ADTrans AI Companion">
      <header class="aic-head"><div class="aic-ident"><div class="aic-avatar">AI</div><div><div class="aic-title">${escapeHtml(companionName)}</div><div class="aic-sub">Personal AI • policy controlled</div></div></div><button class="aic-close" aria-label="Close">×</button></header>
      <div class="aic-context"><span>${escapeHtml(state.context?.application || 'ADTrans')}</span><span>${escapeHtml(state.context?.role || 'STAFF')} · ${state.memory.length} memory</span></div>
      ${needsName ? `<div class="aic-onboard"><p>Berikan nama untuk AI pribadi Anda. Nama ini menjadi identitas asisten pada aplikasi yang Anda gunakan.</p><div class="aic-name-row"><input class="aic-name" maxlength="40" placeholder="Contoh: Bima, Nara, Raka…"><button class="aic-save">Simpan</button></div></div>` : ''}
      <div class="aic-body"><div class="aic-welcome">Saya bekerja mengikuti identitas pengguna, konteks organisasi, project scope, permission, policy, dan audit. Saya dapat membantu menjelaskan dan menyiapkan pekerjaan, tetapi tidak memperoleh kewenangan melebihi Anda.</div>${state.messages.map((m) => `<div class="aic-msg ${m.role === 'user' ? 'aic-user' : 'aic-ai'}">${escapeHtml(m.text)}${m.meta ? `<div class="aic-meta">${escapeHtml(m.meta)}</div>` : ''}</div>`).join('')}</div>
      <form class="aic-foot"><div class="aic-compose"><textarea class="aic-input" rows="2" maxlength="12000" placeholder="Tanyakan sesuatu kepada asisten Anda…"></textarea>${speechAvailable() ? '<button class="aic-mic" type="button" title="Voice input">🎙</button>' : ''}<button class="aic-send" type="submit" ${state.busy ? 'disabled' : ''}>${state.busy ? '…' : 'Kirim'}</button></div><div class="aic-tools"><button class="aic-tool" type="button" data-action="capabilities">Apa yang bisa saya lakukan?</button><button class="aic-tool" type="button" data-action="privacy">Policy & privacy</button></div><div class="aic-status">${state.busy ? 'Mengirim ke AI Gateway…' : 'Gateway aktif · model provider mengikuti konfigurasi lingkungan'}</div></form>
    </section>` : '<button class="aic-launch" aria-label="Open ADTrans AI Companion" title="ADTrans AI Companion">AI</button>';

  root.querySelector('.aic-launch')?.addEventListener('click', () => { state.open = true; render(); });
  root.querySelector('.aic-close')?.addEventListener('click', () => { state.open = false; render(); });
  root.querySelector('.aic-save')?.addEventListener('click', async () => { const input = root.querySelector('.aic-name'); const name = input?.value?.trim(); if (!name || !sb || !state.companion) return; const { data } = await sb.from('ai_companions').update({ companion_name: name }).eq('id', state.companion.id).select('id,companion_name,persona,status,context_policy,preferences').single(); if (data) state.companion = data; render(); });
  root.querySelector('[data-action="capabilities"]')?.addEventListener('click', () => { state.messages.push({ role: 'assistant', text: `Kemampuan aktif untuk role ${state.context?.role || 'STAFF'}: ${(state.context?.capabilities || []).join(', ')}. Semua tindakan tetap melewati permission dan policy ADTrans.` }); render(); });
  root.querySelector('[data-action="privacy"]')?.addEventListener('click', () => { state.messages.push({ role: 'assistant', text: 'Policy: AI tidak boleh menaikkan permission, menghapus audit/evidence, mengubah baseline tanpa approval, atau mengeksekusi tindakan irreversible tanpa kontrol yang diwajibkan. Memory personal dan enterprise knowledge dipisahkan.' }); render(); });
  root.querySelector('.aic-mic')?.addEventListener('click', () => startVoice(root));
  root.querySelector('form')?.addEventListener('submit', async (event) => { event.preventDefault(); const input = root.querySelector('.aic-input'); const text = input?.value?.trim(); if (!text || state.busy) return; state.messages.push({ role: 'user', text }); state.busy = true; input.value = ''; render(); const result = await sendToGateway(text); state.busy = false; state.messages.push({ role: 'assistant', text: fallbackText(result), meta: result?.request?.id ? `Gateway request ${result.request.id}` : 'Gateway response' }); render(); });
}

function startVoice(root) {
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition; if (!Recognition) return;
  if (state.voiceListening) return;
  const recognition = new Recognition(); recognition.lang = 'id-ID'; recognition.interimResults = false; recognition.maxAlternatives = 1; state.voiceListening = true;
  const button = root.querySelector('.aic-mic'); if (button) button.textContent = '…';
  recognition.onresult = (event) => { const text = event.results?.[0]?.[0]?.transcript || ''; const input = root.querySelector('.aic-input'); if (input) input.value = text; };
  recognition.onend = () => { state.voiceListening = false; render(); };
  recognition.onerror = () => { state.voiceListening = false; render(); };
  recognition.start();
}

export async function mountAICompanion(context = {}) {
  if (document.getElementById(COMPANION_ID)) return;
  state.context = { organizationId: context.organizationId || null, userId: context.userId || null, role: context.role || 'STAFF', department: context.department || null, application: context.application || 'IMCS', projectId: context.projectId || null, capabilities: ROLE_CAPABILITIES[context.role] || ROLE_CAPABILITIES.STAFF };
  style(); const root = document.createElement('div'); root.id = COMPANION_ID; getHost().appendChild(root);
  state.messages = [{ role: 'assistant', text: `Halo. Saya AI Companion untuk ${state.context.application}. Saya siap membantu dalam batas akses dan kebijakan Anda.` }];
  render();
  try { await ensureCompanion(); await loadMemory(); render(); } catch (error) { state.messages.push({ role: 'assistant', text: `AI Companion aktif dalam mode terbatas. Inisialisasi personalisasi belum selesai: ${error.message}` }); render(); }
}

export function getAICompanionContext() { return { ...state.context, companion: state.companion, messages: [...state.messages], memory: [...state.memory] }; }
