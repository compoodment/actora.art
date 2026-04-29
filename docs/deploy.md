# Hosting boundary

actora.art is served as a static frontend with same-origin `/api/*` routes for interactive features.

This public document explains only the broad shape expected by the public site. It is not an operations runbook.

## Public shape

- Static pages and assets are served from `https://actora.art/`.
- Interactive routes use same-origin `/api/*` endpoints documented in [api.md](api.md).
- Visitor identity is cookie-backed and managed server-side.
- Static pages should still load even if interactive routes are temporarily unavailable.

## Not public

Live deployment details, source paths, proxy config, backend runtime details, admin routes, secrets, and recovery steps are intentionally private.
