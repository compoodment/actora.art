# Codebase

Role: frontend codebase guide; API shape belongs in `api.md`, deploy shape in `deploy.md`, and private backend details stay private.

How the frontend is organized.

## Top-level structure

```text
src/
  components/   interactive frontend pieces
  lib/          API client, auth helpers, and WebAuthn helpers
  layouts/      shared page layouts
  pages/        route files
  styles/       global and page-specific styles
```

## Key components

| Component | Purpose |
|-----------|---------|
| `TerminalHero.tsx` | Terminal-style homepage interface |
| `ChatIsland.tsx` | Chat bot UI — messages, replies, session history |
| `Wall.tsx` | Collaborative wall UI — grid, paint/erase, budget display |
| `ParticleFlow.tsx` | Interactive visual experiment |

## Layouts

`Base.astro` is the shared page shell — document head, canonical/social metadata, fonts, common framing, and the normal footer back link. Fullscreen experiences can opt out when they need their own layout.

## Pages

| Route | File |
|-------|------|
| Homepage | `src/pages/index.astro` |
| Account | `src/pages/account.astro` |
| Chat | `src/pages/chat/index.astro` |
| Lab index | `src/pages/lab/index.astro` |
| Wall | `src/pages/lab/wall.astro` |
| Particles | `src/pages/lab/particles.astro` |
| Info | `src/pages/info/index.astro` |
| Projects | `src/pages/projects/index.astro` |
| Actora project | `src/pages/projects/actora.astro` |
| Robots directives | `src/pages/robots.txt.ts` |

## Styles

| File | Purpose |
|------|---------|
| `global.css` | Shared tokens and global styling |
| `chat.css` | Chat page styling |
| `terminal.css` | Terminal-specific styling |

## Frontend API boundary

All frontend calls to `/api/*` are centralized in [`src/lib/api.ts`](../src/lib/api.ts). Component code should use that client layer instead of doing inline `fetch('/api/...')` calls.

The public contract for those routes is documented in [api.md](api.md). Interactive behavior assumes a separate backend exposes that contract and manages cookie-backed visitor identity.

## Public vs private knowledge

This file describes the frontend codebase and public-facing structure only. Operational backend details, infrastructure, and admin internals are documented privately.
