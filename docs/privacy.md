# Privacy

actora.art collects only what it needs to run the site.

## What the site uses

- cookies/session state for chat, wall, accounts, passkeys, and account recovery
- public profile details, including status/theme, owner-arranged structured text/automatic links/individual badges, uploaded pictures/GIFs/videos, and up to eight chosen public Music cards, only if an account owner chooses to publish them
- social friend requests, friendships, private directional message mutes and blocks, System notices, and friends-only DMs for the footer quick layer and private Messages inbox
- signed-in Space save/load state
- enough local/browser state to restore recent activity on the same device
- basic safety controls to keep interactive parts usable

## What it does not do

- no cross-site tracking
- no ad profiles
- no analytics scripts
- no selling visitor data
- no third-party sharing for ads or analytics

## Retention

Data is kept only as long as it is useful for the site to work safely. Interactive features may keep enough state to restore chat, wall, profile, social, or Space activity.

Profile and social content stays until it is changed, removed, pruned by normal limits, or the account is deleted. Unpublished profile media is not available to other visitors; removed, abandoned, and account-deleted media is cleaned from ordinary runtime storage. A private profile and its media show only a private-state boundary to other visitors. A profile report may retain the exact visible structured text, automatic-link and individual-badge layout, plus media type, size, and cryptographic digest captured at intake, but not another copy of the image/video bytes or a reusable media URL. If visible at intake, it may also retain up to eight Music item kinds, opaque item IDs, titles, and subtitles; it does not retain Music cover media/URLs or uploader identifiers. Older reports remain under the same retention even if they do not contain this newer field. The private Messages search reads only the signed-in person's currently visible retained conversations and does not persist a separate application search history or message index. Cross-tab fallback storage carries only short coordination signals, not message or relationship content. A message mute lasts until it is removed or the friendship ends; it keeps the conversation and incoming messages intact while quieting that conversation's footer notifications, and the other person is not told. Blocks stay until the person who created them unblocks the account or either account is deleted. A block can hide a retained DM conversation while the other account sees only that contact is unavailable, not the private reason. This state is not used for analytics or advertising.

A signed-in account can choose up to eight ordered public tracks, available albums, and public playlists for a read-only Music section on its profile. That choice is saved in the account's private Music Library state and is changed immediately from Music, independently of profile editing. Deleted or unavailable items and playlists made private are removed from the live selection; account deletion removes the selection. Public profile cards do not reveal Music Library-owner or uploader account identifiers.

An account recovery key is shown only when it is created, replaced, or replaced after a successful recovery. The site does not keep the raw key, and the terminal keeps entered recovery keys out of visible and recalled command history and browser storage. Replacing or using a key invalidates the previous one.

Account archive is reversible. It ends every session and hides public discovery while retaining the account's recovery state, accepted relationships, messages, private safety choices, profile, Music, Chat, Wall, and Space state. A verified login or recovery does not restore the account on its own: the terminal requires a separate explicit restore choice. Its short-lived restore capability is kept only in memory for that browser flow and is not placed in page content, browser storage, URLs, command history, or persistent logs. Archive state lasts until explicit restore or account deletion.

Permanent account deletion immediately removes the ordinary account record, sessions, passkeys, recovery/archive access, profile and badge material, relationships, private mute/block choices, shared DM threads for both participants, the Music profile selection, and the person's ordinary authored feature state. Existing private reports clear current account links but may retain the historical username/display name, reporter note, exact reported profile or message content—including bounded Music title metadata visible at intake—and a stable pseudonymous subject for as long as the report is retained. Operational audit records, capped admin change history, and backups may also remain under their separate retention. The deleted username is reserved without its former account identity for 90 days, then becomes available again. Owner and admin-capable accounts cannot use self-deletion.

## Changes

If this changes, this note will change too.
