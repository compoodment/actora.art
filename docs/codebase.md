# Codebase

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
| `ChatIsland.tsx` | Chat bot UI — messages, replies, visible hint, and session history |
| `Wall.tsx` | Collaborative wall UI — grid, paint/erase, budget display |
| `ParticleFlow.tsx` | Interactive visual experiment |
| `LiminalWalker.tsx` | WebGL first-person lab experiment |

## Layouts

`Base.astro` is the shared page shell — document head, canonical/social metadata, fonts, common framing, standard content width, and the persistent footer. Fullscreen experiences can opt out when they need their own layout.

Most standard content pages use the shared `80rem` canvas from `global.css`. `/chat` uses a route-specific full-height shell in `chat.css`, also capped at `80rem`, because signed-in history needs a rail/sidebar beside the conversation. The homepage terminal stays intentionally narrower in `terminal.css`.

## Pages

| Route | File |
|-------|------|
| Homepage | `src/pages/index.astro` |
| Account | `src/pages/account.astro` |
| Chat | `src/pages/chat/index.astro` |
| Lab index | `src/pages/lab/index.astro` |
| Wall | `src/pages/lab/wall.astro` |
| Particles | `src/pages/lab/particles.astro` |
| Liminal | `src/pages/lab/liminal.astro` |
| Info | `src/pages/info/index.astro` |
| Projects | `src/pages/projects/index.astro` |
| Actora project | `src/pages/projects/actora.astro` |
| Robots directives | `src/pages/robots.txt.ts` |

## Styles

| File | Purpose |
|------|---------|
| `global.css` | Shared tokens, standard page shell, footer, page lists, and global styling |
| `chat.css` | Chat page styling, including the desktop signed-in `chats` rail/sidebar and mobile full-screen `chats` sheet |
| `terminal.css` | Terminal-specific homepage styling and narrow terminal width |

## Frontend API boundary

All frontend calls to `/api/*` are centralized in [`src/lib/api.ts`](../src/lib/api.ts). Component code should use that client layer instead of doing inline `fetch('/api/...')` calls.

The public contract for those routes is documented in [api.md](api.md). Interactive behavior assumes a separate backend exposes that contract and manages cookie-backed visitor identity.

## Boundaries

This file stays focused on frontend structure. API shapes are in [api.md](api.md), and hosting expectations are in [deploy.md](deploy.md).
