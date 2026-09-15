# ADTrans RealIndo domain routing

## Corporate website
- Intended hostname: `www.adtransrealindo.com`
- GitHub Pages custom-domain file: `CNAME`
- DNS: `www` CNAME -> `yudi8377.github.io`

## IMCS
- Intended hostname: `imcs.adtransrealindo.com`
- IMCS application entrypoint: `/imcs.html`
- `imcs.CNAME` is a deployment/domain declaration only; GitHub Pages does not support two independent custom domains on the same Pages site.
- IMCS therefore must be deployed as a separate Pages/Vercel/Hostinger site before `imcs.adtransrealindo.com` can be activated.

Do not represent the IMCS custom domain as live until its separate hosting target and DNS are configured and verified.
