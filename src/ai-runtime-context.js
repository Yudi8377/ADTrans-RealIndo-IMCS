import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;
const sb = url && key ? createClient(url, key) : null;

export async function resolveAIRuntimeContext(application = 'IMCS') {
  if (!sb) return { application };
  const { data: auth } = await sb.auth.getUser();
  const user = auth?.user;
  if (!user) return { application };
  const { data: profile } = await sb.from('profiles').select('id,organization_id,full_name,role,job_title,active').eq('id', user.id).maybeSingle();
  if (!profile?.active) return { application, userId: user.id };
  return {
    application,
    userId: profile.id,
    organizationId: profile.organization_id,
    role: profile.role,
    fullName: profile.full_name,
    jobTitle: profile.job_title
  };
}
