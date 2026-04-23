# API Contract

Public contract for the `/api/*` routes consumed by the actora.art frontend.

This repo's frontend calls these routes through [`src/lib/api.ts`](../src/lib/api.ts). Interactive features assume a separate backend serves these routes on the same origin.

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

type WallCell = {
  char: string;
  color: 'red' | 'green' | 'yellow' | 'cyan' | 'magenta' | 'white' | 'brightWhite';
  placedAt: number;
  isMine: boolean;
};

type WallBudget = {
  remaining: number;
  refundsLeft: number;
  maxDaily: number;
  nextResetAt: number;
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

Bootstraps the current guest-or-user chat thread.

```ts
type GetChatResponse = {
  messages: ChatMessage[];
  signedIn: boolean;
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
};
```

Success response:

```ts
type PostChatResponse = {
  reply: string;
  signedIn: boolean;
  remaining: number;
  resetAt: number;
};
```

Current error responses:

```ts
{ error: 'forbidden', message: 'access denied' }
{ error: 'chat_paused', message: 'computment decided to pause the chat bot momentarily :(' }
{ error: 'daily_limit_reached', message: 'daily message limit reached', remaining: 0, resetAt: number }
{ error: 'minute_limit_reached', message: 'slow down — you talk too much, leave me alone', detail: string, remaining: 0 }
{ error: 'api_rate_limited', message: 'you talk too much, leave me alone', detail: string }
{ error: 'invalid_message' }
{ error: 'body_too_large' }
{ error: 'bad_request' }
{ error: 'api_error', message: 'Failed to get response' }
```

## Wall

### `GET /api/wall`

Returns the public wall state plus ownership flags for the current visitor.

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

### `GET /api/wall/budget`

Returns the current visitor's wall budget state.

```ts
type GetWallBudgetResponse = WallBudget;
```

Possible non-200 error:

```ts
{ error: 'forbidden', message: 'access denied' }
```

### `POST /api/wall/paint`

Places characters on the wall.

Request:

```ts
type PaintWallRequest = {
  cells: Array<{
    x: number;
    y: number;
    char: string; // exactly one character
    color?: 'red' | 'green' | 'yellow' | 'cyan' | 'magenta' | 'white' | 'brightWhite';
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
{ error: 'budget_exhausted', remaining: number, refundsLeft: number, maxDaily: number, nextResetAt: number }
{ error: 'body_too_large' }
{ error: 'bad_request' }
```

### `POST /api/wall/erase`

Erases cells owned by the current visitor.

Request:

```ts
type EraseWallRequest = {
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
};
```

Current error responses:

```ts
{ error: 'forbidden', message: 'access denied' }
{ error: 'invalid_cells' }
{ error: 'refund_limit_reached', remaining: number, refundsLeft: number, maxDaily: number, nextResetAt: number }
{ error: 'body_too_large' }
{ error: 'bad_request' }
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
