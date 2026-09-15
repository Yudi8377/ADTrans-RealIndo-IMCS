# ADTrans RealIndo Finish Gate

## Product boundary
- Corporate portfolio is separated from IMCS.
- IMCS is the enterprise operating system across construction, engineering/installation, real estate, property management, leasing and maintenance.

## Runtime controls
- Supabase session/profile organization is the authorization boundary.
- Transaction lifecycle is database-governed: DRAFT → SUBMITTED → APPROVED → POSTED.
- Posted corrections use REVERSE; historical records are preserved.
- Attendance uses server-side event recording and idempotency.
- AI Gateway requires authenticated JWT and validates organization, companion, conversation, agent/version and tool policy before recording a run.
- ADEI design decisions require governed approval before baseline.
- Initial organization administrator activation is handled by the authenticated `imcs-bootstrap-admin` Edge Function. It is available only while the organization has no active `SUPER_ADMIN`; once the first administrator exists, bootstrap closes permanently.

## Verified deployment gates
- Main branch is merged and the GitHub Pages workflow successfully built and deployed the verified artifact for the release commit.
- CI browser smoke has been executed for both corporate and IMCS surfaces.
- Supabase production backend has been audited directly.

## Accepted platform limitation
- Supabase leaked-password protection remains OFF because the current project plan does not provide the feature. This is an accepted platform limitation, not a reason to fabricate a control or force an upgrade.
- Compensating controls are application-layer authentication, RBAC/RLS, server-side authorization, login/session auditing, rate limiting where implemented, bounded sessions, and future MFA/step-up authentication.

## Production readiness gates still requiring real operational inputs
1. Execute the controlled initial administrator activation for the intended Auth user; never edit a profile role directly to bypass authorization.
2. Register real employees, shifts and approved attendance devices.
3. Configure chart of accounts and approval policies with final company policy.
4. Configure payroll/tax rules and bank payment integration only after bank sandbox/authorization exists.
5. Configure AI provider credentials and model policy before enabling provider-backed generation.
6. Configure DNS/HTTPS for `www.adtransrealindo.com` and `imcs.adtransrealindo.com`, then verify externally.
7. Execute authenticated end-to-end production smoke tests after the privileged Auth workflow is established.
8. Certify physical biometric hardware only when actual devices and vendor environments are available.

These gates are intentionally not faked with synthetic production data, invented credentials, or false live-status claims.
