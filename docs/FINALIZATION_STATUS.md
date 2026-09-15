# Finalization Status

## Completed engineering gates
- Corporate portfolio and IMCS are separate browser surfaces.
- IMCS enterprise operating model covers construction, engineering/installation, real estate, property management, leasing and maintenance.
- Supabase organization-scoped RLS is enabled across the enterprise schema.
- Transaction lifecycle is database-governed and auditable.
- Workforce attendance is server-side and idempotent.
- AI Companion and AIG are authenticated and policy-governed.
- ADEI design intake/review/baseline is governed.
- CI runs build and structural release checks.
- CI now launches a local production preview and performs Chromium screenshot smoke checks for both surfaces.

## External activation gates
These require real credentials, infrastructure, or human operational configuration and are therefore not fabricated:

- Supabase Auth production account/configuration, including leaked-password protection.
- Real employees, shifts, devices and attendance enrollment.
- Real chart of accounts and approval policy configuration.
- Payroll/tax rules and bank integration authorization/sandbox.
- AI provider credentials/model policy.
- Production DNS/HTTPS for custom domains.
- Authenticated end-to-end production browser workflows.
- Physical biometric hardware certification/integration.

A release is not described as production-live until those external gates are independently verified.
