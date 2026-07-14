# Profiles And Social

Public visitor-facing notes for actora.art profiles, badges, friendships, and Messages.

This document explains what normal visitors can see and do. Implementation details, private moderation, storage layout, and operational controls belong outside this public repo.

## Profiles

Signed-in visitors can publish an opt-in profile at `/u/:username`.

Public profiles can show:

- display name
- username
- avatar
- short status over the avatar
- bio
- a custom-titled ordered Things section
- links
- join date
- profile theme and accent color
- display-only badges

Profiles are private by default. Existing accounts with private profiles show a private-state page to other visitors instead of exposing profile details. The route follows the current username, so changing username from `/account` changes the profile URL.

An archived account is hidden from its public profile route and terminal username lookup until its owner explicitly restores it. Archive is reversible and is not a public profile status.

Things are intentionally free-form. A profile owner can arrange up to eight entries for projects, art, notes, collections, contributions, or anything else they had a hand in. They may customize the section heading; leaving it blank uses `things`. Each Thing has a title and may have a plain-text description and an external HTTP(S) link. Thing entries do not require a category, project status such as `active` or `finished`, date, image, or other fixed portfolio field. Empty Things, badge, and link sections do not appear on the public profile.

When signed out, profile, Social, and Messages actions offer a real link to sign in through the homepage terminal. Successful login or registration returns to the requested Account, Messages, or canonical profile page; cancellation remains in the terminal and does not start a redirect loop.

## Badges

Badges are public profile markers only.

They can show a label, color, and optional small image. They do not grant permissions, admin access, social friendships, account roles, chat limits, Wall budgets, or any other product capability.

Beta-era accounts also receive a locked `actoraOS v<joined-version> Beta` badge. It is public profile flair only.

## Finding People

The homepage terminal `find` command looks up usernames and opens the matching `/u/:username` profile route in a new tab.

The lookup can find existing private profiles so signed-in visitors can send friend requests from the private-state page without seeing private profile details.

## Friendships And Messages

Social relationships are mutual friendships, not follows.

- Friend requests can be sent and cancelled from profile pages.
- Incoming requests can be accepted or declined from a profile or the footer `social` popup.
- Friends can be unfriended from their profile.
- A friend can be muted and later unmuted. Mute is a private, one-way notification preference: it keeps the friendship, incoming messages, conversation history, and that thread's unread state, but removes the conversation from the muter's footer notification total. The other person is not notified or shown the mute.
- Accounts can be blocked and later unblocked. Blocking ends any friendship or pending request, prevents new requests and DMs between the two accounts, and hides their retained conversation while the block remains active. The blocker keeps an explicit unblock action; the other account sees only that Social is unavailable, not whether or by whom it was blocked.
- Either person can hold an independent block. Each person can remove only their own block, and unblocking never restores the ended friendship.
- `System` is the one-way social notification thread, with messages visibly sent by Aurora.
- DMs are person-to-person and available only between current, unblocked friends.
- `/messages/` is the private full inbox. It provides conversation navigation, search across visible retained message text and conversation participants, earlier history, new conversations with friends, message copy, mute/unmute, a blocked-people list with explicit unblock, and accept/decline/cancel actions for friend requests.
- Messages uses two panes on larger screens and one pane at a time on phones, with a clear return to the conversation list. It is kept out of search indexes and the public sitemap.
- The footer `social` dialog stays available as the compact notification, recent-preview, `System` action, and quick-reply layer. `open all messages` moves into the full inbox.
- Opening a thread marks its newest shown message or notice as read only after that exact item is actually in view. Leaving an open conversation scrolled elsewhere does not clear a new arrival.
- For signed-in visitors, new DMs, System notices, and friend-state changes can appear without refreshing the page. Tabs share current account-scoped Social updates where browser support allows and clear them when the signed-in session ends.
- The footer popup behaves as a keyboard-contained dialog, closes with Escape, and returns focus to the control that opened it even when a live update refreshed the page action.
- Archive cancels pending friend requests but preserves accepted friendships, retained messages and read state, private mute/block choices, and safety controls. Existing friends can still read, search, copy, report, mute, block, unblock, or end the retained relationship, but neither side can send a new message, request, or acceptance across the archive boundary. Archived profile links are omitted from these private retained views.
- Permanent account deletion is different from archive: it removes the person's friendships, requests, blocks, mutes, System items, read state, and every shared DM thread from both participants. A private report clears its current account link but may retain the historical username/display name and exact reported profile or message content captured at intake under a stable pseudonymous subject for as long as the report is retained. The deleted account is no longer a Social identity.

Social friendships are separate from internal account roles. A public friendship does not mean the account has any special site permission or elevated runtime access.

## Boundaries

Public profiles and social are identity/social surfaces, not content feeds.

Current public social does not include posts or activity feeds, public moderation history, fuzzy people search, follows, or public visibility into private account state. Signed-in people can privately report a non-self profile or one exact incoming message from Messages; the site exposes no public report count, queue, outcome, or moderation history. Profiles and Messages also do not show friend/follower totals, views, likes, reaction totals, rankings, streaks, or other popularity metrics. A person's mute and block choices are visible only to that person.
