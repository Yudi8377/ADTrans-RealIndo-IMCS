# ADTrans RealIndo — Enterprise Operating Model V3

## 1. Purpose

ADTrans RealIndo is designed as a corporate operating platform, not only a dashboard. The target architecture separates:

1. **Corporate Website** — public portfolio, reputation, business development and validated public information.
2. **Business Gateway** — controlled intake for investment, land, partnership, project, vendor and property opportunities.
3. **ADTrans RealIndo IMCS** — internal management control system.
4. **Department Workspaces** — role-specific applications/workspaces integrated into IMCS.
5. **Project Intelligence & AI** — decision-support layer for feasibility, forecasting, risk and scenario analysis.
6. **Enterprise Data & Governance Layer** — source-of-truth data, audit, permissions, document control and reporting.

The governing principle is: **one source of truth, least privilege, evidence before decision, and human approval for material decisions.**

## 2. Departmental operating model

### Executive / Board
- Executive Cockpit
- strategic objectives
- portfolio allocation
- liquidity and capital position
- project health
- enterprise risk
- management alerts
- decision register
- scenario simulation

Privileges: enterprise-wide read; decision/approval rights according to authority matrix; no uncontrolled raw-data modification.

### Corporate Secretary / Governance
- board/committee agenda
- resolutions
- corporate actions
- approval matrix
- policy register
- governance calendar
- evidence repository

Privileges: governance records and controlled approvals; no finance transaction editing unless separately authorized.

### PMO / Project Management Office
- project portfolio
- stage gates
- master schedule
- milestones
- change control
- project health
- dependencies
- project reporting

Privileges: project planning/control; cannot approve its own financial changes.

### Land Acquisition & Land Bank
- land pipeline
- landowner submissions
- acquisition screening
- legal status
- zoning
- valuation
- encumbrance
- due diligence
- land document control

Privileges: land records within assigned organization/project scope; sensitive legal/financial fields are segmented.

### Development / Engineering
- feasibility
- design control
- permits
- technical scope
- WBS
- schedule
- progress
- change requests
- technical document control

Privileges: technical/project data; commercial approval remains separated.

### Construction / Site Operations
- daily reports
- manpower
- equipment
- material receipt/use
- work progress
- quality
- safety/HSE
- weather impact
- site evidence/photos
- subcontractor performance

Privileges: operational project data; no authority to alter approved budget or contract value.

### Quantity Surveying / Cost Control
- BoQ
- cost plan
- tender comparison
- committed cost
- actual cost
- forecast at completion
- variation/change order
- material price intelligence

Privileges: cost and quantity control; approval remains with delegated authority.

### Procurement / Supply Chain
- vendor master
- RFQ/RFP
- tender
- bid comparison
- purchase requests
- purchase orders
- delivery
- supplier performance
- price index

Privileges: procurement workflow with segregation from invoice approval and payment release.

### Finance & Accounting
- chart of accounts
- journal/ledger integration
- AP/AR
- project accounting
- budget vs actual
- cash flow
- management accounts
- consolidation
- financial close

Privileges: finance data by entity/organization; posting and approval separated.

### Tax
- tax mapping
- tax calendar
- transaction tax classification
- VAT/PPN controls
- withholding/PPh controls
- tax reconciliation
- tax evidence
- filing readiness
- tax exposure alerts

The tax engine must be **rules-versioned by effective date** and treated as decision support until reviewed by authorized tax/accounting personnel. Integration with government systems must use officially supported channels/credentials; the system must never store government credentials in the browser.

### Treasury
- bank/cash position
- payment queue
- cash forecast
- debt/financing schedule
- covenant monitoring
- liquidity stress tests

Privileges: payment preparation and approval must be separated; high-value payments require maker-checker/dual authorization.

### Investment / Corporate Finance
- investment pipeline
- investment case
- assumptions
- IRR/NPV/ROI
- sensitivity
- scenario analysis
- funding structure
- partner/investor due diligence
- investment committee workflow

Privileges: investment cases; final capital allocation remains subject to authority matrix.

### Sales / Marketing / CRM
- project inventory
- lead management
- customer/buyer inquiry
- campaign performance
- sales pipeline
- booking/reservation workflow
- conversion analytics

Privileges: customer and sales data only; no access to unrelated finance/legal/risk records.

### Legal & Compliance
- contracts
- obligations
- permits
- licenses
- legal due diligence
- compliance register
- regulatory obligations
- dispute register
- legal document versions

Privileges: legal records; privileged documents are separately controlled.

### Risk Management
- enterprise risk register
- project risk register
- risk scoring
- mitigation actions
- KRIs
- scenario analysis
- risk appetite
- early warning system

Privileges: risk read across the enterprise; controlled write access to risk records.

### Internal Audit
- audit plan
- audit workpapers
- findings
- remediation
- evidence
- audit trail review

Privileges: read-only enterprise evidence by default, with controlled audit annotations. Internal Audit must not be able to erase operational evidence.

### HSE / Quality / ESG
- safety observations
- incidents
- inspections
- quality NCR/CAR
- environmental controls
- ESG metrics
- sustainability reporting

Privileges: project/site operational controls and evidence; sensitive personnel data remains segregated.

### Human Resources
- organization structure
- workforce planning
- employee lifecycle
- competency
- attendance/integration
- payroll integration boundary
- training
- performance

Privileges: HR data is highly restricted and never exposed to general department users.

### IT / Cybersecurity / Data
- identity and access
- device/session control
- security events
- integration monitoring
- data quality
- backup/restore governance
- AI/data pipeline
- system configuration

Privileges: platform administration under separate break-glass controls. Administrative actions must be audited.

### Data, Analytics & AI Office
- enterprise data catalog
- data quality
- forecasting
- AI models
- model monitoring
- scenario engine
- management intelligence

Privileges: analytical access through governed datasets; raw sensitive data access is minimized.

## 3. One platform, many workspaces

Do **not** build every department as an isolated application with separate databases. That would create duplicate master data, inconsistent permissions and high maintenance cost.

Use one ADTrans platform with:

- common identity
- common organization/entity model
- common project ID
- common document ID
- common vendor/customer/partner master
- common audit trail
- common notification engine
- common workflow engine
- common AI/intelligence layer
- department-specific workspace UI
- department-specific permissions

The user sees only the modules and actions granted to their role.

## 4. Authorization model

Use four dimensions together:

1. **RBAC** — role-based access.
2. **ABAC** — organization, department, project, location, sensitivity and record attributes.
3. **SoD** — segregation of duties.
4. **Approval authority** — transaction/decision limits by role and amount.

Example:

`Procurement Staff` may create RFQ → may not approve vendor → may not approve payment.

`Project Manager` may submit change request → may not approve a change above authority limit.

`Finance Staff` may prepare payment → `Treasury Manager` verifies → authorized executive releases.

`Internal Auditor` can inspect evidence → cannot delete evidence.

## 5. Project Intelligence Engine

Every material project should have a continuously updated **Project Intelligence Profile**.

### Internal factors
- land cost
- acquisition cost
- development cost
- BoQ
- labor
- material
- equipment
- contractor/subcontractor
- financing cost
- sales assumptions
- absorption rate
- GDV
- cash flow
- tax assumptions
- contract exposure
- permits
- schedule
- risks
- contingencies

### External factors
- weather
- extreme-weather warnings
- rainfall seasonality
- earthquake/geohazard information where available
- material price movement
- inflation
- interest rates
- exchange rates
- construction labor market
- fuel/logistics costs
- property market indicators
- population/demographic indicators
- infrastructure plans
- government policy
- zoning/regulation
- tax/regulatory changes
- financing environment
- competitor/project supply
- local economic indicators

## 6. Weather intelligence

For Indonesian projects, integrate official BMKG data through a server-side ingestion layer. BMKG provides open forecast data at village/kelurahan level and updates it twice daily; it also publishes severe-weather warnings. The application must display BMKG attribution where required. Forecast data should be cached into a project-weather table and linked to project milestones rather than called directly from every browser session.

Weather impact logic should estimate:

- probable lost working days
- affected activities
- expected schedule variance
- expected cost variance
- safety escalation
- concrete/earthwork/logistics constraints

Weather is a probability input, not a deterministic promise.

## 7. Material price intelligence

Create a **Material Price Index** with:

- material category
- specification/grade
- location
- supplier/source
- quotation date
- unit
- current price
- historical price
- confidence
- source type
- validity period

The forecast engine can then produce:

`Base Case / Upside / Downside / Stress Case`

and calculate the effect on:

- project cost
- gross margin
- cash requirement
- IRR/NPV
- completion date

No AI-generated price may become an approved budget without human validation and source evidence.

## 8. Regulation and policy intelligence

Create a **Regulatory Intelligence Register** with:

- regulation/source
- issuing authority
- effective date
- expiry/replacement date
- affected business area
- affected project(s)
- required action
- responsible department
- evidence
- impact assessment

The AI layer can summarize and classify changes, but legal/compliance personnel approve the interpretation.

## 9. Tax architecture

Tax should be a first-class module, not a spreadsheet afterthought.

Capabilities:

- tax calendar
- transaction classification
- tax basis mapping
- tax provision
- tax reconciliation
- tax exposure
- tax document/evidence
- project tax simulation
- scenario comparison
- filing readiness
- audit support

Indonesia's Coretax DJP is the current central tax administration platform; ADTrans should integrate through supported official processes rather than attempting to bypass or automate government authentication insecurely.

## 10. Forecasting engine

The platform should maintain three layers:

### Operational forecast
- schedule forecast
- cost-to-complete
- cash requirement
- procurement lead time
- resource requirement

### Financial forecast
- revenue
- EBITDA/project profit
- cash flow
- funding gap
- IRR/NPV/ROI
- covenant headroom
- tax impact

### Strategic forecast
- market absorption
- price sensitivity
- macroeconomic sensitivity
- regulatory impact
- climate/weather risk
- capital allocation impact
- portfolio concentration

Use a combination of deterministic calculations, scenario analysis, Monte Carlo simulation where appropriate, and machine-learning models only when enough historical data exists. Do not pretend an ML model is reliable before the organization has sufficient quality history.

## 11. Project Prospect Score

Create a transparent **Project Prospect Score 0–100** with visible components:

- Legal & land certainty — 15
- Market/absorption — 15
- Financial return — 20
- Funding/liquidity — 10
- Cost/supply-chain resilience — 10
- Schedule/delivery feasibility — 10
- Regulatory/permitting — 5
- Risk/HSE/ESG — 5
- Strategic fit — 5
- Data confidence — 5

The score must never be a black box. Management can inspect every contributing factor, source, timestamp and assumption.

Recommended decision bands:

- **80–100: GO / PRIORITY**
- **65–79: GO WITH CONDITIONS**
- **50–64: HOLD / REWORK**
- **0–49: NO-GO / ESCALATE**

A hard-stop gate can override the score, for example unresolved land title, prohibited zoning, unacceptable legal exposure or funding impossibility.

## 12. AI Management Copilot

AI should answer questions such as:

- "Apakah proyek ini masih layak jika harga semen naik 12%?"
- "Apa dampak hujan tinggi terhadap milestone bulan November?"
- "Berapa tambahan cash requirement jika proyek terlambat 45 hari?"
- "Apa kontrak yang berpotensi jatuh tempo sebelum milestone?"
- "Apa perubahan regulasi yang dapat mempengaruhi proyek ini?"
- "Apa risiko terbesar terhadap margin?"
- "Bandingkan Base, Downside dan Stress Case."
- "Mengapa forecast margin turun?"
- "Apa yang harus dilakukan manajemen minggu ini?"

AI must provide **answer + evidence + assumptions + confidence + affected records + recommended action**.

AI must not autonomously approve investment, payments, contracts, tax filings or material changes.

## 13. Management reporting

Standard reports:

- Daily Project Flash
- Weekly Project Control Report
- Monthly Management Report
- Monthly Financial Close
- Cash Flow Forecast
- Budget vs Actual vs Forecast
- Project Cost-to-Complete
- Portfolio Performance
- Investment Committee Pack
- Risk Heatmap
- Compliance Dashboard
- Tax Calendar & Exposure
- Procurement Savings/Variance
- Sales Funnel & Absorption
- HSE/Quality Report
- ESG Report
- Board/Commissioner Pack
- Audit Pack

All reports must identify data period, source, owner, last refresh and confidence/data-quality status.

## 14. Security architecture

### Identity
- Supabase Auth initially
- MFA for privileged roles
- short-lived sessions
- session/device monitoring
- account lifecycle controls

### Authorization
- RLS at database layer
- RBAC + ABAC
- least privilege
- explicit grants
- department/project/organization boundaries
- approval authority matrix

### Application boundary
- public website never accesses internal tables
- public submissions go to controlled intake tables/functions
- privileged operations execute server-side
- secret/service-role keys never reach browser/mobile builds

### Data security
- encryption in transit
- encrypted storage where appropriate
- sensitive document buckets private
- signed URLs with short expiry
- document classification
- immutable/auditable event trail
- backup and recovery testing

### Operational security
- security monitoring
- rate limiting
- bot protection on public forms
- input validation
- file type/size scanning
- malware scanning for uploads
- anomaly detection
- break-glass administration
- periodic access review
- dependency/security scanning

## 15. AI security

The AI layer must follow:

`User → Authorization → Retrieval Scope → Data Filter → AI → Evidence Check → Response`

Never:

`User → AI → unrestricted database`

AI retrieval must respect the same organization, department, project and sensitivity boundaries as the user.

The AI must not be allowed to retrieve a document simply because it exists in the database.

## 16. Business continuity

Plan for:

- internet outage
- Supabase outage
- external API outage
- BMKG/API data delay
- corrupted data
- accidental deletion
- credential compromise
- ransomware/malware on uploaded documents
- bad migration
- AI provider outage
- model degradation
- vendor lock-in

Every critical integration needs a fallback state. For example, if weather data is unavailable, the system shows the last verified observation and marks the forecast as stale rather than inventing a value.

## 17. Data quality and provenance

Every external intelligence record should carry:

- source
- source URL/reference
- retrieved_at
- effective_at
- valid_until where known
- transformation version
- confidence
- reviewer if required

The platform follows:

**Extract → Stage → Validate → Map → Transform → Reconcile → Promote**

No unvalidated external or legacy record becomes a source-of-truth operational record.

## 18. Target user experience

The same employee account can access a mobile/web workspace appropriate to their role.

Examples:

- Site Engineer sees Site Operations, HSE, Quality, Progress and Weather.
- QS sees BoQ, Cost Control, Procurement and Forecast.
- Finance sees Accounting, Cash, Budget, Tax and Project Finance.
- Legal sees Contracts, Due Diligence and Compliance.
- CEO sees Executive Cockpit, Portfolio, Cash, Risk and AI Copilot.
- Internal Audit sees evidence, controls and audit trails.

The interface should not merely hide buttons. The database/API must enforce the same permissions.

## 19. Implementation sequence

### Phase A — Foundation
- identity
- organizations
- departments
- roles
- permissions
- audit
- document control
- project master
- employee master

### Phase B — Core operations
- land
- project
- development
- procurement
- construction
- cost control
- contracts
- finance

### Phase C — Governance
- approvals
- risk
- compliance
- internal audit
- tax
- treasury

### Phase D — Intelligence
- weather
- material prices
- market indicators
- regulations
- macroeconomic feeds
- forecasting
- scenario engine

### Phase E — AI
- governed retrieval
- project copilot
- management copilot
- automated anomaly detection
- report generation
- predictive models

### Phase F — Mobile / field
- mobile/PWA field application
- offline-first evidence capture
- photo/document upload
- daily reports
- HSE incidents
- approvals
- push notifications

## 20. Non-negotiable design principles

1. **No fabricated data.**
2. **No hidden AI assumptions.**
3. **No browser-side secrets.**
4. **No direct public access to internal operational tables.**
5. **No single person should control an end-to-end high-risk transaction.**
6. **Every material decision must be traceable to evidence.**
7. **Every forecast must expose assumptions and confidence.**
8. **Every external data point must have provenance.**
9. **Every permission must be enforceable at the database/API layer.**
10. **Human management remains accountable for material decisions.**

## 21. Current security exception requiring explicit decision

At the time this architecture was prepared, Supabase Security Advisor reports that `legacy_staging.import_batches` and `legacy_staging.raw_records` have Row Level Security disabled. These staging tables are therefore potentially exposed to the `anon` and `authenticated` roles if grants permit it.

The remediation is intentionally **not auto-applied** because enabling RLS without correctly designed policies can break the existing legacy import workflow. Before production use, this must be resolved by either:

- enabling RLS and defining narrowly scoped policies, or
- removing Data API exposure/grants from the staging schema and keeping staging server-side only.

This exception must be closed before declaring the system fully production-hardened.
