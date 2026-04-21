# Contributing

This repo is public, but the site is opinionated.

## General guidance

- preserve the site's identity
- avoid filler
- keep pages cohesive with the rest of the site
- do not add hidden jokes, shortcuts, or easter eggs unless explicitly wanted
- prefer small, intentional changes over noisy expansion

## Before changing docs

Ask:
- is this safe to document publicly?
- does this help readers understand the project?
- does this expose operations that should stay private?

If it reveals operational internals, move it to private docs instead.

## Before changing the UI

Ask:
- does this belong on actora.art?
- does it fit the site's tone?
- is it actually useful or interesting?

## Local work

Typical local workflow:

```bash
npm install
npm run dev
```

A local production build can be checked with:

```bash
npm run build
```

## Scope of this repo

This repo is for public code and public docs.

Private operations, infrastructure notes, moderation playbooks, and sensitive implementation details should be documented elsewhere.
