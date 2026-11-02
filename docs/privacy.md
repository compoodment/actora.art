# Privacy

actora.art handles the data needed to provide its interactive pages, accounts, safety controls, and continuity between visits.

It does not run advertising or analytics scripts, create advertising profiles, or sell visitor data.

## Removed Features

Music and Messages were removed from actora.art on 2026-11-01 (version `0.3.32`). The site no longer offers playing, uploading, sharing or sending anything through either. The songs, playlists, listening history and uploads that Music held, and the messages, attachment files, device records and key backups that Messages held, were deleted from the server on 2026-11-01 (version `0.3.35`). Copies in the site's encrypted backups disappear as those backups age out.

Evidence from a message report that the owner had already received stays under the report rules described below: it follows report retention, even if the conversation or account is later removed. Operational backups and retained reports keep their separate retention.

## Data the Site Handles

- Essential cookies and session state for guest continuity, signed-in accounts, and security.
- Account identity, passkey public-key metadata, session records, and recovery/archive state. Raw recovery keys are never durably stored or logged. After a signed-in key replacement, the exact result may remain in volatile process memory for up to five minutes so the same session and request can recover from an ambiguous response without rotating the key again.
- Aurora conversations (each new message with the time it was sent) and session metadata, account-wide custom instructions and, if memory is on, the facts Aurora saves for signed-in visitors (deleted with the conversation they came from, when they expire, or when you remove them), and enough request context to enforce limits and respond to abuse. Guest custom instructions use browser-session storage.
- Profile content and media, friendships, requests, private blocks, System notices, and private reports. Profiles include optional public guestbook comments.
- Shared Wall marks, ownership/budget state, and saved tool preferences.
- Signed-in Space saves.
- Request details for rate limiting, security, abuse response, and private operational audit. Network (IP) addresses are not stored: the site keeps only a keyed code made from each address, which can't be turned back into the address without the site's secret key. IPv6 addresses are coded by their /64 network, and guest limits group IPv4 addresses by their /24. Codes on Aurora conversations and Wall budgets are dropped after 30 days without use; bans keep their code until they are lifted. The site's web server leaves addresses out of its error log. Backups made before 0.3.39 are being rewritten the same way.

## What Is Public, Private, or Operator-Visible

Published profiles and visible Wall marks are public. A profile is private by default. Ordinary visitors see only its private-state page; the owner and authorized administrators can preview the full profile for operation and moderation.

Aurora conversations, friendship state, block choices, Space saves, and private-profile fields are not public.

Authorized operators can access the operational metadata and server-readable content needed to run, secure, and moderate the service. The site's administrative Aurora view exposes owner/count/time/session-state metadata rather than titles or conversation text. The separate owner-only report view exposes only the evidence captured for a report.

A profile report can retain visible identity and status, structured text and layout, badge metadata, presence/type/size/digest metadata for visible avatar, badge, and canvas media. Reports made before Music was removed may also hold up to eight Music kind/id/title/subtitle entries. A report does not copy the media bytes or reusable media URLs.

Reports of individual messages, made before Messages was removed, retain the evidence disclosed at the time: the selected decrypted message, all attachments belonging to that message, and the reporter's explanation. They do not include the surrounding conversation.

## Profiles and Account

Profiles can use owner-selected designs, isolated custom CSS, featured friends and optional guestbooks. Guestbook comments are public plain text visible to profile visitors. Owners can remove any comment and authors can remove their own. Disabling a guestbook hides its saved comments. User CSS cannot style Actora's navigation, account/safety actions or editor, or load unrestricted external resources.

Account lists signed-in browser sessions and allows one session or all other sessions to be signed out. These sessions are separate from passkeys. Archive remains reversible. Permanent deletion removes your access and profile. Deleting your account cannot erase copies held by other people. Guestbooks and comments authored elsewhere are removed with the deleted account. Report evidence and operational backups retain their separate policies.

## External Services

Aurora sends the current uncompacted conversation, any retained compacted summary, layered Aurora instructions, limited safe account context, and enabled custom instructions to Ollama Cloud to generate a reply. The displayed context estimate covers that same payload; older turns become a retained summary at the compaction threshold rather than disappearing behind a separate message-count cutoff. If Aurora uses general web search, a separate bounded query is sent to Ollama's web-search service; it is instructed not to include private account data, custom instructions, or unrelated conversation text. See the [Ollama privacy policy](https://ollama.com/privacy).

Site pages currently load JetBrains Mono from Google Fonts, so the browser makes a request to Google and sends ordinary network/request metadata. See [Google Fonts privacy information](https://developers.google.com/fonts/faq/privacy).

actora.art does not share visitor data with third parties for advertising or analytics.

## Browser-Local Data

Actora lives, unfinished character drafts, and recovery copies are stored locally in the browser rather than in an actora.art account. They do not follow the account to another device, and clearing the site's browser data can remove them. Some guest continuity and interface preferences also use browser storage or essential cookies.

## Retention and Controls

- Signed-in sessions expire after 30 days. Guests keep one browser-scoped Aurora conversation. Empty signed-in active conversations expire after 6 hours. Non-empty active and archived signed-in Aurora conversations and account-wide custom instructions persist until the account holder changes or removes them, an authorized operator applies an available conversation control, or the account is deleted.
- Profile and Social state generally remains until changed, deleted, or removed by a normal feature limit.
- A visible Wall layer expires within three days and can disappear sooner through normal Wall actions.
- Reports remain open until a decision within bounded limits. Closed reports are retained for at most 180 days. Captured evidence can outlast later edits or account deletion while its report remains retained.

Account archive is reversible. It ends sessions and hides the public profile and terminal find result while retaining account and feature state subject to each feature's normal expiry and limits. Verified login or recovery still requires a separate explicit restore.

Permanent deletion immediately removes the account and its access. Profile media cleanup follows the committed state change and may complete later. Retained report evidence, operational audit records, capped administrative change history, and backups can remain under their separate retention. The deleted username remains reserved without its former account identity for 90 days.

## Changes

This note changes when the site's data handling changes.
