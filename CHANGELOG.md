# CHANGELOG

Role: public product changelog; keep documentation maintenance brief and leave private ops history elsewhere.

Product-level changes visible to visitors and developers.

## Unreleased

- Docs: added top-level role notes to public Markdown docs so repo, product, API, deploy, experiment, privacy, and changelog boundaries are explicit

## 0.1.31 — 2026-04-24

- Wall: replaced always-on 5s wall polling with Server-Sent Events live updates, keeping a slower recovery refresh for stream errors
- Wall: pending drag paints/erases now stay local until their write settles, so live refreshes no longer resurrect cells mid-drag
- Docs: documented the wall live-update event stream
- Terminal: actoraOS bumped to `v0.1.31` in the boot text and footer version

## 0.1.30 — 2026-04-24

- UI: moved the footer `terminal` link away from the identity cluster so username/account state reads separately from navigation
- Wall: rewrote the `?` help copy to be shorter and less generic
- Terminal: actoraOS bumped to `v0.1.30` in the boot text and footer version

## 0.1.29 — 2026-04-24

- UI: added the missing shared `--color-border` token so list and info-card borders render consistently across public pages
- Versioning: package metadata now tracks the public site release version alongside the actoraOS version constant
- Terminal: actoraOS bumped to `v0.1.29` in the boot text and `clear` reset

## 0.1.28 — 2026-04-24

- Wall: `/lab/wall` now uses CSS grid cells instead of preformatted newline layout, fixing row skewing on real devices
- Terminal: actoraOS bumped to `v0.1.28` in the boot text and `clear` reset

## 0.1.27 — 2026-04-24

- Auth: passkey login and registration now work on both `actora.art` and `www.actora.art`, fixing iPhone passkey failures caused by the host mismatch between the two live public origins
- Terminal: actoraOS bumped to `v0.1.27` in the boot text and `clear` reset

## 0.1.26 — 2026-04-23

- Auth: account page `add another passkey` now starts the signed-in passkey registration flow instead of showing a placeholder alert
- Auth: account page now shows lightweight passkey setup status, cancellation, and success feedback
- Docs: public auth API docs now note that the existing register start/finish endpoints also handle signed-in add-passkey registration
- Terminal: actoraOS bumped to `v0.1.26` in the boot text and `clear` reset

## 0.1.25 — 2026-04-23

- Terminal: homepage description copy now says `projects, experiments, computment's site`, and the terminal `cat readme` fallback matches that wording
- Terminal: actoraOS bumped to `v0.1.25` in the boot text and `clear` reset

## 0.1.24 — 2026-04-23

- Terminal: homepage `register` prompt cancellation now uses `Ctrl+C` only; the first press arms cancellation, the second cancels registration input, and the visible hint no longer mentions `Esc`
- Terminal: actoraOS bumped to `v0.1.24` in the boot text and `clear` reset

## 0.1.23 — 2026-04-23

- Terminal: `register` prompt flow now shows an in-terminal cancel hint, supports immediate `Esc` cancel, and requires `Ctrl+C` twice before cancelling registration input
- Terminal: actoraOS bumped to `v0.1.23` in the boot text and `clear` reset

## 0.1.22 — 2026-04-23

- Terminal: `login` now says `already signed in silly.` when you're already signed in, and `logout` now says `already signed out silly.` when you're already signed out
- Terminal: actoraOS bumped to `v0.1.22` in the boot text and `clear` reset

## 0.1.21 — 2026-04-23

- Particles: removed the stale in-page back button so `/lab/particles` now relies on the shared footer navigation only

## 0.1.20 — 2026-04-23

- UI: homepage footer now keeps browser-history `back` and `forward` available, so returning to the terminal does not strand history navigation
- UI: footer version label now preserves the `actoraOS` casing instead of forcing lowercase styling
- Terminal: added a `logout` command to the homepage terminal auth flow

## 0.1.19 — 2026-04-23

- UI: non-home pages now show a dim centered `actoraOS v...` footer label for stronger terminal continuity
- UI: footer version text now shares the same source of truth as the terminal boot version

## 0.1.18 — 2026-04-23

- Wall: removed the stale in-page back button so `/lab/wall` now relies on the shared footer navigation only

## 0.1.17 — 2026-04-23

- UI: footer navigation now uses `back` and `forward` on the left, with `terminal` and identity on the right
- UI: footer navigation buttons now stay visible-but-disabled instead of disappearing when browser history is unavailable

## 0.1.16 — 2026-04-23

- UI: immersive pages now reserve space for the persistent footer so bottom-edge controls are not blocked
- Wall: character and color selection on `/lab/wall` no longer sits under the footer on touch devices
- Particles: bottom hint on `/lab/particles` now clears the persistent footer

## 0.1.15 — 2026-04-23

- UI: Hidden `back` and `terminal` footer links when viewing the homepage
- Terminal: Reordered `help` output so `register` appears before `login`

## 0.1.14 — 2026-04-23

- UI: Added persistent global footer with navigation (`back` / `terminal`) and identity (`@guest` / `@username`)
- Auth: Added interactive `register` and `login` commands to the Terminal
- Auth: Added `/account` page for passkey management, accessible via `cd account`
- Mobile: Fixed iOS Safari auto-zoom bug on terminal and chat inputs

## 0.1.13 — 2026-04-23

- Wall: ownership and daily wall budgets now follow browser/account identity instead of shared IP
- Wall: people on the same network no longer share wall ownership, erase rights, or wall budget state
- Wall: the Phase 4 identity rollout intentionally reset the old wall state once instead of keeping legacy IP-owned data
- Terminal: actoraOS bumped to `v0.1.13` in the boot text and `clear` reset

## 0.1.12 — 2026-04-23

- Chat: `/chat` now uses the normal footer back link instead of a duplicate in-page back control
- Chat: recent-thread restore no longer depends on stale client-side thread-handle state
- Terminal: actoraOS bumped to `v0.1.12` in the boot text and `clear` reset

## 0.1.11 — 2026-04-22

- Chat: reopening `/chat` now restores your recent conversation in the same browser/device
- Terminal: pressing Enter on an empty homepage prompt no longer adds blank prompt lines
- Site: updated `cat lab` in the terminal to say `experiments and web games`
- Site: updated `cat info` in the terminal to say `links and contact`
- Site: removed the chat input focus outline so the chat box matches the terminal’s quieter style
- Site: terminal state now survives back-forward navigation, while refresh starts the homepage terminal fresh
- Site: stacked the `/projects/actora` status under the project name and kept it lowercased to match the rest of the site
- Site: removed the `/info` link from the projects page, since it should stay a quieter destination
- Site: added checkmark feedback to the `/info` Discord copy button and tightened the row layout
- Site: moved the homepage active-construction note below the terminal prompt and darkened it so it reads as a quiet status line
- Docs: public `README.md` now owns the docs reading order and public-doc scope note
- Docs: removed redundant `docs/guide.md`
- Terminal: actoraOS bumped to `v0.1.11` in the boot text and `clear` reset

## 0.1.10 — 2026-04-22

- Site: added an active-construction notice to the homepage terminal
- Terminal: actoraOS bumped to `v0.1.10` in the boot text and `clear` reset

## 0.1.9 — 2026-04-22

- Site: renamed the lab page labels to "visual particle simulator" and "the wall"
- Site: `the wall` now shows as the page title instead of just `wall`
- Terminal: actoraOS bumped to `v0.1.9` in the boot text and `clear` reset

## 0.1.8 — 2026-04-22

- Site: removed the terminal input focus outline, since the caret already shows focus

## 0.1.7 — 2026-04-22

- SEO: added canonical URLs, Open Graph/Twitter metadata, and sitemap/robots support
- Accessibility: improved focus visibility, input/button labelling, and live-region semantics on interactive pages
- Accessibility: particles now respects reduced-motion preferences and the site no longer blocks normal page scrolling globally

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
