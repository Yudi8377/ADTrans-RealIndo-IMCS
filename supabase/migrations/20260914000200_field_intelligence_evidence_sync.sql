-- ADTrans RealIndo Field Intelligence Evidence + Offline Sync
-- Canonical server-side evidence contract for tablet and Smart Glass clients.

create table if not exists public.field_evidence_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  project_id uuid null,
  work_package_id uuid null,
  captured_by uuid not null references auth.users(id) on delete restrict,
  device_uid text null,
  client_event_id uuid not null,
  evidence_type text not null check (evidence_type in ('observation','photo','video','audio','document','location','checklist')),
  payload jsonb not null default '{}'::jsonb,
  captured_at timestamptz not null default now(),
  verification_status text not null default 'unverified' check (verification_status in ('unverified','under_review','verified','rejected')),
  verified_by uuid null references auth.users(id) on delete restrict,
  verified_at timestamptz null,
  created_at timestamptz not null default now(),
  unique (organization_id, client_event_id)
);

create index if not exists idx_field_evidence_org_captured on public.field_evidence_events (organization_id, captured_at desc);
create index if not exists idx_field_evidence_project on public.field_evidence_events (project_id, captured_at desc);
create index if not exists idx_field_evidence_work_package on public.field_evidence_events (work_package_id, captured_at desc);
create index if not exists idx_field_evidence_captured_by on public.field_evidence_events (captured_by, captured_at desc);

alter table public.field_evidence_events enable row level security;

create policy field_evidence_select_org on public.field_evidence_events
for select to authenticated
using (organization_id = (select current_organization_id()));

create policy field_evidence_insert_self on public.field_evidence_events
for insert to authenticated
with check (organization_id = (select current_organization_id()) and captured_by = (select auth.uid()));

create policy field_evidence_update_verifier on public.field_evidence_events
for update to authenticated
using (organization_id = (select current_organization_id()))
with check (organization_id = (select current_organization_id()));

create table if not exists public.field_sync_queue (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  device_uid text null,
  client_event_id uuid not null,
  entity_type text not null,
  entity_id uuid null,
  operation text not null check (operation in ('create','update','delete')),
  payload jsonb not null default '{}'::jsonb,
  client_created_at timestamptz not null,
  received_at timestamptz not null default now(),
  sync_status text not null default 'accepted' check (sync_status in ('accepted','duplicate','rejected','conflict')),
  error_code text null,
  unique (organization_id, client_event_id)
);

create index if not exists idx_field_sync_org_status on public.field_sync_queue (organization_id, sync_status, received_at desc);
create index if not exists idx_field_sync_user on public.field_sync_queue (user_id, received_at desc);

alter table public.field_sync_queue enable row level security;

create policy field_sync_select_self on public.field_sync_queue
for select to authenticated
using (organization_id = (select current_organization_id()) and user_id = (select auth.uid()));

create policy field_sync_insert_self on public.field_sync_queue
for insert to authenticated
with check (organization_id = (select current_organization_id()) and user_id = (select auth.uid()));

create or replace function public.record_field_evidence(
  p_client_event_id uuid,
  p_organization_id uuid,
  p_captured_by uuid,
  p_device_uid text,
  p_project_id uuid,
  p_work_package_id uuid,
  p_evidence_type text,
  p_payload jsonb,
  p_captured_at timestamptz
) returns public.field_evidence_events
language plpgsql
security invoker
set search_path = public
as $$
declare v_row public.field_evidence_events;
begin
  if p_captured_by <> (select auth.uid()) then raise exception 'FIELD_ACTOR_MISMATCH'; end if;
  if p_organization_id <> (select current_organization_id()) then raise exception 'FIELD_ORG_MISMATCH'; end if;
  insert into public.field_sync_queue (organization_id,user_id,device_uid,client_event_id,entity_type,operation,payload,client_created_at,sync_status)
  values (p_organization_id,p_captured_by,p_device_uid,p_client_event_id,'field_evidence','create',coalesce(p_payload,'{}'::jsonb),coalesce(p_captured_at,now()),'accepted')
  on conflict (organization_id,client_event_id) do update set received_at=now(), sync_status='duplicate';
  insert into public.field_evidence_events (organization_id,project_id,work_package_id,captured_by,device_uid,client_event_id,evidence_type,payload,captured_at)
  values (p_organization_id,p_project_id,p_work_package_id,p_captured_by,p_device_uid,p_client_event_id,p_evidence_type,coalesce(p_payload,'{}'::jsonb),coalesce(p_captured_at,now()))
  on conflict (organization_id,client_event_id) do update set payload=excluded.payload
  returning * into v_row;
  return v_row;
end;
$$;

revoke execute on function public.record_field_evidence(uuid,uuid,uuid,text,uuid,uuid,text,jsonb,timestamptz) from public, anon;
grant execute on function public.record_field_evidence(uuid,uuid,uuid,text,uuid,uuid,text,jsonb,timestamptz) to authenticated;
