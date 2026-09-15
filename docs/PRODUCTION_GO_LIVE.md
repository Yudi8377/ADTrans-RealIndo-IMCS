# ADTrans RealIndo Production Go-Live

## Public Corporate Website
Primary: https://www.adtransrealindo.com
Interim: https://yudi8377.github.io/ADTrans-RealIndo-IMCS/
Scope: corporate profile, KBLI, services, portfolio, governance and contact.

## Internal IMCS
Primary: https://imcs.adtransrealindo.com
Interim: https://yudi8377.github.io/ADTrans-RealIndo-IMCS/imcs.html
Scope: authenticated enterprise operating system. The IMCS route is noindex/nofollow and must not expose internal data publicly.

## Release gates
- Production build succeeds.
- Corporate and IMCS entry points load without fatal JavaScript errors.
- Authentication and organization isolation are enforced.
- RLS/security posture is reviewed.
- Service-role secrets never ship to the browser.
- Administrator bootstrap is controlled and atomic.
- Operational data is never fabricated.
- Custom domains are only declared LIVE after DNS, HTTPS and end-to-end browser verification.

## DNS boundary
The corporate and IMCS hosts are intentionally separate. DNS/hosting account actions require access to the user's domain/hosting provider; no production-live claim is made until that external control is available.
