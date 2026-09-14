-- ADTrans RealIndo security/performance hardening
-- Historical hardening is retained here; follow-up migrations own current policy/index state.

revoke execute on function public.current_organization_id() from public, anon;
revoke execute on function public.current_profile_role() from public, anon;
revoke execute on function public.has_permission(text) from public, anon;

grant execute on function public.current_organization_id() to authenticated;
grant execute on function public.current_profile_role() to authenticated;
grant execute on function public.has_permission(text) to authenticated;

create index if not exists idx_aig_device_capabilities_capability_id
  on public.aig_device_capabilities (capability_id);

create index if not exists idx_departments_parent_id
  on public.departments (parent_id);

create index if not exists idx_field_evidence_verified_by
  on public.field_evidence_events (verified_by);
