# Terminal

The [home page](https://actora.art/) is a terminal. `help` lists the everyday commands, `help --all` lists every one, and `what?` is a short tour.

## Commands

For everyone:

- `what?`: a short tour.
- `help`, `help --all`: the command list.
- `page`: pick a page. `page <name>` opens one: `docs`, `aurora`, `wall` or `crawlers`.
- `aurora`: talk to [Aurora](aurora.md) without leaving the terminal. Esc or `/exit` brings you back.
- `space`: opens [space.actora.art](https://space.actora.art/).
- `clear`: clear the screen.

Guests:

- `register`: create an account with a passkey.
- `login`: sign in with a passkey.
- `recover`: add a new passkey with your recovery key.

Signed in:

- `profile`: open your profile.
- `account`: open your account page.
- `find @name`: open someone's profile. It needs the exact username.
- `friends`: your friends and open requests.
- `friend add @name`, `friend accept @name`, `friend decline @name`, `friend cancel @name`: send, answer or withdraw a friend request.
- `unfriend @name`: remove a friend.
- `block @name`, `unblock @name`, `blocks`: block, unblock, and list who you blocked.
- `sessions`: where you are signed in, numbered. `sessions --sign-out <n>` signs one of the others out.
- `logout`: sign out of this browser. `logout --others` signs out every other browser, `logout --everywhere` all of them.

The `@` is optional. `<command> --help` shows a command's options. `unfriend`, `block` and `logout --everywhere` ask y/n first.

What these commands do to your account, friends and blocks is in [accounts](accounts.md) and [profiles](profiles.md).

## Keys

- Tab accepts the suggestion. With several suggestions, the arrow keys choose and Esc closes the list.
- Otherwise the up and down arrows bring back earlier commands.
- Ctrl+C twice cancels a question the terminal asked.

## Good to know

- Buttons elsewhere on the site can open the terminal with a command already typed. Nothing runs until you press Enter.
- Output and command history stay in the tab until you reload or close it.
- A recovery key is typed into a hidden field and never appears in the output or the history.
