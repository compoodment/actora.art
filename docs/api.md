# API Contract

Public `/api/*` shapes used by the actora.art frontend.

Frontend calls are centralized in [`src/lib/api.ts`](../src/lib/api.ts). Interactive features assume these routes exist on the same origin as the site.

## Conventions

- All routes return JSON.
- Visitor identity is cookie-backed. The frontend expects the backend to manage guest and auth cookies server-side.
- Error bodies are small and route-specific, but they follow the same general shape:

```ts
type ApiError = {
  error: string;
  message?: string;
  detail?: string;
  remaining?: number;
  refundsLeft?: number;
  maxDaily?: number;
  resetAt?: number;
  nextResetAt?: number;
};
```

## Shared Types

```ts
type PublicUser = {
  id: string;
  username: string;
  displayName: string;
};

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

type ChatSessionSummary = {
  id: string;
  title: string;
  status: 'active' | 'archived';
  messageCount: number;
  createdAt: number | null;
  updatedAt: number | null;
  archivedAt: number | null;
};

type WallCell = {
  char: string;
  color: WallColor;
  placedAt: number;
  isMine: boolean;
};

type WallColor =
  | 'red' | 'green' | 'yellow' | 'cyan' | 'magenta' | 'white' | 'brightWhite'
  | `#${string}`; // validated 6-digit #rrggbb; legacy named tokens are accepted for old wall cells

type WallBudget = {
  remaining: number;
  refundsLeft: number;
  maxDaily: number;
  nextResetAt: number;
  canUndo: boolean;
  canRedo: boolean;
};

type CredentialPayload = {
  id: string;
  type: 'public-key';
  rawId: string;
  authenticatorAttachment: 'platform' | 'cross-platform' | null;
  clientExtensionResults: Record<string, unknown>;
  response:
    | {
        clientDataJSON: string;
        attestationObject: string;
        transports: string[];
      }
    | {
        clientDataJSON: string;
        authenticatorData: string;
        signature: string;
        userHandle: string | null;
      };
};
```

## Chat

### `GET /api/chat`

Bootstraps the current guest chat or the signed-in user's selected chat session.

```ts
type GetChatResponse = {
  messages: ChatMessage[];
  signedIn: boolean;
  currentSessionId?: string | null;
  sessions?: {
    active: ChatSessionSummary[];
    archived: ChatSessionSummary[];
  } | null;
};
```

Possible non-200 error:

```ts
{ error: 'forbidden', message: 'access denied' }
```

### `POST /api/chat`

Sends one user message and returns one assistant reply.

Request:

```ts
type PostChatRequest = {
  message: string; // required, max length 4000
  sessionId?: string; // signed-in only
  model?: 'fast' | 'smart';
};
```

Success response:

```ts
type PostChatResponse = {
  reply: string;
  signedIn: boolean;
  sessionId?: string;
  currentSessionId?: string | null;
  sessions?: {
    active: ChatSessionSummary[];
    archived: ChatSessionSummary[];
  } | null;
  remaining: number;
  resetAt: number;
};
```

Signed-in session actions:

- `POST /api/chat/new`: create a new active empty session and select it.
- `POST /api/chat/select`: open an active session, or open an archived session read-only without replacing the selected active session.
- `POST /api/chat/rename`: rename one owned session.
- `POST /api/chat/archive`: move one active session into the read-only archived list.
- `POST /api/chat/unarchive`: restore one archived session into the active list without overwriting another active session.
- `POST /api/chat/delete`: delete one owned session.
- `POST /api/chat/reset`: clear the current account/guest chat context.

Daily chat limit: 300 messages per account or guest identity per rolling 24-hour window. The short burst limit is 20 messages per minute per account or guest identity.

Current error responses:

```ts
{ error: 'forbidden', message: 'access denied' }
{ error: 'chat_paused', message: 'computment decided to pause the chat bot momentarily :(' }
{ error: 'daily_limit_reached', message: 'daily message limit reached', remaining: 0, resetAt: number }
{ error: 'chat_generation_in_flight', message: 'a reply is already running for this chat owner', detail: string }
{ error: 'minute_limit_reached', message: 'slow down — you talk too much, leave me alone', detail: string, remaining: 0 }
{ error: 'api_rate_limited', message: 'you talk too much, leave me alone', detail: string }
{ error: 'session_not_found' }
{ error: 'session_archived', message: 'archived chats are read-only' }
{ error: 'invalid_message' }
{ error: 'body_too_large' }
{ error: 'bad_request' }
{ error: 'api_error', message: 'Failed to get response' }
```

## Wall

### `GET /api/wall`

Returns the public wall state plus ownership flags for the current visitor.

Wall coordinates are layered server-side. Public wall responses expose only the visible top layer as `WallCell | null`; internal ownership data is not included.

```ts
type GetWallResponse = {
  grid: (WallCell | null)[][];
  cols: number;
  rows: number;
  filled: number;
  total: number;
};
```

Possible non-200 error:

```ts
{ error: 'forbidden', message: 'access denied' }
```

### `GET /api/wall/events`

Streams confirmed wall mutations using Server-Sent Events. Clients should load `GET /api/wall` for initial state, then listen for live updates here.

Events:

```ts
type WallPatchEvent = {
  cells: Array<{
    x: number;
    y: number;
    cell: WallCell | null;
  }>;
  cols: number;
  rows: number;
  filled: number;
  total: number;
};

type WallRefetchEvent = {
  reason: string;
};
```

Current event names:

```txt
patch
refetch
```

The stream also sends keepalive comments. If the stream errors or disconnects, clients should reconnect and may temporarily refresh `GET /api/wall`.

### `GET /api/wall/budget`

Returns the current visitor's wall budget state plus whether the current owner has recent undo/redo history available.

```ts
type GetWallBudgetResponse = WallBudget;
```

Possible non-200 error:

```ts
{ error: 'forbidden', message: 'access denied' }
```

### `GET /api/wall/tool-preference`

Returns the signed-in user's saved wall tool preference. Signed-out callers receive `signedIn: false` and no saved preference or saved color slots; guest preference storage is browser-local. When a signed-in preference is returned, `savedColors` is exactly four nullable slots.

```ts
type WallToolPreference = {
  char: string; // exactly one character; alphabetic chars are uppercase
  color: WallColor;
  mode: 'paint' | 'erase';
  savedColors?: Array<WallColor | null>; // signed-in preferences only; exactly 4 slots when returned
};

type GetWallToolPreferenceResponse = {
  signedIn: boolean;
  preference: WallToolPreference | null;
};
```

### `POST /api/wall/tool-preference`

Saves the signed-in user's wall tool preference. Saved colors are normalized to exactly four nullable signed-in slots. Signed-out callers receive `401`.

Request:

```ts
type PostWallToolPreferenceRequest = WallToolPreference;
```

Success response:

```ts
type PostWallToolPreferenceResponse = {
  signedIn: true;
  preference: WallToolPreference;
};
```

Current error responses:

```ts
{ error: 'forbidden', message: 'access denied' }
{ error: 'unauthorized' }
{ error: 'invalid_wall_tool_preference' }
{ error: 'body_too_large' }
{ error: 'bad_request' }
```

### `POST /api/wall/paint`

Places characters on the wall. Painting a coordinate pushes a new visible top layer. If the coordinate is already at the server-side stack cap, the oldest hidden layer is dropped. Paint requests validate cells before budget enforcement; daily paint budget is charged only for valid cells that pass bounds, one-character char, uppercase normalization, and color validation, including valid paints over existing cells. Invalid cells are ignored and not charged.

Budget and `canUndo`/`canRedo` fields returned by success and `budget_exhausted` responses are authoritative for the client HUD.

Request:

```ts
type PaintWallRequest = {
  actionId?: string; // optional client stroke/action id for grouping recent undo history
  cells: Array<{
    x: number;
    y: number;
    char: string; // exactly one character; alphabetic chars are stored uppercase
    color?: WallColor;
  }>;
};
```

Success response:

```ts
type PaintWallResponse = WallBudget & {
  placed: number;
};
```

Current error responses:

```ts
{ error: 'forbidden', message: 'access denied' }
{ error: 'invalid_cells' }
{ error: 'budget_exhausted', remaining: number, refundsLeft: number, maxDaily: number, nextResetAt: number, canUndo: boolean, canRedo: boolean }
{ error: 'body_too_large' }
{ error: 'bad_request' }
```

### `POST /api/wall/erase`

Erases visible top layers owned by the current visitor. Erase requests dedupe coordinates and count only coordinates whose current visible top layer is owned by the resolved visitor before refund-limit enforcement. Erasing removes only that top layer; an older unexpired layer underneath may become visible. Non-owned, empty, invalid, or duplicate cells are ignored.

Only cells erased within 24 hours of their original placement refund 1 character and consume 1 refund. Older owned cells can still be erased, but they do not change character budget or refund count.

Budget and `canUndo`/`canRedo` fields returned by success and `refund_limit_reached` responses are authoritative for the client HUD.

Request:

```ts
type EraseWallRequest = {
  actionId?: string; // optional client stroke/action id for grouping recent undo history
  cells: Array<{
    x: number;
    y: number;
  }>;
};
```

Success response:

```ts
type EraseWallResponse = WallBudget & {
  erased: number;
  refunded: number;
};
```

Current error responses:

```ts
{ error: 'forbidden', message: 'access denied' }
{ error: 'invalid_cells' }
{ error: 'refund_limit_reached', remaining: number, refundsLeft: number, maxDaily: number, nextResetAt: number, canUndo: boolean, canRedo: boolean }
{ error: 'body_too_large' }
{ error: 'bad_request' }
```

### `POST /api/wall/undo`

Undoes the current owner's most recent confirmed paint or erase action/stroke when the affected cell stacks still match the expected before/after state. Cells with intervening visible or hidden-stack changes are skipped instead of clobbered. Paint undo refunds the budget units that actually applied. Erase undo restores the erased layer only when the resulting budget charge is safe.

Success response:

```ts
type WallUndoResponse = WallBudget & {
  changed: number;
};
```

### `POST /api/wall/redo`

Redoes the current owner's most recently undone Wall action/stroke with the same ownership-safe stack checks. Redo applies budget/refund deltas only for cells that actually change.

Success response:

```ts
type WallRedoResponse = WallBudget & {
  changed: number;
};
```

## Auth

### `GET /api/auth/me`

Returns the current auth session state.

```ts
type GetAuthMeResponse = {
  signedIn: boolean;
  user: PublicUser | null;
};
```

### `POST /api/auth/logout`

Logs out the current auth session.

Request:

```ts
// no request body
```

Success response:

```ts
type PostAuthLogoutResponse = {
  ok: true;
  signedIn: false;
};
```

### `GET /api/auth/passkeys`

Returns passkey metadata for the signed-in user's own account. Signed-out callers receive `401`.

Success response:

```ts
type PasskeySummary = {
  id: string; // stable non-secret handle for account-scoped updates
  displayId: string; // safe suffix for display only
  nickname: string; // optional user label; empty when unset
  createdAt: number | null;
  lastUsedAt: number | null;
  transports: string[];
  deviceType: 'singleDevice' | 'multiDevice' | string | null;
  backedUp: boolean | null;
};

type GetPasskeysResponse = {
  passkeys: PasskeySummary[];
};
```

The response intentionally does not expose the full credential id, public key, signature counter, or user id.

### `POST /api/auth/passkeys/rename`

Renames one of the signed-in user's own passkeys. Signed-out callers receive `401`.

Request:

```ts
type RenamePasskeyRequest = {
  id: string; // handle from GET /api/auth/passkeys
  nickname: string; // whitespace-normalized, max 40 chars; empty clears it
};
```

Success response:

```ts
type RenamePasskeyResponse = {
  ok: true;
  passkey: PasskeySummary;
};
```

The handle resolves only against the signed-in user's credentials and does not expose the full credential id.

Current error responses:

```ts
{ error: 'unauthorized' }
{ error: 'bad_request' }
{ error: 'body_too_large' }
{ error: 'invalid_passkey_nickname' }
{ error: 'passkey_not_found' }
```

### `POST /api/auth/passkeys/remove`

Removes one of the signed-in user's own passkeys. Signed-out callers receive `401`. The last passkey on an account cannot be removed.

Request:

```ts
type RemovePasskeyRequest = {
  id: string; // handle from GET /api/auth/passkeys
};
```

Success response:

```ts
type RemovePasskeyResponse = {
  ok: true;
  passkeys: PasskeySummary[];
};
```

Current error responses:

```ts
{ error: 'unauthorized' }
{ error: 'bad_request' }
{ error: 'body_too_large' }
{ error: 'passkey_not_found' }
{ error: 'last_passkey', message: 'Add another passkey before removing this one.' }
```

### `POST /api/auth/passkey/register/start`

Starts passkey registration.

- Signed-out visitors use this to create a new account.
- Signed-in users can call the same route with no body (or `{}`) to add another passkey to the current account.

Request:

```ts
type RegisterStartRequest = {
  username?: string; // required when signed out, lowercase a-z, 0-9, _ or -, length 3-24
  displayName?: string; // required when signed out, trimmed display name, max length 40
};
```

Success response:

```ts
type RegisterStartResponse = {
  options: PublicKeyCredentialCreationOptionsJSON;
};
```

The frontend expects `options` directly at the top level. It does not accept alternate wrapper shapes.

Current error responses:

```ts
{ error: 'invalid_username' }
{ error: 'invalid_display_name' }
{ error: 'username_taken' }
{ error: 'registration_start_failed' }
{ error: 'body_too_large' }
{ error: 'bad_request' }
```

### `POST /api/auth/passkey/register/finish`

Completes passkey registration.

- On the new-account path, it creates the user and signs them in.
- On the signed-in path, it attaches the credential to the current account and keeps the current session active.

Request:

```ts
type RegisterFinishRequest = CredentialPayload;
```

Success response:

```ts
type RegisterFinishResponse = {
  ok: true;
  user: PublicUser;
};
```

Current error responses:

```ts
{ error: 'registration_not_started' }
{ error: 'invalid_credential' }
{ error: 'username_taken' }
{ error: 'credential_exists' }
{ error: 'registration_state_mismatch' }
{ error: 'registration_verification_failed' }
{ error: 'body_too_large' }
{ error: 'bad_request' }
```

### `POST /api/auth/passkey/login/start`

Starts passkey login.

Request:

```ts
// no request body required; the frontend sends {}
```

Success response:

```ts
type LoginStartResponse = {
  options: PublicKeyCredentialRequestOptionsJSON;
};
```

The frontend expects `options` directly at the top level. It does not accept alternate wrapper shapes.

Current error responses:

```ts
{ error: 'already_signed_in' }
{ error: 'login_start_failed' }
{ error: 'body_too_large' }
{ error: 'bad_request' }
```

### `POST /api/auth/passkey/login/finish`

Completes passkey login and signs the user in.

Request:

```ts
type LoginFinishRequest = CredentialPayload;
```

Success response:

```ts
type LoginFinishResponse = {
  ok: true;
  user: PublicUser;
};
```

Current error responses:

```ts
{ error: 'login_not_started' }
{ error: 'invalid_credential' }
{ error: 'unknown_credential' }
{ error: 'auth_store_inconsistent' }
{ error: 'login_verification_failed' }
{ error: 'body_too_large' }
{ error: 'bad_request' }
```


### POST /api/chat/reset

Clears the active chat thread for the current signed-in account or guest browser. It does not reset daily or burst message limits.

```js
{ ok: true, deleted: boolean, messages: [], signedIn: boolean }
```


Signed-in chat requests include the public account username and display name in the server-side bot context. Guest chats are labeled as guests.


### Chat model choices

`POST /api/chat` accepts an optional `model` field: `fast` for Gemini 2.5 Flash or `smart` for Gemini 3.1 Pro Preview. The choice is stored on the current account/guest chat session.
