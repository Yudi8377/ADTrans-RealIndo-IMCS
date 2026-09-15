import { createClient } from 'npm:@supabase/supabase-js@2';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

const TYPE_TO_AGENT: Record<string, string> = {
  assistant: 'EXECUTIVE_INTELLIGENCE', translation: 'EXECUTIVE_INTELLIGENCE', meeting: 'EXECUTIVE_INTELLIGENCE',
  project: 'PROJECT_MANAGER', document: 'PLANNING_ENGINEERING', field_report: 'CONSTRUCTION_INTELLIGENCE',
  vision: 'CONSTRUCTION_INTELLIGENCE', command: 'EXECUTIVE_INTELLIGENCE'
};

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { ...cors, 'Content-Type': 'application/json' }
});

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);
  const authorization = req.headers.get('Authorization');
  if (!authorization?.startsWith('Bearer ')) return json({ error: 'missing_user_token' }, 401);

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_PUBLISHABLE_KEY') ?? Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: authorization } } }
  );
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return json({ error: 'unauthorized' }, 401);

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return json({ error: 'invalid_json' }, 400); }

  const requestType = String(body.request_type ?? 'assistant');
  const inputText = String(body.input_text ?? '').trim();
  const metadata = body.input_metadata && typeof body.input_metadata === 'object' ? body.input_metadata : {};
  const projectId = typeof body.project_id === 'string' ? body.project_id : null;
  const deviceId = typeof body.device_id === 'string' ? body.device_id : null;
  const conversationId = typeof body.conversation_id === 'string' ? body.conversation_id : null;
  const companionId = typeof (metadata as Record<string, unknown>).companion_id === 'string'
    ? String((metadata as Record<string, unknown>).companion_id) : null;
  const requestedTool = typeof body.requested_tool === 'string' ? body.requested_tool : null;

  if (!TYPE_TO_AGENT[requestType] || !inputText || inputText.length > 12000) return json({ error: 'invalid_request' }, 400);

  const { data: profile, error: profileError } = await supabase
    .from('profiles').select('id,organization_id,role,active').eq('id', user.id).maybeSingle();
  if (profileError || !profile?.active) return json({ error: 'profile_not_active' }, 403);

  if (projectId) {
    const { data: project, error } = await supabase.from('property_projects')
      .select('id,organization_id').eq('id', projectId).maybeSingle();
    if (error) return json({ error: 'project_scope_check_failed' }, 403);
    if (!project || project.organization_id !== profile.organization_id) return json({ error: 'project_scope_denied' }, 403);
  }

  if (companionId) {
    const { data: companion, error } = await supabase.from('ai_companions')
      .select('id,user_id,organization_id,status').eq('id', companionId).maybeSingle();
    if (error || !companion || companion.user_id !== profile.id || companion.organization_id !== profile.organization_id || companion.status !== 'ACTIVE') {
      return json({ error: 'companion_scope_denied' }, 403);
    }
  }

  if (conversationId) {
    const { data: conversation, error } = await supabase.from('ai_companion_conversations')
      .select('id,user_id,organization_id,companion_id,application,project_id,status')
      .eq('id', conversationId).maybeSingle();
    if (error || !conversation || conversation.user_id !== profile.id || conversation.organization_id !== profile.organization_id || conversation.status !== 'ACTIVE') {
      return json({ error: 'conversation_scope_denied' }, 403);
    }
    if (companionId && conversation.companion_id !== companionId) return json({ error: 'conversation_companion_mismatch' }, 403);
    if (projectId && conversation.project_id && conversation.project_id !== projectId) return json({ error: 'conversation_project_mismatch' }, 403);
  }

  const agentCode = TYPE_TO_AGENT[requestType];
  const { data: agent, error: agentError } = await supabase.from('ai_agents')
    .select('id,code,name,department_code,data_scope,active')
    .eq('organization_id', profile.organization_id).eq('code', agentCode).eq('active', true).maybeSingle();
  if (agentError || !agent) return json({ error: 'agent_not_authorized' }, 403);

  const { data: version, error: versionError } = await supabase.from('ai_agent_versions')
    .select('id,version_no,model_name,model_version,tool_policy,output_schema')
    .eq('agent_id', agent.id).eq('active', true).order('version_no', { ascending: false }).limit(1).maybeSingle();
  if (versionError || !version) return json({ error: 'agent_version_unavailable' }, 503);

  let selectedTool: { tool_name: string; mode: string; risk_level: string; capability: string } | null = null;
  if (requestedTool) {
    const { data: tool, error } = await supabase.from('ai_tool_registry')
      .select('tool_name,mode,risk_level,capability,active')
      .eq('organization_id', profile.organization_id).eq('tool_name', requestedTool).eq('active', true).maybeSingle();
    if (error || !tool) return json({ error: 'tool_not_authorized' }, 403);
    selectedTool = tool;
    const policy = String((version.tool_policy as Record<string, unknown> | null)?.[tool.capability] ?? 'DENY').toUpperCase();
    if (policy !== 'ALLOW') return json({ error: 'tool_policy_denied', tool: requestedTool }, 403);
    if (['HIGH', 'CRITICAL'].includes(String(tool.risk_level).toUpperCase()) && !Boolean(body.confirmed)) {
      return json({ error: 'human_confirmation_required', tool }, 409);
    }
  }

  const highImpact = requestType === 'command' || Boolean(requestedTool && body.confirmed);
  const { data: requestRecord, error: requestError } = await supabase.from('aig_requests').insert({
    organization_id: profile.organization_id, user_id: profile.id, project_id: projectId, device_id: deviceId,
    conversation_id: conversationId, request_type: requestType, input_text: inputText,
    input_metadata: { ...metadata, requested_tool: requestedTool, companion_id: companionId },
    action_status: highImpact ? 'pending_confirmation' : 'informational'
  }).select('id,request_type,action_status,conversation_id,created_at').single();
  if (requestError) return json({ error: 'request_record_failed' }, 400);

  const { data: run, error: runError } = await supabase.from('ai_runs').insert({
    organization_id: profile.organization_id, agent_id: agent.id, agent_version_id: version.id,
    request_id: requestRecord.id, user_id: profile.id, project_id: projectId,
    status: highImpact ? 'blocked' : 'queued', assumptions: [], evidence_refs: []
  }).select('id,status,agent_id,agent_version_id,request_id,created_at').single();
  if (runError) return json({ error: 'ai_run_record_failed' }, 400);

  let audit = null;
  if (selectedTool) {
    const { data } = await supabase.from('ai_tool_audit').insert({
      organization_id: profile.organization_id, user_id: profile.id, companion_id: companionId,
      tool_name: selectedTool.tool_name, action: 'REQUEST',
      decision: highImpact ? 'CONFIRMATION_REQUIRED' : 'ALLOWED',
      risk_level: selectedTool.risk_level, request_id: requestRecord.id,
      metadata: { request_type: requestType, conversation_id: conversationId }
    }).select('id,decision,risk_level,created_at').single();
    audit = data;
  }

  return json({
    ok: true, gateway: 'aig-gateway', request: requestRecord, run, audit,
    agent: { code: agent.code, name: agent.name, department_code: agent.department_code, data_scope: agent.data_scope },
    policy: { read_only_default: true, human_confirmation_required: highImpact, ai_may_advise: true,
      ai_may_not_execute_irreversible_actions: true, cross_department_access: 'deny_by_default',
      project_scope_checked: Boolean(projectId), companion_scope_checked: Boolean(companionId), conversation_scope_checked: Boolean(conversationId) },
    provider_stage: 'not_configured', next_stage: 'server_side_model_provider'
  });
});
