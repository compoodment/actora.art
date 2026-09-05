# Privacy

actora.art handles the data needed to provide its interactive pages, accounts, safety controls, and continuity between visits.

It does not run advertising or analytics scripts, create advertising profiles, or sell visitor data.

## Community Update Status

The profile, Account and encrypted Messages update described in this note is being tested locally. It has not been deployed: current live direct messages remain readable by the server and require friendship. The sections marked **after the update** describe the staged behavior when that update is enabled. Older operational backups and separately retained reports are not retroactively encrypted.

## Data the Site Handles

- Essential cookies and session state for guest continuity, signed-in accounts, and security.
- Account identity, passkey public-key metadata, session records, and recovery/archive state. Raw recovery keys are never durably stored or logged. After a signed-in key replacement, the exact result may remain in volatile process memory for up to five minutes so the same session and request can recover from an ambiguous response without rotating the key again.
- Aurora conversations and session metadata, account-wide custom instructions for signed-in visitors, and enough request context to enforce limits and respond to abuse. Guest custom instructions use browser-session storage.
- Profile content and media, friendships, requests, private mutes/blocks, System notices, messages, and private reports. The update adds optional public guestbook comments and encrypted message storage as described below.
- Published Music files and metadata, private Library and playlist state, listening history, and unpublished review-stage uploads.
- Shared Wall marks, ownership/budget state, and saved tool preferences.
- Signed-in Space saves.
- Request metadata such as IP and browser/request details for rate limiting, security, abuse response, and private operational audit.

## What Is Public, Private, or Operator-Visible

Published profiles, their chosen Music cards, published Music, public playlists, and visible Wall marks are public. A profile is private by default. Ordinary visitors see only its private-state page; the owner and authorized administrators can preview the full profile for operation and moderation.

Aurora conversations, friendship state, Messages, mute/block choices, private playlists, Library state, listening history, unpublished Music reviews, Space saves, and private-profile fields are not public. Messages is excluded from the public sitemap and search indexing.

Authorized operators can access the operational metadata and server-readable content needed to run, secure, and moderate the service. Current live DMs are server-readable. The encrypted relay described below does not hold ordinary message keys. The site's administrative Aurora view exposes owner/count/time/session-state metadata rather than titles or conversation text. The separate owner-only report view exposes only the evidence captured for a report.

A profile report can retain visible identity and status, structured text and layout, badge metadata, presence/type/size/digest metadata for visible avatar, badge, and canvas media, and up to eight Music kind/id/title/subtitle entries. It does not copy the media bytes or reusable media URLs.

In the current live messaging system, a message report retains only the selected incoming message: its text, sender identity, timestamp, internal thread/message references, attached Music title snapshot, and the reporter's optional context. It does not include neighboring messages or separate media bytes or URLs. Encrypted-message reporting after the update has the explicit attachment disclosure described below.

## Messages After the Update

When encrypted Messages is enabled, Messages and the Social footer encrypt message text, replies, reactions, Music links, pictures and video before relay submission. Other accounts may send one encrypted text-only introduction before you accept a conversation. Search and media previews are decrypted in your browser.

The ordinary relay stores encrypted content and attachment files plus participant/device identifiers, sizes, timestamps and delivery metadata. It does not hold your message recovery secret or ordinary message keys. Encryption does not protect plaintext from someone controlling your device or a malicious version of the browser application.

There are no read receipts, last-seen times or online-presence indicators. Typing is temporary and expires after five seconds. Unread state and mute choices are private to you. Notifications stay inside Actora, without browser/OS push or notification audio.

A report deliberately shares the selected decrypted message, **all attachments belonging to that message**, and your explanation with Actora's owner after a preview. Other messages and conversation keys are not shared. The owner can read the disclosed evidence, which follows report retention even if the ordinary conversation or account is later removed. The report does not provide the surrounding conversation.

Your browser keeps a persistent encryption device. One tab per browser/account can actively use it at a time. For an existing encryption identity/history, a new device needs approval from a trusted device or your separately saved message-recovery key. Account login, a passkey or the account-recovery key cannot recreate lost message keys.

Automatic encrypted backup is optional. Once enabled, it backs up message keys and trust data; encrypted messages and attachment files remain stored separately on the server. Recovery needs both the covered keys and retained encrypted content. Clearing browser storage without a trusted device or a usable backup/recovery key can make history inaccessible. Backup failures and storage limits remain visible.

Limits are 4,000 text characters; one 1,000-character introduction; four pictures/videos up to 25 MiB each; 512 MiB encrypted media per uploader; a 10 MiB encrypted key backup; 4,000 events per conversation; 200 conversations and 20 active devices per account. Reactions count as events. These limits do not promise unlimited retention or recovery.

## Profiles and Account After the Update

Profiles can use owner-selected designs, isolated custom CSS, featured friends and optional guestbooks. Guestbook comments are public plain text visible to profile visitors; **they are not encrypted messages**. Owners can remove any comment and authors can remove their own. Disabling a guestbook hides its saved comments. User CSS cannot style Actora's navigation, account/safety actions or editor, or load unrestricted external resources. Profile Music plays only after a visitor chooses Play.

Account lists signed-in browser sessions and allows one session or all other sessions to be signed out. These sessions are separate from passkeys and trusted messaging devices. Archive remains reversible. Permanent deletion removes your access, profile and own key backup, while recipients retain conversation history labelled **Deleted account** without your live profile link. Deleting your account cannot erase copies held by other people. Guestbooks and comments authored elsewhere are removed with the deleted account. Report evidence and operational backups retain their separate policies.

## External Services

Aurora sends the current uncompacted conversation, any retained compacted summary, layered Aurora instructions, limited safe account context, and enabled custom instructions to Ollama Cloud to generate a reply. The displayed context estimate covers that same payload; older turns become a retained summary at the compaction threshold rather than disappearing behind a separate message-count cutoff. If Aurora uses general web search, a separate bounded query is sent to Ollama's web-search service; it is instructed not to include private account data, custom instructions, or unrelated conversation text. See the [Ollama privacy policy](https://ollama.com/privacy).

Site pages currently load JetBrains Mono from Google Fonts, so the browser makes a request to Google and sends ordinary network/request metadata. See [Google Fonts privacy information](https://developers.google.com/fonts/faq/privacy).

actora.art does not share visitor data with third parties for advertising or analytics.

## Browser-Local Data

Actora lives, unfinished character drafts, and recovery copies are stored locally in the browser rather than in an actora.art account. They do not follow the account to another device, and clearing the site's browser data can remove them. Some guest continuity and interface preferences also use browser storage or essential cookies.

The staged encrypted Messages update also keeps its device keys in browser storage. Its unsent drafts are shared in memory between Messages and the Social footer for the current account; they are cleared when the account's messaging session ends, rather than being durably saved as a draft backup.

## Retention and Controls

- Signed-in sessions expire after 30 days. Guests keep one browser-scoped Aurora conversation. Empty signed-in active conversations expire after 6 hours. Non-empty active and archived signed-in Aurora conversations and account-wide custom instructions persist until the account holder changes or removes them, an authorized operator applies an available conversation control, or the account is deleted.
- Profile, Social, Messages, and published Music state generally remains until changed, deleted, or removed by a normal feature limit. Private Music history is capped at 50 entries and expires after 90 days; its owner can clear it immediately.
- Files selected through **Add songs** stay in a private unpublished review for at most two hours. Publishing is explicit; discarding or expiry removes the review stage.
- A visible Wall layer expires within three days and can disappear sooner through normal Wall actions.
- Reports remain open until a decision within bounded limits. Closed reports are retained for at most 180 days. Captured evidence can outlast later profile/message edits or account deletion while its report remains retained.

Account archive is reversible. It ends sessions and hides the public profile and terminal find result while retaining account and feature state subject to each feature's normal expiry and limits. Verified login or recovery still requires a separate explicit restore.

Permanent deletion immediately removes the account and its access. Current live legacy messaging removes shared DM threads; the staged update instead retains recipients' history as described above. Profile and Music media cleanup follows the committed state change and may complete later; encrypted attachments retained by another participant remain available with the retained conversation. Retained report evidence, operational audit records, capped administrative change history, and backups can remain under their separate retention. The deleted username remains reserved without its former account identity for 90 days.

## Changes

This note changes when the site's data handling changes.
