-- ============================================================
-- ADTRANS REALINDO IMCS
-- Migration 0002 - Management Control Plane
-- ============================================================

create extension if not exists pgcrypto;

-- ------------------------------------------------------------
-- ORGANIZATION / SECURITY HELPERS
-- ------------------------------------------------------------

create or replace function public.current_profile()
returns public.profiles
language sql
stable
security definer
set search_path = public
as $$
  select p
  from public.profiles p
  where p.id = auth.uid()
    and p.active = true
  limit 1;
$$;

create or replace function public.current_organization_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select organization_id
  from public.profiles
  where id = auth.uid()
    and active = true
  limit 1;
$$;

create or replace function public.current_user_has_role(
  p_roles public.imcs_role[]
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and active = true
      and role = any(p_roles)
  );
$$;

-- ------------------------------------------------------------
-- GENERIC UPDATED_AT
-- ------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ------------------------------------------------------------
-- PROJECT CONTROL
-- ------------------------------------------------------------

create table if not exists public.project_milestones (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.property_projects(id) on delete cascade,
  code text not null,
  name text not null,
  sequence_no integer not null default 1,
  planned_start date,
  planned_end date,
  actual_start date,
  actual_end date,
  progress_pct numeric(7,3) not null default 0,
  status text not null default 'PLANNED',
  owner_id uuid references public.profiles(id),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(project_id, code)
);

create table if not exists public.project_documents (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.property_projects(id) on delete cascade,
  document_type text not null,
  document_name text not null,
  document_number text,
  version_no integer not null default 1,
  file_path text,
  document_date date,
  verified_at timestamptz,
  verified_by uuid references public.profiles(id),
  status text not null default 'DRAFT',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_changes (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.property_projects(id) on delete cascade,
  change_no text not null,
  title text not null,
  reason text,
  impact_cost numeric(20,2) not null default 0,
  impact_days integer not null default 0,
  status public.approval_status not null default 'DRAFT',
  requested_by uuid references public.profiles(id),
  approved_by uuid references public.profiles(id),
  requested_at timestamptz not null default now(),
  decided_at timestamptz,
  decision_note text,
  unique(project_id, change_no)
);

-- ------------------------------------------------------------
-- RISK CONTROL
-- ------------------------------------------------------------

create table if not exists public.risk_actions (
  id uuid primary key default gen_random_uuid(),
  risk_id uuid not null references public.project_risks(id) on delete cascade,
  action text not null,
  owner_id uuid references public.profiles(id),
  due_date date,
  status text not null default 'OPEN',
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- CONTRACT CONTROL
-- ------------------------------------------------------------

create table if not exists public.contract_obligations (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references public.contracts(id) on delete cascade,
  obligation_type text not null,
  description text not null,
  responsible_id uuid references public.profiles(id),
  due_date date,
  status text not null default 'OPEN',
  evidence_path text,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- COMPLIANCE
-- ------------------------------------------------------------

create table if not exists public.compliance_register (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  compliance_code text not null,
  title text not null,
  requirement text,
  authority text,
  due_date date,
  status text not null default 'OPEN',
  owner_id uuid references public.profiles(id),
  evidence_path text,
  last_reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(organization_id, compliance_code)
);

-- ------------------------------------------------------------
-- BUDGET CONTROL
-- ------------------------------------------------------------

create table if not exists public.budget_lines (
  id uuid primary key default gen_random_uuid(),
  budget_id uuid not null references public.budgets(id) on delete cascade,
  project_id uuid references public.property_projects(id),
  account_code text not null,
  description text,
  budget_amount numeric(20,2) not null default 0,
  committed_amount numeric(20,2) not null default 0,
  actual_amount numeric(20,2) not null default 0,
  forecast_amount numeric(20,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- MANAGEMENT DECISION LOG
-- ------------------------------------------------------------

create table if not exists public.management_decisions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  decision_no text not null,
  title text not null,
  decision_date date not null default current_date,
  decision_type text,
  description text,
  decision text,
  owner_id uuid references public.profiles(id),
  due_date date,
  status text not null default 'OPEN',
  evidence_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(organization_id, decision_no)
);

-- ------------------------------------------------------------
-- INDEXES
-- ------------------------------------------------------------

create index if not exists idx_land_assets_org
  on public.land_assets(organization_id);

create index if not exists idx_projects_org
  on public.property_projects(organization_id);

create index if not exists idx_projects_status
  on public.property_projects(status);

create index if not exists idx_project_costs_project
  on public.project_costs(project_id);

create index if not exists idx_project_risks_project
  on public.project_risks(project_id);

create index if not exists idx_project_risks_level
  on public.project_risks(level);

create index if not exists idx_transactions_org_date
  on public.financial_transactions(organization_id, transaction_date);

create index if not exists idx_contracts_end_date
  on public.contracts(end_date);

create index if not exists idx_alerts_status
  on public.management_alerts(status);

create index if not exists idx_audit_entity
  on public.audit_logs(entity_type, entity_id);

create index if not exists idx_milestones_project
  on public.project_milestones(project_id);

create index if not exists idx_compliance_due
  on public.compliance_register(due_date);

-- ------------------------------------------------------------
-- UPDATED_AT TRIGGERS
-- ------------------------------------------------------------

drop trigger if exists trg_project_milestones_updated_at
on public.project_milestones;

create trigger trg_project_milestones_updated_at
before update on public.project_milestones
for each row execute function public.set_updated_at();

drop trigger if exists trg_project_documents_updated_at
on public.project_documents;

create trigger trg_project_documents_updated_at
before update on public.project_documents
for each row execute function public.set_updated_at();

drop trigger if exists trg_compliance_register_updated_at
on public.compliance_register;

create trigger trg_compliance_register_updated_at
before update on public.compliance_register
for each row execute function public.set_updated_at();

drop trigger if exists trg_budget_lines_updated_at
on public.budget_lines;

create trigger trg_budget_lines_updated_at
before update on public.budget_lines
for each row execute function public.set_updated_at();

drop trigger if exists trg_management_decisions_updated_at
on public.management_decisions;

create trigger trg_management_decisions_updated_at
before update on public.management_decisions
for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- ROW LEVEL SECURITY
-- ------------------------------------------------------------

alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.land_assets enable row level security;
alter table public.land_documents enable row level security;
alter table public.property_projects enable row level security;
alter table public.project_costs enable row level security;
alter table public.project_risks enable row level security;
alter table public.properties enable row level security;
alter table public.investment_cases enable row level security;
alter table public.budgets enable row level security;
alter table public.financial_transactions enable row level security;
alter table public.contracts enable row level security;
alter table public.approvals enable row level security;
alter table public.audit_logs enable row level security;
alter table public.kpi_actuals enable row level security;
alter table public.management_alerts enable row level security;

alter table public.project_milestones enable row level security;
alter table public.project_documents enable row level security;
alter table public.project_changes enable row level security;
alter table public.risk_actions enable row level security;
alter table public.contract_obligations enable row level security;
alter table public.compliance_register enable row level security;
alter table public.budget_lines enable row level security;
alter table public.management_decisions enable row level security;

-- ------------------------------------------------------------
-- ORGANIZATION ISOLATION POLICIES
-- ------------------------------------------------------------

drop policy if exists organization_select on public.organizations;
create policy organization_select
on public.organizations
for select
to authenticated
using (
  id = public.current_organization_id()
  or parent_id = public.current_organization_id()
);

drop policy if exists profiles_select on public.profiles;
create policy profiles_select
on public.profiles
for select
to authenticated
using (
  organization_id = public.current_organization_id()
);

-- helper macro-style policies via repeated organization predicates

drop policy if exists land_assets_all on public.land_assets;
create policy land_assets_all
on public.land_assets
for all
to authenticated
using (organization_id = public.current_organization_id())
with check (organization_id = public.current_organization_id());

drop policy if exists projects_all on public.property_projects;
create policy projects_all
on public.property_projects
for all
to authenticated
using (organization_id = public.current_organization_id())
with check (organization_id = public.current_organization_id());

drop policy if exists properties_all on public.properties;
create policy properties_all
on public.properties
for all
to authenticated
using (organization_id = public.current_organization_id())
with check (organization_id = public.current_organization_id());

drop policy if exists investment_cases_all on public.investment_cases;
create policy investment_cases_all
on public.investment_cases
for all
to authenticated
using (organization_id = public.current_organization_id())
with check (organization_id = public.current_organization_id());

drop policy if exists budgets_all on public.budgets;
create policy budgets_all
on public.budgets
for all
to authenticated
using (organization_id = public.current_organization_id())
with check (organization_id = public.current_organization_id());

drop policy if exists transactions_all on public.financial_transactions;
create policy transactions_all
on public.financial_transactions
for all
to authenticated
using (organization_id = public.current_organization_id())
with check (organization_id = public.current_organization_id());

drop policy if exists contracts_all on public.contracts;
create policy contracts_all
on public.contracts
for all
to authenticated
using (organization_id = public.current_organization_id())
with check (organization_id = public.current_organization_id());

drop policy if exists approvals_all on public.approvals;
create policy approvals_all
on public.approvals
for all
to authenticated
using (organization_id = public.current_organization_id())
with check (organization_id = public.current_organization_id());

drop policy if exists audit_logs_select on public.audit_logs;
create policy audit_logs_select
on public.audit_logs
for select
to authenticated
using (organization_id = public.current_organization_id());

drop policy if exists kpi_actuals_all on public.kpi_actuals;
create policy kpi_actuals_all
on public.kpi_actuals
for all
to authenticated
using (organization_id = public.current_organization_id())
with check (organization_id = public.current_organization_id());

drop policy if exists management_alerts_all on public.management_alerts;
create policy management_alerts_all
on public.management_alerts
for all
to authenticated
using (organization_id = public.current_organization_id())
with check (organization_id = public.current_organization_id());

drop policy if exists compliance_all on public.compliance_register;
create policy compliance_all
on public.compliance_register
for all
to authenticated
using (organization_id = public.current_organization_id())
with check (organization_id = public.current_organization_id());

drop policy if exists decisions_all on public.management_decisions;
create policy decisions_all
on public.management_decisions
for all
to authenticated
using (organization_id = public.current_organization_id())
with check (organization_id = public.current_organization_id());

-- ------------------------------------------------------------
-- CHILD RECORD POLICIES
-- ------------------------------------------------------------

drop policy if exists project_costs_all on public.project_costs;
create policy project_costs_all
on public.project_costs
for all
to authenticated
using (
  exists (
    select 1 from public.property_projects p
    where p.id = project_id
      and p.organization_id = public.current_organization_id()
  )
)
with check (
  exists (
    select 1 from public.property_projects p
    where p.id = project_id
      and p.organization_id = public.current_organization_id()
  )
);

drop policy if exists project_risks_all on public.project_risks;
create policy project_risks_all
on public.project_risks
for all
to authenticated
using (
  project_id is null
  or exists (
    select 1 from public.property_projects p
    where p.id = project_id
      and p.organization_id = public.current_organization_id()
  )
)
with check (
  project_id is null
  or exists (
    select 1 from public.property_projects p
    where p.id = project_id
      and p.organization_id = public.current_organization_id()
  )
);

drop policy if exists milestones_all on public.project_milestones;
create policy milestones_all
on public.project_milestones
for all
to authenticated
using (
  exists (
    select 1 from public.property_projects p
    where p.id = project_id
      and p.organization_id = public.current_organization_id()
  )
)
with check (
  exists (
    select 1 from public.property_projects p
    where p.id = project_id
      and p.organization_id = public.current_organization_id()
  )
);

drop policy if exists documents_all on public.project_documents;
create policy documents_all
on public.project_documents
for all
to authenticated
using (
  exists (
    select 1 from public.property_projects p
    where p.id = project_id
      and p.organization_id = public.current_organization_id()
  )
)
with check (
  exists (
    select 1 from public.property_projects p
    where p.id = project_id
      and p.organization_id = public.current_organization_id()
  )
);

drop policy if exists changes_all on public.project_changes;
create policy changes_all
on public.project_changes
for all
to authenticated
using (
  exists (
    select 1 from public.property_projects p
    where p.id = project_id
      and p.organization_id = public.current_organization_id()
  )
)
with check (
  exists (
    select 1 from public.property_projects p
    where p.id = project_id
      and p.organization_id = public.current_organization_id()
  )
);

drop policy if exists risk_actions_all on public.risk_actions;
create policy risk_actions_all
on public.risk_actions
for all
to authenticated
using (
  exists (
    select 1
    from public.project_risks r
    join public.property_projects p on p.id = r.project_id
    where r.id = risk_id
      and p.organization_id = public.current_organization_id()
  )
)
with check (
  exists (
    select 1
    from public.project_risks r
    join public.property_projects p on p.id = r.project_id
    where r.id = risk_id
      and p.organization_id = public.current_organization_id()
  )
);

drop policy if exists contract_obligations_all on public.contract_obligations;
create policy contract_obligations_all
on public.contract_obligations
for all
to authenticated
using (
  exists (
    select 1 from public.contracts c
    where c.id = contract_id
      and c.organization_id = public.current_organization_id()
  )
)
with check (
  exists (
    select 1 from public.contracts c
    where c.id = contract_id
      and c.organization_id = public.current_organization_id()
  )
);

-- ------------------------------------------------------------
-- LAND DOCUMENTS
-- ------------------------------------------------------------

drop policy if exists land_documents_all on public.land_documents;
create policy land_documents_all
on public.land_documents
for all
to authenticated
using (
  exists (
    select 1 from public.land_assets l
    where l.id = land_asset_id
      and l.organization_id = public.current_organization_id()
  )
)
with check (
  exists (
    select 1 from public.land_assets l
    where l.id = land_asset_id
      and l.organization_id = public.current_organization_id()
  )
);

-- ------------------------------------------------------------
-- AUDIT INSERT
-- ------------------------------------------------------------

drop policy if exists audit_logs_insert on public.audit_logs;
create policy audit_logs_insert
on public.audit_logs
for insert
to authenticated
with check (
  organization_id = public.current_organization_id()
);

-- ------------------------------------------------------------
-- LEGACY STAGING
-- intentionally not exposed to normal authenticated users
-- ------------------------------------------------------------

revoke all on schema legacy_staging from anon, authenticated;

-- ------------------------------------------------------------
-- SEED CONTROL KPIs
-- ------------------------------------------------------------

insert into public.kpi_catalog(code,name,unit,description)
values
('LAND_BANK_AREA','Controlled Land Bank','m2','Total controlled land area'),
('LAND_VALUE','Controlled Land Value','IDR','Current controlled land value'),
('PROJECT_GDV','Project GDV','IDR','Gross development value'),
('PROJECT_MARGIN','Project Margin','%','Target project margin'),
('COST_VARIANCE','Cost Variance','%','Budget versus actual variance'),
('SCHEDULE_VARIANCE','Schedule Variance','days','Project schedule variance'),
('CASH_POSITION','Cash Position','IDR','Current cash position'),
('RECEIVABLES','Receivables','IDR','Outstanding receivables'),
('RISK_EXPOSURE','Risk Exposure','IDR','Material risk exposure'),
('CONTRACT_EXPIRY_30D','Contracts Expiring 30D','count','Contracts approaching expiry'),
('OPEN_APPROVALS','Open Approvals','count','Pending management approvals'),
('COMPLIANCE_DUE_30D','Compliance Due 30D','count','Compliance obligations due within 30 days')
on conflict(code) do nothing;

-- ============================================================
-- END MIGRATION 0002
-- ============================================================
