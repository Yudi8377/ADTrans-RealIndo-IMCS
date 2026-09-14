# ADTrans RealIndo Housing Development Platform — Implementation Plan v1.0

**Status:** Approved Working Plan  
**Priority:** P1 — Urgent Business Program  
**Parent Architecture:** ADTrans RealIndo Digital Ecosystem Master Blueprint v2.0

## 1. Objective

Build the operational platform for housing/property development while preserving compatibility with IMCS shared identity, master data, authorization, audit and executive reporting.

The platform is multi-device by design: office workflows support desktop/laptop, while field workflows are optimized for tablet/mobile and prepared for smart-glass/AR operation.

## 2. MVP Scope

### Wave 1 — Project Control
- Project master
- Project locations and development areas
- Cluster/block/unit hierarchy
- Project status and milestones
- Baseline schedule
- Tablet-first project dashboard

### Wave 2 — Planning & Cost
- Planning/engineering records
- Drawing/specification register
- BOQ
- RAB/budget versions
- Cost codes
- Budget approval
- Responsive engineering/document views

### Wave 3 — Procurement & Material
- Vendor master
- Material master
- Material request
- Purchase request
- RFQ/vendor evaluation
- Purchase order
- Goods receipt
- Warehouse issue/transfer
- Material traceability
- Tablet/scanner-friendly warehouse workflows

### Wave 4 — Construction & Progress
- Work packages
- Contractor/subcontractor
- Daily site report
- Manpower/equipment
- Physical progress
- Milestones
- S-curve
- Schedule variance
- Field photo/video evidence
- Offline draft/sync foundation
- Smart-glass-ready field evidence contract

### Wave 5 — Control
- Commitment cost
- Actual cost
- Forecast
- Cost variance
- Quality inspection
- Defect/non-conformance
- HSE inspection/incident
- Corrective action
- Tablet-first QC/HSE checklists

## 3. Phase 2 Lifecycle Modules

- Sales/CRM
- Unit inventory
- Booking
- Customer management
- Handover
- Warranty/after-sales
- Property/asset management

## 4. Cross-Module Contracts

Every module must reference shared identifiers where applicable:

- organization_id
- department_id
- project_id
- user/employee id
- vendor_id
- customer_id
- property/unit id
- document/reference id
- device/session correlation id where field evidence requires it

No module may create a duplicate authoritative master for an existing shared entity without an explicit architecture decision.

## 5. Key Transaction Chains

### Procurement
Material Request → Purchase Request → Review → Approval → RFQ → Vendor Selection → PO → Delivery → Receipt → Warehouse

### Construction
Work Package → Assignment → Daily Report → Quantity/Progress → Verification → Approved Progress

### Cost
Budget → Commitment → Actual → Forecast → Variance → Management Alert

### Quality
Inspection → Finding → Corrective Action → Re-inspection → Closure

### HSE
Inspection/Incident → Risk/Action → Corrective Action → Verification → Closure

## 6. Permission Model

Default principle: users receive only the access required for their organization, department, role and assigned responsibilities.

Examples:

- Project team: project-scoped operational access.
- Procurement: procurement transactions and vendor data.
- Finance: financial/cost records according to finance permissions.
- Department heads: approval/review within delegated authority.
- Executives: controlled management visibility.
- Auditor: read/audit visibility without operational mutation.
- Field device user: only assigned project/work-package/site scopes.
- Smart-glass session: same authorization as the authenticated user; device capability never grants additional business permission.

## 7. Database Design Rules

- PostgreSQL system of record.
- Foreign keys for relationships.
- RLS for organization/department/user-scoped data.
- Immutable/reference-safe audit records for material actions.
- Versioned migrations.
- No secrets in frontend/client packages.
- Transactional integrity for financial and inventory operations.
- Local device storage is cache/draft/sync queue only, never authoritative corporate data.

## 8. Multi-Device / Field Architecture

### 8.1 Supported experience tiers

| Tier | Devices | Design priority |
|---|---|---|
| Office | Desktop PC, laptop | Full operational workspace |
| Mobile | Smartphone | Approval, alerts, quick actions |
| Field | Android/iPad-class tablet | Primary site workflow |
| Field Intelligence | Smart Glass / AR | Hands-free evidence and guided work |

### 8.2 Field-first design requirements

Tablet and mobile screens must support large touch targets, readable typography, fast search, minimal typing, camera upload, clear connectivity state, resilient form drafts and explicit sync status.

### 8.3 Offline/sync contract

```text
Device
 → Local Draft
 → Validation
 → Sync Queue
 → Authenticated API
 → Server Validation
 → Central PostgreSQL
 → IMCS / Audit / AI
```

Each syncable record requires an idempotency key/correlation identifier. Conflict rules must be defined per transaction type. Unsupported offline transactions must remain unavailable rather than being silently queued as if they were safe.

### 8.4 Smart-glass readiness

The first field release should define device-independent contracts for:

- voice command;
- speech-to-structured-report;
- camera/evidence capture;
- task/checklist presentation;
- drawing/document lookup;
- contextual project/work-package lookup;
- safety and quality observations.

Smart-glass implementation may use a device-specific adapter, but it must call the same secure backend and AIG Gateway as tablet/mobile clients.

AI can classify/summarize evidence and recommend actions. It cannot bypass human approval, RLS, role scope or segregation of duties.

## 9. Executive Reporting

Minimum dashboard metrics:

- project status;
- physical progress;
- schedule variance;
- budget vs commitment vs actual;
- forecast cost;
- procurement status;
- material availability;
- quality findings;
- HSE incidents;
- critical risks/issues;
- unit inventory/sales when commercial modules are enabled;
- field evidence/sync health where operationally relevant.

## 10. AI Integration

Each released housing domain should expose a controlled intelligence contract to the AIG Gateway:

- Project Manager AI — milestones, delays, risks and delivery summary.
- Planning/Engineering AI — documents, revisions, BOQ consistency.
- Cost Controller AI — budget/commitment/actual/forecast variance.
- Procurement AI — vendor, price and lead-time analysis.
- Warehouse AI — demand, stock risk and abnormal consumption.
- Construction AI — daily report, progress and field evidence analysis.
- Quality AI — findings, defects and corrective actions.
- HSE AI — observations, incidents and safety risk patterns.
- Executive Intelligence — authorized aggregate project intelligence.

All AI outputs distinguish facts, assumptions and recommendations. Material actions remain human-controlled.

## 11. Testing Gate

Before release of each wave:

1. Migration/build validation.
2. Seed/master-data validation.
3. CRUD and validation tests.
4. Permission positive/negative tests.
5. RLS tests.
6. Workflow/approval tests.
7. Reconciliation tests for cost/inventory/progress.
8. E2E browser tests for critical journeys.
9. Responsive/error-state tests on desktop/tablet/mobile.
10. Offline/sync tests for supported field workflows.
11. Camera/attachment tests where used.
12. Smart-glass adapter/contract tests before pilot.
13. Runtime and deployment verification.
14. Business owner acceptance.

## 12. Delivery Rule

Do not wait for complete legacy data to build the application. Build schema, workflow, validation and test fixtures first. Real data is introduced through controlled migration/import after Extract → Stage → Validate → Map → Transform → Reconcile → Promote.

## 13. Immediate Next Build Sequence

1. Inspect current repository/application structure.
2. Map existing IMCS tables and reusable core entities.
3. Define housing schema/migrations without duplicating core masters.
4. Implement Project + Estate/Unit foundation.
5. Implement Planning + BOQ/RAB foundation.
6. Implement Procurement + Material/Inventory.
7. Implement Construction + Progress.
8. Implement Cost + QC/HSE control.
9. Implement tablet-first field shell and evidence capture.
10. Implement offline/sync foundation for approved field transactions.
11. Integrate executive reporting into IMCS.
12. Implement AIG contracts and first departmental intelligence agents.
13. Run automated and browser verification at every release gate.
14. Pilot smart-glass interface against defined Construction/QC/HSE scenarios.

**Operating principle:** build the urgent housing capability now, but build it as a durable component of the ADTrans RealIndo digital ecosystem. Device channels are replaceable interfaces; the central data, security, workflow and governance contracts are authoritative.