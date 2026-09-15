# ADTrans RealIndo — Offline Department Installers & Biometric Attendance Architecture v1.0

## 1. Objective

ADTrans RealIndo applications shall be deployable as offline-capable installers for departmental workstations and field devices. Connectivity to ADTrans Cloud is required for synchronization, authorization refresh, centralized reporting, and AI services, but core operational workflows must continue during temporary network outages.

The target is not a collection of unrelated desktop applications. It is one governed enterprise platform with department-specific packages sharing the same domain model, security model, audit model, and synchronization protocol.

## 2. Product packaging model

### ADTrans Desktop Runtime

A common offline runtime is used by department packages:

- local application shell
- encrypted local database/cache
- offline queue
- sync engine
- device registration
- authentication/session cache with bounded offline validity
- audit/event journal
- attachment queue
- update manager
- health diagnostics

Department packages are capability bundles loaded into the runtime:

- Executive / Director
- Finance & Accounting
- HR & Payroll
- Procurement
- Warehouse & Inventory
- Project / Construction
- Engineering & Installation
- Property Management
- Sales & CRM
- Legal & Compliance
- Maintenance / Field Operations
- GIS / Field Intelligence

Each package can have its own installer shortcut, branding, permissions, and menu while remaining part of the same ADTrans ecosystem.

## 3. Installer targets

Phase 1:
- Windows x64 installer: primary enterprise desktop target
- Android APK/AAB: mobile field and attendance target

Phase 2:
- macOS package where required by management/engineering users
- Linux AppImage/deb where operational demand exists

The Windows package should use a signed installer and install the common runtime plus selected departmental capability modules. The Android package should use the same synchronization contract but a mobile-optimized UI.

## 4. Offline-first data architecture

```text
Department App
    |
    +-- Local encrypted DB
    |      +-- master-data cache
    |      +-- operational drafts
    |      +-- offline transactions
    |      +-- attendance queue
    |      +-- evidence/attachments queue
    |      +-- audit journal
    |
    +-- Sync Engine
           |
           +-- idempotency key
           +-- sequence/version
           +-- conflict policy
           +-- retry/backoff
           +-- integrity check
           |
           v
      ADTrans Cloud / Supabase
```

Rules:

1. Every offline write gets a globally unique client event ID.
2. Server timestamps remain authoritative when data reaches the server.
3. Replayed events must be idempotent.
4. Version/concurrency checks prevent silent overwrites.
5. Financial posting remains a server-governed operation unless a separately approved offline ledger protocol is introduced.
6. Attachments are encrypted locally and uploaded after connectivity returns.
7. Offline sessions have a bounded validity period and cannot silently become permanent privileged access.

## 5. Department installer behavior

Installer options:

- full enterprise workstation
- Finance-only
- HR/Payroll-only
- Project/Construction-only
- Procurement/Warehouse-only
- Property Management-only
- Field/Attendance-only
- Executive-only

The package does not grant permissions. RBAC/RLS from ADTrans Cloud remains authoritative.

## 6. Biometric attendance gateway

The attendance subsystem must support commercial attendance terminals rather than being tied to one vendor.

Canonical flow:

```text
Commercial Biometric Terminal
    |
    +-- Fingerprint
    +-- Face
    +-- Card
    +-- PIN
    +-- Palm / Iris where supported
    |
    v
Local Attendance Gateway
    |
    +-- vendor adapter
    +-- device health monitor
    +-- event normalization
    +-- local queue
    +-- duplicate protection
    +-- signed/verified transport
    |
    v
ADTrans Attendance Core
    |
    +-- employee
    +-- shift
    +-- project/work area
    +-- geofence
    +-- exception
    +-- payroll linkage
    +-- audit
```

## 7. Supported commercial integration strategy

### ZKTeco

Implement an adapter family for ZKTeco terminals using the vendor's supported SDK/push/API mechanisms. The architecture must allow fingerprint and face-capable devices. Device-specific capabilities are stored in the device registry instead of hardcoded into attendance logic.

### Suprema

Implement a Suprema adapter family. Suprema provides BioStar Device SDK, BioStar API, and G-SDK integration paths. Device SDK/G-SDK can be used by the local gateway where appropriate; BioStar APIs can be used when the customer's deployment already operates BioStar infrastructure.

### Hikvision

Implement a Hikvision adapter family using the supported attendance integration mechanisms such as ISAPI, Push SDK, or HikCentral/OpenAPI where licensed and applicable.

### Generic adapter

A generic HTTP/SFTP/CSV import adapter is retained for legacy devices that cannot be integrated directly. Such imports must be validated, deduplicated, and audited before becoming attendance events.

## 8. Biometric privacy model

ADTrans should not store raw fingerprint images or raw facial images in the normal attendance database.

Preferred model:

- biometric enrollment remains on the approved terminal/provider system
- ADTrans stores credential references and non-reversible hashes where appropriate
- attendance records store verification method/result, not raw biometric material
- if biometric templates ever need centralized storage, they require explicit encryption, key management, consent/retention policy, access controls, and documented legal basis
- face recognition used on mobile devices should prefer platform/delegated biometric verification where possible

## 9. Anti-fraud controls

Attendance must combine multiple controls:

- registered employee identity
- registered device/terminal
- server timestamp
- device clock drift detection
- terminal/device health
- event ID and idempotency
- duplicate/replay protection
- project/work-area association
- GPS/geofence for mobile attendance
- optional face/fingerprint verification
- optional liveness-capable terminal
- supervisor exception workflow
- photo/evidence where policy permits
- anomaly detection
- audit trail

No system should claim that biometrics alone makes attendance impossible to falsify.

## 10. Payroll integration

Normalized biometric events feed the existing attendance engine. Payroll consumes approved attendance summaries, not raw device logs directly.

```text
Device Event
 -> Normalized Attendance Event
 -> Verification / Exception
 -> Approved Attendance
 -> Payroll Summary
 -> Payroll Run
 -> Finance Transaction
 -> Journal / Payment
```

Payroll rules remain configurable. Tax and statutory calculations must be maintained from authoritative current Indonesian regulations rather than hardcoded assumptions.

## 11. Device registry

Each terminal is registered with:

- organization
- device code/name
- vendor/model
- protocol
- endpoint/network information
- site
- timezone
- capabilities
- status
- last synchronization
- metadata

Credentials are represented by references and hashes, not raw biometric material by default.

## 12. Offline attendance gateway

The gateway must continue collecting terminal events during WAN outages.

When cloud connectivity returns:

1. authenticate gateway
2. send batched events
3. server validates organization/device/event identity
4. duplicate events are ignored safely
5. accepted events are normalized
6. payroll linkage becomes available
7. gateway receives acknowledgement/checkpoint

## 13. Deployment recommendation

The first production-grade offline package should be:

**ADTrans Attendance Gateway for Windows**

with:

- Windows installer
- local service/background worker
- device discovery/configuration
- ZKTeco adapter
- Suprema adapter
- Hikvision adapter
- local queue
- cloud synchronization
- device health dashboard
- attendance event monitor
- secure logs
- automatic recovery after reboot

A separate Android Field Attendance app will handle phone-based attendance using GPS, registered device binding, face/platform biometric verification, offline queueing, and supervisor exceptions.

## 14. Release governance

Every installer release must pass:

- database compatibility test
- offline write/read test
- reconnect/sync test
- duplicate replay test
- RLS authorization test
- audit trail test
- installer upgrade/uninstall test
- device adapter integration test
- payroll linkage test
- crash recovery test
- signed artifact verification

The cloud and installer versions must advertise compatible protocol/schema versions. Incompatible clients must fail safely rather than corrupting data.
