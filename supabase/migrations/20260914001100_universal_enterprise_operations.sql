alter table public.contracts add column if not exists business_line_id uuid references public.business_lines(id);
alter table public.property_projects add column if not exists business_line_id uuid references public.business_lines(id);
alter table public.properties add column if not exists business_line_id uuid references public.business_lines(id);
alter table public.purchase_orders add column if not exists business_line_id uuid references public.business_lines(id);
alter table public.financial_transactions add column if not exists business_line_id uuid references public.business_lines(id);

create table if not exists public.service_agreements (
 id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
 agreement_no text not null, business_line_id uuid references public.business_lines(id), contract_id uuid references public.contracts(id), customer_id uuid references public.customers(id), property_id uuid references public.properties(id),
 service_name text not null, service_category text, start_date date, end_date date, billing_frequency text, service_value numeric(18,2), status text not null default 'DRAFT' check(status in ('DRAFT','ACTIVE','SUSPENDED','EXPIRED','CANCELLED')),
 sla jsonb not null default '{}'::jsonb, notes text, created_by uuid references auth.users(id), created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(organization_id, agreement_no)
);

create table if not exists public.work_orders (
 id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
 work_order_no text not null, business_line_id uuid references public.business_lines(id), project_id uuid references public.property_projects(id), property_id uuid references public.properties(id), service_agreement_id uuid references public.service_agreements(id), customer_id uuid references public.customers(id),
 title text not null, work_type text not null default 'MAINTENANCE', priority text not null default 'NORMAL' check(priority in ('LOW','NORMAL','HIGH','CRITICAL')), status text not null default 'OPEN' check(status in ('DRAFT','OPEN','ASSIGNED','IN_PROGRESS','ON_HOLD','COMPLETED','CANCELLED')),
 requested_at timestamptz not null default now(), scheduled_at timestamptz, completed_at timestamptz, assigned_employee_id uuid references public.employees(id), description text, location jsonb not null default '{}'::jsonb, evidence jsonb not null default '{}'::jsonb, estimated_cost numeric(18,2) not null default 0, actual_cost numeric(18,2) not null default 0, created_by uuid references auth.users(id), created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(organization_id, work_order_no)
);

create table if not exists public.maintenance_plans (
 id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
 business_line_id uuid references public.business_lines(id), property_id uuid references public.properties(id), asset_id uuid, plan_code text not null, plan_name text not null, maintenance_type text not null default 'PREVENTIVE' check(maintenance_type in ('PREVENTIVE','PREDICTIVE','CORRECTIVE','INSPECTION')),
 frequency text, next_due_date date, active boolean not null default true, checklist jsonb not null default '[]'::jsonb, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(organization_id, plan_code)
);

create index if not exists idx_contracts_business_line on public.contracts(organization_id,business_line_id);
create index if not exists idx_property_projects_business_line on public.property_projects(organization_id,business_line_id);
create index if not exists idx_properties_business_line on public.properties(organization_id,business_line_id);
create index if not exists idx_purchase_orders_business_line on public.purchase_orders(organization_id,business_line_id);
create index if not exists idx_financial_transactions_business_line on public.financial_transactions(organization_id,business_line_id);
create index if not exists idx_service_agreements_org_status on public.service_agreements(organization_id,status);
create index if not exists idx_work_orders_org_status on public.work_orders(organization_id,status,priority);
create index if not exists idx_work_orders_project on public.work_orders(organization_id,project_id);
create index if not exists idx_work_orders_property on public.work_orders(organization_id,property_id);
create index if not exists idx_maintenance_plans_due on public.maintenance_plans(organization_id,next_due_date) where active;

alter table public.service_agreements enable row level security;
alter table public.work_orders enable row level security;
alter table public.maintenance_plans enable row level security;

create policy service_agreements_select on public.service_agreements for select to authenticated using (organization_id=(select public.current_organization_id()));
create policy service_agreements_manage on public.service_agreements for all to authenticated using ((select public.housing_can_manage()) and organization_id=(select public.current_organization_id())) with check ((select public.housing_can_manage()) and organization_id=(select public.current_organization_id()));
create policy work_orders_select on public.work_orders for select to authenticated using (organization_id=(select public.current_organization_id()));
create policy work_orders_manage on public.work_orders for all to authenticated using ((select public.housing_can_manage()) and organization_id=(select public.current_organization_id())) with check ((select public.housing_can_manage()) and organization_id=(select public.current_organization_id()));
create policy maintenance_plans_select on public.maintenance_plans for select to authenticated using (organization_id=(select public.current_organization_id()));
create policy maintenance_plans_manage on public.maintenance_plans for all to authenticated using ((select public.housing_can_manage()) and organization_id=(select public.current_organization_id())) with check ((select public.housing_can_manage()) and organization_id=(select public.current_organization_id()));