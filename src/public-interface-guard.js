// Public interface guard: the corporate website must not expose internal IMCS access.
// Internal IMCS remains reachable only through a separately controlled route/app surface.
const INTERNAL_LABELS = /\bIMCS\s*(LOGIN|LOG\s*IN)\b|SECURE\s*MANAGEMENT\s*ACCESS/i;

function enforcePublicBoundary() {
  if ((location.hash || '').toLowerCase() === '#imcs') return;
  document.querySelectorAll('a[href="#imcs"], .pc-login, .navcta').forEach((el) => el.remove());
  document.querySelectorAll('button,a').forEach((el) => {
    const text = (el.textContent || '').trim();
    if (INTERNAL_LABELS.test(text)) el.remove();
  });
}

window.addEventListener('hashchange', enforcePublicBoundary);
window.addEventListener('DOMContentLoaded', enforcePublicBoundary);
new MutationObserver(enforcePublicBoundary).observe(document.documentElement, { childList: true, subtree: true });
enforcePublicBoundary();
