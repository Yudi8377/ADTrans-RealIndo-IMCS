# ADTrans RealIndo Housing Development Platform — Implementation Plan v1.0

**Status:** Approved Working Plan  
**Priority:** P1 — Urgent Business Program  
**Parent Architecture:** ADTrans RealIndo Digital Ecosystem Master Blueprint v2.0

## 1. Objective

Build the operational platform for housing/property development while preserving compatibility with IMCS shared identity, master data, authorization, audit and executive reporting.

## 2. MVP Scope

### Wave 1 — Project Control
- Project master
- Project locations and development areas
- Cluster/block/unit hierarchy
- Project status and milestones
- Baseline schedule

### Wave 2 — Planning & Cost
- Planning/engineering records
- Drawing/specification register
- BOQ
- RAB/budget versions
- Cost codes
- Budget approval

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

### Wave 4 — Construction & Progress
- Work packages
- Contractor/subcontractor
- Daily site report
- Manpower/equipment
- Physical progress
- Milestones
- S-curve
- Schedule variance

### Wave 5 — Control
- Commitment cost
- Actual cost
- Forecast
- Cost variance
- Quality inspection
- Defect/non-conformance
- HSE inspection/incident
- Corrective action

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

## 7. Database Design Rules

- PostgreSQL system of record.
- Foreign keys for relationships.
- RLS for organization/department/user-scoped data.
- Immutable/reference-safe audit records for material actions.
- Versioned migrations.
- No secrets in frontend.
- Transactional integrity for financial and inventory operations.

## 8. Executive Reporting

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
- unit inventory/sales when commercial modules are enabled.

## 9. Testing Gate

Before release of each wave:

1. Migration/build validation.
2. Seed/master-data validation.
3. CRUD and validation tests.
4. Permission positive/negative tests.
5. RLS tests.
6. Workflow/approval tests.
7. Reconciliation tests for cost/inventory/progress.
8. E2E browser tests for critical journeys.
9. Responsive/error-state tests.
10. Runtime and deployment verification.
11. Business owner acceptance.

## 10. Delivery Rule

Do not wait for complete legacy data to build the application. Build schema, workflow, validation and test fixtures first. Real data is introduced through controlled migration/import after Extract → Stage → Validate → Map → Transform → Reconcile → Promote.

## 11. Immediate Next Build Sequence

1. Inspect current repository/application structure.
2. Map existing IMCS tables and reusable core entities.
3. Define housing schema/migrations without duplicating core masters.
4. Implement Project + Estate/Unit foundation.
5. Implement Planning + BOQ/RAB foundation.
6. Implement Procurement + Material/Inventory.
7. Implement Construction + Progress.
8. Implement Cost + QC/HSE control.
9. Integrate executive reporting into IMCS.
10. Execute automated and browser verification at every release gate.

**Operating principle:** build the urgent housing capability now, but build it as a durable component of the ADTrans RealIndo digital ecosystem.