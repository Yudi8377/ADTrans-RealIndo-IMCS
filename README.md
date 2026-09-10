# ADTrans RealIndo IMCS

Web application foundation for **ADTrans RealIndo**, focused on property/real-estate management and management control. Transmind Nusantara Rental Mobil is outside this application scope.

## Scope
Land Bank · Property & Asset · Development · Investment · Finance · Contracts & Legal · Risk & Compliance · Governance · KPI & Alerts.

## Architecture
Vite + JavaScript frontend · Supabase PostgreSQL/Auth/RLS/Storage · GitHub Actions CI/CD · legacy staging for Akvisio.

## Supabase production foundation
- Project: `AD REALINDO IMCS`
- Region: Southeast Asia (Singapore)
- Project ref: `nfvkdqpxexfymzuwdorx`
- Migrations `0001` and `0002` are applied to the remote database.
- Additional remote security hardening migrations are present for KPI catalog and helper-function execution.
- Frontend must use only the Supabase publishable/anon key; never commit a service-role/secret key.

## Local run
1. `npm install`
2. copy `.env.example` to `.env.local`
3. set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
4. `npm run dev`

## Build
`npm run build`

GitHub Actions validates the build on pushes and pull requests. A GitHub Pages deployment workflow is included; the repository Pages setting must use **GitHub Actions** as its source before the first production deployment.

## Legacy status
`migration/akvisio.mdb` is preserved as the supplied legacy source. The Windows extraction run reported zero user objects, so **no production mapping has been fabricated**. Re-run a deeper Access/DAO inspection if a populated Akvisio database is expected.

## Migration gate
Extract → Stage → Validate → Map → Transform → Reconcile → Promote.
