-- Housing security baseline.
-- Permission catalog is not assumed here because the current schema does not expose
-- a public permissions table. Until project-level permission mappings are introduced,
-- housing writes are limited to governance roles already defined by IMCS.

create or replace function public.housing_can_manage()
returns boolean
language sql
stable
security invoker
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.active = true
      and p.role in ('SUPER_ADMIN','DIRECTOR','EXECUTIVE','DEPARTMENT_HEAD','MANAGER')
      and p.organization_id = (select public.current_organization_id())
  );
$$;

revoke execute on function public.housing_can_manage() from public, anon;
grant execute on function public.housing_can_manage() to authenticated;

drop policy if exists project_areas_insert on public.project_areas;
create policy project_areas_insert on public.project_areas for insert to authenticated
with check (organization_id = (select public.current_organization_id()) and (select public.housing_can_manage()));

drop policy if exists project_areas_update on public.project_areas;
create policy project_areas_update on public.project_areas for update to authenticated
using (organization_id = (select public.current_organization_id()) and (select public.housing_can_manage()))
with check (organization_id = (select public.current_organization_id()) and (select public.housing_can_manage()));

drop policy if exists project_areas_delete on public.project_areas;
create policy project_areas_delete on public.project_areas for delete to authenticated
using (organization_id = (select public.current_organization_id()) and (select public.housing_can_manage()));

drop policy if exists project_units_insert on public.project_units;
create policy project_units_insert on public.project_units for insert to authenticated
with check (organization_id = (select public.current_organization_id()) and (select public.housing_can_manage()));

drop policy if exists project_units_update on public.project_units;
create policy project_units_update on public.project_units for update to authenticated
using (organization_id = (select public.current_organization_id()) and (select public.housing_can_manage()))
with check (organization_id = (select public.current_organization_id()) and (select public.housing_can_manage()));

drop policy if exists project_units_delete on public.project_units;
create policy project_units_delete on public.project_units for delete to authenticated
using (organization_id = (select public.current_organization_id()) and (select public.housing_can_manage()));
