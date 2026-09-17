# CTO Execution State

## Locked objective
Take ADTrans RealIndo from Rp0 foundation to a verified go-live while preserving a clean upgrade path to enterprise infrastructure.

## Current repository reality
- Existing public repository: `Yudi8377/ADTrans-RealIndo-IMCS`
- Current stack: Vite + JavaScript + Supabase JS
- Corporate and IMCS are separate HTML entry points in one current repository.
- Current frontend already uses a Supabase publishable key and server-side Edge Functions for privileged actions.
- Current IMCS core has executive/property/investment/finance/legal/risk/governance/KPI modules and dynamic optional modules.

## CTO decision
The current repository is the IMCS production foundation. We will not rewrite it blindly. We will harden it, extract shared platform contracts, and then create departmental repositories around the validated core.

## Rp0 engineering rules
- Prefer existing free services and open-source software.
- Avoid paid infrastructure until an actual requirement is measured.
- Design interfaces for future device gateways and enterprise services now, but implement only the minimum needed for reliable go-live.
- Do not fabricate business or operational data.
- Do not expose privileged keys to client applications.
- Every new security-sensitive capability gets an authorization test and audit path.

## Device roadmap is architectural, not postponed
Device adapters are treated as first-class integration boundaries from the beginning: biometrics, GPS, camera, barcode/QR, printers/scanners, IoT, building systems, AR/VR and smart glasses.

## Go-live priority
1. Platform security and authorization integrity
2. IMCS core reliability
3. Corporate/IMCS deployment boundary
4. Offline-capable field foundation
5. Device gateway contract
6. Department applications
7. Advanced AI/design/AR/VR and enterprise upgrades
