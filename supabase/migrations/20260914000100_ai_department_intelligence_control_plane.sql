-- ADTrans RealIndo AI Department Intelligence Control Plane
-- Central governance for domain-specific AI agents, scopes, prompts, runs and recommendations.

create table if not exists public.ai_agents (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  code text not null,
  name text not null,
  department_code text not null,
  description text,
  system_role text not null,
  data_scope jsonb not null default '{}'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, code)
);

create table if not exists public.ai_agent_capabilities (
  agent_id uuid not null references public.ai_agents(id) on delete cascade,
  capability_id uuid not null references public.aig_capabilities(id) on delete cascade,
  enabled boolean not null default true,
  primary key (agent_id, capability_id)
);

create table if not exists public.ai_agent_versions (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references public.ai_agents(id) on delete cascade,
  version_no integer not null,
  model_name text,
  model_version text,
  prompt_template text not null,
  tool_policy jsonb not null default '{}'::jsonb,
  output_schema jsonb not null default '{}'::jsonb,
  active boolean not null default false,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  unique(agent_id, version_no)
);

create table if not exists public.ai_runs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  agent_id uuid not null references public.ai_agents(id),
  agent_version_id uuid references public.ai_agent_versions(id),
  request_id uuid references public.aig_requests(id),
  user_id uuid not null references public.profiles(id),
  project_id uuid references public.property_projects(id),
  status text not null default 'queued' check (status in ('queued','running','completed','failed','blocked','cancelled')),
  input_hash text,
  evidence_refs jsonb not null default '[]'::jsonb,
  assumptions jsonb not null default '[]'::jsonb,
  output jsonb not null default '{}'::jsonb,
  confidence numeric check (confidence is null or (confidence >= 0 and confidence <= 1)),
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.ai_recommendations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  run_id uuid not null references public.ai_runs(id) on delete cascade,
  agent_id uuid not null references public.ai_agents(id),
  project_id uuid references public.property_projects(id),
  title text not null,
  recommendation text not null,
  evidence_refs jsonb not null default '[]'::jsonb,
  assumptions jsonb not null default '[]'::jsonb,
  risk_level text not null default 'medium' check (risk_level in ('low','medium','high','critical')),
  action_type text not null default 'informational' check (action_type in ('informational','draft','workflow_request','material_action')),
  status text not null default 'pending_review' check (status in ('pending_review','accepted','rejected','superseded','executed')),
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.ai_knowledge_sources (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  department_code text not null,
  source_type text not null check (source_type in ('internal_record','document','external_source','policy','procedure')),
  source_ref text not null,
  classification text not null default 'internal' check (classification in ('public','internal','confidential','restricted')),
  metadata jsonb not null default '{}'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique(organization_id, department_code, source_type, source_ref)
);

create index if not exists idx_ai_agents_org_dept on public.ai_agents(organization_id, department_code);
create index if not exists idx_ai_runs_org_user on public.ai_runs(organization_id, user_id, created_at desc);
create index if not exists idx_ai_runs_project on public.ai_runs(project_id, created_at desc);
create index if not exists idx_ai_recommendations_project on public.ai_recommendations(project_id, created_at desc);
create index if not exists idx_ai_knowledge_org_dept on public.ai_knowledge_sources(organization_id, department_code);

create or replace function public.ai_user_can_access_agent(p_agent_id uuid)
returns boolean
language sql stable security invoker
set search_path = public
as $$
  select exists (
    select 1
    from public.ai_agents a
    join public.profiles p on p.organization_id = a.organization_id
    where a.id = p_agent_id
      and p.id = (select auth.uid())
      and p.active = true
      and a.active = true
      and (
        p.role in ('SUPER_ADMIN','DIRECTOR','COMMISSIONER','EXECUTIVE','AUDITOR')
        or exists (
          select 1 from public.user_departments ud
          join public.departments d on d.id = ud.department_id
          where ud.user_id = p.id
            and lower(d.code) = lower(a.department_code)
            and d.active = true
        )
      )
  );
$$;

alter table public.ai_agents enable row level security;
alter table public.ai_agent_capabilities enable row level security;
alter table public.ai_agent_versions enable row level security;
alter table public.ai_runs enable row level security;
alter table public.ai_recommendations enable row level security;
alter table public.ai_knowledge_sources enable row level security;

create policy ai_agents_select on public.ai_agents for select to authenticated
using (organization_id = public.current_organization_id() and public.ai_user_can_access_agent(id));

create policy ai_agent_capabilities_select on public.ai_agent_capabilities for select to authenticated
using (exists (select 1 from public.ai_agents a where a.id = agent_id and public.ai_user_can_access_agent(a.id)));

create policy ai_agent_versions_select on public.ai_agent_versions for select to authenticated
using (exists (select 1 from public.ai_agents a where a.id = agent_id and public.ai_user_can_access_agent(a.id)));

create policy ai_runs_select on public.ai_runs for select to authenticated
using (organization_id = public.current_organization_id() and (user_id = (select auth.uid()) or exists (select 1 from public.ai_agents a where a.id = agent_id and public.ai_user_can_access_agent(a.id))));

create policy ai_runs_insert on public.ai_runs for insert to authenticated
with check (organization_id = public.current_organization_id() and user_id = (select auth.uid()) and public.ai_user_can_access_agent(agent_id));

create policy ai_recommendations_select on public.ai_recommendations for select to authenticated
using (organization_id = public.current_organization_id() and exists (select 1 from public.ai_agents a where a.id = agent_id and public.ai_user_can_access_agent(a.id)));

create policy ai_recommendations_review on public.ai_recommendations for update to authenticated
using (organization_id = public.current_organization_id() and (select auth.uid()) is not null)
with check (organization_id = public.current_organization_id());

create policy ai_knowledge_sources_select on public.ai_knowledge_sources for select to authenticated
using (organization_id = public.current_organization_id());

-- Seed the department-agent catalog for every current organization.
insert into public.ai_agents (organization_id, code, name, department_code, description, system_role, data_scope)
select o.id, x.code, x.name, x.department_code, x.description, x.system_role, x.data_scope
from public.organizations o
cross join (values
  ('EXECUTIVE_INTELLIGENCE','Executive Intelligence','EXECUTIVE','Cross-domain executive intelligence and decision support','Synthesize authorized cross-domain evidence; never approve or execute material actions.', '{"scope":"authorized_aggregate","material_actions":"blocked"}'::jsonb),
  ('PROJECT_MANAGER','AI Project Manager','PMO','Project planning, schedule, risk and delivery intelligence','Analyze milestones, dependencies, risks and delivery performance; recommend actions for human review.', '{"domains":["projects","milestones","risks","changes"]}'::jsonb),
  ('PLANNING_ENGINEERING','AI Planning & Engineering','ENGINEERING','Design, planning, BOQ and technical document intelligence','Assist with planning, engineering documents and BOQ consistency; do not certify technical approvals.', '{"domains":["documents","planning","engineering","boq"]}'::jsonb),
  ('COST_CONTROLLER','AI Cost Controller','COST_CONTROL','Budget, commitment, actual, forecast and variance intelligence','Detect cost variance and forecast exposure; never alter or approve budgets.', '{"domains":["budgets","costs","commitments","forecast"]}'::jsonb),
  ('PROCUREMENT_INTELLIGENCE','AI Procurement','PROCUREMENT','Procurement, vendor, price and lead-time intelligence','Compare authorized vendor and purchasing data; recommendations only for sourcing and approvals.', '{"domains":["procurement","vendors","purchases","lead_times"]}'::jsonb),
  ('WAREHOUSE_INTELLIGENCE','AI Warehouse & Material','WAREHOUSE','Inventory, consumption and material demand intelligence','Forecast demand and flag stock anomalies; no autonomous stock adjustment.', '{"domains":["inventory","materials","receipts","consumption"]}'::jsonb),
  ('CONSTRUCTION_INTELLIGENCE','AI Construction','CONSTRUCTION','Site progress, daily reports and productivity intelligence','Analyze field evidence and progress against plans; certified progress remains human-controlled.', '{"domains":["daily_reports","progress","work_packages","field_evidence"]}'::jsonb),
  ('QUALITY_INTELLIGENCE','AI Quality','QUALITY','Inspection, defect and corrective-action intelligence','Group findings and recurring defects; never close findings without authorized human action.', '{"domains":["inspections","defects","corrective_actions"]}'::jsonb),
  ('HSE_INTELLIGENCE','AI HSE','HSE','Safety, incident and risk intelligence','Analyze safety observations and incidents; recommendations require responsible-person review.', '{"domains":["hse","incidents","risks","inspections"]}'::jsonb),
  ('SALES_CRM_INTELLIGENCE','AI Sales & CRM','SALES','Lead, customer, unit and sales pipeline intelligence','Score and summarize authorized sales data; no autonomous customer commitment.', '{"domains":["leads","customers","units","pipeline"]}'::jsonb),
  ('FINANCE_INTELLIGENCE','AI Finance','FINANCE','Financial control and management intelligence','Analyze authorized finance records and anomalies; no autonomous payment or accounting approval.', '{"domains":["finance","cashflow","transactions","forecast"]}'::jsonb),
  ('LEGAL_INTELLIGENCE','AI Legal & Contract','LEGAL','Contract, obligation and compliance intelligence','Summarize authorized legal records and obligations; legal decisions remain human-controlled.', '{"domains":["contracts","obligations","compliance","documents"]}'::jsonb),
  ('HR_INTELLIGENCE','AI People Intelligence','HR','Workforce and organizational intelligence','Analyze authorized workforce information; respect restricted HR data and policy boundaries.', '{"domains":["people","organization","workforce"]}'::jsonb),
  ('AUDIT_INTELLIGENCE','AI Audit','AUDIT','Audit, control and anomaly intelligence','Surface control exceptions and evidence trails; auditors remain decision owners.', '{"domains":["audit","controls","evidence","anomalies"]}'::jsonb)
) as x(code,name,department_code,description,system_role,data_scope)
on conflict (organization_id, code) do update set name=excluded.name, department_code=excluded.department_code, description=excluded.description, system_role=excluded.system_role, data_scope=excluded.data_scope, active=true, updated_at=now();

-- Version 1 establishes the safe operating contract. Provider/model is configured later server-side.
insert into public.ai_agent_versions (agent_id, version_no, prompt_template, tool_policy, output_schema, active)
select a.id, 1,
  'You are an ADTrans RealIndo departmental intelligence agent. Use only authorized data and tools. Distinguish facts, verified records, assumptions, analysis and recommendations. Never claim an action was executed unless the system confirms it. Never bypass RBAC/RLS, segregation of duties or approval workflows. For material actions, return a recommendation or workflow request requiring human approval.',
  '{"read_only_default":true,"material_actions":"human_approval","cross_department_access":"deny_by_default","secrets":"never_expose"}'::jsonb,
  '{"type":"object","required":["answer","facts","assumptions","recommendations","confidence"],"additionalProperties":false}'::jsonb,
  true
from public.ai_agents a
where not exists (select 1 from public.ai_agent_versions v where v.agent_id=a.id and v.version_no=1);
