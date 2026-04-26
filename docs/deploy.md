# Hosting

actora.art is a static Astro frontend with interactive features provided by same-origin `/api/*` routes.

This page explains the shape the frontend expects. It is not an operations runbook.

## Frontend output

The site builds to static files: HTML, CSS, JavaScript, images, and generated metadata. Any host serving the frontend needs to serve those files as normal static assets.

## Interactive routes

Chat, wall, account, and passkey screens expect a backend on the same origin with the routes documented in [api.md](api.md).

The frontend assumes:

- `/api/*` routes return the documented JSON shapes
- visitor identity is cookie-backed
- account and guest state are managed server-side
- static pages can still load even if interactive routes are unavailable

## Not covered here

Live operations are handled outside this repo.
