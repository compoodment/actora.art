# Public API boundary

actora.art uses same-origin `/api/*` routes for its interactive pages.

This is not a stable third-party API reference. It is a public boundary note for visitors and testers. Implementation details, private operations, storage layout, and internal error details live in private docs.

## Public shape

- Interactive site features talk to same-origin `/api/*` routes.
- Most normal API responses are JSON; live update streams may use event streams.
- Visitor identity is cookie-backed and handled by the site.
- Dynamic JSON responses are not meant to be cached.
- Errors are small; clients should handle unknown failures generically.

## Interactive areas

### Chat

The chat page sends messages to Aurora and receives visible chat messages back.

Guests use the current browser chat. Signed-in visitors can manage saved chats from the public UI.

Aurora may use sanitized public docs and changelog notes for factual actora.art questions. It cannot access non-public project material.

### Wall

The wall page loads the visible grid, lets visitors paint visible characters, and supports normal undo/redo/erase behavior from the public UI.

The public wall contract is about what visitors can see and do. Hidden state details are not public documentation.

### Space

Signed-in visitors can save and load Space simulation state from the public UI. Guests can use Space temporarily in the current browser.

The public Space contract is about visible save/load behavior. Implementation details, storage layout, and internal simulation state belong in private docs.

### Accounts

The account UI supports passkey-based sign-in, sign-out, editable username/display name, user-owned passkey management, and opt-in public profile settings.

Credential secrets and private account state are not exposed through public docs.

### Public profiles

Profiles render at `/u/:username`, where the route follows the current username. Public profiles show display name as the main heading and username as the handle; private profiles show a private-state page to other visitors. Signed-in visitors can manage their account identity, profile fields, and display-only badges from `/account`.

Profile content is public only after the account owner turns it on. Badges are display markers only; they are not permission roles.

### Social

The social surface supports exact-username finding, mutual friend requests, a one-way System notification thread, and friends-only DMs.

Signed-in visitors can send friend requests from profile pages, accept or decline incoming requests from the footer `social` popup, and DM accepted friends. For signed-in visitors, social updates can arrive without a manual page refresh.

Social friendships are not stored account roles and do not grant permission changes, friend+ access, admin access, chat limits, Wall budgets, or other runtime capabilities.

## Boundary

If a route, field, error, or behavior is not needed to understand normal visitor-facing behavior, it belongs outside this public repo.
