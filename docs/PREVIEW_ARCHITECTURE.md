# ADTrans RealIndo Preview Architecture

## Temporary preview

Until `adtransrealindo.com` is purchased, the project is intentionally previewed through GitHub Pages.

- Corporate Website: `/`
- IMCS: `/imcs.html`

These are preview routes only. They are not the future production domains.

## Production boundary

The production architecture is intentionally separated:

- Corporate Website → `www.adtransrealindo.com`
- IMCS → `imcs.adtransrealindo.com`

The corporate site is public and marketing/portfolio oriented. IMCS is an authenticated enterprise application and must be deployed as a separate application/site before custom-domain go-live.

## Security boundary

The corporate site must never receive IMCS credentials, privileged APIs, service-role keys, internal operational data, or administrative capabilities.

IMCS must remain authenticated and protected by Supabase authorization, RLS, role/permission controls, AI governance, and audit controls.

## Preview rule

Do not add a `CNAME` file for either future domain while the domains are not owned and configured. Domain binding belongs to the final hosting deployment, not the preview artifact.
