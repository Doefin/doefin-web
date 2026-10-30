# Embedded Sanity Studio

The production Studio is mounted at `/studio` in the website deployment. It reuses the schema and document actions in `studio/sanity.config.ts`; the route sets the matching `/studio` base path. The standalone Studio package remains available for local work and Sanity hosting. Run `npm ci` from the repository root to install both workspace packages before starting either Studio.

## Sign-in and access

The route uses Sanity's normal account sign-in. It does not use a website password, shared token, or public client credential. A signed-in user must already be a member of project `yzvr33lo` with a role that grants the required dataset access. At implementation time the project has two administrator members and one pending invitation. No roles or invitations were changed.

An isolated local browser check at `http://localhost:3049/studio` hydrated the Studio and reached Sanity's project connection/CORS screen for `yzvr33lo`, without runtime errors. The local origin was not added to project CORS, so sign-in and document editing were not verified. Those require the intended deployment origin to be allowed first.

## CORS deployment requirement

The project currently allows only `http://localhost:3333`, used by the standalone local Studio, with **Allow credentials** enabled. Before using the embedded Studio, add these exact origins in Sanity project API settings and enable **Allow credentials** for each:

- `https://doefin.com` for the production site.
- `http://localhost:3000` for the website's local development server, when local embedded sign-in is needed.

Add any deployment preview origin individually when needed. Do not use a wildcard origin with credentials. These project settings were not changed as part of this code change.

## Standalone Studio

Run `npm --workspace=doefin-glossary-studio run dev` or `npm --workspace=doefin-glossary-studio run build` from the repository root to use the existing standalone package and its root-path config. The website route overrides only the embedded copy's `basePath` to `/studio`.
