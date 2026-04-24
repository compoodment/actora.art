# Deploy

Role: public static-frontend deploy guide; keep private infrastructure, health checks, and ops procedures out.

This repo builds the static frontend for actora.art.

## What This Repo Does

- `npm run build` produces the static site in `dist/`.
- Pages and client-side UI ship from this repo.
- Interactive features do not live in this repo.

## Interactive Features Need A Separate Backend

Chat, wall, and auth flows require a separate Node backend that exposes the public routes documented in [api.md](api.md).

The frontend expects that backend to:

- serve the documented `/api/*` routes
- run on the same origin as the site, or be reverse-proxied there
- manage guest/auth cookies server-side so browser requests keep identity state

If that backend is absent, the site can still render, but chat, wall, account, and passkey features will not work.

## Basic Frontend Deploy Flow

```bash
npm install
npm run build
```

Then host the generated `dist/` output with any static hosting setup that also routes the documented `/api/*` requests to the separate backend.

## Scope Note

This doc is intentionally public-safe. It does not describe private infrastructure layout, health checks, admin routes, or operational auth details.
