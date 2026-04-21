# CHANGELOG

Product-level changes visible to visitors and developers.

## 0.1.6 — 2026-04-21

- Security: wall clients no longer receive raw IP addresses from the public wall API
- Security: oversized API request bodies are now rejected
- Security: stricter security headers added (CSP + HSTS)
- Site: HTML page cache-control now consistently applies to directory routes like `/chat/` and `/lab/`

## 0.1.5 — 2026-04-21

- Site: normalized header and title spacing across `/projects`, `/projects/actora`, and `/lab`
- Site: `/lab` index subtitle removed for a simpler section page
- Site: section index titles (`/projects`, `/lab`) are now larger than child-page titles
- Docs: codebase docs now note the shared `Base.astro` shell and normal footer back link

## 0.1.4 — 2026-04-21

- Admin: removed `cd admin` from the homepage terminal
- Admin: basic auth now rate-limited to 3 failed attempts per IP per 60 minutes

## 0.1.3 — 2026-04-21

- Chat: system prompt restructured into sections (personality, site, about computment), leaner wording
- Chat: bot can now talk about Cities: Skylines 2
- Terminal: added `bitch` easter egg (→ no u)
- Terminal: all commands and page targets are case-insensitive
- Terminal: `ls` no longer shows sub-pages, only top-level pages
- Terminal: `help` output alignment fixed

## 0.1.2 — 2026-04-21

- Chat: per-minute rate limit (10 messages/minute per IP)
- Chat: Gemini API rate limit errors now show a friendly message instead of a generic error
- Chat: 429 responses include `detail` field with explanation
- Terminal: removed greeting easter eggs (hi, hey, hello) to avoid confusion with chat
- Terminal: all commands and page targets are now case-insensitive
- Terminal: `ls` no longer shows sub-pages — only top-level pages (projects, chat, lab)
- Terminal: `help` output alignment fixed
- Admin dashboard: shows max per minute stat alongside max per day

## 0.1.1 — 2026-04-21

- Projects index page at `/projects/`
- Terminal: `projects` page added, `cd projects/` works (trailing slash stripped)
- actoraOS version synced to changelog version
- Removed duplicate back button from projects page

## 0.1.0 — 2026-04-21

- Terminal homepage with actoraOS branding
- Chat bot page
- Lab: collaborative text wall with daily budgets, fading, and erase mechanics
- Lab: particles visual experiment
- Projects page
- Dark mode throughout
- Back links on all sub-pages
- Wall info popup on first visit