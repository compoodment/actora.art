# Accounts

An account is a username and a passkey. There are no passwords and no email, so nothing can be reset by mail.

You register, sign in, recover and sign out in the [terminal](terminal.md). Everything else is on [Account](https://actora.art/account/).

## Names

- A username is 3 to 24 characters: a to z, 0 to 9, `_` and `-`. It is your profile address, `/u/username`.
- If you change it, old links stop working and anyone can take the old name.
- A display name is up to 40 characters.

## Passkeys and recovery

- You cannot remove your last passkey. Add a second one on another device.
- If you lose every passkey, only a recovery key gets you back in. Create one on Account. It is shown once, so save it somewhere else.
- `recover` in the terminal takes the key and adds a new passkey. Your other passkeys stay.
- If the account is at its passkey limit, `recover` replaces the passkey you used longest ago. It names it and asks first.
- Using a recovery key replaces it. The new key is also shown once.

## Sign-ins

- A sign-in lasts 30 days after you last used it.
- `sessions` and Account list your sign-ins: when each started and was last active. No location or browser name is kept.
- `logout` signs out this browser, `logout --others` every other one, `logout --everywhere` all of them. `sessions --sign-out <n>` ends one.

## Archive

Archiving hides your account until you come back. It has no time limit. Start it on Account, with your username and a passkey.

- Every browser is signed out, and your profile shows as not found.
- Pending friend requests are cancelled. Friends, blocks, chats and Wall marks are kept.
- Comments you left in other guestbooks show as "Deleted account".
- To come back, `login` or `recover`, then type `restore`.

## Delete

Deleting is for good. On Account, type `delete @username forever` and use a passkey.

- Gone at once: your account, passkeys, recovery key, profile and uploads, your guestbook, comments you wrote elsewhere, badges, friendships, blocks, Aurora chats and memories, and Wall data.
- The username is reserved for 90 days.
- Reports by you or about you stay, without your name, until 180 days after they are closed.
- Backups keep a copy until they expire. See [privacy](privacy.md).
- If the connection drops while deleting, try to sign in once before you delete again.
