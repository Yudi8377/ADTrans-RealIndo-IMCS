# ADTrans RealIndo Digital Ecosystem — Master Blueprint v2.0

**Status:** Master Reference / Working Blueprint  
**Date:** 14 September 2026  
**Scope:** Corporate Website + ADTrans RealIndo IMCS + Housing Development Management Platform + Departmental Business Systems

---

## 1. Executive Direction

ADTrans RealIndo will be developed as one controlled digital ecosystem with two public-facing/internal boundaries:

- **Corporate Website:** external corporate presence, portfolio, services, projects, brand and business communication.
- **ADTrans RealIndo IMCS:** internal management, control, governance, reporting, audit and executive decision-support platform.
- **Housing Development Management Platform:** urgent operational priority for property/housing development, designed from day one to synchronize with IMCS shared master data and corporate controls.

The system must not become a collection of disconnected applications. Shared identity, organization, master data, permissions, workflow, audit, reporting and integration services form the common platform.

## 2. Target Product Architecture

```text
ADTRANS REALINDO DIGITAL ECOSYSTEM
│
├── Corporate Website
│   ├── Company Profile
│   ├── Services / Business Lines
│   ├── Portfolio / Projects
│   ├── News / Updates
│   └── Contact / Business Development
│
└── IMCS CORE
    ├── Identity & Access
    ├── Organization & Departments
    ├── Employee / User Master
    ├── Roles & Permissions
    ├── Workflow & Approval
    ├── Documents
    ├── Notifications
    ├── Audit Trail
    ├── Reporting / KPI
    └── Integration / AIG Gateway
         │
         ├── Housing Development Platform
         ├── Finance & Accounting
         ├── Procurement
         ├── HR
         ├── Legal
         ├── Sales / CRM
         ├── Fleet / Transportation
         ├── Property / Asset
         ├── Project Management
         ├── IT / GA
         ├── HSE / Quality
         └── Internal Audit
```

## 3. Core Data Principle

The database must follow a **shared-core, domain-module** model rather than creating isolated databases for every department.

```text
USER → ORGANIZATION → DEPARTMENT → ROLE → PERMISSION → DATA → AUDIT
                                  │
                                  └── BUSINESS MODULES
```

Shared master data includes organization, department, employee/user, project, vendor, customer, property/unit, document and other approved corporate references.

Domain tables belong to their business modules but retain referential links to shared core entities.

## 4. Housing Development Management Platform — Priority 1

The urgent property/housing system will cover the complete development lifecycle:

```text
LAND
 ↓
LEGAL / DUE DILIGENCE
 ↓
MASTERPLAN / PLANNING
 ↓
DESIGN / ENGINEERING
 ↓
RAB / BOQ / BUDGET
 ↓
PROCUREMENT
 ↓
MATERIAL / WAREHOUSE
 ↓
CONSTRUCTION
 ↓
QC / HSE
 ↓
PROGRESS & COST CONTROL
 ↓
SALES / CUSTOMER
 ↓
HANDOVER
 ↓
WARRANTY / AFTER-SALES
 ↓
PROPERTY / ASSET MANAGEMENT
```

### 4.1 Housing modules

1. **Project Master** — project, location, developer/owner, target, schedule and status.
2. **Land & Legal** — land parcels, ownership, certificates, due diligence, permits and legal documents.
3. **Masterplan & Estate** — clusters, blocks, lots, units, house types and development areas.
4. **Planning & Engineering** — drawings, specifications, revisions, BOQ and engineering documents.
5. **RAB / Budget Control** — budget versions, cost codes, BOQ, approved budget and variance.
6. **Construction Management** — work packages, contractors, daily reports, manpower, equipment and progress.
7. **Procurement** — material request, PR, RFQ, vendor evaluation, PO, delivery and approval.
8. **Warehouse / Material** — receipts, issues, transfers, allocations, stock opname and traceability.
9. **Quality Control** — inspections, checklists, defects, corrective action and re-inspection.
10. **HSE** — inspections, incidents, toolbox meetings, PPE and corrective actions.
11. **Schedule & Progress** — baseline schedule, actual progress, milestones, S-curve and variance.
12. **Cost Control** — committed cost, actual cost, forecast, variance and cash requirement.
13. **Sales / CRM** — leads, prospects, units, booking, customer and sales pipeline.
14. **Handover** — completion, snagging, handover checklist, customer acceptance and warranty.
15. **Warranty / After-Sales** — defects, tickets, SLA and resolution tracking.
16. **Project Reporting** — executive dashboard, progress, cost, risk, schedule and exception reporting.

## 5. Departmental Software Roadmap

### Corporate / Executive
- Executive Cockpit
- KPI and alerts
- Strategic initiatives
- Decision-support reporting
- Governance oversight

### Finance & Accounting
- Budget
- Cash flow
- AR/AP
- Project cost integration
- Payment control
- Financial reporting

### Procurement
- Vendor master
- PR/RFQ/PO
- Approval workflow
- Vendor performance
- Procurement analytics

### Human Resources
- Employee master
- Organization / position
- Attendance / leave integration
- Performance
- Training
- HR reporting

### Legal
- Contract management
- Legal documents
- Permits
- Compliance obligations
- Case tracking
- Expiry alerts

### Sales / Marketing
- CRM
- Leads
- Customer
- Unit inventory
- Booking / sales pipeline
- Campaign reporting

### Property / Asset
- Property master
- Unit / tenant
- Lease
- Asset register
- Maintenance
- Occupancy / utilization

### Fleet / Transportation
- Vehicle
- Driver
- Trip / assignment
- Fuel
- Maintenance
- Fleet cost

### Project Management
- Project portfolio
- Task / milestone
- Resource
- Schedule
- Risk / issue
- Project reporting

### IT / General Affairs
- IT assets
- Access requests
- Service tickets
- Facilities
- Inventory
- Administration requests

### HSE / Quality
- Inspection
- Incident
- Non-conformance
- Corrective action
- Compliance evidence

### Internal Audit
- Audit plan
- Audit scope
- Findings
- Risk rating
- Remediation
- Follow-up and closure

## 6. Housing-to-IMCS Synchronization

The housing platform must expose controlled management information to IMCS without duplicating authoritative master data.

Example chain:

```text
Housing Project
 → BOQ / Budget
 → Procurement
 → PO / Commitment
 → Warehouse
 → Construction Usage
 → Physical Progress
 → Actual Cost
 → Cost Variance
 → Project Risk
 → Executive Dashboard
```

The objective is that Directors and authorized executives can see the business impact of operational transactions without directly receiving unrestricted departmental access.

## 7. Security & Governance

Security is a non-negotiable architecture requirement.

- Supabase Auth for identity.
- PostgreSQL as the system of record.
- Row Level Security on exposed business tables.
- Least privilege and deny-by-default for sensitive operations.
- Role + department + organization scoping.
- Server-side privileged operations only.
- No service-role/secret credentials in browser code.
- Audit trail for administrative and material transactions.
- Separation of duties for approval-sensitive processes.
- Account activation/deactivation and session lifecycle controls.
- Backup/recovery and operational monitoring before production acceptance.

Authorization must never rely on editable user metadata. Database policies and server-side authorization must be authoritative.

## 8. Role Model

Baseline roles:

- SUPER_ADMIN
- DIRECTOR
- COMMISSIONER
- EXECUTIVE
- DEPARTMENT_HEAD
- MANAGER
- STAFF
- AUDITOR

Role assignment is explicit. Department and organization boundaries further constrain access.

## 9. Workflow Standard

Every material business transaction should follow a controlled lifecycle where appropriate:

```text
DRAFT → SUBMITTED → REVIEW → APPROVED / REJECTED → EXECUTED → VERIFIED → CLOSED
```

Not every record needs every state, but approval-sensitive transactions must be traceable from request to final disposition.

## 10. Auditability

For important transactions, retain at minimum:

- who performed the action;
- when it happened;
- what record changed;
- previous/new state where applicable;
- approval/rejection decision;
- relevant organization/department context;
- correlation/reference number.

## 11. AI / AIG Gateway

AI is a controlled intelligence layer, not an authorization authority.

Use cases may include:

- management summarization;
- project progress analysis;
- cost/schedule anomaly detection;
- forecasting support;
- document summarization;
- management reporting;
- risk signals;
- decision-support recommendations.

Human approval remains required for high-impact decisions. AI must respect the same access boundary as the requesting user.

## 12. Technology Baseline

Current repository foundation is Vite + JavaScript frontend, Supabase PostgreSQL/Auth/RLS, GitHub Actions CI/CD and GitHub Pages deployment architecture. The existing IMCS repository already defines an application scope around property/real-estate management, investment, development and management control.

The implementation should preserve a clean separation between public corporate experience and authenticated internal operations.

## 13. Development Strategy

### Phase A — Architecture & shared foundation
- Confirm domain model.
- Confirm shared master data.
- Confirm permission matrix.
- Establish module boundaries.
- Establish migration/versioning strategy.

### Phase B — Housing MVP
- Project
- Land
- Planning
- RAB/BOQ
- Procurement
- Material
- Construction
- Progress

### Phase C — Housing Control
- Cost control
- QC
- HSE
- Schedule
- Reporting

### Phase D — Commercial & Lifecycle
- Property/unit
- CRM
- Booking/sales
- Handover
- Warranty

### Phase E — Corporate Integration
- IMCS executive dashboards
- Finance/HR/Legal/Procurement integration
- Audit and governance

### Phase F — Intelligence
- AIG gateway
- analytics
- anomaly detection
- forecasting
- decision support

## 14. Engineering Quality Gates

A feature is not considered complete because the UI renders.

Each production-bound module must pass, as applicable:

1. Build validation.
2. Schema/migration validation.
3. Unit/integration testing.
4. Authentication testing.
5. Positive and negative authorization testing.
6. RLS testing.
7. Workflow/approval testing.
8. Browser/E2E testing for critical journeys.
9. Responsive UI verification.
10. Error/empty/loading-state verification.
11. Deployment verification.
12. Runtime verification.
13. Security review.
14. Business acceptance.

Production status must be reported using evidence, not assumption.

## 15. Data Migration Principle

Legacy data must never be fabricated or promoted blindly.

Required gate:

**Extract → Stage → Validate → Map → Transform → Reconcile → Promote**

This remains the standard for future Access/Excel/legacy-system migrations.

## 16. Deployment Strategy

Target architecture:

- `www.adtransrealindo.com` — Corporate Website.
- `imcs.adtransrealindo.com` — Internal IMCS.

The two domains require clear security boundaries. Hosting, DNS, HTTPS, environment variables, deployment artifact, rollback and runtime checks must be verified before declaring production go-live.

## 17. Definition of Done — Ecosystem

The ecosystem is considered operationally ready when:

- Corporate Website is live and verified on the official domain.
- IMCS authentication works with verified users.
- Organization, department, roles and permissions are enforced.
- RLS and privileged server-side operations are tested.
- Housing project workflows work end-to-end.
- Procurement, material, construction, progress and cost data reconcile.
- Executive dashboards show controlled management information.
- Audit trails exist for material actions.
- Backup/recovery and monitoring are documented and tested.
- User training/SOPs exist for released modules.
- Business owners complete acceptance testing.

## 18. Current Strategic Decision

The final hardening of the existing IMCS core may be **temporarily sequenced behind the urgent Housing Development Platform**, but the IMCS architecture remains the corporate target and shared governance layer.

The housing system is therefore built as a **first-class business module/platform aligned to the IMCS data and security model**, not as a disposable standalone application.

## 19. CTO Operating Rule

All future work follows:

> **Analyze → Architect → Build → Test → Verify → Document → Release → Monitor → Improve**

No feature is declared production-ready without evidence.

---

**Document control:** This blueprint is the master technical/business reference. Changes to core architecture, security boundaries, data ownership or cross-module contracts should be recorded as controlled revisions.
