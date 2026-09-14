-- ADTrans RealIndo security/performance hardening
-- Keep previously applied database hardening represented in source control.

revoke execute on function public.current_organization_id() from public, anon, authenticated;
revoke execute on function public.current_profile_role() from public, anon, authenticated;
revoke execute on function public.has_permission(text) from public, anon, authenticated;

create index if not exists idx_aig_device_capabilities_capability_id
  on public.aig_device_capabilities (capability_id);

create index if not exists idx_departments_parent_id
  on public.departments (parent_id);
