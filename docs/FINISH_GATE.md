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

## Verification boundary
The repository CI test suite runs build, AI Companion, public-boundary, runtime-contract and release checks. Rendered browser QA is not claimed unless a browser-capable runtime is actually available and executed.

## Production readiness gates still requiring real operational inputs
1. Create/verify the intended Auth user through Supabase Auth; never bootstrap privileged access by modifying profile role blindly.
2. Register employees, shifts and approved attendance devices.
3. Configure chart of accounts and approval policies with real company policy.
4. Configure payroll/tax rules and bank payment integration only after bank sandbox/authorization exists.
5. Configure AI provider credentials and model policy before enabling provider-backed generation.
6. Enable Supabase leaked-password protection in Auth settings.
7. Configure DNS/HTTPS for corporate and IMCS custom domains and verify externally.
8. Execute browser QA and production smoke tests in the deployment environment.

These gates are intentionally not faked with synthetic production data or placeholder external credentials.
