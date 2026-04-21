# Codebase

This is a public-safe overview of the codebase.

## Top-level structure

```text
src/
  components/   interactive frontend pieces
  layouts/      shared page layouts
  pages/        route files
  styles/       global and page-specific styles
```

## Important frontend pieces

### `src/components/TerminalHero.tsx`
The terminal-style homepage interface.

It handles:
- visible commands
- hidden page navigation hooks
- terminal interaction flow

### `src/components/ChatIsland.tsx`
The browser chat UI.

It handles:
- sending messages
- displaying replies
- message history in the page session
- user-facing rate limit feedback

### `src/components/Wall.tsx`
The collaborative wall UI.

It handles:
- grid rendering
- paint / erase interaction
- budget display
- onboarding/help popup

### `src/components/ParticleFlow.tsx`
An interactive lab experiment.

## Layouts

### `src/layouts/Base.astro`
The shared page shell.

It provides:
- document head setup
- fonts
- shared layout behavior
- shared page framing

## Pages

### Homepage
- `src/pages/index.astro`

### Chat
- `src/pages/chat/index.astro`

### Lab
- `src/pages/lab/index.astro`
- `src/pages/lab/particles.astro`
- `src/pages/lab/wall.astro`

### Projects
- `src/pages/projects/...`

## Styles

### `src/styles/global.css`
Shared tokens and global styling.

### `src/styles/chat.css`
Chat page styling.

### `src/styles/terminal.css`
Terminal-specific styling.

## Public vs private knowledge

This file intentionally describes the frontend codebase and public-facing structure only.

Operational backend details, moderation logic, infrastructure, deployment flow, and admin internals are documented privately instead.
