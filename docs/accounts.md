# Accounts

actora.art accounts use passkeys instead of passwords. The homepage Terminal is the main place to register, sign in, recover access, restore an archived account, or sign out. The [Account](https://actora.art/account/) page manages identity and account-owned security controls.

## Identity and Passkeys

- A username identifies the account and forms its public-profile address.
- A display name is the visitor-facing name shown by account-aware surfaces such as Aurora.
- An account can link and name multiple passkeys, then remove any passkey except the final one.
- Sessions expire and can also be ended through normal sign-out or account lifecycle actions.

## Recovery

A separately saved recovery key can recover an account after every linked passkey is lost. A successful recovery rotates the key; the new one must be saved before leaving the one-time reveal. Raw recovery keys are not available through a later lookup.

## Archive and Deletion

Archive is reversible. It ends sessions and makes the public profile and terminal lookup unavailable while ordinary retained feature state remains subject to its usual limits. A later verified sign-in or recovery still requires an explicit restore step.

Permanent deletion removes the account and ordinary active records, including account-owned Aurora preferences and conversations, Profile, Social, Music, Wall, and Space state. Safety evidence and bounded operational history can follow the separate retention described in [privacy.md](privacy.md). A deleted username remains reserved for 90 days.
