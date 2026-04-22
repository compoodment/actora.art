# Codebase

A public-safe overview of how the codebase is organized.

## Top-level structure

```text
src/
  components/   interactive frontend pieces
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
| Chat | `src/pages/chat/index.astro` |
| Lab index | `src/pages/lab/index.astro` |
| Wall | `src/pages/lab/wall.astro` |
| Particles | `src/pages/lab/particles.astro` |
| Projects | `src/pages/projects/index.astro` |
| Actora project | `src/pages/projects/actora.astro` |
| Robots directives | `src/pages/robots.txt.ts` |

## Styles

| File | Purpose |
|------|---------|
| `global.css` | Shared tokens and global styling |
| `chat.css` | Chat page styling |
| `terminal.css` | Terminal-specific styling |

## Public vs private knowledge

This file describes the frontend codebase and public-facing structure only. Operational backend details, infrastructure, and admin internals are documented privately.