# actora.art

Projects, experiments, and things worth keeping.

actora.art is a small personal site built around a terminal-like homepage, a few public pages, and an expanding set of interactive experiments.

## What this repo is

This is the public codebase for the site frontend and its public-facing structure.

It contains:
- the Astro site
- interactive frontend components
- public documentation
- project structure and product intent

It does not try to document private operations, moderation tooling, deployment internals, or sensitive infrastructure details.

## Current site areas

- **homepage** , a terminal-style landing page
- **projects** , links to external projects
- **chat** , a public chat bot page
- **lab** , experiments and unfinished things
- **wall** , a collaborative text-based graffiti wall in the lab

## Docs

Start with [`docs/guide.md`](docs/guide.md).

| | |
|---|---|
| [`docs/identity.md`](docs/identity.md) | what actora.art is trying to be |
| [`docs/codebase.md`](docs/codebase.md) | safe map of the public codebase |
| [`docs/experiments.md`](docs/experiments.md) | user-facing overview of chat, lab, and wall |
| [`docs/privacy.md`](docs/privacy.md) | plain-English privacy note |
| [`docs/contributing.md`](docs/contributing.md) | lightweight contribution and editing guidance |

## Local development

If you want to run the public site locally:

```bash
npm install
npm run dev
```

Build a production bundle locally with:

```bash
npm run build
```

## Stack

- [Astro](https://astro.build)
- [Preact](https://preactjs.com)
- plain CSS
- a separate Node.js backend for interactive features

## Note on documentation

This repo intentionally keeps public documentation focused on the project, the codebase, and user-facing behavior.

Operational details, moderation processes, infrastructure specifics, and other sensitive documentation belong in private docs, not here.
