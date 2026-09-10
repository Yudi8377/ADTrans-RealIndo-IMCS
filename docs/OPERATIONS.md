# ADTrans RealIndo IMCS — Operations

## Deployment

1. Merge only tested changes into `main`.
2. GitHub Actions runs dependency installation, production build, release verification, and Pages artifact creation.
3. Treat a failed workflow as a release blocker.
4. Never place Supabase service-role keys in frontend environment variables or committed files.

## Database changes

- Every schema change must have a migration.
- Add indexes for frequently joined foreign keys when justified by query patterns.
- Review Supabase Security Advisor after security-sensitive schema or policy changes.
- Legacy staging tables remain quarantine areas until validation and reconciliation succeed.

## Incident response

- Authentication issue: disable affected access path, inspect Supabase Auth logs, then restore only after verification.
- Data-scope issue: immediately review RLS policies and organization membership; do not bypass RLS from the browser.
- Deployment issue: keep the last known-good Pages artifact and revert the offending commit.
- Data integrity issue: stop promotion from staging and preserve the original source batch for reconciliation.

## Release principle

The system is accepted only when code, database policies, migrations, and deployment checks are mutually consistent.
