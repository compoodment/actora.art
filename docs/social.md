# Profiles and Social

Public visitor-facing notes for actora.art profiles, badges, friendships, and Messages.

## Update Status

The community update is a local candidate under verification, not a deployed release. Current live profiles use the existing canvas and restricted themes, and live DMs require friendship and remain readable by the server. The additions below are explicitly conditional on the profile or encrypted Messages update being enabled. See [privacy.md](privacy.md) for current and staged data handling.

## Profiles

Signed-in visitors can publish an opt-in profile at `/u/:username`. Profiles are private by default. Ordinary visitors see only a private-state page until the owner publishes; the owner and authorized administrators can preview the full profile for operation and moderation. An archived account's profile and terminal find result remain unavailable until restored.

A public profile can show identity details, status, theme, an avatar, structured text and links, uploaded pictures/GIFs/videos, badges, intentional space, and a separate Music showcase with up to eight public tracks, available albums, or public playlists. Its address follows the current username.

The exact owner edits directly from the profile page. They can add and arrange content, use Save, Cancel, Undo, and Redo, and manage Music selections separately. Current live phones derive a readable stack from the saved canvas.

When the profile update is enabled, the whole-page designer adds editable visual starting points, backgrounds, typography, colors, borders, spacing, header/avatar choices and layout controls. Owners can use custom CSS inside an isolated authored page, and visitors can switch to plain view. The editor, navigation, safety actions, Music controls and guestbook form remain accessible outside that design. Existing profile content is preserved.

The new mobile arrangement adapts automatically or uses a separate owner-selected order and one/two columns, without changing desktop positions. Custom media-query CSS can refine mobile appearance. Optional featured friends show up to twelve selected, currently eligible friends. Owners can enable a public guestbook and remove any comment; authors can remove their own. Disabling a guestbook hides its saved comments.

Profiles continue to accept bounded structured content and validated site-hosted media without arbitrary HTML, scripts, uploaded SVG or unrestricted external resources. Custom CSS and overlapping layers are available only inside the updated design's isolated frame. Profile Music uses explicit Play actions; opening a profile preserves the visitor's current listening. Signed-out profile actions can return through the terminal after completed sign-in, registration, or recovery.

## Badges

Badges are display-only profile markers. They never grant access or change another feature.

People can create ordinary badges for their own profile, while assigned or locked badges follow their own display rules. Beta-era accounts receive a locked badge showing the account's recorded join version; legacy accounts use an approximate release-era version.

## Finding People

Signed-in visitors can use the terminal's exact-username `find` command to open `/u/:username`. An existing private profile can still show its private shell and allow a friend request without revealing its fields.

## Friendships and Messages

Social relationships are mutual friendships, not follows.

- Friend requests can be sent, cancelled, accepted, or declined from profiles and Social surfaces.
- Current live direct messages are available only between current, unblocked friends. Friendship grants no elevated site access. When encrypted Messages is enabled, other accounts can send one text-only introduction into a private request inbox; accepting that conversation is separate from friendship and unlocks messages, quoted replies, reactions, pictures and video. Decline or block prevents further messages.
- The footer Social dialog is the compact notification and quick-reply layer. [`/messages/`](https://actora.art/messages/) is the private full inbox with conversation search, history, friend-request actions, copying, mute/block controls, and reporting. Open messages on both surfaces support Aurora's safe Markdown subset; compact inbox previews stay plain.
- Current live search matches visible conversation participants, retained message text, and attached Music titles or subtitles. Encrypted-mode search runs locally over available decrypted history and sends no search query to the relay.
- Songs, albums, and public playlists can be shared. Current live Music cards retain a title/type snapshot if their source disappears. In encrypted mode, the selected title/subtitle and a same-origin Music link are sent as encrypted text; opening the link is explicit and there is no automatic unfurl or playback.
- Mute is a private, one-way notification preference. It keeps the friendship, messages, and unread state while removing that conversation from the muter's footer notification total.
- Blocking ends the friendship or pending friendship request and prevents new contact. The other person receives neutral unavailability. Each person controls only their own block, including accounts without a conversation. In encrypted mode, authorized retained history remains accessible. Unblocking does not restore friendship or accept a pending/declined message request; an already accepted retained conversation can resume if otherwise allowed.
- `System` is a one-way notification thread for site notices.
- Only avatars from currently public profiles appear in Social identity views; otherwise initials are used.
- Unread counts and mark-unread are private personal state, not read receipts. The encrypted update adds a temporary typing indicator that expires after five seconds, with no last-seen or online-presence feature. Existing Social footer notifications remain inside the site; no browser/OS push or notification audio is added.
- Archive cancels pending friendship requests but preserves accepted friendships, retained messages, and private safety choices subject to their normal limits. Neither side can start new contact across the archive boundary. Current live deletion removes shared DM threads. The community update instead leaves recipients' history under **Deleted account** without a live profile link, removes the deleted person's access and key backup, and preserves separately retained reports according to [privacy.md](privacy.md).

Encrypted Messages uses a persistent browser device and allows one active tab per browser/account. A new device for an existing encryption identity/history needs trusted-device approval or the saved message-recovery key. Account recovery is separate. Optional automatic encrypted backup contains keys and trust data; recovery also needs retained encrypted messages and attachment files. [Privacy](privacy.md) lists the limits and recovery boundaries.

## Safety and Boundaries

Signed-in visitors can privately report a non-self profile or one exact incoming message. In encrypted mode, the preview shows the selected decrypted message, all its attachments and the explanation that will be shared with Actora's owner. Other messages and conversation keys stay private. Reports can retain that evidence as described in [privacy.md](privacy.md), but the site exposes no public report count, queue, outcome, or moderation history. Public guestbook comments are not encrypted messages.

Profiles and Social do not include posts, activity feeds, follows, fuzzy people search, public friend/follower totals, views, likes, rankings, streaks, or other popularity metrics. Mute and block choices remain private to the person who made them.

Implementation details, storage layout, and private moderation controls live outside this public repository.
