<div align="center">

# actora.art

**public notes for the site and its social spaces**

[site](https://actora.art/) · [guide](docs/site.md) · [Aurora](docs/aurora.md) · [terminal](docs/terminal.md) · [Space](docs/space.md) · [social](docs/social.md) · [privacy](docs/privacy.md) · [changelog](CHANGELOG.md)

![repo](https://img.shields.io/badge/repo-public%20docs%20surface-0a0a0a?style=flat-square)
![license](https://img.shields.io/badge/license-rights%20reserved-0a0a0a?style=flat-square)

</div>

## Site

- **terminal** — the homepage command interface and account entry point
- **account and profiles** — passkeys, account controls, and optional public profiles
- **social** — find people by username, make friends, and see notifications
- **Aurora** — conversations, custom instructions, public Actora lookups, and cited web search
- **Space** — a 3D orbital sandbox
- **The Wall** — a shared ASCII graffiti wall
- **info** — links, contact, and credits

## Read First

- [docs/terminal.md](docs/terminal.md) — homepage commands and account flow
- [docs/site.md](docs/site.md) — public page and footer guide
- [docs/aurora.md](docs/aurora.md) — conversations, settings, and tools
- [docs/accounts.md](docs/accounts.md) — passkeys, recovery, archive, and deletion
- [docs/space.md](docs/space.md) — Space, simulations, and saves
- [docs/social.md](docs/social.md) — profiles, badges, and friends
- [docs/privacy.md](docs/privacy.md) — data use, visibility, external services, and retention
- [CHANGELOG.md](CHANGELOG.md) — public release notes

This README is the public docs index. Implementation source, deployment details, moderation internals, storage layout, runtime state, and secrets live outside this public repo.

Music and Messages were removed in `0.3.32` (2026-11-01). Old `/music` and `/messages` links show a short page saying so. See [privacy](docs/privacy.md) for what happens to the data they held.

## Site Stack

- Astro
- TypeScript and Preact
- Three.js
- Node.js backend for interactive site-owned APIs

## Privacy

No ads, analytics scripts, or sale of visitor data. Interactive surfaces keep the state they need to work, and current external-service data flows are disclosed.

See [docs/privacy.md](docs/privacy.md).

## License

No open-source license is granted unless a file says otherwise.

Copyright © computment. All rights reserved.
