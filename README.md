# actora.art

A small personal site for projects, experiments, and things worth keeping.

The homepage is a terminal. From there you can browse pages, talk to the chat bot, draw on a shared wall, or find your way into stranger corners. The site is built around the idea that a personal site should feel like a place, not a portfolio.

## What's on the site

- **homepage** — a terminal-style landing page with hidden routes and easter eggs
- **projects** — links to external projects
  - **actora** — a long-form systems project
- **chat** — a public chat bot page
- **lab** — experiments and unfinished things
  - **wall** — a collaborative text-based graffiti wall with daily budgets, fading, and erase mechanics
  - **particles** — an interactive visual experiment

## What this repo is

This is the public codebase for the site frontend. It contains the Astro site, interactive components, and public documentation. It does not contain backend logic, deployment config, or operational details.

## Docs

Read these in order if you want the clearest map of the public side of actora.art:

1. [identity](docs/identity.md) — what actora.art is trying to be
2. [codebase](docs/codebase.md) — how the public codebase is organized
3. [experiments](docs/experiments.md) — what visitors can do
4. [privacy](docs/privacy.md) — the site's public privacy stance

Public docs explain product intent, frontend structure, and visitor-facing behavior. They do not explain deployment internals, admin behavior, moderation mechanics, or secrets handling.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for product-level release notes.

## Local development

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

## Stack

- [Astro](https://astro.build)
- [Preact](https://preactjs.com)
- plain CSS
- a separate Node.js backend for interactive features

## Note on documentation

This repo intentionally keeps public documentation focused on the project, the codebase, and user-facing behavior. Operational details, moderation processes, and infrastructure specifics belong in private docs, not here.