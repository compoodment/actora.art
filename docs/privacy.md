# Privacy

actora.art collects only what it needs to run the site.

## What the site uses

- cookies/session state for chat, wall, accounts, passkeys, and account recovery
- public profile details, including status/theme/badges, only if an account owner chooses to publish them
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

Profile and social content stays until it is changed, removed, pruned by normal limits, or the account is deleted. The private Messages search reads only the signed-in person's currently visible retained conversations and does not persist a separate application search history or message index. Cross-tab fallback storage carries only short coordination signals, not message or relationship content. A message mute lasts until it is removed or the friendship ends; it keeps the conversation and incoming messages intact while quieting that conversation's footer notifications, and the other person is not told. Blocks stay until the person who created them unblocks the account or either account is deleted. A block can hide a retained DM conversation while the other account sees only that contact is unavailable, not the private reason. Private profiles show only a private-state page to other visitors. This state is not used for analytics or advertising.

An account recovery key is shown only when it is created, replaced, or replaced after a successful recovery. The site does not keep the raw key, and the terminal keeps entered recovery keys out of visible and recalled command history and browser storage. Replacing or using a key invalidates the previous one.

## Changes

If this changes, this note will change too.
