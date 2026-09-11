# ADTrans RealIndo Enterprise Intelligence V3

## Purpose

ADTrans RealIndo is designed as an enterprise operating platform, not only a dashboard. The platform shall connect corporate portfolio, secure business intake, department applications, project controls, finance/tax, forecasting, external intelligence, AI and field operations while preserving strict trust boundaries.

## Project Foresight Engine

A project is evaluated using evidence and scenarios across:

- Land title, ownership, encumbrance, zoning, spatial constraints and acquisition terms.
- Permits, regulatory changes, government policy, local rules and effective dates.
- Market demand, absorption, pricing, competitor pipeline, demographics and accessibility.
- Design maturity, constructability, technology choices and scope stability.
- Schedule, critical path, procurement lead times, contractor capacity and productivity.
- Weather, climate and disaster exposure: rainfall, extreme weather, heat, flooding, wind and site-specific hazards.
- Material and equipment prices, logistics, import exposure, FX and commodity sensitivity.
- Labor availability, wage movement, industrial relations and productivity.
- Contractor/vendor financial health, capacity, claims history, HSE and quality performance.
- Financing: interest rate, tenor, covenant, drawdown timing, liquidity and refinancing exposure.
- Sales/collection assumptions, buyer concentration, cancellation/default risk and channel performance.
- Tax, duties, fees, incentives and compliance obligations.
- Legal, insurance, litigation, environmental, social, safety and reputational risk.
- Utilities, infrastructure, traffic, connectivity and public-service capacity.
- Security, theft, fraud, cyber risk and information integrity.
- Stakeholder/community impact and social license to operate.
- ESG and climate-transition exposure.
- Data completeness, freshness, source quality and confidence.

## Decision model

Every material forecast shall distinguish:

1. Observed facts.
2. Verified internal records.
3. External source observations.
4. Assumptions.
5. Model outputs.
6. AI recommendations.

The system shall never represent a forecast as a fact. A Project Prospect Score must be accompanied by Data Confidence and key assumptions. Hard-stop risks can override a high score.

Suggested score dimensions:

- Legal & Land
- Market
- Financial Return
- Funding
- Cost & Supply Chain
- Schedule
- Regulatory
- Risk / HSE / ESG
- Strategic Fit
- Data Confidence

The weights are configurable and must be approved by management before being used for investment decisions.

## Scenario and stress engine

At minimum support:

- Base case
- Upside case
- Downside case
- Stress case
- Custom management scenario

Sensitivity should cover price, sales absorption, construction cost, material inflation, delay, interest rate, FX, tax changes and financing availability. Future implementation may add probabilistic/Monte Carlo analysis where data quality justifies it.

## Department application model

Applications share a common identity, organization, project and audit foundation but expose only authorized workspaces:

- Executive / Board
- Corporate Secretary & Governance
- Internal Audit
- Risk & Compliance
- Land Acquisition & Land Bank
- Property & Asset Management
- Business Development & Partnership
- Investment
- PMO / Development
- Engineering / Construction
- QS / Cost Control
- Procurement & Supply Chain
- HSE / Quality / ESG
- Finance & Accounting
- Treasury
- Tax
- Legal & Contract
- Sales / CRM
- HR
- IT / Cybersecurity
- Data / AI
- Document Control

## Authorization

Authorization shall use layered controls:

- Authentication and MFA where appropriate.
- RBAC for baseline role permissions.
- ABAC for organization, department, project, geography, data classification and action context.
- PostgreSQL RLS as a database enforcement layer.
- Segregation of duties for sensitive workflows.
- Approval authority matrix for material actions.
- Immutable/auditable event history for sensitive actions.
- Short-lived, scoped sessions/tokens where applicable.
- No service-role/secret credential in browser applications.

A frontend permission check is a UX control, never the security boundary.

## Smart Glass Field Assistant

Smart Glass is a field interface to the same enterprise platform. It shall not receive unrestricted database access.

Flow:

Smart Glass -> device identity -> secure gateway -> authorization -> project context -> approved tools/data -> response.

Possible capabilities:

- Identify the active project and authorized work area.
- Display approved drawings, milestones and progress context.
- Capture photo/video/evidence with consent and policy controls.
- Record voice notes and convert them to structured daily reports.
- Ask: "What is today's planned work?"
- Ask: "What are the critical risks on this work package?"
- Compare observed progress with planned progress.
- Surface approved safety procedures and checklists.
- Flag anomalies for human review.
- Create issues, observations or requests without directly approving financial/legal actions.
- Provide offline capture and later synchronization when connectivity is poor.

The assistant should answer according to the user's authority. A site user should not receive confidential finance, legal, HR or executive information merely because the model can retrieve it.

## Evidence and computer vision

Future computer-vision functions should treat visual observations as evidence, not automatic truth. For example, detected progress must be reviewed against project baselines, capture metadata and human verification before it changes certified progress, payment or financial records.

## External intelligence layer

External data connectors may include, subject to licensing and official-source availability:

- Weather and warnings.
- Government regulations and policy.
- Tax authority information.
- Construction/material price indicators.
- Interest rates, macroeconomic and FX data.
- Transport/infrastructure information.
- Market and demographic datasets.
- Disaster and environmental information.

Every external observation must store source, retrieval time, validity/effective period where known, confidence and affected projects. External data must not silently overwrite authoritative internal records.

## AI governance

AI can summarize, forecast, detect anomalies, compare scenarios and recommend actions. It must not autonomously approve investments, release payments, sign contracts, alter legal status, change budgets materially, certify construction progress or override segregation of duties.

Material AI recommendations must expose:

- Evidence used.
- Assumptions.
- Confidence.
- Model/version where applicable.
- Time of analysis.
- Conflicting evidence.
- Recommended human action.

## Resilience and future-proofing

Design for:

- Offline field operation.
- External API outage.
- Stale/contradictory external data.
- Vendor lock-in.
- Model/provider outage.
- AI hallucination.
- Cybersecurity incidents.
- Credential compromise.
- Data corruption.
- Duplicate submissions.
- Integration schema changes.
- Disaster recovery and backup.
- Business continuity.
- Human override and manual fallback.

## Implementation principle

Build in vertical slices. A new capability is not considered complete until UI, authorization, database constraints/RLS, audit trail, error handling, tests, observability and operational documentation are addressed.
