# Device Integration Contract

This contract makes hardware extensibility part of ADTrans RealIndo from day one.

## Supported integration classes

1. Identity & attendance
   - fingerprint readers
   - face recognition terminals
   - RFID/NFC readers
   - mobile biometric capabilities where OS permits

2. Field operations
   - GPS/location
   - camera/photo/video
   - barcode/QR scanners
   - rugged Android/tablet devices

3. Office operations
   - printers
   - document scanners
   - signature pads
   - label/asset printers

4. Property/building/engineering
   - access control
   - CCTV/events
   - environmental sensors
   - electrical/water/HVAC/IPAL telemetry
   - smart-building controllers

5. Future immersive operations
   - AR/VR
   - smart glasses
   - BIM/site overlays
   - 4D construction visualization

## Adapter contract

Every device integration should expose:
- device identity and installation identity
- capability declaration
- protocol/transport
- health/heartbeat
- firmware/software version
- calibration/status where applicable
- signed/authenticated event payload
- timestamp and timezone
- source correlation id
- retry/idempotency key
- last-seen state

## Security

Devices never receive privileged database credentials. Device traffic terminates at an authenticated gateway/API/Edge Function. The gateway validates device identity, user identity and permitted scope before invoking domain operations. All security-sensitive actions produce audit events.

## Example attendance flow

Biometric terminal -> Device Gateway -> employee/device validation -> attendance domain operation -> payroll/HR event -> audit -> authorized realtime notification.

## Example site flow

Field mobile -> offline local queue -> GPS/photo/barcode capture -> sync gateway -> project/work-package validation -> construction record -> audit -> Realtime notification.

## Example AR flow

Smartphone/tablet/glasses -> authenticated project/site context -> BIM/design asset request -> authorized model stream -> local rendering/overlay -> field annotation -> sync -> audit.
