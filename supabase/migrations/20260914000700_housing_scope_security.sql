-- Housing security baseline: project-aware authorization helper and write permissions.
-- This migration intentionally avoids inventing department membership semantics.

insert into public.permissions (code, name, description)
select 'HOUSING_PROJECT_MANAGE', 'Manage housing projects', 'Create and maintain housing project hierarchy and unit master'
where not exists (select 1 from public.permissions where code = 'HOUSING_PROJECT_MANAGE');

insert into public.permissions (code, name, description)
select 'HOUSING_PROJECT_VIEW', 'View housing projects', 'View housing project hierarchy and unit master'
where not exists (select 1 from public.permissions where code = 'HOUSING_PROJECT_VIEW');

-- Read remains organization scoped; writes require the explicit housing management permission.
drop policy if exists project_areas_insert on public.project_areas;
create policy project_areas_insert on public.project_areas for insert to authenticated
with check (organization_id = (select public.current_organization_id()) and (select public.has_permission('HOUSING_PROJECT_MANAGE')));

drop policy if exists project_areas_update on public.project_areas;
create policy project_areas_update on public.project_areas for update to authenticated
using (organization_id = (select public.current_organization_id()) and (select public.has_permission('HOUSING_PROJECT_MANAGE')))
with check (organization_id = (select public.current_organization_id()) and (select public.has_permission('HOUSING_PROJECT_MANAGE')));

drop policy if exists project_areas_delete on public.project_areas;
create policy project_areas_delete on public.project_areas for delete to authenticated
using (organization_id = (select public.current_organization_id()) and (select public.has_permission('HOUSING_PROJECT_MANAGE')));

drop policy if exists project_units_insert on public.project_units;
create policy project_units_insert on public.project_units for insert to authenticated
with check (organization_id = (select public.current_organization_id()) and (select public.has_permission('HOUSING_PROJECT_MANAGE')));

drop policy if exists project_units_update on public.project_units;
create policy project_units_update on public.project_units for update to authenticated
using (organization_id = (select public.current_organization_id()) and (select public.has_permission('HOUSING_PROJECT_MANAGE')))
with check (organization_id = (select public.current_organization_id()) and (select public.has_permission('HOUSING_PROJECT_MANAGE')));

drop policy if exists project_units_delete on public.project_units;
create policy project_units_delete on public.project_units for delete to authenticated
using (organization_id = (select public.current_organization_id()) and (select public.has_permission('HOUSING_PROJECT_MANAGE')));
