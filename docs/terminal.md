# Terminal

The homepage terminal is the main public entry point for actora.art. It accepts short commands, prints responses in place, and opens site pages when a command navigates.

## Flow

- Type a command at the prompt and press Enter.
- Suggestions appear while typing. Press Tab to accept the active suggestion.
- Account commands are state-aware: guests see `register`, `login`, and `recover`; signed-in users see `logout`.
- Account, Messages, profile, Social, and `@guest` links can open the terminal with the relevant auth command prefilled. Press Enter to run it; opening the terminal never starts a passkey prompt or logs out by itself.
- Arrow keys move through suggestions while the suggestion list is open. Without suggestions, they move through command history.
- Escape dismisses the current suggestion list.
- Some commands ask a follow-up prompt, such as `find` and `register`.
- Ctrl+C twice cancels an active `find`, `register`, or `recover` prompt.
- Navigation commands print a short message before opening the target page.
- Terminal output is kept for the current browser session and resets on reload.
- `clear` resets the visible terminal back to the startup lines.

## Pages

`ls` lists the current page targets:

- `info`
- `chat`
- `music`
- `lab`
- `account`
- `messages`

Use `cd <page>` to open a target. `account` and `messages` require sign-in; if signed out, use `login` or `register`.

## Commands

Always available:

- `what?` - brief walkthrough.
- `help` - command list.
- `ls` - list page targets.
- `cd <page>` - open a page.
- `clear` - reset the terminal output.

Guest-only:

- `register` - create a passkey account.
- `login` - sign in with a passkey.
- `recover` - add a new passkey using a separately saved recovery key.

Signed-in only:

- `find` or `find <username>` - find a profile.
- `logout` - sign out.

## Find

While signed in, `find <username>` opens `/u/:username` for a matching username. `@` is optional. If no username is given, the terminal asks for one.

The lookup can open public or private profile state pages. It does not expose private profile fields in the terminal itself.

## Account Flow

`register` asks for a username and display name, then starts browser passkey creation. Successful registration signs in immediately. `register` and `login` are guest commands; they disappear after sign-in.

`login` starts browser passkey sign-in. A login opened from Account, Messages, or a profile returns there after success; cancellation leaves the terminal open for retry. Only Account, Messages, and canonical profile paths are accepted as return destinations. If the verified account is archived, login does not sign it in: the terminal asks for exact `restore` or `cancel`, and only an explicit restore reactivates the account and creates a session.

`recover` asks for a username, then collects the recovery key in a separate hidden field that is not placed in visible or recalled terminal history. A valid key starts creation of one new passkey. Existing passkeys remain unless the account is already at its limit; in that case, the terminal explains which least-recently-used passkey would be replaced and requires an explicit `replace` confirmation before the browser passkey prompt starts. Successful recovery shows a replacement recovery key once and waits for it to be saved before continuing. Recovery of an archived account likewise does not reactivate it implicitly; after the replacement key is saved, the terminal offers the separate restore choice.

Recovery keys are created or replaced from Account Security after approval from a currently linked passkey. Each new key is shown only once, and replacing or successfully using it invalidates the previous key.

`logout` signs out the current account and is only shown while signed in. Account separates identity, public-profile, security, and session settings, but its session action still links back to the homepage with `logout` prefilled rather than owning a separate logout button; Enter is still required.

Passkey prompts are handled by the browser or device. Cancelling a passkey prompt cancels the terminal flow without changing passkeys.

Account archive is started from the Account lifecycle section, not as a terminal command. It requires exact username confirmation and approval from a linked passkey, signs out every session, and returns to the terminal with a one-time notice. The account stays archived until a later verified login or recovery is followed by explicit terminal restore.

Permanent account deletion is also started from Account lifecycle, never as a terminal command. It has a separate irreversible warning, exact `delete @username forever` confirmation, and linked-passkey approval. Success removes the account, returns to the homepage as a guest, and shows a one-time non-secret notice that the deleted username remains reserved for 90 days. If the browser loses the final response, the terminal makes no claim about whether deletion finished: it asks the person to try signing in once and not repeat deletion while the result is uncertain.

## Boundaries

The terminal is a public navigation and account surface. It does not expose implementation source, admin controls, moderation internals, storage layout, runtime state, or secrets.
