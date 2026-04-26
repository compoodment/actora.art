# actora.art

A personal site that behaves more like a place than a portfolio.

You arrive at a terminal. It answers, misdirects, opens doors, and sometimes lets the stranger parts of the site leak through. From there, actora.art branches into projects, experiments, a public chat bot, a shared wall, and whatever else computment decides to leave glowing in the corners.

## What lives here

- **terminal homepage** — the front door, command surface, and hiding place for small weirdness
- **projects** — public traces of larger work
- **chat** — a visitor-facing chat bot with memory only where the product explicitly allows it
- **lab** — unfinished, playful, and experimental surfaces
- **wall** — collaborative text graffiti with budgets, fading, erasing, color, undo/redo, and other tiny acts of public vandalism
- **particles** — a visual experiment, currently more toy than tool

## What this repo is

This is the public frontend codebase for actora.art.

It contains the Astro site, Preact islands, CSS, visitor-facing API contract docs, public changelog, and public-safe project notes. It does **not** contain backend source, deployment config, admin procedures, moderation mechanics, credentials, private infrastructure details, or operational runbooks.

If a detail would help someone understand the public site, it belongs here. If a detail would mostly help someone operate, attack, recover, or administer the site, it belongs in the private repo instead.

## Map

- [Docs Index](docs/index.md) — public documentation map
- [Changelog](CHANGELOG.md) — product-level release notes
- [API Contract](docs/api.md) — public frontend/backend contract for same-origin `/api/*` routes
- [Codebase](docs/codebase.md) — frontend structure and conventions
- [Roadmap](docs/roadmap.md) — public-facing planned work and known follow-ups

## Stack

- [Astro](https://astro.build)
- [Preact](https://preactjs.com)
- plain CSS
- a separate private Node.js backend exposed to the browser through same-origin `/api/*` routes

## Boundary

This repo is intentionally public. Keep it useful, readable, and safe.

Public docs should explain what visitors can experience and what contributors can understand from the frontend. Private docs own live deployment, health checks, admin behavior, moderation operations, restore steps, secrets handling, and infrastructure-specific details.
