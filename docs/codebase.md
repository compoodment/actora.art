# Source boundary

This public repo does not contain actora.art implementation source anymore.

The site is a live service with accounts, chat, admin tooling, abuse controls, and security history. Keeping implementation details public made it too easy to map the system and extract source through secondary tools.

## What stays public

- visitor-facing behavior notes
- public API contract shapes
- public privacy notes
- public testing notes
- release notes

## What stays private

- frontend source code
- backend source code
- admin implementation
- deployment scripts/config
- operational paths, ports, logs, and recovery details
- secrets or secret-adjacent structure

If a public doc accidentally exposes implementation or operational detail that helps attackers more than visitors/contributors, it should be moved or removed.
