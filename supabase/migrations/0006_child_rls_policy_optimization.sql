-- ADTRANS REALINDO IMCS
-- Command-specific child RLS policies.

do $$
declare r record;
begin
  for r in select * from (values
    ('project_costs','exists(select 1 from public.property_projects p where p.id=project_id and p.organization_id=imcs_private.current_organization_id())'),
    ('project_milestones','exists(select 1 from public.property_projects p where p.id=project_id and p.organization_id=imcs_private.current_organization_id())'),
    ('project_documents','exists(select 1 from public.property_projects p where p.id=project_id and p.organization_id=imcs_private.current_organization_id())'),
    ('project_changes','exists(select 1 from public.property_projects p where p.id=project_id and p.organization_id=imcs_private.current_organization_id())'),
    ('contract_obligations','exists(select 1 from public.contracts c where c.id=contract_id and c.organization_id=imcs_private.current_organization_id())'),
    ('land_documents','exists(select 1 from public.land_assets l where l.id=land_asset_id and l.organization_id=imcs_private.current_organization_id())'),
    ('risk_actions','exists(select 1 from public.project_risks r join public.property_projects p on p.id=r.project_id where r.id=risk_id and p.organization_id=imcs_private.current_organization_id())'),
    ('project_risks','(project_id is null or exists(select 1 from public.property_projects p where p.id=project_id and p.organization_id=imcs_private.current_organization_id()))')
  ) as x(tbl,pred) loop
    execute format('drop policy if exists %I on public.%I',r.tbl||'_all',r.tbl);
    execute format('drop policy if exists %I on public.%I',r.tbl||'_write',r.tbl);
    execute format('create policy %I on public.%I for select to authenticated using (%s)',r.tbl||'_select',r.tbl,r.pred);
    execute format('create policy %I on public.%I for insert to authenticated with check ((%s) and imcs_private.can_write())',r.tbl||'_insert',r.tbl,r.pred);
    execute format('create policy %I on public.%I for update to authenticated using ((%s) and imcs_private.can_write()) with check ((%s) and imcs_private.can_write())',r.tbl||'_update',r.tbl,r.pred,r.pred);
    execute format('create policy %I on public.%I for delete to authenticated using ((%s) and imcs_private.can_write())',r.tbl||'_delete',r.tbl,r.pred);
  end loop;
end $$;

drop index if exists public.idx_project_costs_project_id;
drop index if exists public.idx_project_milestones_project_id;
drop index if exists public.idx_project_risks_project_id;
