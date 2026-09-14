-- ADTrans RealIndo Housing Development Platform
-- Wave 1: project / estate / cluster / block / unit foundation.
-- Reuses public.property_projects as the authoritative project master.

create table if not exists public.project_areas (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  project_id uuid not null references public.property_projects(id) on delete cascade,
  parent_id uuid references public.project_areas(id) on delete cascade,
  area_type text not null check (area_type in ('ESTATE','CLUSTER','BLOCK','ZONE','FACILITY','OTHER')),
  code text not null,
  name text not null,
  status text not null default 'PLANNED' check (status in ('PLANNED','ACTIVE','ON_HOLD','COMPLETED','CANCELLED')),
  sequence_no integer not null default 1,
  geometry jsonb,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, code)
);

create table if not exists public.project_units (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  project_id uuid not null references public.property_projects(id) on delete cascade,
  area_id uuid references public.project_areas(id) on delete set null,
  property_id uuid references public.properties(id) on delete set null,
  code text not null,
  unit_type text,
  status text not null default 'PLANNED' check (status in ('PLANNED','CONSTRUCTION','READY','AVAILABLE','BOOKED','SOLD','HANDED_OVER','WARRANTY','CANCELLED')),
  floor_area_m2 numeric(18,2),
  land_area_m2 numeric(18,2),
  list_price numeric(20,2),
  target_cost numeric(20,2),
  progress_pct numeric(7,3) not null default 0 check (progress_pct >= 0 and progress_pct <= 100),
  location jsonb,
  attributes jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, code)
);

create index if not exists idx_project_areas_org_project on public.project_areas(organization_id, project_id);
create index if not exists idx_project_areas_parent on public.project_areas(parent_id);
create index if not exists idx_project_units_org_project on public.project_units(organization_id, project_id);
create index if not exists idx_project_units_area on public.project_units(area_id);
create index if not exists idx_project_units_property on public.project_units(property_id);

create or replace function public.housing_set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists trg_project_areas_updated_at on public.project_areas;
create trigger trg_project_areas_updated_at before update on public.project_areas for each row execute function public.housing_set_updated_at();
drop trigger if exists trg_project_units_updated_at on public.project_units;
create trigger trg_project_units_updated_at before update on public.project_units for each row execute function public.housing_set_updated_at();

alter table public.project_areas enable row level security;
alter table public.project_units enable row level security;

drop policy if exists project_areas_select on public.project_areas;
create policy project_areas_select on public.project_areas for select to authenticated
using (organization_id = (select public.current_organization_id()));

drop policy if exists project_areas_insert on public.project_areas;
create policy project_areas_insert on public.project_areas for insert to authenticated
with check (organization_id = (select public.current_organization_id()));

drop policy if exists project_areas_update on public.project_areas;
create policy project_areas_update on public.project_areas for update to authenticated
using (organization_id = (select public.current_organization_id()))
with check (organization_id = (select public.current_organization_id()));

drop policy if exists project_areas_delete on public.project_areas;
create policy project_areas_delete on public.project_areas for delete to authenticated
using (organization_id = (select public.current_organization_id()));

drop policy if exists project_units_select on public.project_units;
create policy project_units_select on public.project_units for select to authenticated
using (organization_id = (select public.current_organization_id()));

drop policy if exists project_units_insert on public.project_units;
create policy project_units_insert on public.project_units for insert to authenticated
with check (organization_id = (select public.current_organization_id()));

drop policy if exists project_units_update on public.project_units;
create policy project_units_update on public.project_units for update to authenticated
using (organization_id = (select public.current_organization_id()))
with check (organization_id = (select public.current_organization_id()));

drop policy if exists project_units_delete on public.project_units;
create policy project_units_delete on public.project_units for delete to authenticated
using (organization_id = (select public.current_organization_id()));

comment on table public.project_areas is 'Housing hierarchy: estate, cluster, block, zone and facility. Geometry is provider-neutral JSON for GIS readiness.';
comment on table public.project_units is 'Housing unit master linked to project/property; location is provider-neutral JSON for GIS/AR readiness.';
