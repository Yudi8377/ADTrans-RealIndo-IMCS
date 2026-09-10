# Release Checklist

- [ ] Public portfolio routes verified
- [ ] Protected IMCS routes verified
- [ ] Authentication/session/sign-out verified
- [ ] Organization isolation verified
- [ ] No service-role secret in client bundle
- [ ] Database migrations applied
- [ ] Security Advisor reviewed
- [ ] Performance Advisor reviewed
- [ ] `npm ci` passes
- [ ] `npm run build` passes
- [ ] `node scripts/verify-release.mjs` passes
- [ ] GitHub Pages deployment succeeds
- [ ] No fabricated production business data
- [ ] Rollback commit identified
