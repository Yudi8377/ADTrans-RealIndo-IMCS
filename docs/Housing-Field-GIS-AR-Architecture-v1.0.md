# ADTrans RealIndo Housing Field GIS & Mobile AR Architecture v1.0

## Decision

ADTrans Field Intelligence treats smartphone, tablet, and future smart-glass devices as interchangeable field clients over one cloud-controlled application core.

## GIS

The business model is provider-neutral. Project areas and units store location/geometry as application data; a future PostGIS migration/extension, OpenStreetMap basemap, MapLibre/Leaflet rendering, and premium GIS providers can be introduced without changing the authoritative business model.

## Mobile AR

AR is a capability, not a separate product. Smartphone and tablet clients can provide camera, GPS, microphone, touch and AR overlays. Smart Glass adds hands-free display/input through a device adapter.

## Field flow

`Device -> Identity -> Project/Unit Context -> Camera/GPS/Voice -> Offline Queue -> Secure API -> AI Gateway -> Human Verification -> IMCS Audit`

## Safety boundary

AI may identify, summarize, compare and recommend. AI must not silently certify construction progress, approve financial/material transactions, alter authoritative records, or execute irreversible actions.

## Offline

The device stores only cache, drafts, evidence metadata and retry queue. PostgreSQL remains the authoritative source of truth.

## Upgrade path

1. Open-source map/rendering and mobile AR primitives.
2. Harden GIS/search/routing and computer vision services.
3. Pilot premium GIS and Smart Glass hardware through adapters.
4. Scale only where operational ROI and governance justify it.

## Definition of Done for field AR foundation

- Same authentication and authorization as IMCS.
- Project and unit context is mandatory for official evidence where applicable.
- Evidence has device UID and client event ID for idempotent sync.
- Offline replay is duplicate-safe.
- Location and geometry remain vendor-neutral.
- AI recommendations are auditable and human-verifiable.
- No authoritative local database is created.
