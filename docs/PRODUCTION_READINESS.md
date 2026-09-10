# ADTrans RealIndo IMCS — Production Readiness

## Release gates

- Public portfolio and internal IMCS are logically separated.
- Supabase Auth is the only supported authentication boundary.
- Browser code must never contain Supabase service-role credentials.
- Database access must remain protected by organization-scoped RLS.
- Legacy data follows staging → validation → mapping → reconciliation → promotion.
- CI must pass install, build, release verification, and Pages artifact generation.
- Security Advisor findings must be reviewed before production release.
- No fabricated business records are committed to production.

## Smoke-test matrix

| Area | Required result |
|---|---|
| Public home/about/projects/contact | Render without authentication |
| IMCS login | Unauthenticated users cannot access protected data |
| Session persistence | Refresh preserves valid authenticated session |
| Sign-out | Session is revoked from the client |
| Organization scope | Users cannot read another organization’s records |
| Executive cockpit | Loads without exposing raw protected tables |
| Navigation | Every production route has a valid destination |
| Build | `npm run build` succeeds |
| Release verification | `node scripts/verify-release.mjs` succeeds |
| Deployment | GitHub Pages artifact is generated successfully |

## Operational rule

A green frontend build is not equivalent to production acceptance. Production acceptance requires the application, Supabase policies, migrations, deployment workflow, and operational data model to agree.
