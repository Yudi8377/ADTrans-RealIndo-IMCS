# ADTrans RealIndo Device & Field Intelligence Architecture v1.0

**Status:** Approved Engineering Architecture

## 1. Objective

Provide one enterprise platform that works across office PCs, laptops, smartphones, tablets and Smart Glass/AR field devices without creating disconnected data silos.

## 2. Device Classes

| Class | Primary use | UX policy |
|---|---|---|
| Desktop PC | Finance, HR, administration, back office | Full desktop workflow |
| Laptop | Management, engineering, project control | Full responsive workflow |
| Smartphone | Approval, alerts, CRM, executive access | Mobile-first |
| Tablet | Construction, QC, HSE, engineering, site reporting | Touch-first field UX |
| Smart Glass/AR | Hands-free inspection and field intelligence | Voice + visual + evidence-first |

## 3. Canonical Architecture

Device → Secure Application → Supabase Auth → API/Edge Functions → PostgreSQL/RLS → IMCS governance and reporting.

Devices never hold the authoritative enterprise database. Local storage is limited to cache, drafts and an offline synchronization queue.

## 4. Field Mode

Tablet and Smart Glass clients must support:

- daily report capture;
- checklist and inspection forms;
- photo/video evidence;
- optional GPS metadata subject to policy;
- voice input;
- project and work-package context;
- explicit verification state;
- offline draft queue;
- deterministic synchronization and conflict handling;
- visible sync status;
- secure sign-in and session lifecycle.

Offline data is not authoritative until successfully synchronized and accepted by the server workflow.

## 5. Smart Glass / AR Contract

The platform remains hardware-agnostic. A device adapter exposes a stable contract for:

- device identity;
- device class/vendor/model;
- firmware and application version;
- microphone and camera capabilities;
- display/AR capability;
- battery/device health;
- network state;
- privacy state;
- OTA/update state;
- last-seen telemetry;
- evidence capture;
- voice command/input.

No hardware vendor is architecturally locked in before a controlled pilot.

## 6. AI Field Safety Boundary

Smart Glass and tablet AI use the same authorization boundary as every other client:

USER → ORGANIZATION → DEPARTMENT → ROLE → PROJECT/DATA SCOPE → AIG GATEWAY → AI AGENT → RECOMMENDATION → HUMAN REVIEW → WORKFLOW.

AI may analyze evidence and recommend actions. It must not bypass RLS, expose restricted data, certify technical progress, approve financial/material transactions, or execute irreversible actions without an authorized workflow.

## 7. Network Model

Office: LAN/Wi-Fi → HTTPS → secure application/API.

Site: cellular/Wi-Fi/VPN where required → HTTPS → secure application/API.

Poor connectivity: local draft/cache → encrypted sync queue → central API → server validation → PostgreSQL → IMCS.

## 8. Deployment Model

Department applications may be delivered as responsive web/PWA clients or packaged desktop/mobile clients. The business service contract remains centralized. Installable clients must use versioned releases, signed/controlled distribution where supported, automatic update capability, and a rollback strategy.

## 9. Testing Requirements

Every field release must verify:

1. responsive layouts at phone/tablet/desktop breakpoints;
2. touch interaction and accessible controls;
3. authentication/session expiry;
4. organization/department/project isolation;
5. offline draft and sync behavior;
6. duplicate/replay protection;
7. evidence integrity;
8. AI authorization and prompt/tool-injection resistance;
9. human approval gates;
10. audit completeness;
11. recovery after interrupted network/device state.

## 10. Engineering Decision

Smart Glass is an official future device channel of ADTrans RealIndo. Tablet field mode is a first-class current requirement. Both consume the same secure platform and central data model rather than becoming separate products.
