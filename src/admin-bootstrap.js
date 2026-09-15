import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://nfvkdqpxexfymzuwdorx.supabase.co';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_4BG89zR_2gWWWeLqqDzALw_Atx9jAJ6';
const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

async function bootstrapInitialAdmin() {
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return;

  const { data: profile, error } = await sb.from('profiles')
    .select('role,active')
    .eq('id', user.id)
    .maybeSingle();
  if (error || !profile?.active || profile.role === 'SUPER_ADMIN') return;

  const response = await sb.functions.invoke('imcs-bootstrap-admin', { body: {} });
  if (response.error) throw response.error;
  if (!response.data?.ok) throw new Error(response.data?.message || response.data?.error || 'Bootstrap administrator gagal.');

  location.reload();
}

function addBootstrapControl() {
  const topActions = document.querySelector('.top-actions');
  if (!topActions || document.querySelector('#bootstrap-admin')) return;

  const profileChip = topActions.querySelector('.profile-chip');
  if (!profileChip) return;

  const button = document.createElement('button');
  button.id = 'bootstrap-admin';
  button.className = 'ghost';
  button.type = 'button';
  button.textContent = 'Activate Administrator';
  button.title = 'Aktivasi administrator awal hanya tersedia jika organisasi belum memiliki SUPER_ADMIN aktif.';
  button.onclick = async () => {
    const confirmed = window.confirm(
      'Aktifkan akun ini sebagai SUPER_ADMIN pertama organisasi?\n\n' +
      'Operasi ini hanya berhasil bila belum ada SUPER_ADMIN aktif. Setelah berhasil, bootstrap ditutup permanen.'
    );
    if (!confirmed) return;
    button.disabled = true;
    button.textContent = 'Activating…';
    try {
      await bootstrapInitialAdmin();
    } catch (error) {
      console.error('[IMCS] initial admin bootstrap failed', error);
      button.disabled = false;
      button.textContent = 'Activate Administrator';
      window.alert(error?.message || 'Aktivasi administrator gagal.');
    }
  };

  topActions.insertBefore(button, topActions.firstChild);
}

export function mountAdminBootstrap() {
  const observer = new MutationObserver(addBootstrapControl);
  const target = document.querySelector('#app');
  if (target) observer.observe(target, { childList: true, subtree: true });
  addBootstrapControl();
  window.addEventListener('hashchange', addBootstrapControl);
}
