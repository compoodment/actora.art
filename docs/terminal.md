# Terminal

The homepage terminal is the main public entry point for actora.art. It accepts short commands, prints responses in place, and opens site pages when a command navigates.

## Flow

- Type a command at the prompt and press Enter.
- The opening ASCII system card uses one rounded 44-column composition containing the reactive cat, current actoraOS version, and short guidance for `page` and `help`. Its border is literal terminal text rather than window chrome, uses one aligned monospace face for content and box-drawing characters, and stays visible while the activity rail scrolls beneath it.
- Submitted commands, working messages, and results appear in one open activity rail instead of nested boxes.
- When one completion is unambiguous, its remaining characters appear as dim inline ghost text without changing what you typed. Ambiguous matches appear in a small unboxed rail with descriptions.
- Press Tab to accept the visible ghost or active ambiguous match. When there is no completion to accept, Tab and Shift+Tab follow normal browser focus navigation.
- Account commands are state-aware: guests see `register`, `login`, and `recover`; signed-in users see `logout`.
- Account, Messages, profile, Social, and `@guest` links can open the terminal with the relevant auth command prefilled. Press Enter to run it; opening the terminal never starts a passkey prompt or logs out by itself.
- Arrow keys move through ambiguous suggestions or the page picker while either is open. Without a selectable rail, they move through command history.
- Escape dismisses the current completion or closes the page picker without navigating.
- Some commands ask a follow-up prompt, such as `find` and `register`.
- The prompt context identifies follow-up flows such as `register`, `recover`, and `find`; compact guidance changes only when an action needs explanation.
- Ctrl+C twice cancels an active `find`, `register`, `recover`, or archived-account restore prompt.
- Navigation commands print a short message before opening the target page.
- Terminal output is kept for the current browser session and resets on reload.
- New output stays in view while the terminal is already at the latest line. Scrolling up to read or copy older output does not pull the view back down.
- `clear` clears the activity rail while leaving the system card available.
- The terminal adds no borrowed product logo, user/session banner, or permanent ready label. Account identity remains available through the site's shared footer and state-aware commands.

## Pages

Type `page` to open a selectable list of the current page targets:

- `info`
- `chat`
- `music`
- `lab`
- `account`
- `messages`

Use Up/Down and Enter, or choose a row directly. Typing filters the picker, and `page <name>` opens a target directly, such as `page music`.

`account` and `messages` remain visible while signed out so their requirement is clear, but either picker selection or a direct command checks the current session again before opening them. If signed out, use `login`, `register`, or `recover` first.

The former `ls` and `cd` commands are removed. `pages` is not an alias for `page`.

## Commands

Always available:

- `what?` - brief walkthrough.
- `help` - command list.
- `page` - choose a page from the picker.
- `page <name>` - open a page directly.
- `clear` - clear the activity rail while keeping the system card.

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

`login` starts browser passkey sign-in. A safe Account, Messages, or profile return destination can be resumed after login, registration, or completed recovery; cancellation leaves the terminal open for retry. Only Account, Messages, and canonical profile paths are accepted. Recovery returns only after the replacement key has been acknowledged and, for an archived account, after explicit restore. If a verified account is archived, login does not sign it in: the terminal asks for exact `restore` or `cancel`, and only an explicit restore reactivates the account and creates a session.

`recover` asks for a username, then collects the recovery key in a separate hidden field that is not placed in visible or recalled terminal history. A valid key starts creation of one new passkey. Existing passkeys remain unless the account is already at its limit; in that case, the terminal explains which least-recently-used passkey would be replaced and requires an explicit `replace` confirmation before the browser passkey prompt starts. Successful recovery shows a replacement recovery key once and waits for it to be saved before continuing. Recovery of an archived account likewise does not reactivate it implicitly; after the replacement key is saved, the terminal offers the separate restore choice.

Recovery keys are created or replaced from Account Security after approval from a currently linked passkey. Each new key is shown only once, and replacing or successfully using it invalidates the previous key.

`logout` signs out the current account and is only shown while signed in. Account is divided into Identity, Profile, Security, Account lifecycle, and Session. Its session action links back to the homepage with `logout` prefilled rather than owning a separate logout button; Enter is still required.

Passkey prompts are handled by the browser or device. Cancelling a passkey prompt cancels the terminal flow without changing passkeys.

Account archive is started from the Account lifecycle section, not as a terminal command. It requires exact username confirmation and approval from a linked passkey, signs out every session, and returns to the terminal with a one-time notice. The account stays archived until a later verified login or recovery is followed by explicit terminal restore.

Permanent account deletion is also started from Account lifecycle, never as a terminal command. It has a separate irreversible warning, exact `delete @username forever` confirmation, and linked-passkey approval. Success removes the account, returns to the homepage as a guest, and shows a one-time non-secret notice that the deleted username remains reserved for 90 days. If the browser loses the final response, the terminal makes no claim about whether deletion finished: it asks the person to try signing in once and not repeat deletion while the result is uncertain.

## Boundaries

The terminal is a public navigation and account surface. It does not expose implementation source, admin controls, moderation internals, storage layout, runtime state, or secrets.
