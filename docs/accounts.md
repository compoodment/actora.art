# Accounts

An account on [actora.art](https://actora.art/) is a username and a passkey: a sign-in saved on your phone, computer or security key. There are no passwords and no email, so nothing can be reset by mail. An account gives you a [profile](profiles.md), your own [Aurora](aurora.md) chats and a place on the Wall, the site's shared drawing.

You create an account, sign in and sign out in the [terminal](terminal.md) on the home page, with `register`, `login` and `logout`. Your names, passkeys and sign-ins are on the Account page, [actora.art/account](https://actora.art/account/), or `account` in the terminal.

## Names

- A username is 3 to 24 characters: a to z, 0 to 9, `_` and `-`. It is your profile address, `/u/<username>`.
- If you change it, old links stop working and anyone can take the old name.
- A display name is up to 40 characters. Joined emoji such as 👩‍💻 work.

## Passkeys and recovery

- You cannot remove your last passkey. Add a second one on another device.
- A recovery key is a code that gets you back in when every passkey is lost. Nothing else does. Create one on Account. It is shown once, so save it somewhere else.
- `recover` in the terminal takes the key and adds a new passkey. Your other passkeys stay.
- If the account is at its passkey limit, `recover` replaces the passkey you used longest ago. It names it and asks first.
- Using a recovery key replaces it. The new key is also shown once.

## Sign-ins

- A sign-in lasts 30 days after you last used it.
- `sessions` in the terminal and the Account page list your sign-ins: when each started and was last active. No location or browser name is kept.
- `logout` signs out this browser, `logout --others` every other one, `logout --everywhere` all of them. `sessions --sign-out <n>` ends one.

## Archive

Archiving hides your account until you come back. It has no time limit. Start it on Account, with your username and a passkey.

- Every browser is signed out, and your profile shows as not found.
- Pending friend requests are cancelled. Friends, blocks, chats and Wall marks are kept.
- Notes you left in other people's guestbooks show as "Deleted account".
- To come back, `login` or `recover`, then type `restore`.

## Delete

Deleting is for good. On Account, type `delete @<username> forever` and use a passkey.

- Gone at once: your account, passkeys, recovery key, profile and uploads, your guestbook, notes you left in other guestbooks, badges, friendships, blocks, Aurora chats and memories, and Wall data.
- The username is reserved for 90 days.
- Administrators can delete or archive their own account the same way, except the site owner's account.
- Reports by you or about you stay, without your name, until 180 days after they are closed.
- Backups keep a copy until they expire. See [privacy](privacy.md).
- If the connection drops while deleting, try to sign in once before you delete again.
