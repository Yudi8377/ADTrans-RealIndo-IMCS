# ADTrans RealIndo IMCS

Web application foundation for **ADTrans RealIndo**, focused on property/real-estate management and management control. Transmind Nusantara Rental Mobil is outside this application scope.

## Scope
Land Bank · Property & Asset · Development · Investment · Finance · Contracts & Legal · Risk & Compliance · Governance · KPI & Alerts.

## Architecture
Vite + JavaScript frontend · Supabase PostgreSQL/Auth/RLS/Storage · GitHub Actions-ready · legacy staging for Akvisio.

## Legacy status
`migration/akvisio.mdb` is preserved as the supplied legacy source. The Windows extraction run reported zero user objects, so **no production mapping has been fabricated**. Re-run a deeper Access/DAO inspection if a populated Akvisio database is expected.

## Local run
1. `npm install`
2. copy `.env.example` to `.env` and set Supabase URL + publishable/anon key
3. `npm run dev`

## Supabase
Apply `supabase/migrations/0001_imcs.sql` in a controlled Supabase project. Do not expose a service-role key in the browser.

## Migration gate
Extract → Stage → Validate → Map → Transform → Reconcile → Promote.
