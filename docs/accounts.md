# Accounts

actora.art accounts use passkeys instead of passwords. The homepage Terminal is the main place to register, sign in, recover access, restore an archived account, or sign out. The [Account](https://actora.art/account/) page manages identity and account-owned security controls.

Version `0.3.24` added the session-management controls described below.

## Identity and Passkeys

- A username identifies the account and forms its public-profile address.
- A display name is the visitor-facing name shown by account-aware surfaces such as Aurora.
- An account can link and name multiple passkeys, then remove any passkey except the final one.
- Sessions expire and can also be ended through normal sign-out or account lifecycle actions.
- Account shows identity Save/Discard and the resulting profile address, and links to **customize profile** on the owner's page. Changing a username changes that address; old username links do not redirect.
- Account lists your signed-in browser sessions and identifies the current one. You can sign out one session or all other sessions. It shows when each session signed in and was last active, without location or network addresses. Sessions and passkeys are separate.

## Recovery

A recovery key you saved separately can recover your account if you lose every passkey. A successful recovery rotates the key; the new one must be saved before leaving the one-time reveal. Raw recovery keys are not available through a later lookup.

Messages, and the message keys and recovery controls that went with them, were removed on 2026-11-01. See [privacy.md](privacy.md).

## Archive and Deletion

Archive is reversible. It ends sessions and makes the public profile and terminal lookup unavailable while ordinary retained feature state remains subject to its usual limits. A later verified sign-in or recovery still requires an explicit restore step.

Permanent deletion removes the account and ordinary owned records, including account-owned Aurora preferences and conversations, Profile, Social, Wall, and Space state, including the guestbook and comments the person authored elsewhere. Copies held by other people cannot be erased by deleting an account. Safety evidence and bounded operational history can follow the separate retention described in [privacy.md](privacy.md). A deleted username remains reserved for 90 days.
