-- ADTRANS REALINDO IMCS
-- Production security hardening: isolate SECURITY DEFINER helpers and add FK indexes.

create schema if not exists imcs_private;

alter function public.current_organization_id() set schema imcs_private;
alter function public.current_profile() set schema imcs_private;
alter function public.current_user_has_role(public.imcs_role[]) set schema imcs_private;

alter function imcs_private.current_organization_id() set search_path = public, pg_temp;
alter function imcs_private.current_profile() set search_path = public, pg_temp;
alter function imcs_private.current_user_has_role(public.imcs_role[]) set search_path = public, pg_temp;
alter function public.set_updated_at() set search_path = public, pg_temp;

revoke all on schema imcs_private from public;
grant usage on schema imcs_private to authenticated;
grant execute on function imcs_private.current_organization_id() to authenticated;
grant execute on function imcs_private.current_profile() to authenticated;
grant execute on function imcs_private.current_user_has_role(public.imcs_role[]) to authenticated;

drop policy if exists organization_select on public.organizations;
create policy organization_select on public.organizations for select to authenticated
using (id = imcs_private.current_organization_id() or parent_id = imcs_private.current_organization_id());

drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles for select to authenticated
using (organization_id = imcs_private.current_organization_id());

create index if not exists idx_organizations_parent_id on public.organizations(parent_id);
create index if not exists idx_profiles_organization_id on public.profiles(organization_id);
create index if not exists idx_land_documents_land_asset_id on public.land_documents(land_asset_id);
create index if not exists idx_property_projects_land_asset_id on public.property_projects(land_asset_id);
create index if not exists idx_project_costs_project on public.project_costs(project_id);
create index if not exists idx_project_risks_owner_id on public.project_risks(owner_id);
create index if not exists idx_properties_project_id on public.properties(project_id);
create index if not exists idx_investment_cases_project_id on public.investment_cases(project_id);
create index if not exists idx_investment_cases_organization_id on public.investment_cases(organization_id);
create index if not exists idx_budgets_organization_id on public.budgets(organization_id);
create index if not exists idx_financial_transactions_project_id on public.financial_transactions(project_id);
create index if not exists idx_financial_transactions_organization_id on public.financial_transactions(organization_id);
create index if not exists idx_contracts_organization_id on public.contracts(organization_id);
create index if not exists idx_approvals_organization_id on public.approvals(organization_id);
create index if not exists idx_approvals_requested_by on public.approvals(requested_by);
create index if not exists idx_approvals_approver_id on public.approvals(approver_id);
create index if not exists idx_audit_logs_organization_id on public.audit_logs(organization_id);
create index if not exists idx_audit_logs_actor_id on public.audit_logs(actor_id);
create index if not exists idx_kpi_actuals_kpi_code on public.kpi_actuals(kpi_code);
create index if not exists idx_management_alerts_organization_id on public.management_alerts(organization_id);
create index if not exists idx_project_milestones_owner_id on public.project_milestones(owner_id);
create index if not exists idx_project_documents_project_id on public.project_documents(project_id);
create index if not exists idx_project_documents_verified_by on public.project_documents(verified_by);
create index if not exists idx_project_changes_project_id on public.project_changes(project_id);
create index if not exists idx_project_changes_requested_by on public.project_changes(requested_by);
create index if not exists idx_project_changes_approved_by on public.project_changes(approved_by);
create index if not exists idx_risk_actions_risk_id on public.risk_actions(risk_id);
create index if not exists idx_risk_actions_owner_id on public.risk_actions(owner_id);
create index if not exists idx_contract_obligations_contract_id on public.contract_obligations(contract_id);
create index if not exists idx_contract_obligations_responsible_id on public.contract_obligations(responsible_id);
create index if not exists idx_compliance_register_organization_id on public.compliance_register(organization_id);
create index if not exists idx_compliance_register_owner_id on public.compliance_register(owner_id);
create index if not exists idx_budget_lines_budget_id on public.budget_lines(budget_id);
create index if not exists idx_budget_lines_project_id on public.budget_lines(project_id);
create index if not exists idx_management_decisions_organization_id on public.management_decisions(organization_id);
create index if not exists idx_management_decisions_owner_id on public.management_decisions(owner_id);
