# ADTrans RealIndo IMCS — Operating Model

## Mission
A single management-control plane for land, property, development, investment, finance, contracts/legal, risk/compliance, governance and KPI/alerts.

## Architecture
- Frontend: Vite + vanilla JavaScript.
- Backend: Supabase PostgreSQL, Auth, RLS and Storage.
- Source control: GitHub.
- Deployment: GitHub Actions / static hosting compatible with Vite.
- Browser security rule: only Supabase publishable/anon key is allowed in frontend code.

## Control model
Every business record is organization-scoped where applicable. Child records inherit authorization through their parent record. Approval, decision and audit records provide management traceability.

## Data migration gate
Extract → Stage → Validate → Map → Transform → Reconcile → Promote.

No legacy Akvisio data is promoted merely because it exists in the source file. Promotion requires evidence, mapping, validation and reconciliation.

## Production modules
1. Executive Cockpit
2. Land Bank
3. Property & Asset
4. Development
5. Investment
6. Finance
7. Contracts & Legal
8. Risk & Compliance
9. Governance
10. KPI & Alerts

## Engineering rules
- Never commit service-role or secret keys.
- Never fabricate production business data.
- Database migrations are versioned in `supabase/migrations`.
- Security changes must be reproducible from migration files.
- UI metrics must be derived from Supabase data or clearly marked as design targets.
- Changes should preserve organization isolation and auditability.

## Release checklist
- `npm install`
- `npm run build`
- Verify environment variables are publishable only.
- Verify Supabase migrations are applied.
- Verify RLS policies for every organization-scoped table.
- Verify navigation and module data queries.
- Verify responsive layout.
- Deploy through GitHub Actions.
