# Profiles And Social

Public visitor-facing notes for actora.art profiles, badges, friendships, and DMs.

This document explains what normal visitors can see and do. Implementation details, private moderation, storage layout, and operational controls belong outside this public repo.

## Profiles

Signed-in accounts can publish an opt-in profile at `/u/:username`.

Public profiles can show:

- display name
- username
- avatar
- bio
- links
- join date
- display-only badges

Profiles are private by default. Existing private profile URLs show a private-state page to other visitors instead of exposing profile details. The route follows the current username, so changing username from `/account` changes the profile URL.

## Badges

Badges are public profile markers only.

They can show a label, color, and optional small image. They do not grant permissions, admin access, friend status, chat limits, Wall budgets, or any other product capability.

## Finding People

The homepage terminal `find` command looks up exact usernames and opens the matching `/u/:username` profile route in a new tab.

Exact lookup can find existing private profiles so signed-in visitors can send friend requests from the private-state page without seeing private profile details.

## Friendships And DMs

Social relationships are mutual friendships, not follows.

- Friend requests can be sent from profile pages.
- Incoming requests are accepted or declined from the footer `social` popup.
- `System` is the one-way social notification thread, with messages visibly sent by Aurora.
- DMs are person-to-person and friends-only.
- New DMs, System notices, and friend-state changes can appear without refreshing the page.

Social friendships are separate from internal account roles. A public friendship does not mean the account has any special site permission or elevated runtime access.

## Boundaries

Public profiles and social are identity/social surfaces, not content feeds.

Current public social does not include activity feeds, project feeds, public moderation history, fuzzy people search, follows, or public visibility into private account state.
