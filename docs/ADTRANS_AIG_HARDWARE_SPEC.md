# ADTrans Intelligent Glass (AIG) — Hardware Contract & OEM Roadmap

## 1. Objective

ADTrans Intelligent Glass (AIG) is a hardware-agnostic wearable interface to ADTrans RealIndo IMCS and Intelligence services. Hardware is replaceable; identity, authorization, governance, enterprise data and AI policy remain under ADTrans control.

## 2. Security boundary

`Smart Glass -> Device Identity -> Secure Gateway -> Authentication -> Authorization -> Project/Business Context -> Approved Capability -> IMCS/AI -> Response`

A Smart Glass device never receives a database service-role/secret credential and never receives unrestricted direct database access.

## 3. Capability families

- Voice Assistant
- Live Translation
- Meeting Assistant
- Project Context
- Field Evidence
- Vision Assist
- Document Assistant
- Controlled Workflow Command

High-impact commands require explicit confirmation and the normal IMCS approval/segregation-of-duties workflow.

## 4. Enterprise use cases

### Office
- Meeting briefing and agenda
- Live translation
- Authorized document lookup
- KPI/project briefing
- Action-item capture
- Executive briefing
- Personal work queue

### Field
- Project context
- Approved drawing/milestone display
- Voice-to-daily-report
- Safety checklist
- Evidence capture
- Issue/observation creation
- Progress comparison
- Offline capture and synchronization

### AI governance

AI may summarize, forecast, detect anomalies, compare scenarios and recommend. AI must not independently approve investment, release payment, sign contract, alter legal status, materially change budgets or certify construction progress.

## 5. Device contract

Every certified device adapter must expose, directly or through a companion gateway:

- device_uid
- device_class
- hardware_adapter
- firmware_version
- secure device identity
- capability list
- battery/health state
- network state
- camera/microphone privacy state
- OTA version
- last_seen_at
- device telemetry

## 6. Hardware classes

1. Audio AI wearable — voice, translation and meeting assistance.
2. Display wearable — AR data, drawings, project context and instructions.
3. Rugged enterprise wearable — construction, inspection, HSE and industrial field work.
4. ADTrans custom device — future ARIA product.

## 7. Pilot strategy

Do not lock the enterprise architecture to a vendor before field testing. Pilot multiple enterprise hardware classes and record comfort, weight, battery, display readability, microphone quality, camera quality, thermal behavior, connectivity, durability, latency, privacy controls and manageability.

## 8. ADTrans ARIA OEM/JDM target

The long-term objective is an ADTrans-exclusive wearable manufactured by an OEM/ODM/JDM partner. ADTrans should retain ownership/control of:

- product requirements
- industrial/enterprise UX requirements
- AIG software
- IMCS integration
- security architecture
- authorization model
- device-management policy
- AI policy
- data governance
- integration API contract
- acceptance criteria

The manufacturing partner supplies hardware engineering, manufacturing, certification and agreed technology components under a contract protecting ADTrans IP, security requirements and supply continuity.

## 9. Development gates

Requirements -> Architecture -> EVT -> DVT -> PVT -> Production -> Certification -> Fleet rollout.

No mass rollout before security, privacy, battery, thermal, durability, device-management, OTA, offline and integration acceptance tests pass.

## 10. Current implementation

The repository contains the first hardware-agnostic AIG console and the IMCS database foundation. The console deliberately does not pretend that an AI provider, translation provider or camera integration is complete; those services belong behind the server-side Intelligence Gateway.
