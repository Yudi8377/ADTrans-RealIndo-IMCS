# ADTrans RealIndo — Permanent Domain Architecture

## Canonical public website
`https://www.adtransrealindo.com`

Purpose: public corporate portfolio and company information only.

## Canonical internal IMCS
`https://imcs.adtransrealindo.com`

Purpose: authorized internal management system only.

## Non-negotiable boundary
These two applications are permanently treated as separate products and security boundaries.

- The corporate website must never expose IMCS routes, login UI, internal navigation, or internal data.
- IMCS must never be presented as a public corporate website.
- Authentication, authorization, RLS/ABAC, audit, and internal data belong to IMCS.
- Public website content belongs to the Corporate application.

## Current transition
The custom domains require DNS/domain ownership configuration outside the repository. Until DNS and GitHub Pages/custom hosting are configured, the existing GitHub Pages deployment remains the temporary technical URL.

## Change control
The canonical names and separation above are architectural invariants. Any future change must be treated as an explicit architecture change, not an ordinary UI edit.
