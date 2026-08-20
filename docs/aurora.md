# Aurora

[Aurora](https://actora.art/aurora/) is actora.art's conversational presence. The full page supports longer conversations; a compact footer panel makes the current conversation available elsewhere on the site.

## Conversations

- Guests have one browser-scoped conversation and are labelled `guest`.
- Signed-in visitors can create, select, rename, archive, restore, reset, and delete multiple conversations. Their own messages use their current display name.
- Archived conversations are read-only and expire after seven days.
- The footer panel resumes the current conversation. The full Aurora page exposes the complete conversation controls.
- Failed replies can be retried, and the latest user message can be edited and regenerated.
- Sent and received messages support a safe Markdown subset: headings, bold, italics, strikethrough, inline and fenced code, HTTP(S) links, lists, blockquotes, and horizontal rules. Raw HTML is shown as text.
- Normal messages accept up to 10,000 characters. Custom instructions remain limited to 2,000 characters.

## Personalization

The settings control accepts custom instructions for Aurora's tone, format, personality, preferred way of helping, or recurring interaction style. When enabled, applicable instructions persist across every reply without needing to be repeated. Signed-in settings follow the account across devices. Guest settings last for the browser session. If one part conflicts with Aurora's protected boundaries, the remaining customization still applies.

Resetting custom instructions requires an explicit confirmation before the saved or browser-session customization is cleared.

Personal instructions cannot replace Aurora's identity, weaken privacy or safety boundaries, establish account facts, grant permissions, or expand tool access. They can be disabled or reset without deleting a conversation.

## Information and Tools

Aurora can consult bounded sources when useful:

- sanitized public actora.art documentation;
- the public Music catalog;
- exact public-profile lookup;
- public page and Lab catalogues;
- a bounded Space body catalogue;
- safe context about the current visitor; and
- general web search for outside or current information; and
- bounded reading of visitor-provided public websites and GitHub repository pages, with a small number of relevant public links followed when needed.

Web-backed answers should include descriptive source links. Actora documentation and outside-web results are distinct sources. Public-page reading rejects local/private-network targets, credentials, and unusual ports.

After an explicit request from a signed-in visitor, Aurora can control their shared Music player: play, pause/resume, skip, seek, adjust volume or shuffle, queue Music, and clear the upcoming queue. It can create private-by-default playlists and edit playlists that visitor owns, including their name, description, tracks, order, and visibility. Clearing a long queue or making a private playlist public asks for confirmation first, and the latest playlist edit can be undone. Aurora cannot delete playlists.

Aurora otherwise cannot open a page in the visitor's browser, edit accounts, send messages, submit forms, or mutate site state.

The abstract line above the composer stays wordless. Web-backed answers keep a compact source strip with the answer.

## Privacy

Aurora sends a recent part of the current conversation, Aurora's instructions, enabled customization, the conversation brief, and a protected minimal viewer context to Ollama Cloud to produce a reply. Viewer context contains only the safe display/account label, signed-in state, and coarse access class; a read-only tool can supply bounded access guidance. A web-search query is sent only when Aurora chooses to search; account details, private instructions, and unrelated conversation text must not be placed in that query.

See [privacy.md](privacy.md) for retention and external-service details.
