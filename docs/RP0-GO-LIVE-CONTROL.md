# ADTrans RealIndo — Rp0 Go-Live Control

## Locked objective
Bring ADTrans RealIndo to a verified go-live using Rp0/free-tier/open-source infrastructure where practical, while keeping the architecture upgradeable to enterprise infrastructure without a rewrite.

## Current validated foundation
- GitHub repository: `Yudi8377/ADTrans-RealIndo-IMCS`
- Frontend: Vite + JavaScript
- Backend/data: Supabase PostgreSQL + Auth + Edge Functions
- Current Supabase project: `AD REALINDO IMCS`
- Region: `ap-southeast-1`
- PostgreSQL: 17.x
- Public schema is RLS-enabled across the existing application tables.
- Existing application registry contains departmental application records.
- Existing AI Gateway, AI Companion, field evidence, offline sync queue, biometric, attendance and device adapter foundations are present.

## Device integration is now a platform contract
The platform is designed to integrate, without redesigning the domain model, with:
- fingerprint and face terminals
- RFID/NFC and card readers
- mobile biometric capabilities where the operating system permits
- GPS/location
- cameras and media capture
- barcode/QR scanners
- printers, scanners and signature devices
- rugged phones/tablets
- access control and CCTV event sources
- environmental, electrical, water, HVAC and IPAL telemetry
- IoT gateways
- AR/VR and smart glasses
- BIM/4D site visualization

The integration boundary is a device gateway/API/Edge Function layer. Devices never receive privileged database credentials.

## Implemented platform extension
The Supabase data core now includes generic, organization-scoped device integration entities:
- `device_registry`
- `device_integrations`
- `device_events`
- `device_commands`
- `device_command_results`
- `application_releases`

The existing specialized tables remain authoritative for their domains, including biometric devices/events, employee devices, AI devices, field evidence and offline sync.

## Offline-first contract
Field applications may operate with an encrypted local queue. Each client event must carry an idempotency/correlation identifier. Synchronization is server-authorized and must preserve organization/project scope. Conflicts are explicit; they are never silently overwritten.

## Security gates
- Publishable keys may be used by clients; privileged keys remain server-side.
- RLS remains mandatory for exposed application tables.
- Authorization is organization + application + department/permission + project/data scope.
- AI companions inherit human authorization and cannot elevate privileges.
- Device commands are risk-classified and auditable.
- Biometric templates/raw biometric images are not stored in the operational database by default.

## Current security observations
Supabase security advisors still report three existing SECURITY DEFINER helper functions exposed to authenticated users and leaked-password protection disabled by plan. These are tracked as security-hardening items and are not silently changed because they are part of the current RLS authorization design and changing them blindly could break authorization.

## Performance observations
The database advisor reports a large number of currently unused indexes because the system has almost no operational data yet. They are intentionally not mass-deleted. One missing FK index was added for `department_application_registry.department_id`.

## Go-live gates
1. Corporate site and IMCS deployment boundaries verified.
2. IMCS build and runtime tests pass.
3. Authentication and first-admin bootstrap verified through the authorized UI flow.
4. RLS authorization tests cover organization and permission boundaries.
5. Offline field queue tested with reconnect/replay/idempotency.
6. Device registry/gateway contract tested with a simulated device event.
7. Critical workflows have audit evidence.
8. Backup/recovery and rollback procedure documented.
9. No privileged secrets in client bundles.
10. Production domain/DNS is configured only when the domain is actually purchased.

## Rp0 -> Enterprise upgrade path
### Rp0 / validation
GitHub Pages + Supabase free/available tier + open-source tooling + local encrypted offline clients.

### Growth
Dedicated deployment, stronger observability, managed gateway, object storage/CDN strategy, signed installers and automated release channels.

### Enterprise
Dedicated compute, private networking, WAF/API gateway, managed device gateways, stronger identity federation, enterprise backup/DR, SIEM, HSM/KMS, multi-region strategy and dedicated AI infrastructure as justified by measured load and risk.

## CTO rule
Do not buy infrastructure to solve hypothetical scale. First make the Rp0 architecture observable, secure, testable and operationally useful; upgrade only when a measured bottleneck, compliance requirement or business risk justifies the cost.
