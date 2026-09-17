# ADTrans RealIndo — Architecture Lock

Status: LOCKED for Go-Live build

## Principles
- Rp0-first implementation: use existing GitHub, GitHub Pages, Supabase Free and open-source tooling wherever practical.
- Enterprise-ready by architecture, not by premature spending.
- Corporate website and IMCS remain separate deployment surfaces.
- Department applications use separate repositories when created; they share one enterprise data/control plane.
- Supabase is the centralized enterprise data core; repositories are application boundaries, not database boundaries.
- Authorization is application + department + role + scope + RLS. Authentication alone never grants business access.
- Client software uses publishable keys only. Secret keys remain server-side.
- Offline-capable applications use encrypted local storage and a sync queue; online synchronization is authoritative through Supabase APIs/RPCs.
- Realtime uses private channels and authorization for live events; Broadcast is preferred for scalable event distribution.
- Hardware/device integrations are first-class architecture: biometric attendance, cameras, barcode/QR, GPS/location, printers/scanners, IoT/sensors, AR/VR, smart glasses and future gateways must connect through a controlled Device Integration Layer rather than directly to business tables.
- AI is a governed platform capability available to authorized applications and users, not a collection of uncontrolled per-app secrets.
- Crisis Center, audit, compliance, document evidence, device identity and synchronization are cross-platform services.
- Future enterprise upgrades must be additive: paid plans, dedicated compute, SSO, advanced observability, private networking, higher Realtime capacity, enterprise support and self-hosted/segmented components must not require a rewrite of the business domain.

## Application families
- Platform
- IMCS
- Finance
- HR
- Procurement
- Projects
- Construction
- Engineering
- Property
- SalesCRM
- Warehouse
- Maintenance
- LegalCompliance
- CrisisCenter
- Executive
- AI
- Mobile/Field
- Shared SDK

## Device Integration Layer
Canonical flow:
Device -> Device Gateway/Adapter -> Authenticated API/Edge Function -> Validation -> Domain RPC/service -> Postgres/RLS -> Audit/Event -> authorized subscribers.

Never expose privileged database credentials inside a device or desktop/mobile binary.

## Offline Sync Contract
Each offline-capable app maintains:
- device_id
- installation_id
- local database/schema version
- sync cursor
- outbound operation queue
- idempotency key
- retry count/backoff
- conflict state
- last successful sync
- audit correlation id

Conflict policy is domain-specific. Financial, approval, payroll and legal records never use blind last-write-wins; they require server-side validation and explicit workflow transitions.

## Hardware roadmap
Phase 1: web/desktop/mobile + camera + barcode/QR + GPS + attendance capture.
Phase 2: biometric devices + printers/scanners + rugged field devices.
Phase 3: IoT/environment sensors + smart building integrations + access/security systems.
Phase 4: AR/VR + smart glasses + BIM/site overlays.
Phase 5: enterprise gateways, private networking, advanced device management and optional blockchain/notarization services.

## Go-Live rule
No feature is considered complete until its authentication, authorization, audit, error handling, responsive behavior, data integrity and operational verification are demonstrated. Absolute perfection is not claimed; the target is production-ready, auditable and upgrade-safe.
