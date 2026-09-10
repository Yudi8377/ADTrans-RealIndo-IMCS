# ADTrans RealIndo IMCS

Production-oriented web application foundation for **ADTrans RealIndo**, focused on property/real-estate management, investment, development and management control. Transmind Nusantara Rental Mobil is outside this application's scope.

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

The browser uses a Supabase **publishable key**. Supabase documents publishable keys as safe for browser applications when RLS and least-privilege policies are correctly configured; secret/service-role keys are never used by the frontend.

## Current production foundation

- Supabase project: `AD REALINDO IMCS`
- Region: Southeast Asia (Singapore)
- Project ref: `nfvkdqpxexfymzuwdorx`
- PostgreSQL 17
- Organization-scoped RLS across exposed business tables
- Role-aware write access: SUPER_ADMIN, DIRECTOR, COMMISSIONER, EXECUTIVE, DEPARTMENT_HEAD and MANAGER
- STAFF and AUDITOR are read-only at the database policy layer
- Trusted database audit triggers for core organization-owned records
- Security Advisor: no current security findings
- Performance Advisor: no public-schema warning findings; one informational legacy-staging FK remains
- Production migrations are mirrored under `supabase/migrations/0004` through `0007`

## Application capabilities

Every primary IMCS module has a working management view with:

- live Supabase data loading
- organization isolation
- role-aware create/edit/delete controls
- search/filtering
- record detail/edit forms
- validation for typed fields and investment JSON assumptions
- CSV export
- refresh controls
- empty/error states
- responsive desktop/mobile layout
- authenticated route protection

## Local run

1. `npm install`
2. copy `.env.example` to `.env.local`
3. set `VITE_SUPABASE_URL`
4. set `VITE_SUPABASE_PUBLISHABLE_KEY` (preferred) or the legacy compatibility variable `VITE_SUPABASE_ANON_KEY`
5. `npm run dev`

The production build also contains a safe publishable-key fallback for the configured AD REALINDO Supabase project, so GitHub Pages can build without exposing any secret/service-role credential.

## Build

`npm run build`

GitHub Actions validates the build and release smoke checks on pushes and pull requests. The Pages workflow builds and deploys `dist` to GitHub Pages.

## Data migration gate

Legacy Access data is not fabricated or promoted automatically:

**Extract → Stage → Validate → Map → Transform → Reconcile → Promote.**

`migration/akvisio.mdb` remains preserved as the supplied legacy source.
