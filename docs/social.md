# Profiles And Social

Public visitor-facing notes for actora.art profiles, badges, friendships, and DMs.

This document explains what normal visitors can see and do. Implementation details, private moderation, storage layout, and operational controls belong outside this public repo.

## Profiles

Signed-in visitors can publish an opt-in profile at `/u/:username`.

Public profiles can show:

- display name
- username
- avatar
- short status over the avatar
- bio
- links
- join date
- profile theme and accent color
- display-only badges

Profiles are private by default. Existing accounts with private profiles show a private-state page to other visitors instead of exposing profile details. The route follows the current username, so changing username from `/account` changes the profile URL.

## Badges

Badges are public profile markers only.

They can show a label, color, and optional small image. They do not grant permissions, admin access, social friendships, account roles, chat limits, Wall budgets, or any other product capability.

Beta-era accounts also receive a locked `actoraOS v<joined-version> Beta` badge. It is public profile flair only.

## Finding People

The homepage terminal `find` command looks up usernames and opens the matching `/u/:username` profile route in a new tab.

The lookup can find existing private profiles so signed-in visitors can send friend requests from the private-state page without seeing private profile details.

## Friendships And DMs

Social relationships are mutual friendships, not follows.

- Friend requests can be sent and cancelled from profile pages.
- Incoming requests can be accepted or declined from a profile or the footer `social` popup.
- Friends can be unfriended from their profile.
- Accounts can be blocked and later unblocked. Blocking ends any friendship or pending request, prevents new requests and DMs between the two accounts, and hides their retained conversation while the block remains active.
- `System` is the one-way social notification thread, with messages visibly sent by Aurora.
- DMs are person-to-person and available only between current, unblocked friends.
- The popup opens recent messages first and can load earlier messages on demand. Messages show their sender and time.
- Opening a thread marks only the messages or notices already shown as read, so a new arrival is not accidentally cleared.
- For signed-in visitors, new DMs, System notices, and friend-state changes can appear without refreshing the page.

Social friendships are separate from internal account roles. A public friendship does not mean the account has any special site permission or elevated runtime access.

## Boundaries

Public profiles and social are identity/social surfaces, not content feeds.

Current public social does not include activity feeds, project feeds, public moderation history, fuzzy people search, follows, reports, mutes, or public visibility into private account state. A person's block list is visible only to that person.
