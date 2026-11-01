# Profiles and Social

Public visitor-facing notes for actora.art profiles, badges, and friendships.

## Update Status

Version `0.3.24` added profile design. Music and Messages were removed on 2026-11-01; see [privacy.md](privacy.md) for data handling and reporting limits.

## Profiles

Signed-in visitors can publish an opt-in profile at `/u/:username`. Profiles are private by default. Ordinary visitors see only a private-state page until the owner publishes; the owner and authorized administrators can preview the full profile for operation and moderation. An archived account's profile and terminal find result remain unavailable until restored.

A public profile can show identity details, status, theme, an avatar, structured text and links, uploaded pictures/GIFs/videos, badges, and intentional space. Its address follows the current username.

The exact owner edits directly from the profile page. They can add and arrange content, use Save, Cancel, Undo, and Redo.

The whole-page designer adds editable visual starting points, backgrounds, typography, colors, borders, spacing, header/avatar choices and layout controls. Owners can use custom CSS inside an isolated authored page, and visitors can switch to plain view. The editor, navigation, safety actions and guestbook form remain accessible outside that design. Existing profile content is preserved.

The new mobile arrangement adapts automatically or uses a separate owner-selected order and one/two columns, without changing desktop positions. Custom media-query CSS can refine mobile appearance. Optional featured friends show up to twelve selected, currently eligible friends. Owners can enable a public guestbook and remove any comment; authors can remove their own. Disabling a guestbook hides its saved comments.

Profiles continue to accept bounded structured content and validated site-hosted media without arbitrary HTML, scripts, uploaded SVG or unrestricted external resources. Custom CSS and overlapping layers are available only inside the updated design's isolated frame. Signed-out profile actions can return through the terminal after completed sign-in, registration, or recovery.

## Badges

Badges are display-only profile markers. They never grant access or change another feature.

People can create ordinary badges for their own profile, while assigned or locked badges follow their own display rules. Beta-era accounts receive a locked badge showing the account's recorded join version; legacy accounts use an approximate release-era version.

## Finding People

Signed-in visitors can use the terminal's exact-username `find` command to open `/u/:username`. An existing private profile can still show its private shell and allow a friend request without revealing its fields.

## Friendships

Social relationships are mutual friendships, not follows.

- Friend requests can be sent, cancelled, accepted, or declined from profiles and Social surfaces.
- Friendship grants no elevated site access.
- The footer notifications bell opens the compact layer for friend requests and notices.
- Blocking ends the friendship or pending friendship request and prevents new contact. The other person receives neutral unavailability. Each person controls only their own block. Unblocking does not restore the friendship.
- System notices are one-way notifications from the site.
- Only avatars from currently public profiles appear in Social identity views; otherwise initials are used.
- Unread counts are private personal state, not read receipts. There is no last-seen or online-presence feature. Footer notifications remain inside the site; no browser/OS push or notification audio is added.
- Archive cancels pending friendship requests but preserves accepted friendships and private safety choices subject to their normal limits. Neither side can start new contact across the archive boundary. Deletion removes the deleted person's access and preserves separately retained reports according to [privacy.md](privacy.md).

## Safety and Boundaries

Signed-in visitors can privately report a non-self profile. Reports can retain evidence as described in [privacy.md](privacy.md), but the site exposes no public report count, queue, outcome, or moderation history.

Profiles and Social do not include posts, activity feeds, follows, fuzzy people search, public friend/follower totals, views, likes, rankings, streaks, or other popularity metrics. Block choices remain private to the person who made them.

Implementation details, storage layout, and private moderation controls live outside this public repository.
