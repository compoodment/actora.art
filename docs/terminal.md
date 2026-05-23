# Terminal

The homepage terminal is the main public entry point for actora.art. It accepts short commands, prints responses in place, and opens site pages when a command navigates.

## Flow

- Type a command at the prompt and press Enter.
- Suggestions appear while typing. Press Tab to accept the active suggestion.
- Arrow keys move through suggestions while the suggestion list is open. Without suggestions, they move through command history.
- Escape dismisses the current suggestion list.
- Some commands ask a follow-up prompt, such as `find` and `register`.
- Ctrl+C twice cancels an active `find` or `register` prompt.
- Navigation commands print a short message before opening the target page.
- Terminal output is kept for the current browser session and resets on reload.
- `clear` resets the visible terminal back to the startup lines.

## Pages

`ls` lists the current page targets:

- `projects`
- `info`
- `chat`
- `lab`
- `account`

Use `cd <page>` to open a target. `account` requires sign-in; if signed out, use `login` or `register`.

Use `cat <page>` to print a short description without leaving the terminal.

## Commands

- `what?` - brief walkthrough.
- `help` - command list.
- `ls` - list page targets.
- `cd <page>` - open a page.
- `cat <page>` - show what a page is for.
- `find` or `find <username>` - exact username lookup.
- `register` - create a passkey account.
- `login` - sign in with a passkey.
- `logout` - sign out.
- `whoareu` - print the site owner handle.
- `clear` - reset the terminal output.

## Find

`find <username>` opens `/u/:username` for an exact username match. `@` is optional. If no username is given, the terminal asks for one.

Exact lookup can open public or private profile state pages. It does not expose private profile fields in the terminal itself.

## Account Flow

`register` asks for a username and display name, then starts browser passkey creation. Successful registration signs in immediately.

`login` starts browser passkey sign-in. `logout` signs out the current account.

Passkey prompts are handled by the browser or device. Cancelling a passkey prompt cancels the terminal flow.

## Boundaries

The terminal is a public navigation and account surface. It does not expose implementation source, admin controls, moderation internals, storage layout, runtime state, or secrets.
