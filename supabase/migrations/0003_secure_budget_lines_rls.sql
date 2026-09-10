-- ADTrans RealIndo IMCS
-- Security hardening: isolate budget lines through their parent budget organization.
alter table public.budget_lines enable row level security;
drop policy if exists budget_lines_all on public.budget_lines;
create policy budget_lines_all on public.budget_lines
for all to authenticated
using (exists (select 1 from public.budgets b where b.id = budget_lines.budget_id and b.organization_id = public.current_organization_id()))
with check (exists (select 1 from public.budgets b where b.id = budget_lines.budget_id and b.organization_id = public.current_organization_id()));
create index if not exists idx_budget_lines_budget_id on public.budget_lines(budget_id);
create index if not exists idx_budget_lines_project_id on public.budget_lines(project_id);
