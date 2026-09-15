import { createClient } from '@supabase/supabase-js';
import { createDesignIntake, getADEIDesignTypes } from './adei-intake.js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;
const sb = url && key ? createClient(url, key) : null;

export async function createADEIDraft(input = {}) {
  if (!sb) throw new Error('Supabase belum dikonfigurasi.');
  const { data: auth } = await sb.auth.getUser();
  const draft = createDesignIntake(input);
  if (!auth?.user) throw new Error('Login diperlukan untuk membuat design intake.');
  const { data: profile } = await sb.from('profiles').select('organization_id').eq('id', auth.user.id).maybeSingle();
  if (!profile?.organization_id) throw new Error('Organization context belum tersedia.');
  const { data, error } = await sb.from('ai_design_intakes').insert({
    organization_id: profile.organization_id,
    project_id: draft.projectId,
    created_by: auth.user.id,
    title: draft.title,
    design_types: draft.designTypes,
    source_type: draft.sourceType,
    source_references: draft.sourceReferences,
    objectives: draft.objectives,
    constraints: draft.constraints,
    budget_target: draft.budgetTarget,
    target_date: draft.targetDate,
    status: draft.status,
    governance: draft.governance,
  }).select().single();
  if (error) throw error;
  return data;
}

export { getADEIDesignTypes };
