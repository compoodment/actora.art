# Profiles and Social

Public visitor-facing notes for actora.art profiles, badges, friendships, and Messages.

## Profiles

Signed-in visitors can publish an opt-in profile at `/u/:username`. Profiles are private by default. Ordinary visitors see only a private-state page until the owner publishes; the owner and authorized administrators can preview the full profile for operation and moderation. An archived account's profile and terminal find result remain unavailable until restored.

A public profile can show identity details, status, theme, an avatar, structured text and links, uploaded pictures/GIFs/videos, badges, intentional space, and a separate Music showcase with up to eight public tracks, available albums, or public playlists. Its address follows the current username.

The exact owner edits directly from the profile page. They can add and arrange content, use Save, Cancel, Undo, and Redo, and manage Music selections separately. Phones turn the same saved canvas into a readable stack; spatial arrangement remains a wider-screen task.

Profiles accept bounded structured text and validated site-hosted media, not arbitrary HTML, CSS, scripts, SVG, remote embeds, overlapping layers, or autoplaying video. Signed-out profile actions can return through the terminal after completed sign-in, registration, or recovery.

## Badges

Badges are display-only profile markers. They never grant access or change another feature.

People can create ordinary badges for their own profile, while assigned or locked badges follow their own display rules. Beta-era accounts receive a locked badge showing the account's recorded join version; legacy accounts use an approximate release-era version.

## Finding People

Signed-in visitors can use the terminal's exact-username `find` command to open `/u/:username`. An existing private profile can still show its private shell and allow a friend request without revealing its fields.

## Friendships and Messages

Social relationships are mutual friendships, not follows.

- Friend requests can be sent, cancelled, accepted, or declined from profiles and Social surfaces.
- Direct messages are available only between current, unblocked friends. Friendship affects Social and Messages only; it grants no elevated site access.
- The footer Social dialog is the compact notification and quick-reply layer. [`/messages/`](https://actora.art/messages/) is the private full inbox with conversation search, history, friend-request actions, copying, mute/block controls, and reporting.
- Search matches visible conversation participants, retained message text, and attached Music titles or subtitles. It does not create a separate public or shared search record.
- Songs, albums, and public playlists can be shared with friends. If the Music later becomes unavailable, the retained message keeps a recognizable title/type snapshot but loses its link, artwork, and play action.
- Mute is a private, one-way notification preference. It keeps the friendship, messages, and unread state while removing that conversation from the muter's footer notification total.
- Blocking ends the friendship or pending request, prevents new contact, and hides the retained conversation while the block remains. The other person sees only that Social is unavailable. Each person controls only their own block, and unblocking does not restore the friendship.
- `System` is a one-way notification thread whose messages are visibly sent by Aurora.
- Only avatars from currently public profiles appear in Social identity views; otherwise initials are used.
- A newly shown message or notice is acknowledged as read only after that exact item is in view.
- Archive cancels pending requests but preserves accepted friendships, retained messages, and private safety choices subject to their normal limits. Neither side can start new contact across the archive boundary. Permanent deletion removes the person's ordinary Social state and shared DM threads; retained report evidence is the exception described in [privacy.md](privacy.md).

## Safety and Boundaries

Signed-in visitors can privately report a non-self profile or one exact incoming message. Reports can retain the captured profile or message evidence described in [privacy.md](privacy.md), but the site exposes no public report count, queue, outcome, or moderation history.

Profiles and Social do not include posts, activity feeds, follows, fuzzy people search, public friend/follower totals, views, likes, rankings, streaks, or other popularity metrics. Mute and block choices remain private to the person who made them.

Implementation details, storage layout, and private moderation controls live outside this public repository.
