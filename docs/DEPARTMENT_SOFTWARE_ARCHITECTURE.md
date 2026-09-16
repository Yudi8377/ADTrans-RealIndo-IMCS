# ADTrans RealIndo — Departmental Software Architecture

## Decision
ADTrans RealIndo will move from one monolithic IMCS frontend to **separate departmental applications**, all integrated into **one Supabase/PostgreSQL control plane**.

The existing `ADTrans-RealIndo-IMCS` repository becomes the **Enterprise Control Plane / Executive IMCS** rather than the UI for every department.

Each departmental application gets its own repository, deployment, frontend boundary, release cycle, and least-privilege permission scope. No department application gets its own production database.

## Shared backend

- Supabase project: `AD REALINDO IMCS`
- Project ref: `nfvkdqpxexfymzuwdorx`
- Shared PostgreSQL database
- Shared Supabase Auth
- Shared organization identity
- Shared RLS / RBAC / department permissions
- Shared audit trail
- Shared transaction / approval lifecycle
- Shared AI Gateway
- Shared document/evidence model

## Department applications

| Code | Department | Repository | Primary scope |
|---|---|---|---|
| BOARD | Board / Commissioner | `ADTrans-RealIndo-Board` | board oversight, strategic resolutions, governance evidence |
| EXEC | Executive Management | `ADTrans-RealIndo-Executive` | executive cockpit, KPI, decisions, alerts |
| GOV | Governance | `ADTrans-RealIndo-Governance` | governance, approvals, policies, authority matrix |
| CORPSEC | Corporate Secretary | `ADTrans-RealIndo-CorporateSecretary` | corporate records, resolutions, filings, correspondence |
| PMO | Project Management Office | `ADTrans-RealIndo-PMO` | portfolio, schedule, milestones, project controls |
| CONSTR | Construction / Site Operations | `ADTrans-RealIndo-Construction` | site execution, work packages, field evidence, progress |
| ENG | Development / Engineering | `ADTrans-RealIndo-Engineering` | engineering, design, technical review, ADEI |
| QS | Quantity Surveying / Cost Control | `ADTrans-RealIndo-QS` | BOQ, RAB, quantity, cost plan, variation |
| HSEQ | HSE / Quality / ESG | `ADTrans-RealIndo-HSEQ` | HSE, quality, ESG, inspections, incidents |
| LAND | Land Acquisition & Land Bank | `ADTrans-RealIndo-Land` | land bank, acquisition, legal status, due diligence |
| ASSET | Property & Asset Management | `ADTrans-RealIndo-Asset` | property, asset lifecycle, tenancy, maintenance |
| SALES | Sales & Marketing / CRM | `ADTrans-RealIndo-SalesCRM` | leads, prospects, reservations, customers, CRM |
| BD | Business Development / Partnership | `ADTrans-RealIndo-BusinessDevelopment` | opportunities, partnerships, service offerings |
| PROC | Procurement & Supply Chain | `ADTrans-RealIndo-Procurement` | sourcing, vendors, PO, supply chain |
| FIN | Finance & Accounting | `ADTrans-RealIndo-Finance` | GL, AP, AR, budgets, journals, closing |
| TAX | Tax | `ADTrans-RealIndo-Tax` | tax controls, tax evidence, reconciliation |
| TREAS | Treasury | `ADTrans-RealIndo-Treasury` | bank/cash, liquidity, payment batches, reconciliation |
| INV | Investment & Corporate Finance | `ADTrans-RealIndo-Investment` | investment cases, NPV/IRR/ROI, funding |
| HR | Human Resources | `ADTrans-RealIndo-HR` | employee master, organization, payroll inputs, policy |
| IT | IT & Cybersecurity | `ADTrans-RealIndo-ITSecurity` | identity, devices, cybersecurity, access, observability |
| LEGAL | Legal & Compliance | `ADTrans-RealIndo-LegalCompliance` | contracts, legal review, compliance obligations |
| RISK | Risk Management | `ADTrans-RealIndo-Risk` | enterprise/project risk, mitigation, risk appetite |
| IA | Internal Audit | `ADTrans-RealIndo-InternalAudit` | audit plans, evidence, findings, follow-up |
| DOC | Document Control | `ADTrans-RealIndo-DocumentControl` | controlled documents, versions, verification, retention |
| DATA | Data / Analytics / AI | `ADTrans-RealIndo-DataAI` | data platform, analytics, AI governance, AI agents |

## Security model

Every application must follow:

`User → Authenticated Session → Organization → Department → Role → Permission → Policy → Data Scope → Action → Audit`

Rules:

1. Never trust organization, role, or department identifiers from the browser.
2. Every sensitive query is constrained by server-side RLS.
3. Department membership comes from `user_departments`.
4. Department authority comes from `department_permissions` and `permission_catalog`.
5. High-risk actions require server-side policy checks and human confirmation.
6. Financial posting, payment, approval, permission changes, audit deletion, and privileged administration are never directly exposed to ordinary department clients.
7. `service_role`/secret keys never ship to browsers.
8. AI uses the centralized AIG Gateway; departmental apps do not call model providers directly.
9. Evidence and audit records remain centralized.
10. Cross-department reads are explicit and policy controlled.

## Data ownership

Department apps are **domain clients**, not database owners.

The database remains the system of record. A department repository owns UI, workflows, tests, adapters, and deployment configuration for its domain. It does not fork or duplicate the database schema.

## Cross-department integration

All integrations use stable IDs and shared records:

- `organization_id`
- `department_id`
- `profile_id`
- `employee_id`
- `business_line_id`
- `project_id`
- `property_id`
- `contract_id`
- `transaction_id`
- `approval_request_id`
- `ai_run_id`
- `audit_log_id`

Example:

`Sales CRM → Customer → Contract → Project → PMO → Engineering/QS → Procurement → Construction → Finance/Tax/Treasury → Asset/Property → Audit`

## Deployment topology

Production target:

- Corporate Website: public, no authenticated IMCS capabilities.
- Executive IMCS: authenticated control plane.
- Department applications: authenticated, separate deployments.
- Supabase: one shared backend.

Recommended production hostnames:

- `www.adtransrealindo.com`
- `imcs.adtransrealindo.com`
- `board.imcs.adtransrealindo.com`
- `executive.imcs.adtransrealindo.com`
- `finance.imcs.adtransrealindo.com`
- `hr.imcs.adtransrealindo.com`
- `engineering.imcs.adtransrealindo.com`
- etc.

Domain ownership/DNS is intentionally deferred until the domains are purchased and DNS access is available.

## Current migration strategy

Phase 1 — **control plane**
- Keep current `ADTrans-RealIndo-IMCS` as the enterprise control plane.
- Stabilize auth, RLS, RBAC, transaction lifecycle, AI Gateway, audit, and shared contracts.

Phase 2 — **department repositories**
- Create one GitHub repository per department listed above.
- Each repository gets a minimal independent application shell and shared Supabase client package/config.
- Each repository is independently deployable.

Phase 3 — **domain extraction**
- Move department-specific UI/workflows out of the monolith.
- Keep authoritative data and security in Supabase.
- Replace direct cross-module imports with typed API/domain clients.

Phase 4 — **production routing**
- Deploy each application separately.
- Attach department subdomains only after DNS is available.
- Verify HTTPS, authentication, RLS isolation, and critical workflows per application.

## Important constraint

The connected GitHub integration currently exposes repository/file/branch/PR operations but does **not expose a repository-creation operation**. Therefore the 25 target repository names and architecture are prepared here, but actual GitHub repository creation must be performed through a GitHub account capability that permits repository creation. No fake repository URLs are being claimed.
