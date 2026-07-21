<div align="center">

# actora.art

**public notes for the site, its social spaces, Music, and the Lab**

[site](https://actora.art/) · [terminal](docs/terminal.md) · [music](docs/music.md) · [lab](docs/lab.md) · [social](docs/social.md) · [privacy](docs/privacy.md) · [changelog](CHANGELOG.md)

![repo](https://img.shields.io/badge/repo-public%20docs%20surface-0a0a0a?style=flat-square)
![license](https://img.shields.io/badge/license-rights%20reserved-0a0a0a?style=flat-square)

</div>

## Site

- **terminal** — the homepage command interface and account entry point
- **music** — public listening, personal libraries, playlists, and uploads
- **account and profiles** — passkey identity, lifecycle controls, and opt-in profile pages
- **social and messages** — exact-username finding, mutual friendships, and friends-only DMs
- **chat** — conversations with Aurora
- **lab** — experiments and unfinished games, including Space, Liminal, Particles, The Wall, and Actora
- **info** — links, contact, and credits

## Read First

- [docs/terminal.md](docs/terminal.md) — homepage commands and account flow
- [docs/music.md](docs/music.md) — listening, libraries, uploads, and sharing
- [docs/lab.md](docs/lab.md) — short descriptions of the Lab projects
- [docs/social.md](docs/social.md) — profiles, badges, friends, and Messages
- [docs/privacy.md](docs/privacy.md) — data use, visibility, external services, and retention
- [CHANGELOG.md](CHANGELOG.md) — public release notes

This README is the public docs index. Implementation source, deployment details, moderation internals, storage layout, runtime state, and secrets live outside this public repo.

## Site Stack

- Astro
- TypeScript and Preact
- Three.js
- Python and Pyodide for Actora
- Node.js backend for interactive site-owned APIs

## Privacy

No ads, analytics scripts, or sale of visitor data. Interactive surfaces keep the state they need to work, and current external-service data flows are disclosed.

See [docs/privacy.md](docs/privacy.md).

## License

No open-source license is granted unless a file says otherwise.

Copyright © computment. All rights reserved.
