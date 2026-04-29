# Public API contract

Public `/api/*` behavior used by actora.art's interactive pages.

This is a visitor/developer-facing contract, not an implementation map. It intentionally omits backend source, private ops details, admin-only routes, storage layout, secrets, and internal error taxonomy.

## Conventions

- API routes are same-origin under `https://actora.art/api/*`.
- Responses are JSON unless a route is unavailable or blocked before it reaches the app.
- Dynamic JSON responses are sent with no-store cache headers.
- Visitor identity is cookie-backed and handled server-side.
- Error bodies are intentionally small. Clients should treat unknown error strings as recoverable failures and show a generic message.

## Chat

### `GET /api/chat/bootstrap`

Returns the current visitor's chat state.

Guests get the current browser chat. Signed-in users may get saved active/archived chat summaries in addition to the selected chat.

### `POST /api/chat`

Sends a message to Aurora and returns the updated visible messages.

Public request shape:

```json
{
  "message": "hello",
  "model": "fast"
}
```

`model` may be `fast` or `smart`. If omitted, the site uses its default mode for the current chat.

Aurora may use sanitized public docs/changelog snippets for factual actora.art questions. That lookup cannot read source code, private docs, operational notes, runtime state, secrets, or admin-only internals.

### Signed-in chat actions

Signed-in chat history uses these public actions:

- `POST /api/chat/new`
- `POST /api/chat/select`
- `POST /api/chat/rename`
- `POST /api/chat/archive`
- `POST /api/chat/unarchive`
- `POST /api/chat/delete`
- `POST /api/chat/reset`

Guest chats stay browser-scoped instead of using saved-history actions.

Archived signed-in chats are read-only and auto-delete after 7 days.

## Wall

### `GET /api/wall`

Returns the visible wall grid plus ownership hints for the current visitor.

### `GET /api/wall/budget`

Returns the current visitor's available wall budget and recent undo/redo availability.

### `POST /api/wall/paint`

Paints one or more cells when the visitor has enough character budget.

Public request shape:

```json
{
  "cells": [
    { "x": 0, "y": 0, "char": "A", "color": "#ff00aa" }
  ]
}
```

### `POST /api/wall/erase`

Erases the current visitor's own eligible visible cells when the erase/refund rules allow it.

### `POST /api/wall/undo`

Undoes the current visitor's most recent eligible confirmed wall action.

### `POST /api/wall/redo`

Redoes the current visitor's most recent eligible undone wall action.

### `GET /api/wall/preferences`

Returns signed-in wall preferences such as saved colors. Guests use local/browser-only preferences.

### `POST /api/wall/preferences`

Updates signed-in wall preferences.

## Accounts and passkeys

### `GET /api/auth/me`

Returns whether the current visitor is signed in and, if so, their public account display fields.

### `POST /api/auth/logout`

Logs out the current auth session.

### `GET /api/auth/passkeys`

Returns metadata for the signed-in user's own passkeys. It does not expose credential secrets.

### `POST /api/auth/passkeys/rename`

Renames one of the signed-in user's own passkeys.

### `POST /api/auth/passkeys/remove`

Removes one of the signed-in user's own passkeys when account safety rules allow it.

### `POST /api/auth/passkey/register/start`

Starts passkey registration.

Signed-out registration creates a new account. Signed-in registration adds another passkey to the current account. Registration requires WebAuthn user verification.

### `POST /api/auth/passkey/register/finish`

Completes passkey registration and signs in or updates the current account.

### `POST /api/auth/passkey/login/start`

Starts passkey login. Login requires WebAuthn user verification.

### `POST /api/auth/passkey/login/finish`

Completes passkey login and signs the visitor in.

## Public boundary

The public contract covers visitor-facing routes only. Admin routes, operational checks, private source, deployment details, storage files, moderation internals, and recovery procedures are not public API documentation.
