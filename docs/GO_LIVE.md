# Go-Live Status

This repository now contains explicit production-readiness, operations, architecture, and release-gate documentation.

## Current verified baseline

- GitHub Actions build has passed `npm ci`, `npm run build`, and `node scripts/verify-release.mjs` on the latest deployment run.
- Pages artifact generation completed in that run; final publication remains controlled by the GitHub Pages deployment workflow.
- Supabase security review previously reported no security findings.
- Legacy staging FK performance index has been added and mirrored in migration history.

## Acceptance boundary

Code-level readiness is not the same as business acceptance. Before opening IMCS to real users, an authorized operator must perform the release checklist against the production Supabase project and confirm real organization memberships, roles, and business records.

No fabricated production data is added by this release.
