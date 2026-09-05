# Accounts

actora.art accounts use passkeys instead of passwords. The homepage Terminal is the main place to register, sign in, recover access, restore an archived account, or sign out. The [Account](https://actora.art/account/) page manages identity and account-owned security controls.

Version `0.3.24` adds the session-management and separate encrypted-message recovery controls described below.

## Identity and Passkeys

- A username identifies the account and forms its public-profile address.
- A display name is the visitor-facing name shown by account-aware surfaces such as Aurora.
- An account can link and name multiple passkeys, then remove any passkey except the final one.
- Sessions expire and can also be ended through normal sign-out or account lifecycle actions.
- Account shows identity Save/Discard and the resulting profile address, and links to **customize profile** on the owner's page. Changing a username changes that address; old username links do not redirect.
- The update lists signed-in browser sessions, identifies the current session, and supports signing out one session or all other sessions. It shows sign-in/last-active times without IP/location data. Browser sessions, passkeys and trusted messaging devices are separate.

## Recovery

A separately saved recovery key can recover an account after every linked passkey is lost. A successful recovery rotates the key; the new one must be saved before leaving the one-time reveal. Raw recovery keys are not available through a later lookup.

Recovering account access does not recreate message keys. For an existing encryption identity/history, a new browser needs trusted-device approval or a separately saved **message-recovery key**. Optional automatic encrypted backup covers message keys and trust data; messages and attachment files remain stored separately. Recovery needs both covered keys and retained encrypted content, within the limits in [privacy.md](privacy.md). Tabs share one persistent encryption device while retaining separate drafts and selections. Closing a tab leaves the others working.

## Archive and Deletion

Archive is reversible. It ends sessions and makes the public profile and terminal lookup unavailable while ordinary retained feature state remains subject to its usual limits. A later verified sign-in or recovery still requires an explicit restore step.

Permanent deletion removes the account and ordinary owned records, including account-owned Aurora preferences and conversations, Profile, Social, Music, Wall, and Space state. Deletion preserves recipients' conversation history with the person labelled **Deleted account** and no live profile link, while removing that person's devices, own key backup, guestbook and comments authored elsewhere. Copies held by other people cannot be erased by deleting an account. Safety evidence and bounded operational history can follow the separate retention described in [privacy.md](privacy.md). A deleted username remains reserved for 90 days.
