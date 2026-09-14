-- Restrict field evidence verification to explicitly authorized users.
insert into public.permission_catalog (code,name,resource,action,description,active)
values (
  'FIELD_EVIDENCE_VERIFY',
  'Verify field evidence',
  'field_evidence',
  'verify',
  'Review, verify, or reject field evidence events.',
  true
)
on conflict (code) do update
set name=excluded.name,
    resource=excluded.resource,
    action=excluded.action,
    description=excluded.description,
    active=true;

drop policy if exists field_evidence_update_verifier on public.field_evidence_events;
create policy field_evidence_update_verifier
on public.field_evidence_events
for update
to authenticated
using (
  organization_id = (select public.current_organization_id())
  and (select public.has_permission('FIELD_EVIDENCE_VERIFY'))
)
with check (
  organization_id = (select public.current_organization_id())
  and (select public.has_permission('FIELD_EVIDENCE_VERIFY'))
);
