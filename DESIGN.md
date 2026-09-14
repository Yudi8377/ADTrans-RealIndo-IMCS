# ADTrans RealIndo IMCS — Design Context

## Product register

Operational enterprise control system for property, investment and development management. Primary users are executives, department heads, managers and field staff. The interface must feel like an instrument panel for accountable decisions, not a generic SaaS template.

## Visual direction

- **Palette:** graphite `#151b24`, paper `#f7f8f6`, slate `#697386`, field green `#738774`, signal amber `#b9852d`, critical red `#a4483f`.
- **Typography:** existing project typography remains authoritative; hierarchy is created through weight, size and spacing rather than decorative effects.
- **Surfaces:** restrained borders, compact radii, high information density, clear separation between control surfaces and data.
- **Signature:** geographic/site intelligence is represented as a quiet field-map language that can extend from desktop dashboard to tablet and future AR overlays.

## Interaction contract

- Native buttons for actions and links for navigation.
- Every async action exposes a stable busy state and actionable failure recovery.
- Destructive or irreversible operations require an application-owned confirmation.
- Data tables use bounded navigation rather than unbounded scrolling.
- Empty states explain what is missing and what the user can do next.
- Touch targets remain usable on tablet and field devices.
- WCAG 2.2 AA is the target.

## Housing product pattern

Project is the top-level context. Spatial hierarchy is `Estate → Cluster → Block → Unit`. Field evidence follows `Project/Unit → Capture → Offline queue → Secure API → AI Gateway → Human verification → Audit`.

## Responsive behavior

Desktop prioritizes multi-panel control. Tablet prioritizes field actions, project context and map/unit exploration. Phone prioritizes capture, evidence and compact status. Future Smart Glass uses the same Field Core and authorization model through a device adapter.

## Security boundary

The public corporate surface never exposes internal IMCS data. Authenticated application data is organization-scoped and server-authorized through Supabase RLS. AI is advisory by default and cannot bypass authorization or silently perform irreversible/material actions.
