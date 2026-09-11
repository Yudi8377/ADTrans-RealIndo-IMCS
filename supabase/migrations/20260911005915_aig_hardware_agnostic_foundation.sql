create table if not exists public.aig_devices (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id), device_uid text not null unique,
  device_class text not null check (device_class in ('audio','display','rugged','custom')), vendor text, model text, firmware_version text,
  hardware_adapter text not null default 'generic', status text not null default 'pending' check (status in ('pending','active','suspended','retired','lost')),
  owner_user_id uuid references public.profiles(id), metadata jsonb not null default '{}'::jsonb, last_seen_at timestamptz,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.aig_capabilities (
  id uuid primary key default gen_random_uuid(), code text not null unique, name text not null, description text,
  risk_level text not null default 'low' check (risk_level in ('low','medium','high','critical')),
  requires_confirmation boolean not null default true, active boolean not null default true, created_at timestamptz not null default now()
);
create table if not exists public.aig_device_capabilities (
  device_id uuid not null references public.aig_devices(id) on delete cascade,
  capability_id uuid not null references public.aig_capabilities(id) on delete cascade, enabled boolean not null default true,
  primary key (device_id, capability_id)
);
create table if not exists public.aig_sessions (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id), device_id uuid not null references public.aig_devices(id),
  user_id uuid not null references public.profiles(id), project_id uuid references public.property_projects(id), context jsonb not null default '{}'::jsonb,
  started_at timestamptz not null default now(), ended_at timestamptz, status text not null default 'active' check (status in ('active','ended','revoked','offline'))
);
create table if not exists public.aig_requests (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id), session_id uuid references public.aig_sessions(id),
  user_id uuid not null references public.profiles(id), device_id uuid references public.aig_devices(id), project_id uuid references public.property_projects(id),
  request_type text not null check (request_type in ('assistant','translation','meeting','project','document','field_report','vision','command')),
  input_text text, input_metadata jsonb not null default '{}'::jsonb, response_text text, evidence jsonb not null default '[]'::jsonb,
  confidence numeric check (confidence is null or (confidence >= 0 and confidence <= 1)), model_name text, model_version text,
  action_status text not null default 'informational' check (action_status in ('informational','pending_confirmation','approved','rejected','executed','blocked')),
  created_at timestamptz not null default now(), completed_at timestamptz
);
create table if not exists public.aig_field_evidence (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id), project_id uuid references public.property_projects(id),
  session_id uuid references public.aig_sessions(id), captured_by uuid not null references public.profiles(id), device_id uuid references public.aig_devices(id),
  evidence_type text not null check (evidence_type in ('photo','video','audio','voice_note','observation','sensor')), storage_path text,
  captured_at timestamptz not null default now(), latitude numeric, longitude numeric, metadata jsonb not null default '{}'::jsonb,
  verification_status text not null default 'unverified' check (verification_status in ('unverified','reviewed','verified','rejected')),
  verified_by uuid references public.profiles(id), verified_at timestamptz
);
create table if not exists public.aig_meeting_sessions (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id), created_by uuid not null references public.profiles(id),
  title text not null, language_code text not null default 'id-ID', target_language_code text, started_at timestamptz not null default now(), ended_at timestamptz,
  status text not null default 'active' check (status in ('active','ended','cancelled')), summary text, decisions jsonb not null default '[]'::jsonb, action_items jsonb not null default '[]'::jsonb
);
create table if not exists public.aig_hardware_adapters (
  id uuid primary key default gen_random_uuid(), adapter_code text not null unique, vendor text, model_family text, protocol_version text not null default '1.0',
  capabilities jsonb not null default '[]'::jsonb, status text not null default 'planned' check (status in ('planned','pilot','certified','deprecated')), created_at timestamptz not null default now()
);
create index if not exists idx_aig_devices_org on public.aig_devices(organization_id);
create index if not exists idx_aig_devices_owner on public.aig_devices(owner_user_id);
create index if not exists idx_aig_sessions_user on public.aig_sessions(user_id, started_at desc);
create index if not exists idx_aig_sessions_project on public.aig_sessions(project_id, started_at desc);
create index if not exists idx_aig_requests_user on public.aig_requests(user_id, created_at desc);
create index if not exists idx_aig_requests_project on public.aig_requests(project_id, created_at desc);
create index if not exists idx_aig_evidence_project on public.aig_field_evidence(project_id, captured_at desc);

alter table public.aig_devices enable row level security;
alter table public.aig_capabilities enable row level security;
alter table public.aig_device_capabilities enable row level security;
alter table public.aig_sessions enable row level security;
alter table public.aig_requests enable row level security;
alter table public.aig_field_evidence enable row level security;
alter table public.aig_meeting_sessions enable row level security;
alter table public.aig_hardware_adapters enable row level security;

create policy aig_devices_org_select on public.aig_devices for select to authenticated using ((select p.organization_id from public.profiles p where p.id = (select auth.uid())) = organization_id);
create policy aig_devices_owner_insert on public.aig_devices for insert to authenticated with check ((select p.organization_id from public.profiles p where p.id = (select auth.uid())) = organization_id);
create policy aig_devices_owner_update on public.aig_devices for update to authenticated using ((select p.organization_id from public.profiles p where p.id = (select auth.uid())) = organization_id) with check ((select p.organization_id from public.profiles p where p.id = (select auth.uid())) = organization_id);
create policy aig_capabilities_read on public.aig_capabilities for select to authenticated using (active = true);
create policy aig_device_capabilities_read on public.aig_device_capabilities for select to authenticated using (exists (select 1 from public.aig_devices d where d.id = device_id and d.organization_id = (select p.organization_id from public.profiles p where p.id = (select auth.uid()))));
create policy aig_sessions_own_select on public.aig_sessions for select to authenticated using (user_id = (select auth.uid()) or organization_id = (select p.organization_id from public.profiles p where p.id = (select auth.uid())));
create policy aig_sessions_own_insert on public.aig_sessions for insert to authenticated with check (user_id = (select auth.uid()) and organization_id = (select p.organization_id from public.profiles p where p.id = (select auth.uid())));
create policy aig_sessions_own_update on public.aig_sessions for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy aig_requests_own_select on public.aig_requests for select to authenticated using (user_id = (select auth.uid()) or organization_id = (select p.organization_id from public.profiles p where p.id = (select auth.uid())));
create policy aig_requests_own_insert on public.aig_requests for insert to authenticated with check (user_id = (select auth.uid()) and organization_id = (select p.organization_id from public.profiles p where p.id = (select auth.uid())));
create policy aig_evidence_org_select on public.aig_field_evidence for select to authenticated using (organization_id = (select p.organization_id from public.profiles p where p.id = (select auth.uid())));
create policy aig_evidence_own_insert on public.aig_field_evidence for insert to authenticated with check (captured_by = (select auth.uid()) and organization_id = (select p.organization_id from public.profiles p where p.id = (select auth.uid())));
create policy aig_evidence_own_update on public.aig_field_evidence for update to authenticated using (captured_by = (select auth.uid())) with check (captured_by = (select auth.uid()));
create policy aig_meeting_org_select on public.aig_meeting_sessions for select to authenticated using (organization_id = (select p.organization_id from public.profiles p where p.id = (select auth.uid())));
create policy aig_meeting_own_insert on public.aig_meeting_sessions for insert to authenticated with check (created_by = (select auth.uid()) and organization_id = (select p.organization_id from public.profiles p where p.id = (select auth.uid())));
create policy aig_meeting_own_update on public.aig_meeting_sessions for update to authenticated using (created_by = (select auth.uid())) with check (created_by = (select auth.uid()));
create policy aig_adapters_read on public.aig_hardware_adapters for select to authenticated using (true);

insert into public.aig_capabilities(code,name,description,risk_level,requires_confirmation) values
('voice_assistant','Voice Assistant','Context-aware ADTrans AI assistant','low',false),
('translation','Live Translation','Speech translation between approved languages','medium',false),
('meeting_assistant','Meeting Assistant','Agenda, notes, decisions and action items','medium',true),
('project_context','Project Context','Project progress, milestones, risks and approved data','medium',false),
('field_evidence','Field Evidence','Capture and submit field evidence','medium',true),
('vision_assist','Vision Assist','Computer vision observations for human review','medium',true),
('document_assist','Document Assistant','Search and summarize authorized documents','medium',false),
('workflow_command','Workflow Command','Request controlled IMCS actions','high',true)
on conflict (code) do update set name=excluded.name, description=excluded.description, risk_level=excluded.risk_level, requires_confirmation=excluded.requires_confirmation, active=true;
insert into public.aig_hardware_adapters(adapter_code,vendor,model_family,status) values ('generic','ADTrans','Hardware Agnostic Adapter','pilot') on conflict (adapter_code) do nothing;
