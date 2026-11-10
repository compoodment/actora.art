# Terminal

The homepage terminal is the front door of actora.art. Type a short command and press Enter. It answers right there, or opens a page. Type `help` for the list, or `what?` for a short tour.

## Flow

- As you type, the rest of a matching command shows in dim text. Press Tab to accept it. If several commands match, a short list with descriptions appears. Use the arrow keys to choose, Tab to accept, and Esc to dismiss.
- With no list open, the up and down arrows bring back earlier commands.
- Guests see `register`, `login` and `recover`. Signed-in visitors see `profile`, `account`, `find` and `logout`.
- Some commands ask a follow-up question, such as `register` and `find`. Press Ctrl+C twice to cancel one.
- Links from Account, profiles and Social can open the terminal with a command already typed. Nothing runs, and no passkey prompt starts, until you press Enter.
- Output stays until you reload the page. `clear` wipes it.
- Scrolling up to read older output does not pull you back down.

## Pages

Type `page` for a list of pages: `docs`, `aurora`, `wall` and `crawlers`. Pick one with the arrow keys and Enter, or type to filter. `page <name>` opens one directly, such as `page wall`. [Account](accounts.md) has its own command.

## Commands

For everyone:

- `what?` — a short tour.
- `help` — the command list.
- `page` — choose a page.
- `page <name>` — open a page.
- `space` — explore Space at [space.actora.art](https://space.actora.art/).
- `clear` — clear the screen.
- `aurora` — chat with [Aurora](aurora.md) inside the terminal.

Guests:

- `register` — create an account with a passkey.
- `login` — sign in with a passkey.
- `recover` — add a new passkey with your saved recovery key.

Signed in:

- `profile` — open your profile.
- `account` — open your account page.
- `find <username>` — open someone's profile. `@` is optional. Without a name, it asks for one.
- `logout` — sign out.

`find` needs the exact username. It opens public and private profile pages alike, and shows no private details itself.

## Accounts

`register` asks for a username and display name, then asks your browser or device to create a passkey. You are signed in straight away.

`login` asks for your passkey. After `login`, `register` or `recover`, the terminal can take you back to the Account or profile page you came from. Cancelling a passkey prompt changes nothing, and you can try again.

If the account is archived, `login` does not sign you in. The terminal asks you to type `restore` or `cancel`.

`recover` asks for your username, then for your recovery key in a hidden field that is not kept in the terminal history. A valid key starts the creation of a new passkey. Your other passkeys stay. If you already have the most allowed, the terminal tells you which passkey, the one used least recently, would be replaced and asks you to type `replace`. Then you get a new recovery key, shown once. Save it before you carry on. For an archived account, you then choose `restore` or `cancel`.

You create or replace recovery keys on Account, under Security, with one of your passkeys. Each key is shown once, and a new key replaces the old one.

`logout` signs you out. On Account, the signed-in sessions section sends you back here with `logout` typed, and you press Enter.

Archiving and deleting start on Account, never in the terminal. Archive needs your exact username and a passkey, and signs out every browser. You come back to the terminal with a one-time note, and `restore` is how you return later. Deleting needs you to type `delete @username forever` and use a passkey. You land on the homepage as a guest with a note that the username is reserved for 90 days. If the connection drops during a delete, the terminal does not claim it finished. Try signing in once, and do not delete again while unsure. See [accounts.md](accounts.md).

## Boundaries

The terminal is for finding pages and managing your account. It does not show the site's code, admin tools, private workings or secrets.
