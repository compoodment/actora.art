# Privacy

actora.art handles the data needed to provide its interactive pages, accounts, safety controls, and continuity between visits.

It does not run advertising or analytics scripts, create advertising profiles, or sell visitor data.

## Data the Site Handles

- Essential cookies and session state for guest continuity, signed-in accounts, and security.
- Account identity, passkey public-key metadata, session records, and recovery/archive state. Raw recovery keys are shown once and are not stored by the site.
- Chat conversations and session metadata, including enough request context to enforce limits and respond to abuse.
- Profile content and media, friendships, requests, private mutes/blocks, System notices, friends-only messages, and private reports.
- Published Music files and metadata, private Library and playlist state, listening history, and unpublished review-stage uploads.
- Shared Wall marks, ownership/budget state, and saved tool preferences.
- Signed-in Space saves.
- Request metadata such as IP and browser/request details for rate limiting, security, abuse response, and private operational audit.

## What Is Public, Private, or Operator-Visible

Published profiles, their chosen Music cards, published Music, public playlists, and visible Wall marks are public. A profile is private by default. Ordinary visitors see only its private-state page; the owner and authorized administrators can preview the full profile for operation and moderation.

Chat conversations, friendship state, Messages, mute/block choices, private playlists, Library state, listening history, unpublished Music reviews, Space saves, and private-profile fields are not public. Messages is excluded from the public sitemap and search indexing.

Authorized operators can access the operational metadata and content needed to run, secure, and moderate the service. The site's administrative Chat view exposes owner/count/time/session-state metadata rather than titles or conversation text. The separate owner-only report view exposes only the evidence captured for a report.

A profile report can retain visible identity and status, structured text and layout, badge metadata, presence/type/size/digest metadata for visible avatar, badge, and canvas media, and up to eight Music kind/id/title/subtitle entries. It does not copy the media bytes or reusable media URLs.

A message report retains only the selected incoming message: its text, sender identity, timestamp, internal thread/message references, attached Music title snapshot, and the reporter's optional context. It does not include neighboring messages or separate media bytes or URLs.

## External Services

Aurora sends a recent portion of the current conversation, a site system prompt, and limited signed-in account context to Ollama Cloud to generate a reply. See the [Ollama privacy policy](https://ollama.com/privacy).

Site pages currently load JetBrains Mono from Google Fonts, so the browser makes a request to Google and sends ordinary network/request metadata. See [Google Fonts privacy information](https://developers.google.com/fonts/faq/privacy).

actora.art does not share visitor data with third parties for advertising or analytics.

## Browser-Local Data

Actora lives, unfinished character drafts, and recovery copies are stored locally in the browser rather than in an actora.art account. They do not follow the account to another device, and clearing the site's browser data can remove them. Some guest continuity and interface preferences also use browser storage or essential cookies.

## Retention and Controls

- Signed-in sessions expire after 30 days. Guests keep one browser-scoped Chat session. Empty signed-in Chat sessions expire after 6 hours, and archived chats expire after 7 days. Other signed-in chats persist until the account holder deletes, resets, or archives them; an authorized operator resets or archives them; or the account is deleted.
- Profile, Social, Messages, and published Music state generally remains until changed, deleted, or removed by a normal feature limit. Private Music history is capped at 50 entries and expires after 90 days; its owner can clear it immediately.
- Files selected through **Add songs** stay in a private unpublished review for at most two hours. Publishing is explicit; discarding or expiry removes the review stage.
- A visible Wall layer expires within three days and can disappear sooner through normal Wall actions.
- Reports remain open until a decision within bounded limits. Closed reports are retained for at most 180 days. Captured evidence can outlast later profile/message edits or account deletion while its report remains retained.

Account archive is reversible. It ends sessions and hides the public profile and terminal find result while retaining account and feature state subject to each feature's normal expiry and limits. Verified login or recovery still requires a separate explicit restore.

Permanent deletion immediately removes the account, access, and ordinary active records. Profile and Music media cleanup follows that state change and may complete later. Retained report evidence, operational audit records, capped administrative change history, and backups can remain under their separate retention. The deleted username remains reserved without its former account identity for 90 days.

## Changes

This note changes when the site's data handling changes.
