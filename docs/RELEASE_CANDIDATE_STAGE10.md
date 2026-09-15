# ADTrans RealIndo — Stage 10 Release Candidate

This release candidate adds automated browser smoke verification to CI for both application surfaces:

- Corporate portfolio: `/`
- Internal IMCS login: `/imcs.html#imcs`

The smoke gate builds a local-base preview, launches Vite preview, captures both surfaces with Chromium, and uploads screenshots/logs as CI artifacts.

This verifies browser startup/render availability in CI. It does not substitute for authenticated production workflow testing, production DNS/HTTPS verification, or external provider activation.
