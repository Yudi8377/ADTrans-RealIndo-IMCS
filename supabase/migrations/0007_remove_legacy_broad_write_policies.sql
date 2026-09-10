-- ADTRANS REALINDO IMCS
-- Remove legacy broad write policies left by the original control-plane migration.

do $$
declare r record;
begin
  for r in select * from (values
    ('land_assets','land_assets_write'),('property_projects','projects_write'),('properties','properties_write'),('investment_cases','investment_cases_write'),
    ('budgets','budgets_write'),('financial_transactions','transactions_write'),('contracts','contracts_write'),('approvals','approvals_write'),
    ('kpi_actuals','kpi_actuals_write'),('management_alerts','management_alerts_write'),('compliance_register','compliance_write'),
    ('management_decisions','decisions_write'),('project_costs','project_costs_write'),('project_risks','project_risks_write'),
    ('project_milestones','milestones_write'),('project_documents','documents_write'),('project_changes','changes_write'),
    ('risk_actions','risk_actions_write'),('contract_obligations','contract_obligations_write'),('land_documents','land_documents_write')
  ) as x(tbl,pol) loop
    execute format('drop policy if exists %I on public.%I',r.pol,r.tbl);
  end loop;
end $$;
