-- ADTRANS REALINDO IMCS
-- Role-aware write control and trusted audit trail.

create or replace function imcs_private.can_write()
returns boolean language sql stable security definer set search_path = public, pg_temp
as $$ select imcs_private.current_user_has_role(array['SUPER_ADMIN','DIRECTOR','COMMISSIONER','EXECUTIVE','DEPARTMENT_HEAD','MANAGER']::public.imcs_role[]) $$;
grant execute on function imcs_private.can_write() to authenticated;

do $$
declare r record;
begin
  for r in select * from (values
    ('land_assets','land_assets_all'),('property_projects','projects_all'),('properties','properties_all'),('investment_cases','investment_cases_all'),
    ('budgets','budgets_all'),('financial_transactions','transactions_all'),('contracts','contracts_all'),('approvals','approvals_all'),
    ('kpi_actuals','kpi_actuals_all'),('management_alerts','management_alerts_all'),('compliance_register','compliance_all'),
    ('management_decisions','decisions_all'),('project_costs','project_costs_all'),('project_risks','project_risks_all'),
    ('project_milestones','milestones_all'),('project_documents','documents_all'),('project_changes','changes_all'),
    ('risk_actions','risk_actions_all'),('contract_obligations','contract_obligations_all'),('land_documents','land_documents_all')
  ) as x(tbl,pol) loop
    execute format('drop policy if exists %I on public.%I',r.pol,r.tbl);
  end loop;
end $$;

do $$
declare r record;
begin
  for r in select * from (values
    ('land_assets','organization_id = imcs_private.current_organization_id()'),('property_projects','organization_id = imcs_private.current_organization_id()'),
    ('properties','organization_id = imcs_private.current_organization_id()'),('investment_cases','organization_id = imcs_private.current_organization_id()'),
    ('budgets','organization_id = imcs_private.current_organization_id()'),('financial_transactions','organization_id = imcs_private.current_organization_id()'),
    ('contracts','organization_id = imcs_private.current_organization_id()'),('approvals','organization_id = imcs_private.current_organization_id()'),
    ('kpi_actuals','organization_id = imcs_private.current_organization_id()'),('management_alerts','organization_id = imcs_private.current_organization_id()'),
    ('compliance_register','organization_id = imcs_private.current_organization_id()'),('management_decisions','organization_id = imcs_private.current_organization_id()')
  ) as x(tbl,pred) loop
    execute format('create policy %I on public.%I for select to authenticated using (%s)',r.tbl||'_select',r.tbl,r.pred);
    execute format('create policy %I on public.%I for insert to authenticated with check ((%s) and imcs_private.can_write())',r.tbl||'_insert',r.tbl,r.pred);
    execute format('create policy %I on public.%I for update to authenticated using ((%s) and imcs_private.can_write()) with check ((%s) and imcs_private.can_write())',r.tbl||'_update',r.tbl,r.pred,r.pred);
    execute format('create policy %I on public.%I for delete to authenticated using ((%s) and imcs_private.can_write())',r.tbl||'_delete',r.tbl,r.pred);
  end loop;
end $$;

drop policy if exists audit_logs_insert on public.audit_logs;
drop policy if exists audit_logs_select on public.audit_logs;
create policy audit_logs_select on public.audit_logs for select to authenticated using (organization_id = imcs_private.current_organization_id());

create or replace function imcs_private.audit_row_change()
returns trigger language plpgsql security definer set search_path = public, pg_temp
as $$
declare org_id uuid; actor uuid := auth.uid(); entity_id uuid;
begin
  if tg_op='DELETE' then org_id:=old.organization_id; entity_id:=old.id;
  else org_id:=new.organization_id; entity_id:=new.id; end if;
  if org_id is not null then insert into public.audit_logs(organization_id,actor_id,action,entity_type,entity_id,before_data,after_data)
    values(org_id,actor,tg_op,tg_table_name,entity_id,case when tg_op in ('UPDATE','DELETE') then to_jsonb(old) end,case when tg_op in ('INSERT','UPDATE') then to_jsonb(new) end); end if;
  return case when tg_op='DELETE' then old else new end;
end; $$;
grant execute on function imcs_private.audit_row_change() to authenticated;

do $$
declare t text;
begin
  foreach t in array array['land_assets','property_projects','properties','investment_cases','budgets','financial_transactions','contracts','approvals','kpi_actuals','management_alerts','compliance_register','management_decisions'] loop
    execute format('drop trigger if exists trg_audit_%I on public.%I',t,t);
    execute format('create trigger trg_audit_%I after insert or update or delete on public.%I for each row execute function imcs_private.audit_row_change()',t,t);
  end loop;
end $$;
