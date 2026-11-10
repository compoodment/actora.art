# Terminal

The home page of [actora.art](https://actora.art/) is a terminal: you type a command and press Enter, and it answers or opens a page. It is how you get around the site and where you create an account, sign in and out, and manage friends. `help` lists the everyday commands, `help --all` lists every one, and `what?` is a short tour.

## Commands

For everyone:

- `what?`: a short tour.
- `help`, `help --all`: the command list.
- `page`: pick a page. `page <name>` opens one: `docs` (these guides), `aurora` (the AI assistant), `wall` (the shared drawing) or `crawlers` (bot counts).
- `aurora`: talk to [Aurora](aurora.md) without leaving the terminal. Esc or `/exit` brings you back.
- `space`: opens [space.actora.art](https://space.actora.art/), a 3D sandbox on its own site.
- `clear`: clear the screen.

Without an account:

- `register`: create an account with a passkey.
- `login`: sign in with a passkey.
- `recover`: get back into your account with your recovery key.

Signed in:

- `profile`: open your profile.
- `account`: open Account, the page with your names, passkeys and sign-ins.
- `find @name`: open someone's profile. It needs the exact username.
- `friends`: your friends and open friend requests.
- `friend add @name`, `friend accept @name`, `friend decline @name`, `friend cancel @name`: send, answer or withdraw a friend request.
- `unfriend @name`: remove a friend.
- `block @name`, `unblock @name`, `blocks`: block, unblock, and list who you blocked.
- `sessions`: the browsers you are signed in on, numbered. `sessions --sign-out <n>` signs one of the others out.
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
- `recover` takes your recovery key in a hidden field, and the key never appears in the output or the history.
