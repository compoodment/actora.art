<div align="center">

# actora.art

**public notes for experiments, social surfaces, and small web systems**

[site](https://actora.art/) · [terminal](docs/terminal.md) · [experiments](docs/experiments.md) · [social](docs/social.md) · [privacy](docs/privacy.md) · [changelog](CHANGELOG.md)

![repo](https://img.shields.io/badge/repo-public%20docs%20surface-0a0a0a?style=flat-square)
![license](https://img.shields.io/badge/license-rights%20reserved-0a0a0a?style=flat-square)

</div>

## Site

- **terminal** — homepage command interface
- **account** — identity, passkey recovery, archive, and permanent lifecycle controls
- **profiles** — opt-in identity pages at `/u/:username` with direct spatial editing, media, and undo/redo for the owner
- **social** — exact-username finding, friend requests, and friends-only DMs
- **chat** — Aurora, the site chat bot
- **wall** — shared text/ASCII wall
- **lab** — experiments and prototypes
- **space** — orbital mechanics prototype
- **liminal** — first-person concrete test chamber
- **particles** — interactive visual toy
- **info** — links, contact, credits

## Read First

- [docs/terminal.md](docs/terminal.md) - homepage terminal commands and flow
- [docs/social.md](docs/social.md) - profiles, badges, friends, and DMs
- [docs/experiments.md](docs/experiments.md) - public experiment notes
- [docs/privacy.md](docs/privacy.md) - privacy notes
- [CHANGELOG.md](CHANGELOG.md) - public release notes

This README is the public docs index. Implementation source, deployment details, admin behavior, moderation internals, storage layout, runtime state, and secrets live outside this public repo.

## Site Stack

- Astro
- TypeScript
- Preact
- Three.js
- Node.js backend for interactive site-owned APIs

## Privacy

No analytics scripts. No ads. No cross-site tracking.

Interactive surfaces keep only the state they need to work. See [docs/privacy.md](docs/privacy.md).

## License

No open-source license is granted unless a file says otherwise.

Copyright © computment. All rights reserved.
