# ADTrans RealIndo IMCS

Production-oriented web application foundation for **ADTrans RealIndo**, focused on property/real-estate management, investment, development and management control. Transmind Nusantara Rental Mobil is outside this application's scope.

## Public preview surfaces

- Corporate portfolio: `/`
- IMCS application: `/imcs.html`

Corporate and IMCS are separate HTML entry points. The corporate surface does not load the IMCS application runtime or privileged management UI. The IMCS surface remains `noindex` and is protected by Supabase authentication/RLS/RBAC.

## Production scope

- Executive Cockpit
- Land Bank
- Property & Asset
- Development Control
- Investment
- Finance Control
- Contracts & Legal
- Risk & Compliance
- Governance / Approvals
- KPI & Management Alerts

## Architecture

Vite + JavaScript frontend · Supabase PostgreSQL/Auth/RLS · GitHub Actions CI/CD · GitHub Pages deployment.

The browser uses a Supabase **publishable key**. Secret/service-role keys are never used by the frontend.

## Local run

1. `npm install`
2. copy `.env.example` to `.env.local`
3. set `VITE_SUPABASE_URL`
4. set `VITE_SUPABASE_PUBLISHABLE_KEY` (preferred) or the legacy compatibility variable `VITE_SUPABASE_ANON_KEY`
5. `npm run dev`

## Build

`npm run build`

The Pages workflow builds the two entry points, verifies the public boundary and production artifact, then deploys the generated `dist` directory.

## Data migration gate

Legacy Access data is not fabricated or promoted automatically:

**Extract → Stage → Validate → Map → Transform → Reconcile → Promote.**

`migration/akvisio.mdb` remains preserved as the supplied legacy source.
