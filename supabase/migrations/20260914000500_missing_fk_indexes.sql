create index if not exists idx_aig_device_capabilities_capability_id
  on public.aig_device_capabilities (capability_id);

create index if not exists idx_departments_parent_id
  on public.departments (parent_id);
