// ADTrans AI Companion foundation.
// The companion is a first-class UI capability for every departmental application.
// It intentionally uses a provider-neutral gateway contract: no model or vendor is hard-coded here.

const COMPANION_ID = 'adtrans-ai-companion';

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
};

function getHost() {
  return document.body || document.documentElement;
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>\"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;' }[char]));
}

function style() {
  if (document.getElementById(`${COMPANION_ID}-style`)) return;
  const css = document.createElement('style');
  css.id = `${COMPANION_ID}-style`;
  css.textContent = `
    #${COMPANION_ID}{position:fixed;right:20px;bottom:20px;z-index:99990;font-family:Inter,system-ui,sans-serif}
    #${COMPANION_ID} .aic-launch{width:58px;height:58px;border:0;border-radius:50%;cursor:pointer;background:#111827;color:#fff;box-shadow:0 12px 35px rgba(0,0,0,.25);font-weight:700}
    #${COMPANION_ID} .aic-panel{width:min(390px,calc(100vw - 32px));height:min(600px,calc(100vh - 110px));display:flex;flex-direction:column;background:#fff;border:1px solid #e5e7eb;border-radius:18px;box-shadow:0 24px 70px rgba(0,0,0,.22);overflow:hidden}
    #${COMPANION_ID} .aic-head{padding:16px;background:#111827;color:#fff;display:flex;justify-content:space-between;align-items:center}
    #${COMPANION_ID} .aic-title{font-weight:800}.aic-sub{font-size:11px;opacity:.7;margin-top:2px}
    #${COMPANION_ID} .aic-close{border:0;background:transparent;color:#fff;font-size:20px;cursor:pointer}
    #${COMPANION_ID} .aic-body{flex:1;padding:14px;overflow:auto;background:#f8fafc}
    #${COMPANION_ID} .aic-msg{padding:10px 12px;border-radius:13px;margin:8px 0;max-width:88%;font-size:13px;line-height:1.45;white-space:pre-wrap}
    #${COMPANION_ID} .aic-ai{background:#fff;border:1px solid #e5e7eb}.aic-user{background:#111827;color:#fff;margin-left:auto}
    #${COMPANION_ID} .aic-foot{padding:10px;border-top:1px solid #e5e7eb;display:flex;gap:8px;background:#fff}
    #${COMPANION_ID} .aic-input{flex:1;resize:none;border:1px solid #d1d5db;border-radius:12px;padding:10px;font:inherit;font-size:13px}.aic-send{border:0;border-radius:12px;background:#111827;color:#fff;padding:0 14px;cursor:pointer}
    #${COMPANION_ID} .aic-welcome{font-size:12px;color:#475569;margin-bottom:10px}
  `;
  document.head.appendChild(css);
}

function render() {
  const root = document.getElementById(COMPANION_ID);
  if (!root) return;
  root.innerHTML = state.open ? `
    <section class="aic-panel" aria-label="ADTrans AI Companion">
      <header class="aic-head"><div><div class="aic-title">ADTrans AI Companion</div><div class="aic-sub">Personal assistant • policy controlled</div></div><button class="aic-close" aria-label="Close">×</button></header>
      <div class="aic-body">
        <div class="aic-welcome">Saya bekerja mengikuti konteks aplikasi, identitas pengguna, dan hak akses ADTrans. Saya dapat membantu menjelaskan, menganalisis, dan menyiapkan pekerjaan tanpa melewati kewenangan Anda.</div>
        ${state.messages.map((m) => `<div class="aic-msg ${m.role === 'user' ? 'aic-user' : 'aic-ai'}">${escapeHtml(m.text)}</div>`).join('')}
      </div>
      <form class="aic-foot"><textarea class="aic-input" rows="2" placeholder="Tanyakan sesuatu kepada asisten Anda…"></textarea><button class="aic-send" type="submit">Kirim</button></form>
    </section>` : '<button class="aic-launch" aria-label="Open ADTrans AI Companion" title="ADTrans AI Companion">AI</button>';

  root.querySelector('.aic-launch')?.addEventListener('click', () => { state.open = true; render(); });
  root.querySelector('.aic-close')?.addEventListener('click', () => { state.open = false; render(); });
  root.querySelector('form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const input = root.querySelector('.aic-input');
    const text = input?.value?.trim();
    if (!text) return;
    state.messages.push({ role: 'user', text });
    state.messages.push({ role: 'assistant', text: 'Permintaan diterima. AI Gateway akan memprosesnya sesuai konteks, permission, dan policy Anda.' });
    input.value = '';
    render();
  });
}

export function mountAICompanion(context = {}) {
  if (document.getElementById(COMPANION_ID)) return;
  state.context = {
    organizationId: context.organizationId || null,
    userId: context.userId || null,
    role: context.role || 'STAFF',
    department: context.department || null,
    application: context.application || 'IMCS',
    projectId: context.projectId || null,
    capabilities: ROLE_CAPABILITIES[context.role] || ROLE_CAPABILITIES.STAFF,
  };
  style();
  const root = document.createElement('div');
  root.id = COMPANION_ID;
  getHost().appendChild(root);
  state.messages = [{ role: 'assistant', text: `Halo. Saya ADTrans AI Companion untuk ${state.context.application}. Saya siap membantu dalam batas akses dan kebijakan Anda.` }];
  render();
}

export function getAICompanionContext() {
  return { ...state.context, messages: [...state.messages], memory: [...state.memory] };
}
